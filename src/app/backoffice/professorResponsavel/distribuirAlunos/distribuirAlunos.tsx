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
import styles from "./distribuirAlunosStyles";

type EnsinoResponsavel = {
  ensino_clinico_id: number;
};

type Utilizador = {
  id: string;
  nome: string;
  email: string;
  tipo: string;
  numero_identificacao: string | null;
  ano_curricular: number | null;
};

type Edicao = {
  id: number;
  ensino_clinico_id: number;
  vagas: number;
  ano_letivo: string | null;
  estado: string | null;
  ensinos_clinicos?: {
    nome: string;
    ano_curricular: number;
  } | null;
  instituicoes?: {
    nome: string;
  } | null;
  servicos?: {
    nome: string;
  } | null;
};

type Inscricao = {
  id: number;
  aluno_id: string;
  professor_id: string | null;
  orientador_id: string | null;
  edicao_estagio_id: number;
  estado: string | null;
  estado_estagio: string | null;
  data_inscricao: string | null;
  professor_responsavel_id: string | null;
  distribuido_por: string | null;
  data_distribuicao: string | null;
  utilizador_distribuicao_id: string | null;
};

type ProfessorEstagio = {
  id: number;
  edicao_estagio_id: number;
  professor_id: string;
  max_alunos: number;
};

type OrientadorEstagio = {
  id: number;
  edicao_estagio_id: number;
  orientador_id: string;
  max_alunos: number;
};

