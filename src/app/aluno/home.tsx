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
  numero_identificacao: string | null;
  ano_curricular: number | null;
  telefone: string | null;
  morada: string | null;
  data_nascimento: string | null;
  grau: string | null;
  curso: string | null;
  foto_url: string | null;
};

type EstagioAtual = {
  id: number;
  edicao_estagio_id: number;
  professor_id: string | null;
  orientador_id: string | null;
  estado_estagio: string | null;
  edicoes_estagio?: {
    id: number;
    data_inicio: string | null;
    data_fim: string | null;
    ensinos_clinicos?: {
      nome: string;
    };
    instituicoes?: {
      nome: string;
    };
    servicos?: {
      nome: string;
    };
  };
  professor?: {
    nome: string;
  } | null;
  orientador?: {
    nome: string;
  } | null;
};

type Reuniao = {
  id: number;
  assunto: string | null;
  data_hora: string | null;
  local: string | null;
  professor?: {
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

export default function AlunoHome() {
  const [utilizador, setUtilizador] = useState<Utilizador | null>(null);
  const [estagioAtual, setEstagioAtual] = useState<EstagioAtual | null>(null);
  const [reunioes, setReunioes] = useState<Reuniao[]>([]);
  const [loading, setLoading] = useState(true);

  const [menuAberto, setMenuAberto] = useState(false);

  const [popupVisivel, setPopupVisivel] = useState(false);
  const [popupTitulo, setPopupTitulo] = useState("");
  const [popupMensagem, setPopupMensagem] = useState("");

  const [confirmarLogoutVisivel, setConfirmarLogoutVisivel] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

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
      .select(
        "id, nome, email, numero_identificacao, ano_curricular, telefone, morada, data_nascimento, grau, curso, foto_url"
      )
      .eq("id", userId)
      .single();

    if (userError || !userData) {
      console.log("ERRO ALUNO HOME:", userError);
      setLoading(false);
      return;
    }

    setUtilizador(userData as any);

    const { data: estagioData, error: estagioError } = await supabase
      .from("inscricoes_estagio")
      .select(`
        id,
        edicao_estagio_id,
        professor_id,
        orientador_id,
        estado_estagio,
        edicoes_estagio(
          id,
          data_inicio,
          data_fim,
          ensinos_clinicos(nome),
          instituicoes(nome),
          servicos(nome)
        ),
        professor:utilizadores!inscricoes_estagio_professor_id_fkey(nome),
        orientador:utilizadores!inscricoes_estagio_orientador_id_fkey(nome)
      `)
      .eq("aluno_id", userId)
      .neq("estado_estagio", "concluido")
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (estagioError) {
      console.log("ERRO ESTÁGIO HOME:", estagioError);
    }

    setEstagioAtual((estagioData as any) || null);

    const agora = new Date().toISOString();

    const { data: reunioesData, error: reunioesError } = await supabase
      .from("reunioes")
      .select(`
        id,
        assunto,
        data_hora,
        local,
        professor:utilizadores!reunioes_professor_id_fkey(nome),
        orientador:utilizadores!reunioes_orientador_id_fkey(nome),
        edicoes_estagio(
          ensinos_clinicos(nome)
        )
      `)
      .eq("aluno_id", userId)
      .gte("data_hora", agora)
      .order("data_hora", { ascending: true })
      .limit(3);

    if (reunioesError) {
      console.log("ERRO REUNIÕES:", reunioesError);
      setReunioes([]);
    } else {
      setReunioes((reunioesData as any) || []);
    }

    setLoading(false);
  }

  function mostrarPopup(titulo: string, mensagem: string) {
    setPopupTitulo(titulo);
    setPopupMensagem(mensagem);
    setPopupVisivel(true);
  }

  function perfilIncompleto() {
    if (!utilizador) return true;

    return (
      !utilizador.ano_curricular ||
      !utilizador.telefone ||
      !utilizador.morada ||
      !utilizador.data_nascimento ||
      !utilizador.grau ||
      !utilizador.curso
    );
  }

  function formatarData(data: string | null | undefined) {
    if (!data) return "Sem data";

    const date = new Date(data);

    if (Number.isNaN(date.getTime())) return data;

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

  function numeroDoEstagio(nomeEstagio?: string) {
    const nome = nomeEstagio || "";

    const match = nome.match(/Ensino Clínico\s*(\d+)/i);

    if (match?.[1]) {
      return Number(match[1]);
    }

    return null;
  }

  function corDoEstagioAtual() {
    const numero = numeroDoEstagio(
      estagioAtual?.edicoes_estagio?.ensinos_clinicos?.nome
    );

    if (!numero) return "#FDB515";

    return CORES_ESTAGIOS[numero - 1] || "#FDB515";
  }

  function pessoasReuniao(reuniao: Reuniao) {
    const professor = reuniao.professor?.nome;
    const orientador = reuniao.orientador?.nome;

    if (professor && orientador) {
      return `Professor: ${professor} · Orientador: ${orientador}`;
    }

    if (professor) return `Professor: ${professor}`;

    if (orientador) return `Orientador: ${orientador}`;

    return "Sem participantes indicados";
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
            <Text style={styles.nome}>{utilizador?.nome || "Aluno"} 👋</Text>
          </View>

          <Pressable
            onPress={() =>
              router.push("/aluno/preencherPerfil/perfil?from=top" as any)
            }
          >
            {utilizador?.foto_url ? (
              <Image
                source={{ uri: utilizador.foto_url }}
                style={styles.fotoPerfil}
              />
            ) : (
              <Ionicons
                name="person-circle-outline"
                size={70}
                color="#FDB515"
              />
            )}
          </Pressable>
        </View>

        {perfilIncompleto() ? (
          <Pressable
            style={styles.avisoPerfil}
            onPress={() => router.push("/aluno/completar-perfil" as any)}
          >
            <Ionicons name="alert-circle-outline" size={28} color="#160909" />

            <View style={{ flex: 1 }}>
              <Text style={styles.avisoTitulo}>Completa o teu perfil</Text>

              <Text style={styles.avisoTexto}>
                Para continuares, preenche os teus dados pessoais.
              </Text>
            </View>

            <Ionicons name="chevron-forward-outline" size={24} color="#160909" />
          </Pressable>
        ) : null}

        <Text style={styles.secaoTitulo}>Acessos rápidos</Text>

        <View style={styles.grid}>
          <Pressable
            style={styles.cardAtalho}
            onPress={() => router.push("/aluno/estagios/estagio" as any)}
          >
            <Ionicons name="briefcase-outline" size={34} color="#FDB515" />
            <Text style={styles.cardTitulo}>Ensinos Clínicos</Text>
          </Pressable>

          <Pressable
            style={styles.cardAtalho}
            onPress={() =>
              router.push(
                "/aluno/presencas/estagioPresencas/estagioPresencas" as any
              )
            }
          >
            <Ionicons name="calendar-outline" size={34} color="#FDB515" />
            <Text style={styles.cardTitulo}>Presenças</Text>
          </Pressable>

          <Pressable
            style={styles.cardAtalho}
            onPress={() =>
              router.push(
                "/aluno/avaliacao/estagioAvaliacoes/estagioAvaliacoes" as any
              )
            }
          >
            <Ionicons name="star-outline" size={34} color="#FDB515" />
            <Text style={styles.cardTitulo}>Avaliações</Text>
          </Pressable>

          <Pressable
            style={styles.cardAtalho}
            onPress={() => router.push("/aluno/agenda/agenda" as any)}
          >
            <Ionicons name="people-outline" size={34} color="#FDB515" />
            <Text style={styles.cardTitulo}>Agenda</Text>
          </Pressable>
        </View>

        <Text style={styles.secaoTitulo}>Estágio atual</Text>

        {estagioAtual ? (
         <Pressable
  style={[
    styles.estagioAtualCard,
    {
      borderLeftColor: corDoEstagioAtual(),
    },
  ]}
  onPress={() =>
    router.push({
      pathname: "/aluno/estagios/detalheEstagio/detalheEstagio" as any,
      params: {
        inscricaoId: String(estagioAtual.id),
        edicaoId: String(estagioAtual.edicao_estagio_id),
      },
    })
  }
>
  <View style={styles.estagioIcone}>
    <Ionicons name="briefcase-outline" size={30} color="#160909" />
  </View>

  <View style={{ flex: 1 }}>
    <Text style={styles.estagioTitulo}>
      {estagioAtual.edicoes_estagio?.ensinos_clinicos?.nome ||
        "Ensino Clínico"}
    </Text>

    <Text style={styles.estagioTexto}>
      {estagioAtual.edicoes_estagio?.instituicoes?.nome || "Instituição"} ·{" "}
      {estagioAtual.edicoes_estagio?.servicos?.nome || "Serviço"}
    </Text>

    <Text style={styles.estagioTexto}>
      {formatarData(estagioAtual.edicoes_estagio?.data_inicio)} -{" "}
      {formatarData(estagioAtual.edicoes_estagio?.data_fim)}
    </Text>

    <Text style={styles.estagioTexto}>
      Professor: {estagioAtual.professor?.nome || "Não indicado"}
    </Text>

    <Text style={styles.estagioTexto}>
      Orientador: {estagioAtual.orientador?.nome || "Não indicado"}
    </Text>
  </View>
</Pressable>
        ) : (
          <Text style={styles.mensagemVazia}>
            Ainda não tens estágio atribuído.
          </Text>
        )}

        <Text style={styles.secaoTitulo}>Próximos eventos</Text>

        {reunioes.length === 0 ? (
          <Text style={styles.mensagemVazia}>
            Não existem eventos agendados.
          </Text>
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
                onPress={() => router.push("/aluno/agenda/agenda" as any)}
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
            <Ionicons name="settings-outline" size={25} color="#160909" />
            <Text style={styles.bottomTexto}>Definições</Text>
          </Pressable>

          <Pressable
            style={styles.bottomItem}
            onPress={() =>
              router.push("/aluno/preencherPerfil/perfil?from=bottom" as any)
            }
          >
            <Ionicons name="person-outline" size={24} color="#160909" />
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
                  router.push("/aluno/estagios/estagio" as any);
                }}
              >
                <Ionicons name="briefcase-outline" size={25} color="#160909" />
                <Text style={styles.sidebarTexto}>Ensinos Clínicos</Text>
              </Pressable>

              <Pressable
                style={styles.sidebarItem}
                onPress={() => {
                  setMenuAberto(false);
                  router.push("/aluno/agenda/agenda" as any);
                }}
              >
                <Ionicons name="calendar-outline" size={25} color="#160909" />
                <Text style={styles.sidebarTexto}>Agenda</Text>
              </Pressable>

              <Pressable
                style={styles.sidebarItem}
                onPress={() => {
                  setMenuAberto(false);
                  router.push(
                    "/aluno/presencas/estagioPresencas/estagioPresencas" as any
                  );
                }}
              >
                <Ionicons name="clipboard-outline" size={25} color="#160909" />
                <Text style={styles.sidebarTexto}>Presenças</Text>
              </Pressable>

              <Pressable
                style={styles.sidebarItem}
                onPress={() => {
                  setMenuAberto(false);
                  router.push(
                    "/aluno/avaliacao/estagioAvaliacoes/estagioAvaliacoes" as any
                  );
                }}
              >
                <Ionicons name="star-outline" size={25} color="#160909" />
                <Text style={styles.sidebarTexto}>Avaliações</Text>
              </Pressable>

              <Pressable
                style={styles.sidebarItem}
                onPress={() => {
                  setMenuAberto(false);
                  setPopupVisivel(true);
                }}
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={25}
                  color="#160909"
                />
                <Text style={styles.sidebarTexto}>Comentários Semanais</Text>
              </Pressable>

              <Pressable
                style={styles.sidebarItem}
                onPress={() => {
                  setMenuAberto(false);
                  router.push("/aluno/preencherPerfil/perfil?from=top" as any);
                }}
              >
                <Ionicons name="person-outline" size={25} color="#160909" />
                <Text style={styles.sidebarTexto}>Perfil</Text>
              </Pressable>

              <Pressable
                style={styles.sidebarItem}
                onPress={() => {
                  setMenuAberto(false);
                  setPopupVisivel(true);
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