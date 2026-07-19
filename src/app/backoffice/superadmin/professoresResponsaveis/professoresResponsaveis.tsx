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
import { ContasPendentesBadge, useContasPendentes } from "../contasPendentes";
import styles from "./professoresResponsaveisStyles";

type Professor = {
  id: string;
  nome: string;
  email: string;
  numero_identificacao: string | null;
};

type EnsinoClinico = {
  id: number;
  nome: string;
  ano_curricular: number;
  semestre: number | null;
  ativo: boolean | null;
};

type Associacao = {
  id: number;
  professor_id: string;
  ensino_clinico_id: number;
  ativo: boolean | null;
  criado_em: string | null;
  utilizadores?: {
    nome: string;
    email: string;
    numero_identificacao: string | null;
  };
  ensinos_clinicos?: {
    nome: string;
    ano_curricular: number;
    semestre: number | null;
  };
};

type ProfessorAgrupado = {
  professor_id: string;
  nome: string;
  email: string;
  numero_identificacao: string | null;
  ativo: boolean | null;
  criado_em: string | null;
  ensinos: {
    associacao_id: number;
    ensino_id: number;
    nome: string;
    ano_curricular: number;
    semestre: number | null;
    ativo: boolean | null;
    criado_em: string | null;
  }[];
};

