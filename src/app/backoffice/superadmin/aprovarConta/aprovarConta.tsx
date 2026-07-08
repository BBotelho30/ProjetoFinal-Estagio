import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Image,
} from "react-native";
import { supabase } from "../../../../lib/supabase";
import styles from "./aprovarContaStyles";

type Utilizador = {
  id: string;
  nome: string;
  email: string;
  tipo: string;
  estado: string;
  numero_identificacao: string | null;
};

export default function AprovarContas() {
  const [sidebarAberta, setSidebarAberta] = useState(true);

  const [utilizadores, setUtilizadores] = useState<Utilizador[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterTipo, setFilterTipo] = useState<
    "all" | "aluno" | "professor" | "orientador"
  >("all");

  const [showFilters, setShowFilters] = useState(false);
  const [showPorPagina, setShowPorPagina] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(15);

  const [utilizadorSelecionado, setUtilizadorSelecionado] =
    useState<Utilizador | null>(null);
  const [estadoSelecionado, setEstadoSelecionado] = useState<
    "aprovado" | "rejeitado" | null
  >(null);

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTipo, setPopupTipo] = useState<
    "normal" | "sair" | "aprovar" | "rejeitar"
  >("normal");

  useEffect(() => {
    carregarUtilizadoresPendentes();
  }, []);

  function abrirPopup(
    titulo: string,
    mensagem: string,
    tipo: "normal" | "sair" | "aprovar" | "rejeitar" = "normal"
  ) {
    setPopupTitle(titulo);
    setPopupMessage(mensagem);
    setPopupTipo(tipo);
    setPopupVisible(true);
  }

  async function carregarUtilizadoresPendentes() {
    setLoading(true);

    const { data, error } = await supabase
      .from("utilizadores")
      .select("id, nome, email, tipo, estado, numero_identificacao")
      .eq("estado", "pendente")
      .order("criado_em", { ascending: false });

    if (error) {
      console.log("ERRO AO CARREGAR:", error);
      abrirPopup("Erro", "Não foi possível carregar as contas pendentes.");
    } else {
      setUtilizadores(data || []);
    }

    setLoading(false);
  }

  function pedirAtualizacaoEstado(
    user: Utilizador,
    novoEstado: "aprovado" | "rejeitado"
  ) {
    setUtilizadorSelecionado(user);
    setEstadoSelecionado(novoEstado);

    if (novoEstado === "aprovado") {
      abrirPopup(
        "Aprovar conta",
        `Tens a certeza que queres aprovar a conta de ${user.nome}?`,
        "aprovar"
      );
    } else {
      abrirPopup(
        "Rejeitar conta",
        `Tens a certeza que queres rejeitar a conta de ${user.nome}?`,
        "rejeitar"
      );
    }
  }

  async function confirmarAtualizacaoEstado() {
    if (!utilizadorSelecionado || !estadoSelecionado) return;

    setPopupVisible(false);

    const { error } = await supabase
      .from("utilizadores")
      .update({ estado: estadoSelecionado })
      .eq("id", utilizadorSelecionado.id);

    if (error) {
      console.log("ERRO AO ATUALIZAR:", error);
      abrirPopup("Erro", "Não foi possível atualizar o estado da conta.");
      return;
    }

    abrirPopup(
      "Sucesso",
      estadoSelecionado === "aprovado"
        ? "Conta aprovada com sucesso."
        : "Conta rejeitada com sucesso."
    );

    setUtilizadorSelecionado(null);
    setEstadoSelecionado(null);
    carregarUtilizadoresPendentes();
  }

  async function terminarSessao() {
    setPopupVisible(false);
    await supabase.auth.signOut();
    router.replace("/backoffice/login" as any);
  }

  const utilizadoresFiltrados = useMemo(() => {
    return utilizadores.filter((u) => {
      if (filterTipo !== "all" && u.tipo !== filterTipo) return false;

      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const nome = (u.nome || "").toLowerCase();
        const email = (u.email || "").toLowerCase();
        const numero = (u.numero_identificacao || "").toLowerCase();

        return nome.includes(q) || email.includes(q) || numero.includes(q);
      }

      return true;
    });
  }, [utilizadores, filterTipo, searchQuery]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(utilizadoresFiltrados.length / itensPorPagina)
  );

  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;

  const utilizadoresPaginados = utilizadoresFiltrados.slice(inicio, fim);

  function mudarItensPorPagina(valor: number) {
    setItensPorPagina(valor);
    setPaginaAtual(1);
    setShowPorPagina(false);
  }

  function irPaginaAnterior() {
    if (paginaAtual > 1) {
      setPaginaAtual(paginaAtual - 1);
    }
  }

  function irPaginaSeguinte() {
    if (paginaAtual < totalPaginas) {
      setPaginaAtual(paginaAtual + 1);
    }
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
              <Image source={require("../../../../../assets/images/enf.jpg")} style={styles.logoSidebar} resizeMode="cover"/></View>

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
            style={styles.menuItem}
            onPress={() => router.push("/backoffice/superadmin/home" as any)}
          >
            <Ionicons name="home-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && <Text style={styles.menuText}>Dashboard</Text>}
          </Pressable>

          <Pressable
            style={[styles.menuItem, styles.menuItemActive]}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/aprovarConta/aprovarConta" as any
              )
            }
          >
            <Ionicons name="person-add-outline" size={23} color="#160909" />
            {sidebarAberta && (
              <Text style={[styles.menuText, styles.menuTextActive]}>
                Aprovar Contas
              </Text>
            )}
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/utilizadores/utilizadores" as any
              )
            }
          >
            <Ionicons name="people-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && <Text style={styles.menuText}>Utilizadores</Text>}
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/instituicoes/instituicoes" as any
              )
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
            {sidebarAberta && (
              <Text style={styles.menuText}>Ensinos Clínicos</Text>
            )}
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/editarEstagio/editarEstagio" as any
              )
            }
          >
            <Ionicons name="calendar-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && (
              <Text style={styles.menuText}>Edições de Estágio</Text>
            )}
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
              router.push(
                "/backoffice/superadmin/criar_equipas/equipasEstagio" as any
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
                "/backoffice/superadmin/distribuirAlunos/distribuirAlunos" as any
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
              router.push("/backoffice/superadmin/perfil/perfil" as any)
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
            <Text style={styles.titulo}>Aprovar Contas</Text>
            <Text style={styles.subtitulo}>
              Validar registos de alunos, professores e orientadores.
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons name="person-add-outline" size={34} color="#FDB515" />
          </View>
        </View>

        <View style={styles.filtrosCard}>
          <View style={styles.searchRow}>
            <TextInput
              placeholder="Pesquisar por nome, email ou número..."
              placeholderTextColor="#8c8787"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                setPaginaAtual(1);
              }}
              autoCapitalize="none"
            />

            <Pressable
              style={styles.filterToggle}
              onPress={() => setShowFilters((s) => !s)}
            >
              <Text style={styles.filterToggleText}>Filtrar</Text>
              <Ionicons
                name={showFilters ? "chevron-up-outline" : "chevron-down-outline"}
                size={18}
                color="#160909"
              />
            </Pressable>
          </View>

          {showFilters && (
            <View style={styles.filterDropdown}>
              <Pressable
                style={[
                  styles.filterOption,
                  filterTipo === "all" && styles.filterOptionActive,
                ]}
                onPress={() => {
                  setFilterTipo("all");
                  setPaginaAtual(1);
                  setShowFilters(false);
                }}
              >
                <Text style={styles.filterOptionText}>Todos</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.filterOption,
                  filterTipo === "aluno" && styles.filterOptionActive,
                ]}
                onPress={() => {
                  setFilterTipo("aluno");
                  setPaginaAtual(1);
                  setShowFilters(false);
                }}
              >
                <Text style={styles.filterOptionText}>Alunos</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.filterOption,
                  filterTipo === "professor" && styles.filterOptionActive,
                ]}
                onPress={() => {
                  setFilterTipo("professor");
                  setPaginaAtual(1);
                  setShowFilters(false);
                }}
              >
                <Text style={styles.filterOptionText}>Professores</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.filterOption,
                  filterTipo === "orientador" && styles.filterOptionActive,
                ]}
                onPress={() => {
                  setFilterTipo("orientador");
                  setPaginaAtual(1);
                  setShowFilters(false);
                }}
              >
                <Text style={styles.filterOptionText}>Orientadores</Text>
              </Pressable>
            </View>
          )}
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FDB515"
            style={{ marginTop: 40 }}
          />
        ) : utilizadoresFiltrados.length === 0 ? (
          <View style={styles.vazioContainer}>
            <Ionicons name="checkmark-circle-outline" size={50} color="#FDB515" />
            <Text style={styles.vazioTexto}>Não existem contas pendentes.</Text>
          </View>
        ) : (
          <>
            <View style={styles.lista}>
              {utilizadoresPaginados.map((user) => (
                <View key={user.id} style={styles.card}>
                  <View style={styles.cardTopo}>
                    <View style={styles.avatar}>
                      <Ionicons
                        name="person-outline"
                        size={28}
                        color="#160909"
                      />
                    </View>

                    <View style={styles.info}>
                      <Text style={styles.nome}>{user.nome}</Text>
                      <Text style={styles.numeroTopo}>
                        Nº identificação: {user.numero_identificacao || "N/A"}
                      </Text>
                    </View>

                    <View style={styles.estadoBadge}>
                      <Text style={styles.estadoBadgeTexto}>{user.estado}</Text>
                    </View>
                  </View>

                  <View style={styles.detalhesGrid}>
                    <View style={styles.linhaInfo}>
                      <Text style={styles.label}>Tipo</Text>
                      <Text style={styles.valorTipo}>{user.tipo}</Text>
                    </View>

                    <View style={styles.linhaInfo}>
                      <Text style={styles.label}>Email</Text>
                      <Text style={styles.valor}>{user.email || "N/A"}</Text>
                    </View>
                  </View>

                  <View style={styles.botoes}>
                    <Pressable
                      style={[styles.botao, styles.botaoAprovar]}
                      onPress={() => pedirAtualizacaoEstado(user, "aprovado")}
                    >
                      <Ionicons
                        name="checkmark-outline"
                        size={21}
                        color="#ffffffff"
                      />
                      <Text style={styles.botaoTexto}>Aprovar</Text>
                    </Pressable>

                    <Pressable
                      style={[styles.botao, styles.botaoRejeitar]}
                      onPress={() => pedirAtualizacaoEstado(user, "rejeitado")}
                    >
                      <Ionicons name="close-outline" size={21} color="#FFFFFF" />
                      <Text style={styles.botaoTextoRejeitar}>Rejeitar</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.paginacaoCard}>
              <View style={styles.paginacaoInfo}>
                <Text style={styles.paginacaoTexto}>
                  A mostrar {inicio + 1}-
                  {Math.min(fim, utilizadoresFiltrados.length)} de{" "}
                  {utilizadoresFiltrados.length}
                </Text>

                <View style={styles.porPaginaContainer}>
                  <Text style={styles.porPaginaLabel}>Por página:</Text>

                  <Pressable
                    style={styles.porPaginaBotao}
                    onPress={() => setShowPorPagina((s) => !s)}
                  >
                    <Text style={styles.porPaginaTexto}>{itensPorPagina}</Text>
                    <Ionicons
                      name={
                        showPorPagina
                          ? "chevron-up-outline"
                          : "chevron-down-outline"
                      }
                      size={16}
                      color="#160909"
                    />
                  </Pressable>

                  {showPorPagina && (
                    <View style={styles.porPaginaDropdown}>
                      <Pressable
                        style={styles.porPaginaOpcao}
                        onPress={() => mudarItensPorPagina(10)}
                      >
                        <Text style={styles.porPaginaOpcaoTexto}>10</Text>
                      </Pressable>

                      <Pressable
                        style={styles.porPaginaOpcao}
                        onPress={() => mudarItensPorPagina(15)}
                      >
                        <Text style={styles.porPaginaOpcaoTexto}>15</Text>
                      </Pressable>

                      <Pressable
                        style={styles.porPaginaOpcao}
                        onPress={() => mudarItensPorPagina(20)}
                      >
                        <Text style={styles.porPaginaOpcaoTexto}>20</Text>
                      </Pressable>

                      <Pressable
                        style={styles.porPaginaOpcao}
                        onPress={() => mudarItensPorPagina(25)}
                      >
                        <Text style={styles.porPaginaOpcaoTexto}>25</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.paginacaoBotoes}>
                <Pressable
                  style={[
                    styles.paginaBotao,
                    paginaAtual === 1 && styles.paginaBotaoDisabled,
                  ]}
                  onPress={irPaginaAnterior}
                  disabled={paginaAtual === 1}
                >
                  <Ionicons name="chevron-back-outline" size={20} color="#160909" />
                </Pressable>

                <Text style={styles.paginaAtualTexto}>
                  Página {paginaAtual} de {totalPaginas}
                </Text>

                <Pressable
                  style={[
                    styles.paginaBotao,
                    paginaAtual === totalPaginas && styles.paginaBotaoDisabled,
                  ]}
                  onPress={irPaginaSeguinte}
                  disabled={paginaAtual === totalPaginas}
                >
                  <Ionicons
                    name="chevron-forward-outline"
                    size={20}
                    color="#160909"
                  />
                </Pressable>
              </View>
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
            ) : popupTipo === "aprovar" || popupTipo === "rejeitar" ? (
              <View style={styles.popupBotoesLinha}>
                <Pressable
                  style={styles.popupBotaoCancelar}
                  onPress={() => setPopupVisible(false)}
                >
                  <Text style={styles.popupTextoCancelar}>Cancelar</Text>
                </Pressable>

                <Pressable
                  style={
                    popupTipo === "aprovar"
                      ? styles.popupBotaoConfirmar
                      : styles.popupBotaoSair
                  }
                  onPress={confirmarAtualizacaoEstado}
                >
                  <Text
                    style={
                      popupTipo === "aprovar"
                        ? styles.popupTextoConfirmar
                        : styles.popupTextoSair
                    }
                  >
                    {popupTipo === "aprovar" ? "Aprovar" : "Rejeitar"}
                  </Text>
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