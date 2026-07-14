 import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { supabase } from "../../lib/supabase";
import styles from "./homeStyles";

type Perfil = {
  nome: string;
  email: string;
  foto_url: string | null;
  telefone: string | null;
  morada: string | null;
  data_nascimento: string | null;
  instituicao_id: number | null;
  servico_id: number | null;
};

type InscricaoOrientador = {
  id: number;
  aluno_id: string;
  edicao_estagio_id: number;
  estado: string | null;
  estado_estagio: string | null;
  aluno?: {
    nome: string;
    email: string;
  } | null;
  edicoes_estagio?: {
    id: number;
    data_inicio: string | null;
    data_fim: string | null;
    ano_letivo: string | null;
    ensinos_clinicos?: {
      nome: string;
      ano_curricular: number;
      tipo: string | null;
      horas_estimadas: number | null;
    } | null;
    instituicoes?: {
      nome: string;
    } | null;
    servicos?: {
      nome: string;
    } | null;
  } | null;
};

type Reuniao = {
  id: number;
  assunto: string | null;
  local: string | null;
  data_hora: string | null;
  aluno?: {
    nome: string;
  } | null;
  professor?: {
    nome: string;
  } | null;
  edicoes_estagio?: {
    ensinos_clinicos?: {
      nome: string;
    } | null;
  } | null;
};

const CORES_ESTAGIOS = [
  "#2F80ED",
  "#A7F3D0",
  "#9B51E0",
  "#F8BBD0",
  "#C9A27E",
  "#800020",
  "#FDB515",
  "#8ED6FF",
  "#EB5757",
  "#BDBDBD",
  "#F2994A",
];

