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
  estado_estagio: string | null;
  aluno?: { nome: string } | null;
  edicoes_estagio?: {
    id: number;
    data_inicio: string | null;
    data_fim: string | null;
    ensinos_clinicos?: { nome: string } | null;
    instituicoes?: { nome: string } | null;
    servicos?: { nome: string } | null;
  } | null;
};

type Reuniao = {
  id: number;
  assunto: string | null;
  data_hora: string | null;
  local: string | null;
};

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

  function mostrarPopup(titulo: string, mensagem: string) {
    setPopupTitulo(titulo);
    setPopupMensagem(mensagem);
    setPopupVisivel(true);
  }

  async function carregarDados() {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace("/login/login" as any);
      return;
    }

    const userId = authData.user.id;

    const { data: userData } = await supabase
      .from("utilizadores")
      .select("id, nome, email, foto_url")
      .eq("id", userId)
      .single();

    setUtilizador((userData as any) || null);

    // Verificar se o professor tem área responsável
    const { data: responsavelData } = await supabase
      .from("responsaveis_ensinos_clinicos")
      .select("id")
      .eq("professor_id", userId)
      .limit(1);

    setTemAreaResponsavel((responsavelData || []).length > 0); // Se houver pelo menos um registro, o professor tem área responsável

    const { data: estagiosData, error: estagiosError } = await supabase
      .from("inscricoes_estagio")
      .select(`
        id,
        estado_estagio,
        aluno:utilizadores!inscricoes_estagio_aluno_id_fkey(nome),
        edicoes_estagio(
          id,
          data_inicio,
          data_fim,
          ensinos_clinicos(nome),
          instituicoes(nome),
          servicos(nome)
        )
      `)
      .eq("professor_id", userId)
      .neq("estado_estagio", "concluido")
      .order("id", { ascending: false });

    if (estagiosError) {
      console.log("ERRO ESTÁGIOS PROFESSOR:", estagiosError);
      setEstagios([]);
    } else {
      setEstagios((estagiosData as any) || []);
    }

    const { data: reunioesData, error: reunioesError } = await supabase
      .from("reunioes")
      .select("id, assunto, data_hora, local")
      .eq("professor_id", userId)
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

  useEffect(() => {
    carregarDados();
  }, []);

  async function terminarSessao() {
    await supabase.auth.signOut();
    router.replace("/login/login" as any);
  }

  function formatarData(data: string | null | undefined) {
    if (!data) return "Sem data";
    const date = new Date(data);
    if (Number.isNaN(date.getTime())) return data;

    return date.toLocaleDateString("pt-PT");
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FDB515" />
      </View>
    );
  }

  // Função para agrupar os estágios por edição de estágio
  function estagiosUnicos() {
  const grupos: EstagioProfessor[] = [];

  estagios.forEach((estagio) => {
    const edicaoId = estagio.edicoes_estagio?.id;

    const jaExiste = grupos.some(
      (item) => item.edicoes_estagio?.id === edicaoId
    );

    if (!jaExiste) {
      grupos.push(estagio);
    }
  });

  return grupos;
}

  const estagiosAgrupados = estagiosUnicos();

  return (
    <View style={styles.page}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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
            onPress={() => router.push("/professor/verAlunos/verAlunos" as any)}
          >
            <Ionicons name="people-outline" size={34} color="#FDB515" />
            <Text style={styles.cardTitulo}>Os meus alunos</Text>
          </Pressable>

          <Pressable
            style={styles.cardAtalho}
            onPress={() => router.push("/professor/presencas/presencas" as any)}
          >
            <Ionicons name="checkmark-done-outline" size={34} color="#FDB515" />
            <Text style={styles.cardTitulo}>Validar presenças</Text>
          </Pressable>

          <Pressable
            style={styles.cardAtalho}
            onPress={() => router.push("/professor/relatorios/relatorios" as any)}
          >
            <Ionicons name="document-text-outline" size={34} color="#FDB515" />
            <Text style={styles.cardTitulo}>Relatórios</Text>
          </Pressable>

          <Pressable
            style={styles.cardAtalho}
            onPress={() => router.push("/professor/avaliacoes/avaliacoes" as any)}
          >
            <Ionicons name="star-outline" size={34} color="#FDB515" />
            <Text style={styles.cardTitulo}>Avaliações</Text>
          </Pressable>

          <Pressable
            style={styles.cardAtalho}
            onPress={() => router.push("/professor/reunioes/reunioes" as any)}
          >
            <Ionicons name="calendar-outline" size={34} color="#FDB515" />
            <Text style={styles.cardTitulo}>Agendar reuniões</Text>
          </Pressable>
        </View>

        {temAreaResponsavel ? (
          <>
            <Text style={styles.secaoTitulo}>Área responsável</Text>

            <Pressable
              style={styles.cardResponsavel}
              onPress={() => router.push("/professorResponsavel/home" as any)}
            >
              <View style={styles.responsavelIcone}>
                <Ionicons name="shield-checkmark-outline" size={32} color="#160909" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.responsavelTitulo}>Professor Responsável</Text>
                <Text style={styles.responsavelTexto}>
                  Gerir alunos dos ensinos clínicos atribuídos.
                </Text>
              </View>

              <Ionicons name="chevron-forward-outline" size={24} color="#160909" />
            </Pressable>
          </>
        ) : null}

        <Text style={styles.secaoTitulo}>Estágios que orienta</Text>

        {estagiosAgrupados.length === 0 ? (
          <Text style={styles.mensagemVazia}>
            Ainda não tens alunos associados.
          </Text>
        ) : (
          <View style={styles.listaEstagios}>
            {estagiosAgrupados.map((estagio) => (
              <View key={estagio.id} style={styles.estagioCard}>
                <View style={styles.estagioIcone}>
                  <Ionicons name="briefcase-outline" size={28} color="#160909" />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.estagioTitulo}>
                    {estagio.edicoes_estagio?.ensinos_clinicos?.nome ||
                      "Ensino Clínico"}
                  </Text>

                  <Text style={styles.estagioTexto}>
                    {estagio.edicoes_estagio?.instituicoes?.nome || "Instituição"} ·{" "}
                    {estagio.edicoes_estagio?.servicos?.nome || "Serviço"}
                  </Text>

                  <Text style={styles.estagioTexto}>
                    {formatarData(estagio.edicoes_estagio?.data_inicio)} -{" "}
                    {formatarData(estagio.edicoes_estagio?.data_fim)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.secaoTitulo}>Próximos eventos</Text>

        {reunioes.length === 0 ? (
          <Text style={styles.mensagemVazia}>
            Não existem eventos agendados.
          </Text>
        ) : (
          <View style={styles.eventosLista}>
            {reunioes.map((reuniao) => (
              <View key={reuniao.id} style={styles.eventoCard}>
                <View>
                  <Text style={styles.eventoTitulo}>
                    {reuniao.assunto || "Reunião"}
                  </Text>
                  <Text style={styles.eventoTexto}>
                    {reuniao.data_hora
                      ? new Date(reuniao.data_hora).toLocaleString("pt-PT")
                      : "Sem data"}
                  </Text>
                  <Text style={styles.eventoTexto}>
                    {reuniao.local || "Sem local"}
                  </Text>
                </View>

                <Ionicons name="calendar-outline" size={28} color="#FDB515" />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {!menuAberto && (
        <View style={styles.bottomBar}>
          <Pressable
            style={styles.bottomItem}
            onPress={() =>
              router.push("/professor/perfil/perfil?from=bottom" as any)
            }
          >
            <Ionicons name="person-outline" size={25} color="#FDB515" />
            <Text style={styles.bottomTextoAtivo}>Perfil</Text>
          </Pressable>

          <Pressable
            style={styles.bottomItem}
            onPress={() =>
              mostrarPopup("Definições", "Esta página encontra-se em desenvolvimento.")
            }
          >
            <Ionicons name="settings-outline" size={25} color="#160909" />
            <Text style={styles.bottomTexto}>Definições</Text>
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
              <Image source={require("../../../assets/images/enf.jpg")} style={styles.imagemSidebar} resizeMode="cover"/>             
               </View>
            </View>

            <View style={styles.sidebarBody}>
              <Pressable
                style={styles.sidebarItem}
                onPress={() => {
                  setMenuAberto(false);
                  router.push("/professor/verAlunos/verAlunos" as any);
                }}
              >
                <Ionicons name="people-outline" size={25} color="#160909" />
                <Text style={styles.sidebarTexto}>Os meus alunos</Text>
              </Pressable>

              <Pressable
                style={styles.sidebarItem}
                onPress={() => {
                  setMenuAberto(false);
                  router.push("/professor/presencas/presencas" as any);
                }}
              >
                <Ionicons name="checkmark-done-outline" size={25} color="#160909" />
                <Text style={styles.sidebarTexto}>Validar presenças</Text>
              </Pressable>

              <Pressable
                style={styles.sidebarItem}
                onPress={() => {
                  setMenuAberto(false);
                  router.push("/professor/relatorios/relatorios" as any);
                }}
              >
                <Ionicons name="document-text-outline" size={25} color="#160909" />
                <Text style={styles.sidebarTexto}>Relatórios</Text>
              </Pressable>

              <Pressable
                style={styles.sidebarItem}
                onPress={() => {
                  setMenuAberto(false);
                  router.push("/professor/avaliacoes/avaliacoes" as any);
                }}
              >
                <Ionicons name="star-outline" size={25} color="#160909" />
                <Text style={styles.sidebarTexto}>Avaliações</Text>
              </Pressable>

              <Pressable
                style={styles.sidebarItem}
                onPress={() => {
                  setMenuAberto(false);
                  router.push("/professor/reunioes/reunioes" as any);
                }}
              >
                <Ionicons name="calendar-outline" size={25} color="#160909" />
                <Text style={styles.sidebarTexto}>Agendar reuniões</Text>
              </Pressable>

              {temAreaResponsavel ? (
                <Pressable
                  style={styles.sidebarItem}
                  onPress={() => {
                    setMenuAberto(false);
                    router.push("/professorResponsavel/home" as any);
                  }}
                >
                  <Ionicons name="shield-checkmark-outline" size={25} color="#160909" />
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
                  mostrarPopup("Definições", "Esta página encontra-se em desenvolvimento.");
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