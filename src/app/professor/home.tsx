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

export default function ProfessorHome() {
  const [utilizador, setUtilizador] = useState<Utilizador | null>(null);
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

    const { data: userData, error: userError } = await supabase
      .from("utilizadores")
      .select("id, nome, email, foto_url, tipo")
      .eq("id", userId)
      .single();

    if (userError || !userData) {
      console.log("ERRO PROFESSOR HOME:", userError);
      setLoading(false);
      return;
    }

    setUtilizador(userData as any);

    const { data: responsavelData } = await supabase
      .from("responsaveis_ensinos_clinicos")
      .select("id")
      .eq("professor_id", userId)
      .limit(1);

    setTemAreaResponsavel((responsavelData || []).length > 0);

    setLoading(false);
  }

  useEffect(() => {
    carregarDados();
  }, []);

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
              <Ionicons
                name="person-circle-outline"
                size={70}
                color="#FDB515"
              />
            )}
          </Pressable>
        </View>

        <Text style={styles.secaoTitulo}>Acessos rápidos</Text>

        <View style={styles.grid}>
          <Pressable
            style={styles.cardAtalho}
            onPress={() =>
              router.push("/professor/alunos/alunos" as any)
            }
          >
            <Ionicons name="people-outline" size={34} color="#FDB515" />
            <Text style={styles.cardTitulo}>Os meus alunos</Text>
          </Pressable>

          <Pressable
            style={styles.cardAtalho}
            onPress={() =>
              router.push("/professor/presencas/presencas" as any)
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
              router.push("/professor/avaliacoes/avaliacoes" as any)
            }
          >
            <Ionicons name="star-outline" size={34} color="#FDB515" />
            <Text style={styles.cardTitulo}>Avaliações</Text>
          </Pressable>
        </View>

        {temAreaResponsavel ? (
          <>
            <Text style={styles.secaoTitulo}>Área responsável</Text>

            <Pressable
              style={styles.cardResponsavel}
              onPress={() =>
                router.push("/professorResponsavel/home" as any)
              }
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
                  Gerir alunos dos ensinos clínicos atribuídos.
                </Text>
              </View>

              <Ionicons name="chevron-forward-outline" size={24} color="#160909" />
            </Pressable>
          </>
        ) : null}
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
              mostrarPopup(
                "Definições",
                "Esta página encontra-se em desenvolvimento."
              )
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
                <Ionicons name="school-outline" size={34} color="#160909" />
              </View>
            </View>

            <View style={styles.sidebarBody}>
              <Pressable
                style={styles.sidebarItem}
                onPress={() => {
                  setMenuAberto(false);
                  router.push("/professor/alunos/alunos" as any);
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

              {temAreaResponsavel ? (
                <Pressable
                  style={styles.sidebarItem}
                  onPress={() => {
                    setMenuAberto(false);
                    router.push("/professorResponsavel/home" as any);
                  }}
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