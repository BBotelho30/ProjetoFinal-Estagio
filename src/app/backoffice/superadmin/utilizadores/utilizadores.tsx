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
  TextInput,
  View,
} from "react-native";
import { supabase } from "../../../../lib/supabase";
import styles from "./utilizadoresStyle";

type Utilizador = {
  id: string;
  nome: string;
  email: string;
  tipo: string;
  estado: string;
  numero_identificacao: string | null;
  ano_curricular: number | null;
  ativo: boolean | null;
};

export default function Utilizadores() {
  const [sidebarAberta, setSidebarAberta] = useState(true);

  const [utilizadores, setUtilizadores] = useState<Utilizador[]>([]);
  const [loading, setLoading] = useState(true);

  const [pesquisa, setPesquisa] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroAno, setFiltroAno] = useState("todos");
  const [filtroAtivo, setFiltroAtivo] = useState("ativos");

  const [showFiltroTipo, setShowFiltroTipo] = useState(false);
  const [showFiltroAno, setShowFiltroAno] = useState(false);
  const [showFiltroAtivo, setShowFiltroAtivo] = useState(false);
  const [showPorPagina, setShowPorPagina] = useState(false);

  const [utilizadorAberto, setUtilizadorAberto] = useState<string | null>(null);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(15);

  const [utilizadorSelecionado, setUtilizadorSelecionado] =
    useState<Utilizador | null>(null);

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTipo, setPopupTipo] = useState<
    "normal" | "sair" | "inativar" | "ativar" | "apagar"
  >("normal");

  useEffect(() => {
    carregarUtilizadores();
  }, []);

  function abrirPopup(
    titulo: string,
    mensagem: string,
    tipo: "normal" | "sair" | "inativar" | "ativar" | "apagar" = "normal"
  ) {
    setPopupTitle(titulo);
    setPopupMessage(mensagem);
    setPopupTipo(tipo);
    setPopupVisible(true);
  }

  async function carregarUtilizadores() {
    setLoading(true);

    const { data, error } = await supabase
      .from("utilizadores")
      .select(
        "id, nome, email, tipo, estado, numero_identificacao, ano_curricular, ativo"
      )
      .eq("estado", "aprovado")
      .order("nome", { ascending: true });

    if (error) {
      console.log("ERRO AO CARREGAR UTILIZADORES:", error);
      abrirPopup("Erro", "Não foi possível carregar os utilizadores.");
    } else {
      setUtilizadores(data || []);
    }

    setLoading(false);
  }

  function textoTipo(tipo: string) {
    if (tipo === "aluno") return "Aluno";
    if (tipo === "professor") return "Professor";
    if (tipo === "orientador") return "Orientador";
    if (tipo === "professor_responsavel") return "Professor Responsável";
    if (tipo === "superadmin") return "SuperAdmin";
    return tipo;
  }

  function pedirAlterarAtivo(user: Utilizador) {
    setUtilizadorSelecionado(user);

    if (user.ativo === false) {
      abrirPopup(
        "Ativar utilizador",
        `Tens a certeza que queres ativar ${user.nome}?`,
        "ativar"
      );
    } else {
      abrirPopup(
        "Inativar utilizador",
        `Tens a certeza que queres colocar ${user.nome} como inativo?`,
        "inativar"
      );
    }
  }

  function pedirApagar(user: Utilizador) {
    setUtilizadorSelecionado(user);

    abrirPopup(
      "Apagar utilizador",
      `Tens a certeza que queres apagar ${user.nome}? Esta ação deve ser usada apenas se for mesmo necessário.`,
      "apagar"
    );
  }

  async function confirmarAlterarAtivo() {
    if (!utilizadorSelecionado) return;

    const novoAtivo = utilizadorSelecionado.ativo === false;

    setPopupVisible(false);

    const { error } = await supabase
      .from("utilizadores")
      .update({ ativo: novoAtivo })
      .eq("id", utilizadorSelecionado.id);

    if (error) {
      console.log("ERRO AO ALTERAR ATIVO:", error);
      abrirPopup("Erro", "Não foi possível atualizar o estado do utilizador.");
      return;
    }

    abrirPopup(
      "Sucesso",
      novoAtivo
        ? "Utilizador ativado com sucesso."
        : "Utilizador colocado como inativo."
    );

    setUtilizadorSelecionado(null);
    carregarUtilizadores();
  }

  async function confirmarApagarUtilizador() {
    if (!utilizadorSelecionado) return;

    setPopupVisible(false);

    const { error } = await supabase
      .from("utilizadores")
      .delete()
      .eq("id", utilizadorSelecionado.id);

    if (error) {
      console.log("ERRO AO APAGAR:", error);
      abrirPopup("Erro", "Não foi possível apagar o utilizador.");
      return;
    }

    abrirPopup("Sucesso", "Utilizador apagado com sucesso.");
    setUtilizadorSelecionado(null);
    carregarUtilizadores();
  }

  async function terminarSessao() {
    setPopupVisible(false);
    await supabase.auth.signOut();
    router.replace("/backoffice/login" as any);
  }

  const utilizadoresFiltrados = useMemo(() => {
    return utilizadores.filter((user) => {
      const textoPesquisa = pesquisa.toLowerCase();

      const correspondePesquisa =
        user.nome?.toLowerCase().includes(textoPesquisa) ||
        user.email?.toLowerCase().includes(textoPesquisa) ||
        user.numero_identificacao?.toLowerCase().includes(textoPesquisa);

      const correspondeTipo =
        filtroTipo === "todos" ? true : user.tipo === filtroTipo;

      const correspondeAno =
        filtroAno === "todos"
          ? true
          : user.ano_curricular === Number(filtroAno);

      const correspondeAtivo =
        filtroAtivo === "todos"
          ? true
          : filtroAtivo === "ativos"
          ? user.ativo !== false
          : user.ativo === false;

      return (
        correspondePesquisa &&
        correspondeTipo &&
        correspondeAno &&
        correspondeAtivo
      );
    });
  }, [utilizadores, pesquisa, filtroTipo, filtroAno, filtroAtivo]);

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
                <Image
                  source={require("../../../../../assets/images/enf.jpg")}
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
            style={styles.menuItem}
            onPress={() => router.push("/backoffice/superadmin/home" as any)}
          >
            <Ionicons name="home-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && <Text style={styles.menuText}>Dashboard</Text>}
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/aprovarConta/aprovarConta" as any
              )
            }
          >
            <Ionicons name="person-add-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && (
              <Text style={styles.menuText}>Aprovar Contas</Text>
            )}
          </Pressable>

          <Pressable
            style={[styles.menuItem, styles.menuItemActive]}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/utilizadores/utilizadores" as any
              )
            }
          >
            <Ionicons name="people-outline" size={23} color="#160909" />
            {sidebarAberta && (
              <Text style={[styles.menuText, styles.menuTextActive]}>
                Utilizadores
              </Text>
            )}
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
          <View style={styles.headerTitleRow}>
            <Pressable
              style={styles.botaoVoltarHome}
              onPress={() => router.push("/backoffice/superadmin/home" as any)}
            >
              <Ionicons name="arrow-back-outline" size={22} color="#160909" />
            </Pressable>

            <View>
              <Text style={styles.titulo}>Utilizadores</Text>
              <Text style={styles.subtitulo}>
                Consultar alunos, professores e orientadores aprovados.
              </Text>
            </View>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons name="people-outline" size={34} color="#FDB515" />
          </View>
        </View>

        <View style={styles.filtrosCard}>
          <View style={styles.searchRow}>
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={22} color="#777" />
              <TextInput
                placeholder="Pesquisar por nome, email ou número"
                placeholderTextColor="#8c8787"
                style={styles.searchInput}
                value={pesquisa}
                onChangeText={(text) => {
                  setPesquisa(text);
                  setPaginaAtual(1);
                }}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.filtrosLinha}>
            <View style={styles.filtroBox}>
              <Text style={styles.filtroLabel}>Tipo</Text>
              <Pressable
                style={styles.selectToggle}
                onPress={() => {
                  setShowFiltroTipo(!showFiltroTipo);
                  setShowFiltroAno(false);
                  setShowFiltroAtivo(false);
                }}
              >
                <Text style={styles.selectToggleText}>
                  {filtroTipo === "todos" ? "Todos" : textoTipo(filtroTipo)}
                </Text>
                <Ionicons
                  name={
                    showFiltroTipo
                      ? "chevron-up-outline"
                      : "chevron-down-outline"
                  }
                  size={18}
                  color="#160909"
                />
              </Pressable>

              {showFiltroTipo && (
                <View style={styles.dropdown}>
                  <Pressable
                    style={styles.dropdownOption}
                    onPress={() => {
                      setFiltroTipo("todos");
                      setPaginaAtual(1);
                      setShowFiltroTipo(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>Todos</Text>
                  </Pressable>

                  <Pressable
                    style={styles.dropdownOption}
                    onPress={() => {
                      setFiltroTipo("aluno");
                      setPaginaAtual(1);
                      setShowFiltroTipo(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>Alunos</Text>
                  </Pressable>

                  <Pressable
                    style={styles.dropdownOption}
                    onPress={() => {
                      setFiltroTipo("professor");
                      setPaginaAtual(1);
                      setShowFiltroTipo(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>Professores</Text>
                  </Pressable>

                  <Pressable
                    style={styles.dropdownOption}
                    onPress={() => {
                      setFiltroTipo("orientador");
                      setPaginaAtual(1);
                      setShowFiltroTipo(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>Orientadores</Text>
                  </Pressable>
                </View>
              )}
            </View>

            <View style={styles.filtroBox}>
              <Text style={styles.filtroLabel}>Ano curricular</Text>
              <Pressable
                style={styles.selectToggle}
                onPress={() => {
                  setShowFiltroAno(!showFiltroAno);
                  setShowFiltroTipo(false);
                  setShowFiltroAtivo(false);
                }}
              >
                <Text style={styles.selectToggleText}>
                  {filtroAno === "todos" ? "Todos" : `${filtroAno}.º ano`}
                </Text>
                <Ionicons
                  name={
                    showFiltroAno
                      ? "chevron-up-outline"
                      : "chevron-down-outline"
                  }
                  size={18}
                  color="#160909"
                />
              </Pressable>

              {showFiltroAno && (
                <View style={styles.dropdown}>
                  <Pressable
                    style={styles.dropdownOption}
                    onPress={() => {
                      setFiltroAno("todos");
                      setPaginaAtual(1);
                      setShowFiltroAno(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>Todos</Text>
                  </Pressable>

                  <Pressable
                    style={styles.dropdownOption}
                    onPress={() => {
                      setFiltroAno("1");
                      setPaginaAtual(1);
                      setShowFiltroAno(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>1.º ano</Text>
                  </Pressable>

                  <Pressable
                    style={styles.dropdownOption}
                    onPress={() => {
                      setFiltroAno("2");
                      setPaginaAtual(1);
                      setShowFiltroAno(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>2.º ano</Text>
                  </Pressable>

                  <Pressable
                    style={styles.dropdownOption}
                    onPress={() => {
                      setFiltroAno("3");
                      setPaginaAtual(1);
                      setShowFiltroAno(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>3.º ano</Text>
                  </Pressable>

                  <Pressable
                    style={styles.dropdownOption}
                    onPress={() => {
                      setFiltroAno("4");
                      setPaginaAtual(1);
                      setShowFiltroAno(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>4.º ano</Text>
                  </Pressable>
                </View>
              )}
            </View>

            <View style={styles.filtroBox}>
              <Text style={styles.filtroLabel}>Estado</Text>
              <Pressable
                style={styles.selectToggle}
                onPress={() => {
                  setShowFiltroAtivo(!showFiltroAtivo);
                  setShowFiltroTipo(false);
                  setShowFiltroAno(false);
                }}
              >
                <Text style={styles.selectToggleText}>
                  {filtroAtivo === "ativos"
                    ? "Ativos"
                    : filtroAtivo === "inativos"
                    ? "Inativos"
                    : "Todos"}
                </Text>
                <Ionicons
                  name={
                    showFiltroAtivo
                      ? "chevron-up-outline"
                      : "chevron-down-outline"
                  }
                  size={18}
                  color="#160909"
                />
              </Pressable>

              {showFiltroAtivo && (
                <View style={styles.dropdown}>
                  <Pressable
                    style={styles.dropdownOption}
                    onPress={() => {
                      setFiltroAtivo("ativos");
                      setPaginaAtual(1);
                      setShowFiltroAtivo(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>Ativos</Text>
                  </Pressable>

                  <Pressable
                    style={styles.dropdownOption}
                    onPress={() => {
                      setFiltroAtivo("inativos");
                      setPaginaAtual(1);
                      setShowFiltroAtivo(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>Inativos</Text>
                  </Pressable>

                  <Pressable
                    style={styles.dropdownOption}
                    onPress={() => {
                      setFiltroAtivo("todos");
                      setPaginaAtual(1);
                      setShowFiltroAtivo(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>Todos</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FDB515"
            style={{ marginTop: 40 }}
          />
        ) : utilizadoresFiltrados.length === 0 ? (
          <View style={styles.vazioContainer}>
            <Ionicons name="people-outline" size={52} color="#FDB515" />
            <Text style={styles.textoVazio}>
              Não existem utilizadores para mostrar.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.tabelaCard}>
              <View style={styles.tabelaHeader}>
                <Text style={[styles.th, styles.colNome]}>Nome</Text>
                <Text style={[styles.th, styles.colTipo]}>Tipo</Text>
                <Text style={[styles.th, styles.colNumero]}>Número</Text>
                <Text style={[styles.th, styles.colEstado]}>Estado</Text>
                <Text style={[styles.th, styles.colAcoes]}>Ações</Text>
              </View>

              {utilizadoresPaginados.map((user) => {
                const aberto = utilizadorAberto === user.id;

                return (
                  <View key={user.id} style={styles.linhaContainer}>
                    <View style={styles.tabelaLinha}>
                      <Text style={[styles.tdNome, styles.colNome]}>
                        {user.nome}
                      </Text>

                      <Text style={[styles.td, styles.colTipo]}>
                        {textoTipo(user.tipo)}
                      </Text>

                      <Text style={[styles.td, styles.colNumero]}>
                        {user.numero_identificacao || "Não indicado"}
                      </Text>

                      <View style={styles.colEstado}>
                        <Text
                          style={[
                            styles.estadoBadge,
                            user.ativo === false && styles.estadoBadgeInativo,
                          ]}
                        >
                          {user.ativo === false ? "Inativo" : "Ativo"}
                        </Text>
                      </View>

                      <View style={[styles.acoes, styles.colAcoes]}>
                        <Pressable
                          style={styles.acaoBotao}
                          onPress={() =>
                            setUtilizadorAberto(aberto ? null : user.id)
                          }
                        >
                          <Ionicons
                            name={
                              aberto
                                ? "chevron-up-outline"
                                : "chevron-down-outline"
                            }
                            size={21}
                            color="#160909"
                          />
                        </Pressable>

                        <Pressable
                          style={styles.acaoBotao}
                          onPress={() => pedirAlterarAtivo(user)}
                        >
                          <Ionicons
                            name={
                              user.ativo === false
                                ? "refresh-outline"
                                : "ban-outline"
                            }
                            size={20}
                            color="#160909"
                          />
                        </Pressable>

                        <Pressable
                          style={styles.acaoBotaoPerigo}
                          onPress={() => pedirApagar(user)}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={20}
                            color="#FFFFFF"
                          />
                        </Pressable>
                      </View>
                    </View>

                    {aberto && (
                      <View style={styles.detalhesLinha}>
                        <View style={styles.detalheItem}>
                          <Text style={styles.detalheLabel}>Email</Text>
                          <Text style={styles.detalheValor}>
                            {user.email || "Não indicado"}
                          </Text>
                        </View>

                        <View style={styles.detalheItem}>
                          <Text style={styles.detalheLabel}>
                            Ano curricular
                          </Text>
                          <Text style={styles.detalheValor}>
                            {user.tipo === "aluno"
                              ? user.ano_curricular
                                ? `${user.ano_curricular}.º ano`
                                : "Não indicado"
                              : "Não se aplica"}
                          </Text>
                        </View>

                        <View style={styles.detalheItem}>
                          <Text style={styles.detalheLabel}>Hospital</Text>
                          <Text style={styles.detalheValor}>
                            Ainda não associado
                          </Text>
                        </View>

                        <View style={styles.detalheItem}>
                          <Text style={styles.detalheLabel}>Serviço</Text>
                          <Text style={styles.detalheValor}>
                            Ainda não associado
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
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
                    onPress={() => setShowPorPagina(!showPorPagina)}
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
                  <Ionicons
                    name="chevron-back-outline"
                    size={20}
                    color="#160909"
                  />
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
            ) : popupTipo === "inativar" || popupTipo === "ativar" ? (
              <View style={styles.popupBotoesLinha}>
                <Pressable
                  style={styles.popupBotaoCancelar}
                  onPress={() => setPopupVisible(false)}
                >
                  <Text style={styles.popupTextoCancelar}>Cancelar</Text>
                </Pressable>

                <Pressable
                  style={styles.popupBotaoConfirmar}
                  onPress={confirmarAlterarAtivo}
                >
                  <Text style={styles.popupTextoConfirmar}>
                    {popupTipo === "ativar" ? "Ativar" : "Inativar"}
                  </Text>
                </Pressable>
              </View>
            ) : popupTipo === "apagar" ? (
              <View style={styles.popupBotoesLinha}>
                <Pressable
                  style={styles.popupBotaoCancelar}
                  onPress={() => setPopupVisible(false)}
                >
                  <Text style={styles.popupTextoCancelar}>Cancelar</Text>
                </Pressable>

                <Pressable
                  style={styles.popupBotaoSair}
                  onPress={confirmarApagarUtilizador}
                >
                  <Text style={styles.popupTextoSair}>Apagar</Text>
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