export default function HomeOrientador() {
  const [loading, setLoading] = useState(true);
  const [menuAberto, setMenuAberto] = useState(false);

  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [inscricoes, setInscricoes] = useState<InscricaoOrientador[]>([]);
  const [reunioes, setReunioes] = useState<Reuniao[]>([]);

  const [popupVisivel, setPopupVisivel] = useState(false);
  const [popupTitulo, setPopupTitulo] = useState("");
  const [popupMensagem, setPopupMensagem] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  const ensinosUnicos = useMemo(() => {
    const mapa = new Map<number, InscricaoOrientador>();

    inscricoes.forEach((inscricao) => {
      if (!mapa.has(inscricao.edicao_estagio_id)) {
        mapa.set(inscricao.edicao_estagio_id, inscricao);
      }
    });

    return Array.from(mapa.values());
  }, [inscricoes]);

  function mostrarPopup(titulo: string, mensagem: string) {
    setPopupTitulo(titulo);
    setPopupMensagem(mensagem);
    setPopupVisivel(true);
  }

  function numeroDoEstagio(nomeEstagio?: string | null) {
    const nome = nomeEstagio || "";
    const match = nome.match(/Ensino Clínico\s*(\d+)/i);

    if (match?.[1]) {
      return Number(match[1]);
    }

    return null;
  }

  function corDoEstagio(nomeEstagio?: string | null) {
    const numero = numeroDoEstagio(nomeEstagio);

    if (!numero) return "#FDB515";

    return CORES_ESTAGIOS[numero - 1] || "#FDB515";
  }

  function formatarData(data: string | null | undefined) {
    if (!data) return "Sem data";

    const date = new Date(data);

    if (Number.isNaN(date.getTime())) return "Sem data";

    return date.toLocaleDateString("pt-PT");
  }

  function formatarHora(data: string | null | undefined) {
    if (!data) return "Sem hora";

    const date = new Date(data);

    if (Number.isNaN(date.getTime())) return "Sem hora";

    return date.toLocaleTimeString("pt-PT", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function totalAlunosPorEdicao(edicaoId: number) {
    return inscricoes.filter(
      (inscricao) => inscricao.edicao_estagio_id === edicaoId
    ).length;
  }

  function irPara(pathname: string) {
    setMenuAberto(false);
    router.push(pathname as any);
  }

  async function terminarSessao() {
    await supabase.auth.signOut();
    router.replace("/login/login" as any);
  }

  async function carregarDados() {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace("/login/login" as any);
      return;
    }

    const orientadorId = authData.user.id;

    const { data: perfilData, error: perfilError } = await supabase
      .from("utilizadores")
      .select(
        `
        nome,
        email,
        foto_url,
        telefone,
        morada,
        data_nascimento,
        instituicao_id,
        servico_id
      `
      )
      .eq("id", orientadorId)
      .maybeSingle();

    if (perfilError) {
      console.log("ERRO PERFIL ORIENTADOR:", perfilError);
      setPerfil(null);
    } else {
      setPerfil((perfilData as any) || null);
    }

    const { data: inscricoesData, error: inscricoesError } = await supabase
      .from("inscricoes_estagio")
      .select(`
        id,
        aluno_id,
        edicao_estagio_id,
        estado,
        estado_estagio,
        aluno:utilizadores!inscricoes_estagio_aluno_id_fkey(nome, email),
        edicoes_estagio(
          id,
          data_inicio,
          data_fim,
          ano_letivo,
          ensinos_clinicos(nome, ano_curricular, tipo, horas_estimadas),
          instituicoes(nome),
          servicos(nome)
        )
      `)
      .eq("orientador_id", orientadorId)
      .order("id", { ascending: false });

    if (inscricoesError) {
      console.log("ERRO INSCRIÇÕES ORIENTADOR:", inscricoesError);
      setInscricoes([]);
    } else {
      const lista = ((inscricoesData as any) || []).filter(
        (inscricao: InscricaoOrientador) =>
          inscricao.estado !== "rejeitado" &&
          inscricao.estado_estagio !== "inativo" &&
          inscricao.estado_estagio !== "por_distribuir"
      );

      setInscricoes(lista);
    }

    const agora = new Date().toISOString();

    const { data: reunioesData, error: reunioesError } = await supabase
      .from("reunioes")
      .select(`
        id,
        assunto,
        local,
        data_hora,
        aluno:utilizadores!reunioes_aluno_id_fkey(nome),
        professor:utilizadores!reunioes_professor_id_fkey(nome),
        edicoes_estagio(
          ensinos_clinicos(nome)
        )
      `)
      .eq("orientador_id", orientadorId)
      .gte("data_hora", agora)
      .order("data_hora", { ascending: true })
      .limit(3);

    if (reunioesError) {
      console.log("ERRO REUNIÕES ORIENTADOR:", reunioesError);
      setReunioes([]);
    } else {
      setReunioes((reunioesData as any) || []);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FDB515" />
      </View>
    );
  }


  function perfilIncompleto() {
    if (!perfil) return true;

    return (
      !perfil.telefone ||
      !perfil.morada ||
      !perfil.data_nascimento ||
      !perfil.instituicao_id ||
      !perfil.servico_id
    );
  }

  return (
    <View style={styles.page}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.topIcons}>
          <Pressable onPress={() => setMenuAberto(true)}>
            <Ionicons name="menu-outline" size={32} color="#160909" />
          </Pressable>

          <Pressable
            onPress={() =>
              mostrarPopup(
                "Notificações",
                "Esta funcionalidade será implementada futuramente."
              )
            }
          >
            <Ionicons name="notifications-outline" size={30} color="#160909" />
          </Pressable>
        </View>

        <View style={styles.header}>
          <View>
            <Text style={styles.ola}>Olá,</Text>
            <Text style={styles.nome}>{perfil?.nome || "Orientador"} 👋</Text>
          </View>

          <Pressable
            onPress={() =>
              router.push("/orientador/perfil/perfil?from=top" as any)
            }
          >
          {perfil?.foto_url ? (
            <Image source={{ uri: perfil.foto_url }} style={styles.fotoPerfil} />
          ) : (
            <Ionicons name="person-circle-outline" size={74} color="#FDB515" />
          )}
          </Pressable>
        </View>

      {perfilIncompleto() ? (
        <Pressable style={styles.avisoPerfil}  onPress={() => router.push("/orientador/perfil/perfil?from=home" as any)}>
          <Ionicons name="alert-circle-outline" size={28} color="#160909" />

          <View style={{ flex: 1 }}>
            <Text style={styles.avisoTitulo}>Completa o teu perfil</Text>

            <Text style={styles.avisoTexto}>
              Para continuares, preenche o hospital, serviço e dados pessoais.
            </Text>
          </View>

          <Ionicons name="chevron-forward-outline" size={24} color="#160909" />
        </Pressable>
      ) : null}

        <Text style={styles.secaoTitulo}>Acessos rápidos</Text>

        <View style={styles.grid}>
          <Pressable
            style={styles.cardAtalho}
            onPress={() => router.push("/orientador/estagios/estagios" as any)}
          >
            <Ionicons name="briefcase-outline" size={32} color="#FDB515" />
            <Text style={styles.cardTitulo}>Os meus estágios</Text>
          </Pressable>

          <Pressable
            style={styles.cardAtalho}
            onPress={() =>
              router.push(
                "/orientador/estagios/presencas/alunosPresencas/alunosPresencas" as any
              )
            }
          >
            <Ionicons name="checkmark-done-outline" size={32} color="#FDB515" />
            <Text style={styles.cardTitulo}>Validar presenças</Text>
          </Pressable>

          <Pressable
            style={styles.cardAtalho}
            onPress={() =>
              router.push(
                "/orientador/estagios/relatorios/estagioRelatorios/estagioRelatorios" as any
              )
            }
          >
            <Ionicons name="document-text-outline" size={32} color="#FDB515" />
            <Text style={styles.cardTitulo}>Relatórios</Text>
          </Pressable>

          <Pressable
            style={styles.cardAtalho}
            onPress={() =>
              router.push({
                pathname: "/orientador/agenda/agenda" as any,
                params: {
                  origem: "home",
                },
              })
            }
          >
            <Ionicons name="calendar-outline" size={32} color="#FDB515" />
            <Text style={styles.cardTitulo}>Agenda</Text>
          </Pressable>
        </View>

        <Text style={styles.secaoTitulo}>Estágios que orienta</Text>

        {ensinosUnicos.length === 0 ? (
          <Text style={styles.mensagemVazia}>
            Ainda não tens estágios atribuídos.
          </Text>
        ) : (
          <View style={styles.listaEstagios}>
            {ensinosUnicos.map((item) => {
              const nomeEstagio =
                item.edicoes_estagio?.ensinos_clinicos?.nome ||
                "Ensino Clínico";

              return (
                <Pressable
                  key={item.edicao_estagio_id}
                  style={[
                    styles.estagioCard,
                    {
                      borderLeftColor: corDoEstagio(nomeEstagio),
                    },
                  ]}
                  onPress={() =>
                    router.push({
                      pathname:
                        "/orientador/ensinosClinicos/alunosEstagio/alunosEstagio" as any,
                      params: {
                        edicaoId: String(item.edicao_estagio_id),
                      },
                    })
                  }
                >
                  <View style={styles.estagioIcone}>
                    <Ionicons
                      name="briefcase-outline"
                      size={28}
                      color="#160909"
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.estagioTitulo}>{nomeEstagio}</Text>

                    <Text style={styles.estagioTexto}>
                      {item.edicoes_estagio?.instituicoes?.nome ||
                        "Instituição"}{" "}
                      · {item.edicoes_estagio?.servicos?.nome || "Serviço"}
                    </Text>

                    <Text style={styles.estagioTexto}>
                      {formatarData(item.edicoes_estagio?.data_inicio)} -{" "}
                      {formatarData(item.edicoes_estagio?.data_fim)}
                    </Text>

                    <Text style={styles.estagioTexto}>
                      {totalAlunosPorEdicao(item.edicao_estagio_id)} aluno(s)
                      distribuído(s)
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward-outline"
                    size={28}
                    color="#160909"
                  />
                </Pressable>
              );
            })}
          </View>
        )}

        <Text style={styles.secaoTitulo}>Próximas reuniões</Text>

        {reunioes.length === 0 ? (
          <Text style={styles.mensagemVazia}>
            Não existem reuniões agendadas para breve.
          </Text>
        ) : (
          <View style={styles.eventosLista}>
            {reunioes.map((reuniao) => (
              <Pressable
                key={reuniao.id}
                style={[styles.eventoCard, { borderLeftColor: "#8ED6FF" }]}
                onPress={() =>
                  router.push({
                    pathname: "/orientador/agenda/agenda" as any,
                    params: {
                      origem: "home",
                    },
                  })
                }
              >
                <View style={styles.eventoHeader}>
                  <Text style={styles.eventoTitulo}>
                    {reuniao.assunto || "Reunião"}
                  </Text>

                  <Ionicons
                    name="calendar-outline"
                    size={26}
                    color="#8ED6FF"
                  />
                </View>

                <Text style={styles.eventoTexto}>
                  Data: {formatarData(reuniao.data_hora)}
                </Text>

                <Text style={styles.eventoTexto}>
                  Hora: {formatarHora(reuniao.data_hora)}
                </Text>

                <Text style={styles.eventoTexto}>
                  Local: {reuniao.local || "Sem local definido"}
                </Text>

                <Text style={styles.eventoTexto}>
                  Aluno: {reuniao.aluno?.nome || "Não indicado"}
                </Text>

                <Text style={styles.eventoTexto}>
                  Professor: {reuniao.professor?.nome || "Não indicado"}
                </Text>

                <Text style={styles.eventoTexto}>
                  Estágio:{" "}
                  {reuniao.edicoes_estagio?.ensinos_clinicos?.nome ||
                    "Não indicado"}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>



      <View style={styles.bottomBar}>
        <Pressable style={styles.bottomItem}>
          <Ionicons name="home-outline" size={24} color="#FDB515" />
          <Text style={styles.bottomTextoAtivo}>Home</Text>
        </Pressable>

        <Pressable
          style={styles.bottomItem}
          onPress={() =>
            mostrarPopup(
              "Definições",
              "Esta página encontra-se em desenvolvimento."
            )
          }
        >
          <Ionicons name="settings-outline" size={24} color="#160909" />
          <Text style={styles.bottomTexto}>Definições</Text>
        </Pressable>

        <Pressable
          style={styles.bottomItem}
          onPress={() => router.push("/orientador/perfil/perfil?from=bottom" as any)}
        >
          <Ionicons name="person-outline" size={24} color="#160909" />
          <Text style={styles.bottomTexto}>Perfil</Text>
        </Pressable>
      </View>

      <Modal visible={menuAberto} transparent animationType="fade">
        <View style={styles.sidebarOverlay}>
          <Pressable
            style={styles.sidebarBackdrop}
            onPress={() => setMenuAberto(false)}
          />

          <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarTitulo}>Menu</Text>

              <View style={styles.sidebarImagemFixa}>
                <Ionicons name="school-outline" size={34} color="#FDB515" />
              </View>
            </View>

            <View style={styles.sidebarBody}>
              <Pressable
                style={styles.sidebarItem}
                onPress={() => {
                  setMenuAberto(false);
                }}
              >
                <Ionicons name="home-outline" size={25} color="#160909" />
                <Text style={styles.sidebarTexto}>Home</Text>
              </Pressable>

              <Pressable
                style={styles.sidebarItem}
                onPress={() => irPara("/orientador/estagios/estagios")}
              >
                <Ionicons
                  name="briefcase-outline"
                  size={25}
                  color="#160909"
                />
                <Text style={styles.sidebarTexto}>Os meus estágios</Text>
              </Pressable>

              <Pressable
                style={styles.sidebarItem}
                onPress={() =>
                  irPara(
                    "/orientador/presencas/estagioPresencas/estagioPresencas"
                  )
                }
              >
                <Ionicons
                  name="checkmark-done-outline"
                  size={25}
                  color="#160909"
                />
                <Text style={styles.sidebarTexto}>Validar presenças</Text>
              </Pressable>

              <Pressable
                style={styles.sidebarItem}
                onPress={() =>
                  irPara(
                    "/orientador/comentarios/estagioComentarios/estagioComentarios"
                  )
                }
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={25}
                  color="#160909"
                />
                <Text style={styles.sidebarTexto}>Comentários semanais</Text>
              </Pressable>

              <Pressable
                style={styles.sidebarItem}
                onPress={() =>
                  irPara(
                    "/orientador/avaliacoes/estagioAvaliacoes/estagioAvaliacoes"
                  )
                }
              >
                <Ionicons name="star-outline" size={25} color="#160909" />
                <Text style={styles.sidebarTexto}>Avaliações</Text>
              </Pressable>

              <Pressable
                style={styles.sidebarItem}
                onPress={() =>
                  irPara(
                    "/orientador/relatorios/estagioRelatorios/estagioRelatorios"
                  )
                }
              >
                <Ionicons
                  name="document-text-outline"
                  size={25}
                  color="#160909"
                />
                <Text style={styles.sidebarTexto}>Relatórios</Text>
              </Pressable>

              <Pressable
                style={styles.sidebarItem}
                onPress={() =>
                  router.push({
                    pathname: "/orientador/agenda/agenda" as any,
                    params: {
                      origem: "home",
                    },
                  })
                }
              >
                <Ionicons name="calendar-outline" size={25} color="#160909" />
                <Text style={styles.sidebarTexto}>Agenda</Text>
              </Pressable>

              <Pressable
                style={styles.sidebarItem}
                onPress={() => irPara("/orientador/perfil/perfil")}
              >
                <Ionicons name="person-outline" size={25} color="#160909" />
                <Text style={styles.sidebarTexto}>Perfil</Text>
              </Pressable>

              <Pressable
                style={styles.sidebarItem}
                onPress={() => {
                  setMenuAberto(false);
                  mostrarPopup(
                    "Definições",
                    "Esta página encontra-se em desenvolvimento."
                  );
                }}
              >
                <Ionicons name="settings-outline" size={25} color="#160909" />
                <Text style={styles.sidebarTexto}>Definições</Text>
              </Pressable>

              <View style={{ flex: 1 }} />

              <Pressable style={styles.logoutButton} onPress={terminarSessao}>
                <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
                <Text style={styles.logoutTexto}>Terminar sessão</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={popupVisivel}
        transparent
        animationType="fade"
        onRequestClose={() => setPopupVisivel(false)}
      >
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>
              {popupTitulo || "Em desenvolvimento"}
            </Text>

            <Text style={styles.popupMessage}>
              {popupMensagem ||
                "Esta funcionalidade será implementada futuramente."}
            </Text>

            <Pressable
              style={styles.popupOkButton}
              onPress={() => setPopupVisivel(false)}
            >
              <Text style={styles.popupOkText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}