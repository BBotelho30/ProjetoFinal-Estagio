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
import { supabase } from "../../../lib/supabase";
import styles from "./homeStyles";

type EnsinoResponsavel = {
  ensino_clinico_id: number;
};

export default function ProfessorResponsavelHome() {
  const [sidebarAberta, setSidebarAberta] = useState(true);

  const [nome, setNome] = useState("Professor");
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);

  const [totalEnsinos, setTotalEnsinos] = useState(0);
  const [totalEquipas, setTotalEquipas] = useState(0);
  const [totalDistribuicoes, setTotalDistribuicoes] = useState(0);

  const [loading, setLoading] = useState(true);

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTipo, setPopupTipo] = useState<"normal" | "sair">("normal");

  useEffect(() => {
    carregarDados();
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

  async function carregarDados() {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    if (!user) {
      setLoading(false);
      router.replace("/backoffice/superadmin/login/login" as any);
      return;
    }

    const { data: perfilData, error: perfilError } = await supabase
      .from("utilizadores")
      .select("nome, foto_url")
      .eq("id", user.id)
      .maybeSingle();

    if (perfilError) {
      console.log("ERRO AO CARREGAR PERFIL:", perfilError);
    } else {
      setNome(perfilData?.nome || "Professor");
      setFotoPerfil(perfilData?.foto_url || null);
    }

    const { data: responsaveisData, error: responsaveisError } = await supabase
      .from("responsaveis_ensinos_clinicos")
      .select("ensino_clinico_id")
      .eq("professor_id", user.id);

    if (responsaveisError) {
      console.log("ERRO AO CARREGAR ENSINOS RESPONSÁVEIS:", responsaveisError);
      abrirPopup("Erro", "Não foi possível carregar os ensinos atribuídos.");
      setLoading(false);
      return;
    }

    const ensinosIds =
      (responsaveisData as EnsinoResponsavel[] | null)?.map(
        (item) => item.ensino_clinico_id
      ) || [];

    setTotalEnsinos(ensinosIds.length);

    if (ensinosIds.length === 0) {
      setTotalEquipas(0);
      setTotalDistribuicoes(0);
      setLoading(false);
      return;
    }

    const { data: edicoesData, error: edicoesError } = await supabase
      .from("edicoes_estagio")
      .select("id, ensino_clinico_id")
      .in("ensino_clinico_id", ensinosIds)
      .neq("estado", "inativo");

    if (edicoesError) {
      console.log("ERRO AO CARREGAR EDIÇÕES:", edicoesError);
      abrirPopup("Erro", "Não foi possível carregar as edições de estágio.");
      setLoading(false);
      return;
    }

    const edicoesIds = (edicoesData || []).map((item: any) => item.id);

    if (edicoesIds.length === 0) {
      setTotalEquipas(0);
      setTotalDistribuicoes(0);
      setLoading(false);
      return;
    }

    const { data: professoresEstagioData } = await supabase
      .from("professores_estagio")
      .select("id, edicao_estagio_id")
      .in("edicao_estagio_id", edicoesIds);

    const { data: orientadoresEstagioData } = await supabase
      .from("orientadores_estagio")
      .select("id, edicao_estagio_id")
      .in("edicao_estagio_id", edicoesIds);

    const edicoesComEquipa = new Set<number>();

    (professoresEstagioData || []).forEach((item: any) => {
      edicoesComEquipa.add(item.edicao_estagio_id);
    });

    (orientadoresEstagioData || []).forEach((item: any) => {
      edicoesComEquipa.add(item.edicao_estagio_id);
    });

    setTotalEquipas(edicoesComEquipa.size);

    const { data: inscricoesData, error: inscricoesError } = await supabase
      .from("inscricoes_estagio")
      .select("id, edicao_estagio_id, estado, estado_estagio")
      .in("edicao_estagio_id", edicoesIds)
      .neq("estado", "rejeitado");

    if (inscricoesError) {
      console.log("ERRO AO CARREGAR DISTRIBUIÇÕES:", inscricoesError);
      setTotalDistribuicoes(0);
    } else {
      const distribuidas = (inscricoesData || []).filter(
        (item: any) =>
          item.estado === "aprovado" || item.estado_estagio === "em_curso"
      );

      setTotalDistribuicoes(distribuidas.length);
    }

    setLoading(false);
  }

  async function terminarSessao() {
    setPopupVisible(false);
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
                <Image
                  source={require("../../../../assets/images/enf.jpg")}
                  style={styles.logoSidebar}
                  resizeMode="cover"
                />
              </View>

              <Text style={styles.sidebarTitle}>Passaporte</Text>
              <Text style={styles.sidebarSubtitle}>Enfermagem</Text>
            </View>
          )}
        </View>

        <ScrollView
          style={styles.menuScroll}
          contentContainerStyle={styles.menu}
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            style={[styles.menuItem, styles.menuItemActive]}
            onPress={() =>
              router.push("/backoffice/professorResponsavel/home" as any)
            }
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
              router.push(
                "/backoffice/professorResponsavel/equipasEstagio/equipasEstagio" as any
              )
            }
          >
            <Ionicons name="people-circle-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && <Text style={styles.menuText}>Equipas</Text>}
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() =>
              router.push(
                "/backoffice/professorResponsavel/distribuirAlunos/distribuirAlunos" as any
              )
            }
          >
            <Ionicons name="git-branch-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && (
              <Text style={styles.menuText}>Distribuir Alunos</Text>
            )}
          </Pressable>
        </ScrollView>

        <View style={styles.sidebarFooter}>
          <Pressable
            style={styles.footerButton}
            onPress={() =>
              router.push("/backoffice/professorResponsavel/perfil/perfil" as any)
            }
          >
            <Ionicons name="person-circle-outline" size={24} color="#FDB515" />
            {sidebarAberta && <Text style={styles.footerText}>Perfil</Text>}
          </Pressable>

          <Pressable
            style={styles.footerButton}
            onPress={() =>
              abrirPopup(
                "Terminar sessão",
                "Tens a certeza que queres terminar sessão?",
                "sair"
              )
            }
          >
            <Ionicons name="log-out-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && <Text style={styles.footerText}>Sair</Text>}
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.titulo}>Olá, {nome}</Text>
            <Text style={styles.subtitulo}>
              Área do Professor Responsável
            </Text>
          </View>

          <Pressable
            style={styles.profileButton}
            onPress={() =>
              router.push("/backoffice/professorResponsavel/perfil/perfil" as any)
            }
          >
            {fotoPerfil ? (
              <Image
                source={{ uri: fotoPerfil }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <Ionicons
                name="person-circle-outline"
                size={36}
                color="#225943"
              />
            )}
          </Pressable>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FDB515"
            style={{ marginTop: 50 }}
          />
        ) : (
          <>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Ionicons name="school-outline" size={25} color="#160909" />
                </View>
                <Text style={styles.statNumero}>{totalEnsinos}</Text>
                <Text style={styles.statLabel}>Ensinos atribuídos</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Ionicons
                    name="people-circle-outline"
                    size={26}
                    color="#160909"
                  />
                </View>
                <Text style={styles.statNumero}>{totalEquipas}</Text>
                <Text style={styles.statLabel}>Equipas criadas</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Ionicons
                    name="git-branch-outline"
                    size={25}
                    color="#160909"
                  />
                </View>
                <Text style={styles.statNumero}>{totalDistribuicoes}</Text>
                <Text style={styles.statLabel}>Alunos distribuídos</Text>
              </View>
            </View>

            {totalEnsinos === 0 && (
              <View style={styles.avisoCard}>
                <Ionicons
                  name="information-circle-outline"
                  size={26}
                  color="#B77900"
                />
                <Text style={styles.avisoTexto}>
                  Ainda não tens ensinos clínicos atribuídos como professor
                  responsável. Quando o SuperAdmin fizer essa atribuição, eles
                  aparecem aqui.
                </Text>
              </View>
            )}

            <Text style={styles.secaoTitulo}>Ações principais</Text>

            <View style={styles.cardsGrid}>
              <Pressable
                style={styles.actionCard}
                onPress={() =>
                  router.push(
                    "/backoffice/professorResponsavel/equipasEstagio/equipasEstagio" as any
                  )
                }
              >
                <View style={styles.actionBarra} />

                <View style={styles.actionIcon}>
                  <Ionicons
                    name="people-circle-outline"
                    size={36}
                    color="#FDB515"
                  />
                </View>

                <View style={styles.actionTextoBox}>
                  <Text style={styles.actionTitle}>Equipas dos Estágios</Text>
                  <Text style={styles.actionDescription}>
                    Consultar e gerir professores e orientadores dos estágios
                    que coordenas.
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward-outline"
                  size={24}
                  color="#160909"
                />
              </Pressable>

              <Pressable
                style={styles.actionCard}
                onPress={() =>
                  router.push(
                    "/backoffice/professorResponsavel/distribuirAlunos/distribuirAlunos" as any
                  )
                }
              >
                <View style={styles.actionBarra} />

                <View style={styles.actionIcon}>
                  <Ionicons
                    name="git-branch-outline"
                    size={34}
                    color="#FDB515"
                  />
                </View>

                <View style={styles.actionTextoBox}>
                  <Text style={styles.actionTitle}>Distribuir Alunos</Text>
                  <Text style={styles.actionDescription}>
                    Ver alunos já distribuídos e fazer novas distribuições nos
                    teus estágios.
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward-outline"
                  size={24}
                  color="#160909"
                />
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>

      <Modal
        visible={popupVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPopupVisible(false)}
      >
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