export default function ProfessoresResponsaveis() {
  const [sidebarAberta, setSidebarAberta] = useState(true);
  const contasPendentes = useContasPendentes();

  const [professores, setProfessores] = useState<Professor[]>([]);
  const [ensinos, setEnsinos] = useState<EnsinoClinico[]>([]);
  const [associacoes, setAssociacoes] = useState<Associacao[]>([]);

  const [modalVisivel, setModalVisivel] = useState(false);

  const [professorSelecionado, setProfessorSelecionado] = useState("");
  const [ensinosSelecionados, setEnsinosSelecionados] = useState<number[]>([]);

  const [mostrarProfessores, setMostrarProfessores] = useState(false);
  const [mostrarEnsinos, setMostrarEnsinos] = useState(false);

  const [pesquisaProfessorModal, setPesquisaProfessorModal] = useState("");

  const [professorEditarId, setProfessorEditarId] = useState<string | null>(
    null,
  );

  const [pesquisa, setPesquisa] = useState("");
  const [filtroAno, setFiltroAno] = useState("todos");
  const [showFiltroAno, setShowFiltroAno] = useState(false);

  const [filtroEstado, setFiltroEstado] = useState<
    "todos" | "ativos" | "inativos"
  >("ativos");
  const [showFiltroEstado, setShowFiltroEstado] = useState(false);

  const [professorAberto, setProfessorAberto] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [aGuardar, setAGuardar] = useState(false);

  const [professorParaApagar, setProfessorParaApagar] =
    useState<ProfessorAgrupado | null>(null);

  const [professorParaAlterarEstado, setProfessorParaAlterarEstado] =
    useState<ProfessorAgrupado | null>(null);

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTipo, setPopupTipo] = useState<
    "normal" | "sair" | "apagar" | "ativar" | "inativar"
  >("normal");

  useEffect(() => {
    carregarDados();
  }, []);

  function abrirPopup(
    titulo: string,
    mensagem: string,
    tipo: "normal" | "sair" | "apagar" | "ativar" | "inativar" = "normal",
  ) {
    setPopupTitle(titulo);
    setPopupMessage(mensagem);
    setPopupTipo(tipo);
    setPopupVisible(true);
  }

  function formatarData(data: string | null | undefined) {
    if (!data) return "Sem data";

    const date = new Date(data);

    if (Number.isNaN(date.getTime())) return "Sem data";

    return date.toLocaleDateString("pt-PT");
  }

  async function carregarDados() {
    setLoading(true);

    const { data: professoresData, error: professoresError } = await supabase
      .from("utilizadores")
      .select("id, nome, email, numero_identificacao, ativo, tipo, estado")
      .eq("tipo", "professor")
      .eq("estado", "aprovado")
      .neq("ativo", false)
      .order("nome", { ascending: true });

    const { data: ensinosData, error: ensinosError } = await supabase
      .from("ensinos_clinicos")
      .select("id, nome, ano_curricular, semestre, ativo")
      .neq("ativo", false)
      .order("ano_curricular", { ascending: true })
      .order("semestre", { ascending: true })
      .order("nome", { ascending: true });

    const { data: associacoesData, error: associacoesError } = await supabase
      .from("responsaveis_ensinos_clinicos")
      .select(
        `
        id,
        professor_id,
        ensino_clinico_id,
        ativo,
        criado_em,
        utilizadores(nome, email, numero_identificacao),
        ensinos_clinicos(nome, ano_curricular, semestre)
      `,
      )
      .order("id", { ascending: false });

    if (professoresError || ensinosError || associacoesError) {
      console.log(
        "ERRO:",
        professoresError || ensinosError || associacoesError,
      );
      abrirPopup("Erro", "Não foi possível carregar os dados.");
    } else {
      setProfessores((professoresData as any) || []);
      setEnsinos((ensinosData as any) || []);
      setAssociacoes((associacoesData as any) || []);
    }

    setLoading(false);
  }

  function abrirModalCriar() {
    setProfessorEditarId(null);
    setProfessorSelecionado("");
    setEnsinosSelecionados([]);
    setMostrarProfessores(false);
    setMostrarEnsinos(false);
    setPesquisaProfessorModal("");
    setModalVisivel(true);
  }

  function fecharModal() {
    setModalVisivel(false);
    setProfessorEditarId(null);
    setProfessorSelecionado("");
    setEnsinosSelecionados([]);
    setMostrarProfessores(false);
    setMostrarEnsinos(false);
    setPesquisaProfessorModal("");
  }

  function nomeProfessorSelecionado() {
    const professor = professores.find((p) => p.id === professorSelecionado);
    return professor ? professor.nome : "Selecionar professor";
  }

  function toggleEnsinoSelecionado(id: number) {
    if (ensinosSelecionados.includes(id)) {
      setEnsinosSelecionados(ensinosSelecionados.filter((e) => e !== id));
    } else {
      setEnsinosSelecionados([...ensinosSelecionados, id]);
    }
  }

  function textoEnsinosSelecionados() {
    if (ensinosSelecionados.length === 0) {
      return "Selecionar um ou mais ensinos clínicos";
    }

    if (ensinosSelecionados.length === 1) {
      const ensino = ensinos.find((e) => e.id === ensinosSelecionados[0]);
      return ensino ? ensino.nome : "1 ensino selecionado";
    }

    return `${ensinosSelecionados.length} ensinos selecionados`;
  }

  async function guardarAssociacao() {
    if (aGuardar) return;

    if (!professorSelecionado) {
      abrirPopup("Erro", "Seleciona um professor.");
      return;
    }

    if (ensinosSelecionados.length === 0) {
      abrirPopup("Erro", "Seleciona pelo menos um ensino clínico.");
      return;
    }

    setAGuardar(true);

    if (professorEditarId) {
      const { error: deleteError } = await supabase
        .from("responsaveis_ensinos_clinicos")
        .delete()
        .eq("professor_id", professorEditarId);

      if (deleteError) {
        setAGuardar(false);
        console.log("ERRO AO LIMPAR ASSOCIAÇÕES:", deleteError);
        abrirPopup("Erro", "Não foi possível atualizar as associações.");
        return;
      }
    }

    const novasAssociacoes = ensinosSelecionados.map((ensinoId) => ({
      professor_id: professorSelecionado,
      ensino_clinico_id: ensinoId,
      ativo: true,
    }));

    const { error } = await supabase
      .from("responsaveis_ensinos_clinicos")
      .insert(novasAssociacoes);

    setAGuardar(false);

    if (error) {
      console.log("ERRO AO ASSOCIAR:", error);

      if (error.code === "23505") {
        abrirPopup(
          "Erro",
          "Um destes ensinos clínicos já está associado a este professor.",
        );
      } else {
        abrirPopup("Erro", error.message);
      }

      return;
    }

    fecharModal();

    abrirPopup(
      "Sucesso",
      professorEditarId
        ? "Associações atualizadas com sucesso."
        : "Professor responsável nomeado com sucesso.",
    );

    carregarDados();
  }

  function editarProfessorResponsavel(professor: ProfessorAgrupado) {
    setProfessorEditarId(professor.professor_id);
    setProfessorSelecionado(professor.professor_id);
    setEnsinosSelecionados(professor.ensinos.map((e) => e.ensino_id));
    setMostrarProfessores(false);
    setMostrarEnsinos(false);
    setPesquisaProfessorModal("");
    setModalVisivel(true);
  }

  function pedirApagarProfessor(professor: ProfessorAgrupado) {
    setProfessorParaApagar(professor);

    abrirPopup(
      "Remover professor responsável",
      `Tens a certeza que queres remover todas as associações de ${professor.nome}?`,
      "apagar",
    );
  }

  async function confirmarApagarProfessor() {
    if (!professorParaApagar) return;

    setPopupVisible(false);

    const { error } = await supabase
      .from("responsaveis_ensinos_clinicos")
      .delete()
      .eq("professor_id", professorParaApagar.professor_id);

    if (error) {
      console.log("ERRO AO APAGAR:", error);
      abrirPopup("Erro", "Não foi possível remover as associações.");
      return;
    }

    abrirPopup("Sucesso", "Associações removidas com sucesso.");
    setProfessorParaApagar(null);
    carregarDados();
  }

  function pedirAlterarEstadoProfessor(professor: ProfessorAgrupado) {
    setProfessorParaAlterarEstado(professor);

    if (professor.ativo === false) {
      abrirPopup(
        "Ativar nomeação",
        `Tens a certeza que queres ativar a nomeação de ${professor.nome}?`,
        "ativar",
      );
    } else {
      abrirPopup(
        "Inativar nomeação",
        `Tens a certeza que queres colocar a nomeação de ${professor.nome} como inativa?`,
        "inativar",
      );
    }
  }

  async function confirmarAlterarEstadoProfessor() {
    if (!professorParaAlterarEstado) return;

    const novoEstado = professorParaAlterarEstado.ativo === false;

    setPopupVisible(false);

    const { error } = await supabase
      .from("responsaveis_ensinos_clinicos")
      .update({
        ativo: novoEstado,
      })
      .eq("professor_id", professorParaAlterarEstado.professor_id);

    if (error) {
      console.log("ERRO AO ALTERAR ESTADO:", error);
      abrirPopup("Erro", "Não foi possível alterar o estado da nomeação.");
      return;
    }

    abrirPopup(
      "Sucesso",
      novoEstado
        ? "Nomeação ativada com sucesso."
        : "Nomeação colocada como inativa.",
    );

    setProfessorParaAlterarEstado(null);
    carregarDados();
  }

  async function terminarSessao() {
    setPopupVisible(false);
    await supabase.auth.signOut();
    router.replace("/backoffice/superadmin/login/login" as any);
  }

  const professoresAgrupados = useMemo(() => {
    const mapa: Record<string, ProfessorAgrupado> = {};

    associacoes.forEach((assoc) => {
      if (!mapa[assoc.professor_id]) {
        mapa[assoc.professor_id] = {
          professor_id: assoc.professor_id,
          nome: assoc.utilizadores?.nome || "Professor",
          email: assoc.utilizadores?.email || "",
          numero_identificacao:
            assoc.utilizadores?.numero_identificacao || null,
          ativo: assoc.ativo,
          criado_em: assoc.criado_em,
          ensinos: [],
        };
      }

      mapa[assoc.professor_id].ensinos.push({
        associacao_id: assoc.id,
        ensino_id: assoc.ensino_clinico_id,
        nome: assoc.ensinos_clinicos?.nome || "Ensino clínico",
        ano_curricular: assoc.ensinos_clinicos?.ano_curricular || 0,
        semestre: assoc.ensinos_clinicos?.semestre || null,
        ativo: assoc.ativo,
        criado_em: assoc.criado_em,
      });
    });

    return Object.values(mapa);
  }, [associacoes]);

  const professoresFiltrados = useMemo(() => {
    return professoresAgrupados.filter((professor) => {
      const textoPesquisa = pesquisa.toLowerCase().trim();

      const correspondePesquisa =
        textoPesquisa === "" ||
        professor.nome.toLowerCase().includes(textoPesquisa) ||
        professor.email.toLowerCase().includes(textoPesquisa) ||
        professor.numero_identificacao?.toLowerCase().includes(textoPesquisa) ||
        professor.ensinos.some((e) =>
          e.nome.toLowerCase().includes(textoPesquisa),
        );

      const correspondeAno =
        filtroAno === "todos"
          ? true
          : professor.ensinos.some(
              (e) => e.ano_curricular === Number(filtroAno),
            );

      const correspondeEstado =
        filtroEstado === "todos"
          ? true
          : filtroEstado === "ativos"
            ? professor.ativo !== false
            : professor.ativo === false;

      return correspondePesquisa && correspondeAno && correspondeEstado;
    });
  }, [professoresAgrupados, pesquisa, filtroAno, filtroEstado]);

  const professoresModalFiltrados = useMemo(() => {
    const texto = pesquisaProfessorModal.toLowerCase().trim();

    if (texto === "") {
      return professores;
    }

    return professores.filter((professor) => {
      const nome = professor.nome?.toLowerCase() || "";
      const email = professor.email?.toLowerCase() || "";
      const numero = professor.numero_identificacao?.toLowerCase() || "";

      return (
        nome.includes(texto) || email.includes(texto) || numero.includes(texto)
      );
    });
  }, [professores, pesquisaProfessorModal]);

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
                "/backoffice/superadmin/aprovarConta/aprovarConta" as any,
              )
            }
          >
            <Ionicons name="person-add-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && (
              <Text style={styles.menuText}>Aprovar Contas</Text>
            )}
            <ContasPendentesBadge count={contasPendentes} />
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/utilizadores/utilizadores" as any,
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
                "/backoffice/superadmin/instituicoes/instituicoes" as any,
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
                "/backoffice/superadmin/ensinos-clinicos/ensinos-clinicos" as any,
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
                "/backoffice/superadmin/editarEstagio/editarEstagio" as any,
              )
            }
          >
            <Ionicons name="calendar-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && (
              <Text style={styles.menuText}>Edições de Estágio</Text>
            )}
          </Pressable>

          <Pressable
            style={[styles.menuItem, styles.menuItemActive]}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/professoresResponsaveis/professoresResponsaveis" as any,
              )
            }
          >
            <Ionicons name="ribbon-outline" size={23} color="#160909" />
            {sidebarAberta && (
              <Text style={[styles.menuText, styles.menuTextActive]}>
                Professores Responsáveis
              </Text>
            )}
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/criar_equipas/equipasEstagio" as any,
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
                "/backoffice/superadmin/distribuirAlunos/distribuirAlunos" as any,
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
                "sair",
              )
            }
          >
            <Ionicons name="log-out-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && <Text style={styles.footerText}>Sair</Text>}
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Pressable
              style={styles.botaoVoltarHome}
              onPress={() => router.push("/backoffice/superadmin/home" as any)}
            >
              <Ionicons name="arrow-back-outline" size={22} color="#160909" />
            </Pressable>

            <View>
              <Text style={styles.titulo}>Professores Responsáveis</Text>
              <Text style={styles.subtitulo}>
                Nomear professores responsáveis por um ou mais ensinos clínicos.
              </Text>
            </View>
          </View>

          <Pressable style={styles.botaoCriarHeader} onPress={abrirModalCriar}>
            <Ionicons name="add-outline" size={22} color="#160909" />
            <Text style={styles.textoBotaoCriar}>Nova nomeação</Text>
          </Pressable>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FDB515"
            style={{ marginTop: 40 }}
          />
        ) : (
          <>
            <View style={styles.filtrosCard}>
              <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={22} color="#777" />

                <TextInput
                  placeholder="Pesquisar professor, email, número ou ensino..."
                  placeholderTextColor="#8c8787"
                  style={styles.searchInput}
                  value={pesquisa}
                  onChangeText={setPesquisa}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.filtroBox}>
                <Text style={styles.filtroLabel}>Ano curricular</Text>

                <Pressable
                  style={styles.selectFiltro}
                  onPress={() => {
                    setShowFiltroAno(!showFiltroAno);
                    setShowFiltroEstado(false);
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
                    {["todos", "1", "2", "3", "4"].map((ano) => (
                      <Pressable
                        key={ano}
                        style={styles.dropdownOption}
                        onPress={() => {
                          setFiltroAno(ano);
                          setShowFiltroAno(false);
                        }}
                      >
                        <Text style={styles.dropdownOptionText}>
                          {ano === "todos" ? "Todos" : `${ano}.º ano`}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.filtroBox}>
                <Text style={styles.filtroLabel}>Estado</Text>

                <Pressable
                  style={styles.selectFiltro}
                  onPress={() => {
                    setShowFiltroEstado(!showFiltroEstado);
                    setShowFiltroAno(false);
                  }}
                >
                  <Text style={styles.selectToggleText}>
                    {filtroEstado === "ativos"
                      ? "Ativos"
                      : filtroEstado === "inativos"
                        ? "Inativos"
                        : "Todos"}
                  </Text>

                  <Ionicons
                    name={
                      showFiltroEstado
                        ? "chevron-up-outline"
                        : "chevron-down-outline"
                    }
                    size={18}
                    color="#160909"
                  />
                </Pressable>

                {showFiltroEstado && (
                  <View style={styles.dropdown}>
                    <Pressable
                      style={styles.dropdownOption}
                      onPress={() => {
                        setFiltroEstado("ativos");
                        setShowFiltroEstado(false);
                      }}
                    >
                      <Text style={styles.dropdownOptionText}>Ativos</Text>
                    </Pressable>

                    <Pressable
                      style={styles.dropdownOption}
                      onPress={() => {
                        setFiltroEstado("inativos");
                        setShowFiltroEstado(false);
                      }}
                    >
                      <Text style={styles.dropdownOptionText}>Inativos</Text>
                    </Pressable>

                    <Pressable
                      style={styles.dropdownOption}
                      onPress={() => {
                        setFiltroEstado("todos");
                        setShowFiltroEstado(false);
                      }}
                    >
                      <Text style={styles.dropdownOptionText}>Todos</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>

            {professoresFiltrados.length === 0 ? (
              <View style={styles.vazioContainer}>
                <Ionicons name="ribbon-outline" size={52} color="#FDB515" />
                <Text style={styles.textoVazio}>
                  Ainda não existem professores responsáveis nomeados.
                </Text>
              </View>
            ) : (
              <View style={styles.tabelaCard}>
                <View style={styles.tabelaHeader}>
                  <Text style={[styles.th, styles.colProfessor]}>
                    Professor
                  </Text>
                  <Text style={[styles.th, styles.colNumero]}>Número</Text>
                  <Text style={[styles.th, styles.colEnsinos]}>Ensinos</Text>
                  <Text style={[styles.th, styles.colEstado]}>Estado</Text>
                  <Text style={[styles.th, styles.colData]}>Criado em</Text>
                  <Text style={[styles.th, styles.colAcoes]}>Ações</Text>
                </View>

                {professoresFiltrados.map((professor) => {
                  const aberto = professorAberto === professor.professor_id;

                  return (
                    <View
                      key={professor.professor_id}
                      style={styles.linhaContainer}
                    >
                      <View style={styles.tabelaLinha}>
                        <View style={styles.colProfessor}>
                          <Text style={styles.tdNome}>{professor.nome}</Text>
                          <Text style={styles.tdSub}>{professor.email}</Text>
                        </View>

                        <Text style={[styles.td, styles.colNumero]}>
                          {professor.numero_identificacao || "N/A"}
                        </Text>

                        <Text style={[styles.td, styles.colEnsinos]}>
                          {professor.ensinos.length} ensino(s)
                        </Text>

                        <View style={styles.colEstado}>
                          <Text
                            style={[
                              styles.estadoBadge,
                              professor.ativo === false &&
                                styles.estadoBadgeInativo,
                            ]}
                          >
                            {professor.ativo === false ? "Inativo" : "Ativo"}
                          </Text>
                        </View>

                        <Text style={[styles.td, styles.colData]}>
                          {formatarData(professor.criado_em)}
                        </Text>

                        <View style={[styles.acoes, styles.colAcoes]}>
                          <Pressable
                            style={styles.acaoBotao}
                            onPress={() =>
                              setProfessorAberto(
                                aberto ? null : professor.professor_id,
                              )
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
                            onPress={() =>
                              editarProfessorResponsavel(professor)
                            }
                          >
                            <Ionicons
                              name="pencil-outline"
                              size={19}
                              color="#160909"
                            />
                          </Pressable>

                          <Pressable
                            style={styles.acaoBotao}
                            onPress={() =>
                              pedirAlterarEstadoProfessor(professor)
                            }
                          >
                            <Ionicons
                              name={
                                professor.ativo === false
                                  ? "refresh-outline"
                                  : "ban-outline"
                              }
                              size={19}
                              color="#160909"
                            />
                          </Pressable>

                          <Pressable
                            style={styles.acaoBotaoPerigo}
                            onPress={() => pedirApagarProfessor(professor)}
                          >
                            <Ionicons
                              name="trash-outline"
                              size={19}
                              color="#FFFFFF"
                            />
                          </Pressable>
                        </View>
                      </View>

                      {aberto && (
                        <View style={styles.detalhesLinha}>
                          <Text style={styles.detalheLabel}>
                            Ensinos clínicos associados
                          </Text>

                          {professor.ensinos.map((ensino) => (
                            <View
                              key={ensino.associacao_id}
                              style={styles.ensinoDetalhe}
                            >
                              <Text style={styles.detalheValor}>
                                {ensino.nome}
                              </Text>

                              <Text style={styles.detalheSubvalor}>
                                {ensino.ano_curricular}.º ano
                                {ensino.semestre
                                  ? ` · ${ensino.semestre}.º semestre`
                                  : ""}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </>
        )}
      </ScrollView>

      <Modal
        visible={modalVisivel}
        transparent
        animationType="fade"
        onRequestClose={fecharModal}
      >
        <View style={styles.popupOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitulo}>
                {professorEditarId ? "Editar Nomeação" : "Nova Nomeação"}
              </Text>

              <Text style={styles.label}>Professor</Text>

              <Pressable
                style={styles.selectToggle}
                onPress={() => {
                  setMostrarProfessores(!mostrarProfessores);
                  setMostrarEnsinos(false);
                }}
              >
                <Text style={styles.selectToggleText}>
                  {nomeProfessorSelecionado()}
                </Text>

                <Ionicons
                  name={
                    mostrarProfessores
                      ? "chevron-up-outline"
                      : "chevron-down-outline"
                  }
                  size={20}
                  color="#160909"
                />
              </Pressable>

              {mostrarProfessores && (
                <View style={styles.pickerBox}>
                  <View style={styles.modalSearchContainer}>
                    <Ionicons name="search-outline" size={20} color="#777" />

                    <TextInput
                      placeholder="Pesquisar professor..."
                      placeholderTextColor="#8c8787"
                      style={styles.modalSearchInput}
                      value={pesquisaProfessorModal}
                      onChangeText={setPesquisaProfessorModal}
                      autoCapitalize="none"
                    />

                    {pesquisaProfessorModal.length > 0 && (
                      <Pressable onPress={() => setPesquisaProfessorModal("")}>
                        <Ionicons
                          name="close-circle-outline"
                          size={20}
                          color="#777"
                        />
                      </Pressable>
                    )}
                  </View>

                  <ScrollView style={styles.pickerLista} nestedScrollEnabled>
                    {professoresModalFiltrados.length === 0 ? (
                      <Text style={styles.textoVazioModal}>
                        Nenhum professor encontrado.
                      </Text>
                    ) : (
                      professoresModalFiltrados.map((professor) => (
                        <Pressable
                          key={professor.id}
                          style={[
                            styles.opcaoInstituicao,
                            professorSelecionado === professor.id &&
                              styles.opcaoInstituicaoSelecionada,
                          ]}
                          onPress={() => {
                            setProfessorSelecionado(professor.id);
                            setMostrarProfessores(false);
                            setPesquisaProfessorModal("");
                          }}
                        >
                          <Text style={styles.opcaoInstituicaoTexto}>
                            {professor.nome}
                          </Text>

                          <Text style={styles.opcaoSubtexto}>
                            {professor.email}
                            {professor.numero_identificacao
                              ? ` · Nº ${professor.numero_identificacao}`
                              : ""}
                          </Text>
                        </Pressable>
                      ))
                    )}
                  </ScrollView>
                </View>
              )}

              <Text style={styles.label}>Ensinos Clínicos</Text>

              <Pressable
                style={styles.selectToggle}
                onPress={() => {
                  setMostrarEnsinos(!mostrarEnsinos);
                  setMostrarProfessores(false);
                }}
              >
                <Text style={styles.selectToggleText}>
                  {textoEnsinosSelecionados()}
                </Text>

                <Ionicons
                  name={
                    mostrarEnsinos
                      ? "chevron-up-outline"
                      : "chevron-down-outline"
                  }
                  size={20}
                  color="#160909"
                />
              </Pressable>

              {mostrarEnsinos && (
                <ScrollView style={styles.pickerLista} nestedScrollEnabled>
                  {ensinos.length === 0 ? (
                    <Text style={styles.textoVazioModal}>
                      Não existem ensinos clínicos ativos.
                    </Text>
                  ) : (
                    ensinos.map((ensino) => {
                      const selecionado = ensinosSelecionados.includes(
                        ensino.id,
                      );

                      return (
                        <Pressable
                          key={ensino.id}
                          style={[
                            styles.opcaoInstituicao,
                            selecionado && styles.opcaoInstituicaoSelecionada,
                          ]}
                          onPress={() => toggleEnsinoSelecionado(ensino.id)}
                        >
                          <View style={styles.opcaoLinha}>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.opcaoInstituicaoTexto}>
                                {ensino.nome}
                              </Text>

                              <Text style={styles.opcaoSubtexto}>
                                {ensino.ano_curricular}.º ano
                                {ensino.semestre
                                  ? ` · ${ensino.semestre}.º semestre`
                                  : ""}
                              </Text>
                            </View>

                            <Ionicons
                              name={
                                selecionado
                                  ? "checkbox-outline"
                                  : "square-outline"
                              }
                              size={24}
                              color="#160909"
                            />
                          </View>
                        </Pressable>
                      );
                    })
                  )}
                </ScrollView>
              )}

              <View style={styles.popupBotoesLinha}>
                <Pressable
                  style={styles.popupBotaoCancelar}
                  onPress={fecharModal}
                >
                  <Text style={styles.popupTextoCancelar}>Cancelar</Text>
                </Pressable>

                <Pressable
                  style={styles.popupBotaoConfirmar}
                  onPress={guardarAssociacao}
                  disabled={aGuardar}
                >
                  <Text style={styles.popupTextoConfirmar}>
                    {aGuardar
                      ? "A guardar..."
                      : professorEditarId
                        ? "Guardar"
                        : "Criar"}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

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

                <Pressable
                  style={styles.popupBotaoSair}
                  onPress={terminarSessao}
                >
                  <Text style={styles.popupTextoSair}>Sair</Text>
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
                  onPress={confirmarApagarProfessor}
                >
                  <Text style={styles.popupTextoSair}>Apagar</Text>
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
                  onPress={confirmarAlterarEstadoProfessor}
                >
                  <Text style={styles.popupTextoConfirmar}>
                    {popupTipo === "ativar" ? "Ativar" : "Inativar"}
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
