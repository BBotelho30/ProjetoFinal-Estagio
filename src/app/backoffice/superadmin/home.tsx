import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View, Image, Modal } from "react-native";
import { supabase } from "../../../lib/supabase";
import styles from "./homeStyles";
import backofficeStyles from "../../../styles/backofficeStyles";


export default function SuperAdminHome() {
  const [sidebarAberta, setSidebarAberta] = useState(true);
  const [nome, setNome] = useState("Admin");
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTipo, setPopupTipo] = useState<"normal" | "sair">("normal");
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  

  useEffect(() => {
    carregarPerfil();
  }, []);

function abrirPopup(
  titulo: string,
  mensagem: string,
  tipo: "normal" | "sair" = "normal"
) {
  setPopupTitle(titulo);
  setPopupMessage(mensagem);
  setPopupTipo(tipo);
  setPopupVisible(true);
}

async function carregarPerfil() {
  const { data: authData } = await supabase.auth.getUser();

  const user = authData.user;

  if (!user) {
    console.log("SEM SESSÃO ATIVA");
    return;
  }

  const { data, error } = await supabase
    .from("utilizadores")
    .select("nome, foto_url")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.log("Erro ao carregar perfil:", error);
    return;
  }

  if (data?.nome) {
    setNome(data.nome);
  }

  if (data?.foto_url) {
    setFotoPerfil(data.foto_url);
  } else {
    setFotoPerfil(null);
  }
}


  async function terminarSessao() {
    await supabase.auth.signOut();
    router.replace("/backoffice/superadmin/login/login" as any);
  }

  return (
    <View style={styles.page}>
      <View style={[styles.sidebar, !sidebarAberta && styles.sidebarFechada]}>
        <View style={styles.sidebarTop}>
          <Pressable
            style={styles.menuButton}
            onPress={() => setSidebarAberta(!sidebarAberta)}
          >
            <Ionicons
              name={sidebarAberta ? "chevron-back-outline" : "menu-outline"}
              size={26}
              color="#FDB515"
            />
          </Pressable>

          {sidebarAberta && (
            <View style={styles.sidebarHeader}>
              <View style={styles.logoCircle}>
                <Image source={require("../../../../assets/images/enf.jpg")} style={styles.logoSidebar} resizeMode="cover"/></View>

              <Text style={styles.sidebarTitle}>Passaporte</Text>
              <Text style={styles.sidebarSubtitle}>Enfermagem</Text>
            </View>
          )}
        </View>

        <ScrollView style={styles.menuScroll} contentContainerStyle={styles.menu} showsVerticalScrollIndicator={false}>
          <Pressable
            style={[styles.menuItem, styles.menuItemActive]}
            onPress={() => router.push("/backoffice/superadmin/home" as any)}
          >
            <Ionicons name="home-outline" size={23} color="#160909" />
            {sidebarAberta && (
              <Text style={[styles.menuText, styles.menuTextActive]}>
                Dashboard
              </Text>
            )}
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() =>
              router.push("/backoffice/superadmin/aprovarConta/aprovarConta" as any)
            }
          >
            <Ionicons name="person-add-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && <Text style={styles.menuText}>Aprovar Contas</Text>}
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() =>
              router.push("/backoffice/superadmin/utilizadores/utilizadores" as any)
            }
          >
            <Ionicons name="people-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && <Text style={styles.menuText}>Utilizadores</Text>}
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() =>
              router.push("/backoffice/superadmin/instituicoes/instituicoes" as any)
            }
          >
            <Ionicons name="business-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && <Text style={styles.menuText}>Instituições</Text>}
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() =>
              router.push("/backoffice/superadmin/servicos/servicos" as any)
            }
          >
            <Ionicons name="medkit-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && <Text style={styles.menuText}>Serviços</Text>}
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/ensinos-clinicos/ensinos-clinicos" as any
              )
            }
          >
            <Ionicons name="school-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && <Text style={styles.menuText}>Ensinos Clínicos</Text>}
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() =>
              router.push("/backoffice/superadmin/editarEstagio/editarEstagio" as any)
            }
          >
            <Ionicons name="calendar-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && <Text style={styles.menuText}>Edições de Estágio</Text>}
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/professoresResponsaveis/professoresResponsaveis" as any
              )
            }
          >
            <Ionicons name="ribbon-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && (
              <Text style={styles.menuText}>Professores Responsáveis</Text>
            )}
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() =>
              router.push("/backoffice/superadmin/criar_equipas/equipasEstagio" as any)
            }
          >
            <Ionicons name="people-circle-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && <Text style={styles.menuText}>Equipas</Text>}
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/distribuirAlunos/distribuirAlunos" as any
              )
            }
          >
            <Ionicons name="git-branch-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && <Text style={styles.menuText}>Distribuir Alunos</Text>}
          </Pressable>
        </ScrollView>

        <View style={styles.sidebarFooter}>
          <Pressable
            style={styles.footerButton}
            onPress={() =>
              router.push("/backoffice/superadmin/perfil/perfil" as any)
            }
          >
            <Ionicons name="person-circle-outline" size={24} color="#FDB515" />
            {sidebarAberta && <Text style={styles.footerText}>Perfil</Text>}
          </Pressable>

          <Pressable style={styles.footerButton} onPress={() => abrirPopup("Terminar sessão", "Tens a certeza que queres terminar sessão?", "sair")}>
            <Ionicons name="log-out-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && <Text style={styles.footerText}>Sair</Text>}
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.main} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.titulo}>Olá, {nome}</Text>
            <Text style={styles.subtitulo}>
              Gestão do Passaporte de Enfermagem
            </Text>
          </View>

          <Pressable style={styles.profileButton} onPress={() => router.push("/backoffice/superadmin/perfil/perfil" as any)}>
            {fotoPerfil ? (
              <Image source={{ uri: fotoPerfil }} style={styles.profileImage} resizeMode="cover"/>
            ) : (
            <Ionicons name="person-circle-outline" size={34} color="#225943" />
          )}
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Ações principais</Text>

        <View style={styles.cardsContainer}>
          <Pressable
            style={styles.card}
            onPress={() =>
              router.push("/backoffice/superadmin/aprovarConta/aprovarConta" as any)
            }
          >
            <Ionicons name="person-add-outline" size={36} color="#FDB515" />
            <View style={styles.cardTexto}>
              <Text style={styles.cardTitulo}>Aprovar Contas</Text>
              <Text style={styles.cardDescricao}>
                Validar alunos, professores e orientadores pendentes.
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={styles.card}
            onPress={() =>
              router.push("/backoffice/superadmin/utilizadores/utilizadores" as any)
            }
          >
            <Ionicons name="people-outline" size={36} color="#FDB515" />
            <View style={styles.cardTexto}>
              <Text style={styles.cardTitulo}>Utilizadores</Text>
              <Text style={styles.cardDescricao}>
                Consultar alunos, professores e orientadores aprovados.
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={styles.card}
            onPress={() =>
              router.push("/backoffice/superadmin/instituicoes/instituicoes" as any)
            }
          >
            <Ionicons name="business-outline" size={36} color="#FDB515" />
            <View style={styles.cardTexto}>
              <Text style={styles.cardTitulo}>Instituições</Text>
              <Text style={styles.cardDescricao}>
                Gerir hospitais, unidades e instituições parceiras.
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={styles.card}
            onPress={() =>
              router.push("/backoffice/superadmin/servicos/servicos" as any)
            }
          >
            <Ionicons name="medkit-outline" size={36} color="#FDB515" />
            <View style={styles.cardTexto}>
              <Text style={styles.cardTitulo}>Serviços</Text>
              <Text style={styles.cardDescricao}>
                Criar serviços associados às instituições.
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={styles.card}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/ensinos-clinicos/ensinos-clinicos" as any,
              )
            }
          >
            <Ionicons name="school-outline" size={36} color="#FDB515" />
            <View style={styles.cardTexto}>
              <Text style={styles.cardTitulo}>Ensinos Clínicos</Text>
              <Text style={styles.cardDescricao}>
                Gerir os ensinos clínicos, anos, semestres e horas.
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={styles.card}
            onPress={() =>
              router.push("/backoffice/superadmin/editarEstagio/editarEstagio" as any)
            }
          >
            <Ionicons name="calendar-outline" size={36} color="#FDB515" />
            <View style={styles.cardTexto}>
              <Text style={styles.cardTitulo}>Edições de Estágio</Text>
              <Text style={styles.cardDescricao}>
                Criar vagas por ano letivo, instituição e serviço.
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={styles.card}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/professoresResponsaveis/professoresResponsaveis" as any,
              )
            }
          >
            <Ionicons name="ribbon-outline" size={36} color="#FDB515" />
            <View style={styles.cardTexto}>
              <Text style={styles.cardTitulo}>Professores Responsáveis</Text>
              <Text style={styles.cardDescricao}>
                Nomear professores responsáveis por ensinos clínicos.
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={styles.card}
            onPress={() =>
              router.push("/backoffice/superadmin/criar_equipas/equipasEstagio" as any)
            }
          >
            <Ionicons name="people-circle-outline" size={36} color="#FDB515" />
            <View style={styles.cardTexto}>
              <Text style={styles.cardTitulo}>Equipas dos Estágios</Text>
              <Text style={styles.cardDescricao}>
                Associar professores e orientadores às edições de estágio.
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={styles.card}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/distribuirAlunos/distribuirAlunos" as any,
              )
            }
          >
            <Ionicons name="git-branch-outline" size={36} color="#FDB515" />
            <View style={styles.cardTexto}>
              <Text style={styles.cardTitulo}>Distribuir Alunos</Text>
              <Text style={styles.cardDescricao}>
                Associar alunos a estágios, professores e orientadores.
              </Text>
            </View>
          </Pressable>

        </View>
      </ScrollView>

      
      
      <Modal visible={popupVisible} transparent animationType="fade" onRequestClose={() => setPopupVisible(false)}>
        <View style={styles.popupOverlay}>
        <View style={styles.popupContainer}>
        <Text style={styles.popupTitle}>{popupTitle}</Text>
        <Text style={styles.popupMessage}>{popupMessage}</Text>

      {popupTipo === "sair" ? (
        <View style={styles.popupBotoesLinha}>
          <Pressable
            style={styles.popupBotaoCancelar}
            onPress={() => setPopupVisible(false)}
          >
            <Text style={styles.popupTextoCancelar}>Cancelar</Text>
          </Pressable>

          <Pressable style={styles.popupBotaoSair} onPress={terminarSessao}>
            <Text style={styles.popupTextoSair}>Sair</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          style={styles.popupOkButton}
          onPress={() => setPopupVisible(false)}
        >
          <Text style={styles.popupOkText}>OK</Text>
        </Pressable>
      )}
    </View>
  </View>
</Modal>
    </View>
  );
}