import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
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

type Utilizador = {
  id: string;
  nome: string;
  email: string;
  foto_url: string | null;
};

type EstagioProfessor = {
  id: number;
  edicao_estagio_id: number;
  max_alunos: number | null;
  total_alunos: number;
  edicoes_estagio?: {
    id: number;
    data_inicio: string | null;
    data_fim: string | null;
    ensinos_clinicos?: {
      nome: string;
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
  data_hora: string | null;
  local: string | null;
  aluno?: {
    nome: string;
  } | null;
  orientador?: {
    nome: string;
  } | null;
  edicoes_estagio?: {
    ensinos_clinicos?: {
      nome: string;
    } | null;
  } | null;
};

const LINK_BACKOFFICE =
  "http://localhost:8081/";

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

export default function ProfessorHome() {
  const [utilizador, setUtilizador] = useState<Utilizador | null>(null);
  const [estagios, setEstagios] = useState<EstagioProfessor[]>([]);
  const [reunioes, setReunioes] = useState<Reuniao[]>([]);
  const [loading, setLoading] = useState(true);

  const [menuAberto, setMenuAberto] = useState(false);
  const [temAreaResponsavel, setTemAreaResponsavel] = useState(false);

  const [popupVisivel, setPopupVisivel] = useState(false);
  const [popupTitulo, setPopupTitulo] = useState("");
  const [popupMensagem, setPopupMensagem] = useState("");
  const [confirmarLogoutVisivel, setConfirmarLogoutVisivel] = useState(false);
  

  useEffect(() => {
    carregarDados();
  }, []);

  function mostrarPopup(titulo: string, mensagem: string) {
    setPopupTitulo(titulo);
    setPopupMensagem(mensagem);
    setPopupVisivel(true);
  }

  function mostrarAvisoBackoffice() {
    setMenuAberto(false);

    mostrarPopup(
      "Área do Professor Responsável",
      `Esta área deve ser aberta no site/backoffice.\n\nAcede através deste link:\n${LINK_BACKOFFICE}`
    );
  }

  function formatarData(data: string | null | undefined) {
    if (!data) return "Sem data";

    const date = new Date(data);

    if (Number.isNaN(date.getTime())) return "Sem data";

    return date.toLocaleDateString("pt-PT");
  }

  function formatarDataHora(data: string | null | undefined) {
    if (!data) return "Sem data";

    const date = new Date(data);

    if (Number.isNaN(date.getTime())) return "Sem data";

    return `${date.toLocaleDateString("pt-PT")} às ${date.toLocaleTimeString(
      "pt-PT",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    )}`;
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

  function numeroDoEstagio(nomeEstagio?: string | null) {
    const nome = nomeEstagio || "";

    const match = nome.match(/Ensino Clínico\s*(\d+)/i);

    if (match?.[1]) {
      return Number(match[1]);
    }

    return null;
  }

  function corDoEstagio(estagio: EstagioProfessor) {
    const numero = numeroDoEstagio(
      estagio.edicoes_estagio?.ensinos_clinicos?.nome
    );

    if (!numero) return "#FDB515";

    return CORES_ESTAGIOS[numero - 1] || "#FDB515";
  }

  function pessoasReuniao(reuniao: Reuniao) {
    const aluno = reuniao.aluno?.nome;
    const orientador = reuniao.orientador?.nome;

    if (aluno && orientador) {
      return `Aluno: ${aluno} · Orientador: ${orientador}`;
    }

    if (aluno) return `Aluno: ${aluno}`;
    if (orientador) return `Orientador: ${orientador}`;

    return "Sem participantes indicados";
  }

  async function carregarDados() {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace("/login/login" as any);
      return;
    }

    const userId = authData.user.id;

    const { data: userData, error: userError } = await supabase
      .from("utilizadores")
      .select("id, nome, email, foto_url")
      .eq("id", userId)
      .single();

    if (userError) {
      console.log("ERRO UTILIZADOR PROFESSOR:", userError);
      setUtilizador(null);
    } else {
      setUtilizador((userData as any) || null);
    }

    const { data: responsavelData, error: responsavelError } = await supabase
      .from("responsaveis_ensinos_clinicos")
      .select("id")
      .eq("professor_id", userId)
      .limit(1);

    if (responsavelError) {
      console.log("ERRO ÁREA RESPONSÁVEL:", responsavelError);
      setTemAreaResponsavel(false);
    } else {
      setTemAreaResponsavel((responsavelData || []).length > 0);
    }

    const { data: equipasProfessorData, error: equipasProfessorError } =
      await supabase
        .from("professores_estagio")
        .select(
          `
          id,
          edicao_estagio_id,
          max_alunos,
          edicoes_estagio(
            id,
            data_inicio,
            data_fim,
            ensinos_clinicos(nome),
            instituicoes(nome),
            servicos(nome)
          )
        `
        )
        .eq("professor_id", userId)
        .order("id", { ascending: false });

    if (equipasProfessorError) {
      console.log("ERRO ESTÁGIOS PROFESSOR:", equipasProfessorError);
      setEstagios([]);
    } else {
      const equipas = ((equipasProfessorData as any) ||
        []) as EstagioProfessor[];

      const edicoesIds = equipas
        .map((item) => item.edicao_estagio_id)
        .filter(Boolean);

      let inscricoesDistribuidas: any[] = [];

      if (edicoesIds.length > 0) {
        const { data: inscricoesData, error: inscricoesError } = await supabase
          .from("inscricoes_estagio")
          .select(
            "id, edicao_estagio_id, estado, estado_estagio, distribuido_por"
          )
          .in("edicao_estagio_id", edicoesIds);

        if (inscricoesError) {
          console.log("ERRO ALUNOS DOS ESTÁGIOS:", inscricoesError);
        } else {
          inscricoesDistribuidas = ((inscricoesData as any) || []).filter(
            (inscricao: any) =>
              inscricao.estado !== "rejeitado" &&
              inscricao.estado_estagio !== "inativo" &&
              inscricao.estado_estagio !== "por_distribuir" &&
              (inscricao.estado === "aprovado" ||
                inscricao.estado_estagio === "em_curso" ||
                Boolean(inscricao.distribuido_por))
          );
        }
      }

      const estagiosComTotais = equipas.map((equipa) => {
        const totalAlunos = inscricoesDistribuidas.filter(
          (inscricao) =>
            inscricao.edicao_estagio_id === equipa.edicao_estagio_id
        ).length;

        return {
          ...equipa,
          total_alunos: totalAlunos,
        };
      });

      setEstagios(estagiosComTotais);
    }

    const agora = new Date().toISOString();

    const { data: reunioesData, error: reunioesError } = await supabase
      .from("reunioes")
      .select(`
        id,
        assunto,
        data_hora,
        local,
        aluno:utilizadores!reunioes_aluno_id_fkey(nome),
        orientador:utilizadores!reunioes_orientador_id_fkey(nome),
        edicoes_estagio(
          ensinos_clinicos(nome)
        )
      `)
      .eq("professor_id", userId)
      .gte("data_hora", agora)
      .order("data_hora", { ascending: true })
      .limit(3);

    if (reunioesError) {
      console.log("ERRO REUNIÕES PROFESSOR:", reunioesError);
      setReunioes([]);
    } else {
      setReunioes((reunioesData as any) || []);
    }

    setLoading(false);
  }

  async function terminarSessao() {
    await supabase.auth.signOut();
    router.replace("/login/login" as any);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FDB515" />
      </View>
    );
  }

  const estagiosAgrupados = estagios;

  return (
    <View style={styles.page}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topIcons}>
          <Pressable onPress={() => setMenuAberto(true)}>
            <Ionicons name="menu-outline" size={34} color="#160909" />
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
            <Text style={styles.nome}>{utilizador?.nome || "Professor"} 👋</Text>
          </View>

          <Pressable
            onPress={() =>
              router.push("/professor/perfil/perfil?from=top" as any)
            }
          >
            {utilizador?.foto_url ? (
              <Image
                source={{ uri: utilizador.foto_url }}
                style={styles.fotoPerfil}
              />
            ) : (
              <Ionicons name="person-circle-outline" size={70} color="#FDB515" />
            )}
          </Pressable>
        </View>

        <Text style={styles.secaoTitulo}>Acessos rápidos</Text>

        <View style={styles.grid}>
          <Pressable
            style={styles.cardAtalho}
            onPress={() =>
              router.push("/professor/verEstagios/verEstagios" as any)
            }
          >
            <Ionicons name="briefcase-outline" size={34} color="#FDB515" />
            <Text style={styles.cardTitulo}>Os meus estágios</Text>
          </Pressable>

          <Pressable
            style={styles.cardAtalho}
            onPress={() =>
              router.push(
                "/professor/presencas/alunoPresencas/alunoPresencas" as any
              )
            }
          >
            <Ionicons name="checkmark-done-outline" size={34} color="#FDB515" />
            <Text style={styles.cardTitulo}>Validar presenças</Text>
          </Pressable>

          <Pressable
            style={styles.cardAtalho}
            onPress={() =>
              router.push("/professor/relatorios/relatorios" as any)
            }
          >
            <Ionicons name="document-text-outline" size={34} color="#FDB515" />
            <Text style={styles.cardTitulo}>Relatórios</Text>
          </Pressable>

          <Pressable
            style={styles.cardAtalho}
            onPress={() =>
              router.push({
                pathname: "/professor/agenda/agenda" as any,
                params: {
                  origem: "home",
                },
              })
            }
          >
            <Ionicons name="calendar-outline" size={34} color="#FDB515" />
            <Text style={styles.cardTitulo}>Agenda</Text>
          </Pressable>
        </View>

        {temAreaResponsavel ? (
          <>
            <Text style={styles.secaoTitulo}>Área responsável</Text>

            <Pressable
              style={styles.cardResponsavel}
              onPress={mostrarAvisoBackoffice}
            >
              <View style={styles.responsavelIcone}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={32}
                  color="#160909"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.responsavelTitulo}>
                  Professor Responsável
                </Text>

                <Text style={styles.responsavelTexto}>
                  Esta área deve ser aberta no site/backoffice.
                </Text>
              </View>

              <Ionicons name="open-outline" size={24} color="#160909" />
            </Pressable>
          </>
        ) : null}

        <Text style={styles.secaoTitulo}>Estágios que orienta</Text>

        {estagiosAgrupados.length === 0 ? (
          <Text style={styles.mensagemVazia}>
            Ainda não tens estágios associados.
          </Text>
        ) : (
          <View style={styles.listaEstagios}>
            {estagiosAgrupados.map((estagio) => (
              <Pressable
                key={estagio.id}
                style={[
                  styles.estagioCard,
                  {
                    borderLeftColor: corDoEstagio(estagio),
                  },
                ]}
                onPress={() =>
                  router.push(
                    `/professor/verEstagios/verEstagios?edicaoId=${estagio.edicao_estagio_id}` as any
                  )
                }
              >
                <View style={styles.estagioIcone}>
                  <Ionicons name="briefcase-outline" size={28} color="#160909" />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.estagioTitulo}>
                    {estagio.edicoes_estagio?.ensinos_clinicos?.nome ||
                      "Ensino Clínico"}
                  </Text>

                  <Text style={styles.estagioTexto}>
                    {estagio.edicoes_estagio?.instituicoes?.nome ||
                      "Instituição"}{" "}
                    · {estagio.edicoes_estagio?.servicos?.nome || "Serviço"}
                  </Text>

                  <Text style={styles.estagioTexto}>
                    {formatarData(estagio.edicoes_estagio?.data_inicio)} -{" "}
                    {formatarData(estagio.edicoes_estagio?.data_fim)}
                  </Text>

                  <Text style={styles.estagioTexto}>
                    {estagio.total_alunos} aluno(s) distribuído(s)
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward-outline"
                  size={24}
                  color="#160909"
                />
              </Pressable>
            ))}
          </View>
        )}

        <Text style={styles.secaoTitulo}>Próximos eventos</Text>

        {reunioes.length === 0 ? (
          <Text style={styles.mensagemVazia}>Não existem eventos agendados.</Text>
        ) : (
          <View style={styles.eventosLista}>
            {reunioes.map((reuniao) => (
              <Pressable
                key={reuniao.id}
                style={[
                  styles.eventoCard,
                  {
                    borderLeftColor: "#8ED6FF",
                  },
                ]}
                onPress={() =>
                  router.push({
                    pathname: "/professor/agenda/agenda" as any,
                    params: {
                      origem: "home",
                    },
                  })
                }
              >
                <View style={{ flex: 1 }}>
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
                    Assunto: {reuniao.assunto || "Reunião"}
                  </Text>

                  <Text style={styles.eventoTexto}>
                    Data: {formatarDataHora(reuniao.data_hora)}
                  </Text>

                  <Text style={styles.eventoTexto}>
                    Hora: {formatarHora(reuniao.data_hora)}
                  </Text>

                  <Text style={styles.eventoTexto}>
                    Local: {reuniao.local || "Sem local definido"}
                  </Text>

                  <Text style={styles.eventoTexto}>
                    Com quem: {pessoasReuniao(reuniao)}
                  </Text>

                  <Text style={styles.eventoTexto}>
                    Estágio:{" "}
                    {reuniao.edicoes_estagio?.ensinos_clinicos?.nome ||
                      "Não indicado"}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      {!menuAberto && (
        <View style={styles.bottomBar}>
          <Pressable
            style={styles.bottomItem}
            onPress={() =>
              router.push("/professor/home/home?from=bottom" as any)
            }
          >
            <Ionicons name="home-outline" size={25} color="#FDB515" />
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
            <Ionicons name="settings-outline" size={25} color="#160909" />
            <Text style={styles.bottomTexto}>Definições</Text>
          </Pressable>

          <Pressable
            style={styles.bottomItem}
            onPress={() =>
              router.push("/professor/perfil/perfil?from=bottom" as any)
            }
          >
            <Ionicons name="person-outline" size={25} color="#160909" />
            <Text style={styles.bottomTexto}>Perfil</Text>
          </Pressable>
        </View>
      )}

      {menuAberto && (
        <View style={styles.sidebarOverlay}>
          <Pressable
            style={styles.sidebarBackdrop}
            onPress={() => setMenuAberto(false)}
          />

          <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarTitulo}>Menu</Text>

              <View style={styles.sidebarImagemFixa}>
                <Image
                  source={require("../../../assets/images/enf.jpg")}
                  style={styles.imagemSidebar}
                  resizeMode="cover"
                />
              </View>
            </View>

            <View style={styles.sidebarBody}>
              <Pressable
                style={styles.sidebarItem}
                onPress={() => {
                  setMenuAberto(false);
                  router.push("/professor/verEstagios/verEstagios" as any);
                }}
              >
                <Ionicons name="briefcase-outline" size={25} color="#160909" />
                <Text style={styles.sidebarTexto}>Os meus estágios</Text>
              </Pressable>

              <Pressable
                style={styles.sidebarItem}
                onPress={() => {
                  setMenuAberto(false);
                  router.push(
                    "/professor/presencas/alunoPresencas/alunoPresencas" as any
                  );
                }}
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
                onPress={() => {
                  setMenuAberto(false);
                  router.push("/professor/relatorios/relatorios" as any);
                }}
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
                onPress={() => {
                  setMenuAberto(false);
                  router.push({
                    pathname: "/professor/agenda/agenda" as any,
                    params: {
                      origem: "home",
                    },
                  });
                }}
              >
                <Ionicons name="calendar-outline" size={25} color="#160909" />
                <Text style={styles.sidebarTexto}>Agenda</Text>
              </Pressable>

              {temAreaResponsavel ? (
                <Pressable
                  style={styles.sidebarItem}
                  onPress={mostrarAvisoBackoffice}
                >
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={25}
                    color="#160909"
                  />
                  <Text style={styles.sidebarTexto}>Área Responsável</Text>
                </Pressable>
              ) : null}

              <Pressable
                style={styles.sidebarItem}
                onPress={() => {
                  setMenuAberto(false);
                  router.push("/professor/perfil/perfil?from=top" as any);
                }}
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

              <Pressable
                style={styles.logoutButton}
                onPress={() => setConfirmarLogoutVisivel(true)}
              >
                <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
                <Text style={styles.logoutTexto}>Terminar Sessão</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      <Modal visible={popupVisivel} transparent animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>{popupTitulo}</Text>
            <Text style={styles.popupMessage}>{popupMensagem}</Text>

            <Pressable
              style={styles.popupOkButton}
              onPress={() => setPopupVisivel(false)}
            >
              <Text style={styles.popupOkText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={confirmarLogoutVisivel} transparent animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>Terminar Sessão</Text>
            <Text style={styles.popupMessage}>
              Tens a certeza que queres terminar sessão?
            </Text>

            <View style={styles.modalBotoes}>
              <Pressable
                style={styles.modalBotaoCancelar}
                onPress={() => setConfirmarLogoutVisivel(false)}
              >
                <Text style={styles.modalBotaoTexto}>Cancelar</Text>
              </Pressable>

              <Pressable style={styles.modalBotaoCriar} onPress={terminarSessao}>
                <Text style={styles.modalBotaoTextoEscuro}>Sair</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}