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
  professor_id: string | null;
  orientador_id: string | null;
  edicoes_estagio?: {
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
};

export default function AlunoHome() {
  const [utilizador, setUtilizador] = useState<Utilizador | null>(null);
  const [estagioAtual, setEstagioAtual] = useState<EstagioAtual | null>(null);
  const [reunioes, setReunioes] = useState<Reuniao[]>([]);
  const [loading, setLoading] = useState(true);

  const [menuAberto, setMenuAberto] = useState(false);
  const [popupVisivel, setPopupVisivel] = useState(false);

  const [popupDefinicoesVisivel, setPopupDefinicoesVisivel] = useState(false);
  const [confirmarLogoutVisivel, setConfirmarLogoutVisivel] = useState(false);

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
        professor_id,
        orientador_id,
        estado_estagio,
        edicoes_estagio(
          data_inicio,
          data_fim,
          ensinos_clinicos(nome),
          instituicoes(nome),
          servicos(nome)
        )
      `)
      .eq("aluno_id", userId)
      .neq("estado_estagio", "concluido")
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (estagioError) {
      console.log("ERRO ESTÁGIO HOME:", estagioError);
    }

    if (estagioData) {
      let professor = null;
      let orientador = null;

      if ((estagioData as any).professor_id) {
        const { data: professorData } = await supabase
          .from("utilizadores")
          .select("nome")
          .eq("id", (estagioData as any).professor_id)
          .single();

        professor = professorData;
      }

      if ((estagioData as any).orientador_id) {
        const { data: orientadorData } = await supabase
          .from("utilizadores")
          .select("nome")
          .eq("id", (estagioData as any).orientador_id)
          .single();

        orientador = orientadorData;
      }

      setEstagioAtual({
        ...(estagioData as any),
        professor,
        orientador,
      });
    } else {
      setEstagioAtual(null);
    }

    const { data: reunioesData, error: reunioesError } = await supabase
      .from("reunioes")
      .select("id, assunto, data_hora, local")
      .eq("aluno_id", userId)
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

  useEffect(() => {
    carregarDados();
  }, []);

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
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.topIcons}>
          <Pressable onPress={() => setMenuAberto(true)}>
            <Ionicons name="menu-outline" size={34} color="#160909" />
          </Pressable>

          <Pressable onPress={() => setPopupVisivel(true)}>
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
            onPress={() => router.push("/aluno/presencas" as any)}
          >
            <Ionicons name="calendar-outline" size={34} color="#FDB515" />
            <Text style={styles.cardTitulo}>Presenças</Text>
          </Pressable>

          <Pressable
            style={styles.cardAtalho}
            onPress={() => router.push("/aluno/avaliacoes" as any)}
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
            style={styles.estagioAtualCard}
            onPress={() =>
              router.push(
                `/aluno/estagios/detalheEstagio/detalheEstagio?id=${estagioAtual.id}` as any
              )
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
                {estagioAtual.edicoes_estagio?.instituicoes?.nome ||
                  "Instituição"}{" "}
                · {estagioAtual.edicoes_estagio?.servicos?.nome || "Serviço"}
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
                </View>

                <Ionicons name="calendar-outline" size={28} color="#FDB515" />
              </View>
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

        <Pressable style={styles.bottomItem}onPress={() => {setMenuAberto(false);setPopupDefinicoesVisivel(true);}}>
          <Ionicons name="settings-outline" size={24} color="#160909" />
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
              <Image source={require("../../../assets/images/enf.jpg")} style={styles.imagemSidebar} resizeMode="cover"/>             
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
                  router.push("/aluno/presencas" as any);
                }}
              >
                <Ionicons name="clipboard-outline" size={25} color="#160909" />
                <Text style={styles.sidebarTexto}>Presenças</Text>
              </Pressable>

              <Pressable
                style={styles.sidebarItem}
                onPress={() => {
                  setMenuAberto(false);
                  router.push("/aluno/avaliacoes" as any);
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

              <Pressable style={styles.logoutButton} onPress={() => setConfirmarLogoutVisivel(true)}>
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
            <Text style={styles.popupTitle}>Em desenvolvimento</Text>
            <Text style={styles.popupMessage}>
              Esta funcionalidade será implementada futuramente.
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


      <Modal visible={popupDefinicoesVisivel} transparent animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>Definições</Text>
            <Text style={styles.popupMessage}>
              Esta página encontra-se em desenvolvimento.
            </Text>

            <Pressable
              style={styles.popupOkButton}
              onPress={() => setPopupDefinicoesVisivel(false)}
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

              <Pressable
                style={styles.modalBotaoCriar}
                onPress={terminarSessao}
              >
                <Text style={styles.modalBotaoTextoEscuro}>Sair</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}