export default function DistribuirAlunosProfessorResponsavel() {
  const [sidebarAberta, setSidebarAberta] = useState(true);

  const [edicoes, setEdicoes] = useState<Edicao[]>([]);
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [utilizadores, setUtilizadores] = useState<Utilizador[]>([]);

  const [professoresEstagio, setProfessoresEstagio] = useState<
    ProfessorEstagio[]
  >([]);
  const [orientadoresEstagio, setOrientadoresEstagio] = useState<
    OrientadorEstagio[]
  >([]);

  const [pesquisa, setPesquisa] = useState("");
  const [filtroAno, setFiltroAno] = useState("todos");
  const [filtroAnoAberto, setFiltroAnoAberto] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroEstadoAberto, setFiltroEstadoAberto] = useState(false);

  const [inscricaoAberta, setInscricaoAberta] = useState<number | null>(null);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(15);
  const [itensDropdownAberto, setItensDropdownAberto] = useState(false);

  const [loading, setLoading] = useState(true);

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTipo, setPopupTipo] = useState<
    | "normal"
    | "sair"
    | "inativar"
    | "ativar"
    | "apagar"
    | "todosInativos"
    | "apagarTudo"
  >("normal");

  const [inscricaoSelecionada, setInscricaoSelecionada] = useState<
    number | null
  >(null);

  useEffect(() => {
    carregarDados();
  }, []);

  function abrirPopup(
    titulo: string,
    mensagem: string,
    tipo:
      | "normal"
      | "sair"
      | "inativar"
      | "ativar"
      | "apagar"
      | "todosInativos"
      | "apagarTudo" = "normal"
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

    const { data: responsaveisData, error: responsaveisError } = await supabase
      .from("responsaveis_ensinos_clinicos")
      .select("ensino_clinico_id")
      .eq("professor_id", user.id);

    if (responsaveisError) {
      console.log("ERRO RESPONSÁVEIS:", responsaveisError);
      abrirPopup("Erro", "Não foi possível carregar os ensinos atribuídos.");
      setLoading(false);
      return;
    }

    const ensinosIds =
      (responsaveisData as EnsinoResponsavel[] | null)?.map(
        (item) => item.ensino_clinico_id
      ) || [];

    if (ensinosIds.length === 0) {
      setEdicoes([]);
      setInscricoes([]);
      setUtilizadores([]);
      setProfessoresEstagio([]);
      setOrientadoresEstagio([]);
      setLoading(false);
      return;
    }

    const { data: edicoesData, error: edicoesError } = await supabase
      .from("edicoes_estagio")
      .select(
        `
        id,
        ensino_clinico_id,
        vagas,
        ano_letivo,
        estado,
        ensinos_clinicos(nome, ano_curricular),
        instituicoes(nome),
        servicos(nome)
      `
      )
      .in("ensino_clinico_id", ensinosIds)
      .order("id", { ascending: false });

    if (edicoesError) {
      console.log("ERRO EDIÇÕES:", edicoesError);
      abrirPopup("Erro", "Não foi possível carregar as edições de estágio.");
      setLoading(false);
      return;
    }

    const listaEdicoes = ((edicoesData as any) || []) as Edicao[];
    const edicoesIds = listaEdicoes.map((edicao) => edicao.id);

    setEdicoes(listaEdicoes);

    if (edicoesIds.length === 0) {
      setInscricoes([]);
      setUtilizadores([]);
      setProfessoresEstagio([]);
      setOrientadoresEstagio([]);
      setLoading(false);
      return;
    }

    const { data: inscricoesData, error: inscricoesError } = await supabase
      .from("inscricoes_estagio")
      .select(
        `
        id,
        aluno_id,
        professor_id,
        orientador_id,
        edicao_estagio_id,
        estado,
        estado_estagio,
        data_inscricao,
        professor_responsavel_id,
        distribuido_por,
        data_distribuicao,
        utilizador_distribuicao_id
      `
      )
      .in("edicao_estagio_id", edicoesIds)
      .order("id", { ascending: false });

    if (inscricoesError) {
      console.log("ERRO INSCRIÇÕES:", inscricoesError);
      abrirPopup("Erro", "Não foi possível carregar as distribuições.");
      setLoading(false);
      return;
    }

    const listaInscricoesTodas = ((inscricoesData as any) || []) as Inscricao[];

    const listaInscricoes = listaInscricoesTodas.filter((inscricao) => {
      const temOrigem = Boolean(inscricao.distribuido_por);

      const estaDistribuida =
        inscricao.estado === "aprovado" ||
        inscricao.estado_estagio === "em_curso" ||
        temOrigem;

      const estaApagada =
        inscricao.estado === "pendente" &&
        inscricao.estado_estagio === "por_distribuir" &&
        !temOrigem;

      return estaDistribuida && !estaApagada;
    });

    const { data: professoresEstagioData, error: professoresEstagioError } =
      await supabase
        .from("professores_estagio")
        .select("id, edicao_estagio_id, professor_id, max_alunos")
        .in("edicao_estagio_id", edicoesIds);

    const { data: orientadoresEstagioData, error: orientadoresEstagioError } =
      await supabase
        .from("orientadores_estagio")
        .select("id, edicao_estagio_id, orientador_id, max_alunos")
        .in("edicao_estagio_id", edicoesIds);

    if (professoresEstagioError || orientadoresEstagioError) {
      console.log(
        "ERRO EQUIPA ESTÁGIO:",
        professoresEstagioError || orientadoresEstagioError
      );
      abrirPopup("Erro", "Não foi possível carregar professores/orientadores.");
      setLoading(false);
      return;
    }

    const listaProfessoresEstagio =
      ((professoresEstagioData as any) || []) as ProfessorEstagio[];

    const listaOrientadoresEstagio =
      ((orientadoresEstagioData as any) || []) as OrientadorEstagio[];

    setProfessoresEstagio(listaProfessoresEstagio);
    setOrientadoresEstagio(listaOrientadoresEstagio);

    const idsUtilizadores = Array.from(
      new Set(
        [
          ...listaInscricoes.flatMap((inscricao) => [
            inscricao.aluno_id,
            inscricao.professor_responsavel_id,
            inscricao.utilizador_distribuicao_id,
          ]),
          ...listaProfessoresEstagio.map((item) => item.professor_id),
          ...listaOrientadoresEstagio.map((item) => item.orientador_id),
        ].filter(Boolean) as string[]
      )
    );

    if (idsUtilizadores.length === 0) {
      setInscricoes(listaInscricoes);
      setUtilizadores([]);
      setLoading(false);
      return;
    }

    const { data: utilizadoresData, error: utilizadoresError } = await supabase
      .from("utilizadores")
      .select("id, nome, email, tipo, numero_identificacao, ano_curricular")
      .in("id", idsUtilizadores);

    if (utilizadoresError) {
      console.log("ERRO UTILIZADORES:", utilizadoresError);
      abrirPopup("Erro", "Não foi possível carregar os utilizadores.");
      setLoading(false);
      return;
    }

    setInscricoes(listaInscricoes);
    setUtilizadores((utilizadoresData as any) || []);

    setLoading(false);
  }

  function utilizadorPorId(id: string | null) {
    if (!id) return null;
    return utilizadores.find((utilizador) => utilizador.id === id) || null;
  }

  function edicaoPorId(id: number) {
    return edicoes.find((edicao) => edicao.id === id) || null;
  }

  function alunoDaInscricao(inscricao: Inscricao) {
    return utilizadorPorId(inscricao.aluno_id);
  }

  function responsavelDaInscricao(inscricao: Inscricao) {
    return utilizadorPorId(inscricao.professor_responsavel_id);
  }

  function utilizadorDistribuicao(inscricao: Inscricao) {
    return utilizadorPorId(inscricao.utilizador_distribuicao_id);
  }

  function professoresDaEdicao(edicaoId: number) {
    const professores = professoresEstagio.filter(
      (item) => item.edicao_estagio_id === edicaoId
    );

    return professores
      .map((item) => utilizadorPorId(item.professor_id))
      .filter(Boolean) as Utilizador[];
  }

  function orientadoresDaEdicao(edicaoId: number) {
    const orientadores = orientadoresEstagio.filter(
      (item) => item.edicao_estagio_id === edicaoId
    );

    return orientadores
      .map((item) => utilizadorPorId(item.orientador_id))
      .filter(Boolean) as Utilizador[];
  }

  function textoProfessoresDaEdicao(edicaoId: number) {
    const professores = professoresDaEdicao(edicaoId);

    if (professores.length === 0) return "Sem professor";

    return professores.map((professor) => professor.nome).join(", ");
  }

  function textoOrientadoresDaEdicao(edicaoId: number) {
    const orientadores = orientadoresDaEdicao(edicaoId);

    if (orientadores.length === 0) return "Sem orientador";

    return orientadores.map((orientador) => orientador.nome).join(", ");
  }

  function temDistribuicao(inscricao: Inscricao) {
    return (
      inscricao.estado === "aprovado" ||
      inscricao.estado_estagio === "em_curso" ||
      Boolean(inscricao.distribuido_por)
    );
  }

  function estaInativa(inscricao: Inscricao) {
    return inscricao.estado_estagio?.toLowerCase() === "inativo";
  }

  function estadoTexto(inscricao: Inscricao) {
    if (estaInativa(inscricao)) return "Inativo";

    if (temDistribuicao(inscricao)) return "Distribuído";

    if (inscricao.estado === "rejeitado") return "Rejeitado";

    return "Por distribuir";
  }

  function textoOrigem(inscricao: Inscricao) {
    if (!temDistribuicao(inscricao)) return "Sem distribuição";

    if (inscricao.distribuido_por === "admin") {
      return "SuperAdmin";
    }

    if (inscricao.distribuido_por === "professor_responsavel") {
      return "Prof. Responsável";
    }

    return "Sem origem";
  }

  function dataFormatada(data: string | null) {
    if (!data) return "Sem data";
    return new Date(data).toLocaleDateString("pt-PT");
  }

  const anosDisponiveis = useMemo(() => {
    const anosAlunos = inscricoes
      .map((inscricao) => alunoDaInscricao(inscricao)?.ano_curricular)
      .filter(Boolean);

    const anosEnsinos = edicoes
      .map((edicao) => edicao.ensinos_clinicos?.ano_curricular)
      .filter(Boolean);

    return Array.from(new Set([...anosAlunos, ...anosEnsinos]));
  }, [inscricoes, utilizadores, edicoes]);

  const inscricoesFiltradas = useMemo(() => {
    const termo = pesquisa.toLowerCase().trim();

    return inscricoes.filter((inscricao) => {
      const aluno = alunoDaInscricao(inscricao);
      const responsavel = responsavelDaInscricao(inscricao);
      const edicao = edicaoPorId(inscricao.edicao_estagio_id);

      const professores = textoProfessoresDaEdicao(
        inscricao.edicao_estagio_id
      );

      const orientadores = textoOrientadoresDaEdicao(
        inscricao.edicao_estagio_id
      );

      const texto = `
        ${aluno?.nome || ""}
        ${aluno?.email || ""}
        ${aluno?.numero_identificacao || ""}
        ${professores}
        ${orientadores}
        ${responsavel?.nome || ""}
        ${edicao?.ensinos_clinicos?.nome || ""}
        ${edicao?.instituicoes?.nome || ""}
        ${edicao?.servicos?.nome || ""}
        ${edicao?.ano_letivo || ""}
        ${estadoTexto(inscricao)}
        ${textoOrigem(inscricao)}
      `.toLowerCase();

      const passaPesquisa = !termo || texto.includes(termo);

      const anoAluno = aluno?.ano_curricular;
      const anoEnsino = edicao?.ensinos_clinicos?.ano_curricular;

      const passaAno =
        filtroAno === "todos" ||
        String(anoAluno) === filtroAno ||
        String(anoEnsino) === filtroAno;

      const passaEstado =
        filtroEstado === "todos" ||
        (filtroEstado === "distribuidos" && temDistribuicao(inscricao)) ||
        (filtroEstado === "porDistribuir" && !temDistribuicao(inscricao)) ||
        (filtroEstado === "inativos" && estaInativa(inscricao));

      return passaPesquisa && passaAno && passaEstado;
    });
  }, [
    inscricoes,
    pesquisa,
    filtroAno,
    filtroEstado,
    utilizadores,
    edicoes,
    professoresEstagio,
    orientadoresEstagio,
  ]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(inscricoesFiltradas.length / itensPorPagina)
  );

  const inicioPagina = (paginaAtual - 1) * itensPorPagina;
  const fimPagina = paginaAtual * itensPorPagina;

  const inscricoesPagina = inscricoesFiltradas.slice(inicioPagina, fimPagina);

  function abrirAlterarEstado(inscricao: Inscricao) {
    setInscricaoSelecionada(inscricao.id);

    if (estaInativa(inscricao)) {
      abrirPopup(
        "Ativar distribuição",
        "Tens a certeza que queres voltar a ativar esta distribuição?",
        "ativar"
      );
    } else {
      abrirPopup(
        "Colocar distribuição inativa",
        "Tens a certeza que queres colocar esta distribuição como inativa?",
        "inativar"
      );
    }
  }

  async function alterarEstadoInscricao(novoEstado: "em_curso" | "inativo") {
    if (!inscricaoSelecionada) return;

    const { error } = await supabase
      .from("inscricoes_estagio")
      .update({
        estado_estagio: novoEstado,
      })
      .eq("id", inscricaoSelecionada);

    if (error) {
      console.log("ERRO AO ALTERAR ESTADO:", error);
      abrirPopup("Erro", "Não foi possível alterar o estado da distribuição.");
      return;
    }

    setPopupVisible(false);
    setInscricaoSelecionada(null);
    await carregarDados();
  }

  function abrirApagarDistribuicao(inscricaoId: number) {
    setInscricaoSelecionada(inscricaoId);
    abrirPopup(
      "Apagar distribuição",
      "Tens a certeza que queres apagar esta distribuição? A inscrição fica guardada, mas deixa de aparecer como distribuída.",
      "apagar"
    );
  }

  async function apagarDistribuicao() {
    if (!inscricaoSelecionada) return;

    const { error } = await supabase
      .from("inscricoes_estagio")
      .update({
        professor_id: null,
        orientador_id: null,
        professor_responsavel_id: null,
        distribuido_por: null,
        data_distribuicao: null,
        utilizador_distribuicao_id: null,
        estado: "pendente",
        estado_estagio: "por_distribuir",
      })
      .eq("id", inscricaoSelecionada);

    if (error) {
      console.log("ERRO AO APAGAR DISTRIBUIÇÃO:", error);
      abrirPopup("Erro", "Não foi possível apagar a distribuição.");
      return;
    }

    setPopupVisible(false);
    setInscricaoSelecionada(null);
    await carregarDados();
  }

  async function colocarTudoInativo() {
    const ids = inscricoesFiltradas
      .filter((inscricao) => !estaInativa(inscricao))
      .map((inscricao) => inscricao.id);

    if (ids.length === 0) {
      abrirPopup("Aviso", "Todas as distribuições filtradas já estão inativas.");
      return;
    }

    const { error } = await supabase
      .from("inscricoes_estagio")
      .update({
        estado_estagio: "inativo",
      })
      .in("id", ids);

    if (error) {
      console.log("ERRO TODOS INATIVOS:", error);
      abrirPopup(
        "Erro",
        "Não foi possível colocar as distribuições como inativas."
      );
      return;
    }

    setPopupVisible(false);
    await carregarDados();
  }

  async function apagarTudoFiltrado() {
    const ids = inscricoesFiltradas.map((inscricao) => inscricao.id);

    if (ids.length === 0) {
      abrirPopup("Aviso", "Não existem distribuições filtradas para apagar.");
      return;
    }

    const { error } = await supabase
      .from("inscricoes_estagio")
      .update({
        professor_id: null,
        orientador_id: null,
        professor_responsavel_id: null,
        distribuido_por: null,
        data_distribuicao: null,
        utilizador_distribuicao_id: null,
        estado: "pendente",
        estado_estagio: "por_distribuir",
      })
      .in("id", ids);

    if (error) {
      console.log("ERRO APAGAR TUDO:", error);
      abrirPopup("Erro", "Não foi possível apagar as distribuições filtradas.");
      return;
    }

    setPopupVisible(false);
    await carregarDados();
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
            onPress={() =>
              router.push("/backoffice/professorResponsavel/home" as any)
            }
          >
            <Ionicons name="home-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && <Text style={styles.menuText}>Dashboard</Text>}
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
            style={[styles.menuItem, styles.menuItemActive]}
            onPress={() =>
              router.push(
                "/backoffice/professorResponsavel/distribuirAlunos/distribuirAlunos" as any
              )
            }
          >
            <Ionicons name="git-branch-outline" size={23} color="#160909" />
            {sidebarAberta && (
              <Text style={[styles.menuText, styles.menuTextActive]}>
                Distribuir Alunos
              </Text>
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

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Pressable
              style={styles.botaoVoltarHome}
              onPress={() =>
                router.push("/backoffice/professorResponsavel/home" as any)
              }
            >
              <Ionicons name="arrow-back-outline" size={22} color="#160909" />
            </Pressable>

            <View>
              <Text style={styles.titulo}>Distribuir Alunos</Text>
              <Text style={styles.subtitulo}>
                Consultar e gerir distribuições dos estágios que coordenas.
              </Text>
            </View>
          </View>

          <Pressable
            style={styles.botaoCriar}
            onPress={() =>
              router.push(
                "/backoffice/professorResponsavel/distribuirAlunos/criarDistribuicao" as any
              )
            }
          >
            <Ionicons name="add-outline" size={22} color="#160909" />
            <Text style={styles.botaoCriarTexto}>Nova distribuição</Text>
          </Pressable>
        </View>

        <View style={styles.filtrosCard}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={22} color="#667085" />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar aluno, número, estágio, hospital, serviço, professor ou orientador..."
              placeholderTextColor="#8c8787"
              value={pesquisa}
              onChangeText={(valor) => {
                setPesquisa(valor);
                setPaginaAtual(1);
              }}
            />
          </View>

          <View style={styles.filtroBox}>
            <Text style={styles.filtroLabel}>Ano</Text>

            <Pressable
              style={styles.selectToggle}
              onPress={() => setFiltroAnoAberto(!filtroAnoAberto)}
            >
              <Text style={styles.selectToggleText}>
                {filtroAno === "todos" ? "Todos" : `${filtroAno}.º ano`}
              </Text>
              <Ionicons
                name={
                  filtroAnoAberto ? "chevron-up-outline" : "chevron-down-outline"
                }
                size={22}
                color="#160909"
              />
            </Pressable>

            {filtroAnoAberto && (
              <View style={styles.dropdown}>
                <Pressable
                  style={styles.dropdownItem}
                  onPress={() => {
                    setFiltroAno("todos");
                    setFiltroAnoAberto(false);
                    setPaginaAtual(1);
                  }}
                >
                  <Text style={styles.dropdownText}>Todos</Text>
                </Pressable>

                {anosDisponiveis.map((ano) => (
                  <Pressable
                    key={ano}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setFiltroAno(String(ano));
                      setFiltroAnoAberto(false);
                      setPaginaAtual(1);
                    }}
                  >
                    <Text style={styles.dropdownText}>{ano}.º ano</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View style={styles.filtroBox}>
            <Text style={styles.filtroLabel}>Estado</Text>

            <Pressable
              style={styles.selectToggle}
              onPress={() => setFiltroEstadoAberto(!filtroEstadoAberto)}
            >
              <Text style={styles.selectToggleText}>
                {filtroEstado === "todos"
                  ? "Todos"
                  : filtroEstado === "distribuidos"
                  ? "Distribuídos"
                  : filtroEstado === "porDistribuir"
                  ? "Por distribuir"
                  : "Inativos"}
              </Text>
              <Ionicons
                name={
                  filtroEstadoAberto
                    ? "chevron-up-outline"
                    : "chevron-down-outline"
                }
                size={22}
                color="#160909"
              />
            </Pressable>

            {filtroEstadoAberto && (
              <View style={styles.dropdown}>
                {[
                  { label: "Todos", value: "todos" },
                  { label: "Distribuídos", value: "distribuidos" },
                  { label: "Por distribuir", value: "porDistribuir" },
                  { label: "Inativos", value: "inativos" },
                ].map((opcao) => (
                  <Pressable
                    key={opcao.value}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setFiltroEstado(opcao.value);
                      setFiltroEstadoAberto(false);
                      setPaginaAtual(1);
                    }}
                  >
                    <Text style={styles.dropdownText}>{opcao.label}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FDB515"
            style={{ marginTop: 40 }}
          />
        ) : inscricoesPagina.length === 0 ? (
          <View style={styles.vazioCard}>
            <Ionicons
              name="information-circle-outline"
              size={30}
              color="#FDB515"
            />
            <Text style={styles.vazioTitulo}>Sem distribuições para mostrar</Text>
            <Text style={styles.vazioTexto}>
              Ainda não existem alunos distribuídos nos estágios que coordenas,
              ou não existem resultados para a pesquisa atual.
            </Text>
          </View>
        ) : (
          <View style={styles.tabelaCard}>
            <View style={styles.tabelaHeader}>
              <Text style={[styles.th, styles.colAluno]}>Aluno</Text>
              <Text style={[styles.th, styles.colNumero]}>Nº aluno</Text>
              <Text style={[styles.th, styles.colAno]}>Ano</Text>
              <Text style={[styles.th, styles.colLocal]}>Local</Text>
              <Text style={[styles.th, styles.colEstado]}>Estado</Text>
              <Text style={[styles.th, styles.colOrigem]}>Origem</Text>
              <Text style={[styles.th, styles.colAcoes]}>Ações</Text>
            </View>

            {inscricoesPagina.map((inscricao) => {
              const aluno = alunoDaInscricao(inscricao);
              const edicao = edicaoPorId(inscricao.edicao_estagio_id);
              const aberta = inscricaoAberta === inscricao.id;

              return (
                <View key={inscricao.id}>
                  <View
                    style={[
                      styles.tabelaLinha,
                      estaInativa(inscricao) && styles.tabelaLinhaInativa,
                    ]}
                  >
                    <View style={styles.colAluno}>
                      <Text style={styles.tdPrincipal}>
                        {aluno?.nome || "Aluno"}
                      </Text>
                      <Text style={styles.tdSecundario}>
                        {aluno?.email || "Sem email"}
                      </Text>
                    </View>

                    <View style={styles.colNumero}>
                      <Text style={styles.tdPrincipal}>
                        {aluno?.numero_identificacao || "N/A"}
                      </Text>
                    </View>

                    <View style={styles.colAno}>
                      <Text style={styles.tdPrincipal}>
                        {aluno?.ano_curricular ||
                          edicao?.ensinos_clinicos?.ano_curricular ||
                          "N/A"}
                        .º
                      </Text>
                    </View>

                    <View style={styles.colLocal}>
                      <Text style={styles.tdPrincipal}>
                        {edicao?.instituicoes?.nome || "Instituição"}
                      </Text>
                      <Text style={styles.tdSecundario}>
                        {edicao?.servicos?.nome || "Serviço"}
                      </Text>
                    </View>

                    <View style={styles.colEstado}>
                      <View
                        style={[
                          styles.estadoBadge,
                          estaInativa(inscricao) && styles.estadoBadgeInativo,
                        ]}
                      >
                        <Text
                          style={[
                            styles.estadoBadgeTexto,
                            estaInativa(inscricao) &&
                              styles.estadoBadgeTextoInativo,
                          ]}
                        >
                          {estadoTexto(inscricao)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.colOrigem}>
                      <Text style={styles.tdPrincipal}>
                        {textoOrigem(inscricao)}
                      </Text>
                    </View>

                    <View style={[styles.colAcoes, styles.acoes]}>
                      <Pressable
                        style={styles.acaoBotao}
                        onPress={() =>
                          setInscricaoAberta(aberta ? null : inscricao.id)
                        }
                      >
                        <Ionicons
                          name={
                            aberta
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
                          router.push({
                            pathname:
                              "/backoffice/professorResponsavel/distribuirAlunos/criarDistribuicao" as any,
                            params: {
                              inscricaoId: String(inscricao.id),
                            },
                          })
                        }
                      >
                        <Ionicons
                          name="pencil-outline"
                          size={21}
                          color="#160909"
                        />
                      </Pressable>

                      <Pressable
                        style={
                          estaInativa(inscricao)
                            ? styles.acaoBotaoAtivar
                            : styles.acaoBotaoEscuro
                        }
                        onPress={() => abrirAlterarEstado(inscricao)}
                      >
                        <Ionicons
                          name={
                            estaInativa(inscricao)
                              ? "checkmark-outline"
                              : "ban-outline"
                          }
                          size={21}
                          color={
                            estaInativa(inscricao) ? "#160909" : "#FFFFFF"
                          }
                        />
                      </Pressable>

                      <Pressable
                        style={styles.acaoBotaoPerigo}
                        onPress={() => abrirApagarDistribuicao(inscricao.id)}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={21}
                          color="#FFFFFF"
                        />
                      </Pressable>
                    </View>
                  </View>

                  {aberta && (
                    <View style={styles.detalhesBox}>
                      <View style={styles.detalheColuna}>
                        <Text style={styles.detalheLabel}>Ensino clínico</Text>
                        <Text style={styles.detalheValor}>
                          {edicao?.ensinos_clinicos?.nome || "Sem ensino"}
                        </Text>

                        <Text style={styles.detalheLabel}>Ano letivo</Text>
                        <Text style={styles.detalheValor}>
                          {edicao?.ano_letivo || "Sem ano letivo"}
                        </Text>

                        <Text style={styles.detalheLabel}>Professor</Text>
                        <Text style={styles.detalheValor}>
                          {textoProfessoresDaEdicao(
                            inscricao.edicao_estagio_id
                          )}
                        </Text>

                        <Text style={styles.detalheLabel}>Orientador</Text>
                        <Text style={styles.detalheValor}>
                          {textoOrientadoresDaEdicao(
                            inscricao.edicao_estagio_id
                          )}
                        </Text>
                      </View>

                      <View style={styles.detalheColuna}>
                        <Text style={styles.detalheLabel}>
                          Professor responsável
                        </Text>
                        <Text style={styles.detalheValor}>
                          {responsavelDaInscricao(inscricao)?.nome ||
                            "Sem responsável"}
                        </Text>

                        <Text style={styles.detalheLabel}>Distribuído por</Text>
                        <Text style={styles.detalheValor}>
                          {textoOrigem(inscricao)}
                        </Text>

                        <Text style={styles.detalheLabel}>
                          Utilizador da distribuição
                        </Text>
                        <Text style={styles.detalheValor}>
                          {utilizadorDistribuicao(inscricao)?.nome ||
                            "Sem registo"}
                        </Text>

                        <Text style={styles.detalheLabel}>
                          Data da distribuição
                        </Text>
                        <Text style={styles.detalheValor}>
                          {dataFormatada(inscricao.data_distribuicao)}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {!loading && inscricoesFiltradas.length > 0 && (
          <View style={styles.footerTabela}>
            <Text style={styles.footerTexto}>
              A mostrar {inicioPagina + 1}-
              {Math.min(fimPagina, inscricoesFiltradas.length)} de{" "}
              {inscricoesFiltradas.length}
            </Text>

            <View style={styles.itensPorPaginaBox}>
              <Text style={styles.footerTexto}>Por página:</Text>

              <View style={styles.itensDropdownWrapper}>
                <Pressable
                  style={styles.itensSelect}
                  onPress={() => setItensDropdownAberto(!itensDropdownAberto)}
                >
                  <Text style={styles.itensSelectTexto}>{itensPorPagina}</Text>
                  <Ionicons
                    name={
                      itensDropdownAberto
                        ? "chevron-up-outline"
                        : "chevron-down-outline"
                    }
                    size={18}
                    color="#160909"
                  />
                </Pressable>

                {itensDropdownAberto && (
                  <View style={styles.itensDropdown}>
                    {[5, 10, 15, 20].map((valor) => (
                      <Pressable
                        key={valor}
                        style={styles.itensDropdownItem}
                        onPress={() => {
                          setItensPorPagina(valor);
                          setPaginaAtual(1);
                          setItensDropdownAberto(false);
                        }}
                      >
                        <Text style={styles.itensDropdownText}>{valor}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            </View>

            <View style={styles.paginacao}>
              <Pressable
                style={[
                  styles.paginaBotao,
                  paginaAtual === 1 && styles.paginaBotaoDisabled,
                ]}
                disabled={paginaAtual === 1}
                onPress={() => setPaginaAtual(paginaAtual - 1)}
              >
                <Ionicons
                  name="chevron-back-outline"
                  size={20}
                  color="#160909"
                />
              </Pressable>

              <Text style={styles.paginaTexto}>
                Página {paginaAtual} de {totalPaginas}
              </Text>

              <Pressable
                style={[
                  styles.paginaBotao,
                  paginaAtual === totalPaginas && styles.paginaBotaoDisabled,
                ]}
                disabled={paginaAtual === totalPaginas}
                onPress={() => setPaginaAtual(paginaAtual + 1)}
              >
                <Ionicons
                  name="chevron-forward-outline"
                  size={20}
                  color="#160909"
                />
              </Pressable>
            </View>
          </View>
        )}

        {!loading && inscricoesFiltradas.length > 0 && (
          <View style={styles.botoesFinais}>
            <Pressable
              style={styles.botaoTodosInativos}
              onPress={() =>
                abrirPopup(
                  "Colocar tudo inativo",
                  "Tens a certeza que queres colocar todas as distribuições filtradas como inativas?",
                  "todosInativos"
                )
              }
            >
              <Ionicons name="ban-outline" size={20} color="#FFFFFF" />
              <Text style={styles.botaoTodosInativosTexto}>
                Colocar tudo inativo
              </Text>
            </Pressable>

            <Pressable
              style={styles.botaoApagarTudo}
              onPress={() =>
                abrirPopup(
                  "Apagar distribuições",
                  "Tens a certeza que queres apagar todas as distribuições filtradas?",
                  "apagarTudo"
                )
              }
            >
              <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
              <Text style={styles.botaoApagarTudoTexto}>
                Apagar distribuições
              </Text>
            </Pressable>
          </View>
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
            ) : popupTipo === "inativar" ? (
              <View style={styles.popupBotoesLinha}>
                <Pressable
                  style={styles.popupBotaoCancelar}
                  onPress={() => setPopupVisible(false)}
                >
                  <Text style={styles.popupTextoCancelar}>Cancelar</Text>
                </Pressable>

                <Pressable
                  style={styles.popupBotaoSair}
                  onPress={() => alterarEstadoInscricao("inativo")}
                >
                  <Text style={styles.popupTextoSair}>Inativar</Text>
                </Pressable>
              </View>
            ) : popupTipo === "ativar" ? (
              <View style={styles.popupBotoesLinha}>
                <Pressable
                  style={styles.popupBotaoCancelar}
                  onPress={() => setPopupVisible(false)}
                >
                  <Text style={styles.popupTextoCancelar}>Cancelar</Text>
                </Pressable>

                <Pressable
                  style={styles.popupBotaoConfirmar}
                  onPress={() => alterarEstadoInscricao("em_curso")}
                >
                  <Text style={styles.popupTextoConfirmar}>Ativar</Text>
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
                  onPress={apagarDistribuicao}
                >
                  <Text style={styles.popupTextoSair}>Apagar</Text>
                </Pressable>
              </View>
            ) : popupTipo === "todosInativos" ? (
              <View style={styles.popupBotoesLinha}>
                <Pressable
                  style={styles.popupBotaoCancelar}
                  onPress={() => setPopupVisible(false)}
                >
                  <Text style={styles.popupTextoCancelar}>Cancelar</Text>
                </Pressable>

                <Pressable
                  style={styles.popupBotaoSair}
                  onPress={colocarTudoInativo}
                >
                  <Text style={styles.popupTextoSair}>Inativar</Text>
                </Pressable>
              </View>
            ) : popupTipo === "apagarTudo" ? (
              <View style={styles.popupBotoesLinha}>
                <Pressable
                  style={styles.popupBotaoCancelar}
                  onPress={() => setPopupVisible(false)}
                >
                  <Text style={styles.popupTextoCancelar}>Cancelar</Text>
                </Pressable>

                <Pressable
                  style={styles.popupBotaoSair}
                  onPress={apagarTudoFiltrado}
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