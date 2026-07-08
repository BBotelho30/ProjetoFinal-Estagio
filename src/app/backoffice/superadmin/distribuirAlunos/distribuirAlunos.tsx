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
  vagas: number;
  ano_letivo: string;
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
  utilizador_distribuicao_id: string | null;
  data_distribuicao: string | null;
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

export default function DistribuirAlunos() {
  const [sidebarAberta, setSidebarAberta] = useState(true);

  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [utilizadores, setUtilizadores] = useState<Utilizador[]>([]);
  const [edicoes, setEdicoes] = useState<Edicao[]>([]);
  const [professoresEstagio, setProfessoresEstagio] = useState<
    ProfessorEstagio[]
  >([]);
  const [orientadoresEstagio, setOrientadoresEstagio] = useState<
    OrientadorEstagio[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [pesquisa, setPesquisa] = useState("");
  const [filtroAno, setFiltroAno] = useState("todos");
  const [showFiltroAno, setShowFiltroAno] = useState(false);

  const [linhaAberta, setLinhaAberta] = useState<number | null>(null);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(15);
  const [showPorPagina, setShowPorPagina] = useState(false);

  const [idParaApagar, setIdParaApagar] = useState<number | null>(null);

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTipo, setPopupTipo] = useState<
    "normal" | "sair" | "apagar" | "inativarTudo" | "apagarTudo"
  >("normal");

  useEffect(() => {
    carregarDados();
  }, []);

  function abrirPopup(
    titulo: string,
    mensagem: string,
    tipo: "normal" | "sair" | "apagar" | "inativarTudo" | "apagarTudo" =
      "normal"
  ) {
    setPopupTitle(titulo);
    setPopupMessage(mensagem);
    setPopupTipo(tipo);
    setPopupVisible(true);
  }

  async function carregarDados() {
    setLoading(true);

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
        utilizador_distribuicao_id,
        data_distribuicao
      `
      )
      .order("id", { ascending: false });

    const { data: utilizadoresData, error: utilizadoresError } = await supabase
      .from("utilizadores")
      .select("id, nome, email, tipo, numero_identificacao, ano_curricular")
      .order("nome", { ascending: true });

    const { data: edicoesData, error: edicoesError } = await supabase
      .from("edicoes_estagio")
      .select(
        `
        id,
        vagas,
        ano_letivo,
        estado,
        ensinos_clinicos(nome, ano_curricular),
        instituicoes(nome),
        servicos(nome)
      `
      )
      .order("id", { ascending: false });

    if (inscricoesError || utilizadoresError || edicoesError) {
      console.log("ERRO:", inscricoesError || utilizadoresError || edicoesError);
      abrirPopup("Erro", "Não foi possível carregar as distribuições.");
      setLoading(false);
      return;
    }

    const listaEdicoes = ((edicoesData as any) || []) as Edicao[];
    const edicoesIds = listaEdicoes.map((edicao) => edicao.id);

    let listaProfessoresEstagio: ProfessorEstagio[] = [];
    let listaOrientadoresEstagio: OrientadorEstagio[] = [];

    if (edicoesIds.length > 0) {
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
          "ERRO EQUIPAS:",
          professoresEstagioError || orientadoresEstagioError
        );
        abrirPopup("Erro", "Não foi possível carregar as equipas dos estágios.");
        setLoading(false);
        return;
      }

      listaProfessoresEstagio =
        ((professoresEstagioData as any) || []) as ProfessorEstagio[];

      listaOrientadoresEstagio =
        ((orientadoresEstagioData as any) || []) as OrientadorEstagio[];
    }

    const todasInscricoes = ((inscricoesData as any) || []) as Inscricao[];

    const inscricoesDistribuidas = todasInscricoes.filter((inscricao) => {
      const temOrigem = Boolean(inscricao.distribuido_por);

      const estaDistribuida =
        inscricao.estado === "aprovado" ||
        inscricao.estado_estagio === "em_curso" ||
        inscricao.estado_estagio === "inativo" ||
        temOrigem;

      const estaApagada =
        inscricao.estado === "pendente" &&
        inscricao.estado_estagio === "por_distribuir" &&
        !temOrigem;

      return estaDistribuida && !estaApagada;
    });

    setInscricoes(inscricoesDistribuidas);
    setUtilizadores((utilizadoresData as any) || []);
    setEdicoes(listaEdicoes);
    setProfessoresEstagio(listaProfessoresEstagio);
    setOrientadoresEstagio(listaOrientadoresEstagio);

    setLoading(false);
  }

  function getUser(id: string | null) {
    if (!id) return null;
    return utilizadores.find((u) => u.id === id) || null;
  }

  function getEdicao(id: number) {
    return edicoes.find((e) => e.id === id) || null;
  }

  function professoresDaEdicao(edicaoId: number) {
    const professores = professoresEstagio.filter(
      (item) => item.edicao_estagio_id === edicaoId
    );

    return professores
      .map((item) => getUser(item.professor_id))
      .filter(Boolean) as Utilizador[];
  }

  function orientadoresDaEdicao(edicaoId: number) {
    const orientadores = orientadoresEstagio.filter(
      (item) => item.edicao_estagio_id === edicaoId
    );

    return orientadores
      .map((item) => getUser(item.orientador_id))
      .filter(Boolean) as Utilizador[];
  }

  function textoProfessoresDaEdicao(edicaoId: number) {
    const professores = professoresDaEdicao(edicaoId);

    if (professores.length === 0) return "Ainda não atribuído";

    return professores.map((professor) => professor.nome).join(", ");
  }

  function textoOrientadoresDaEdicao(edicaoId: number) {
    const orientadores = orientadoresDaEdicao(edicaoId);

    if (orientadores.length === 0) return "Ainda não atribuído";

    return orientadores.map((orientador) => orientador.nome).join(", ");
  }

  function temDistribuicao(inscricao: Inscricao) {
    return (
      inscricao.estado === "aprovado" ||
      inscricao.estado_estagio === "em_curso" ||
      inscricao.estado_estagio === "inativo" ||
      Boolean(inscricao.distribuido_por)
    );
  }

  function estaInativa(inscricao: Inscricao) {
    return inscricao.estado_estagio === "inativo";
  }

  function textoEstado(inscricao: Inscricao) {
    if (estaInativa(inscricao)) return "Inativo";
    if (temDistribuicao(inscricao)) return "Distribuído";
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

  function formatarData(data: string | null) {
    if (!data) return "Sem data";

    const d = new Date(data);

    if (Number.isNaN(d.getTime())) {
      return "Sem data";
    }

    return d.toLocaleDateString("pt-PT");
  }

  function pedirApagarDistribuicao(id: number) {
    setIdParaApagar(id);

    abrirPopup(
      "Apagar distribuição",
      "Tens a certeza que queres apagar a distribuição deste aluno? A inscrição no estágio será mantida.",
      "apagar"
    );
  }

  async function apagarDistribuicao() {
    if (!idParaApagar) return;

    setPopupVisible(false);

    const { error } = await supabase
      .from("inscricoes_estagio")
      .update({
        professor_id: null,
        orientador_id: null,
        professor_responsavel_id: null,
        distribuido_por: null,
        utilizador_distribuicao_id: null,
        data_distribuicao: null,
        estado: "pendente",
        estado_estagio: "por_distribuir",
      })
      .eq("id", idParaApagar);

    setIdParaApagar(null);

    if (error) {
      console.log("ERRO AO APAGAR DISTRIBUIÇÃO:", error);
      abrirPopup("Erro", "Não foi possível apagar a distribuição.");
      return;
    }

    abrirPopup("Sucesso", "Distribuição apagada com sucesso.");
    carregarDados();
  }

  function pedirInativarTudo() {
    abrirPopup(
      "Colocar tudo inativo",
      "Tens a certeza que queres colocar todas as distribuições filtradas como inativas?",
      "inativarTudo"
    );
  }

  async function confirmarInativarTudo() {
    setPopupVisible(false);

    const ids = inscricoesFiltradas.map((inscricao) => inscricao.id);

    if (ids.length === 0) {
      abrirPopup("Aviso", "Não existem distribuições para inativar.");
      return;
    }

    const { error } = await supabase
      .from("inscricoes_estagio")
      .update({
        estado_estagio: "inativo",
      })
      .in("id", ids);

    if (error) {
      console.log("ERRO AO INATIVAR:", error);
      abrirPopup("Erro", "Não foi possível colocar tudo como inativo.");
      return;
    }

    abrirPopup(
      "Sucesso",
      "As distribuições filtradas foram colocadas como inativas."
    );
    carregarDados();
  }

  function pedirApagarTudo() {
    abrirPopup(
      "Apagar tudo",
      "Tens a certeza que queres apagar todas as distribuições filtradas? As inscrições serão mantidas.",
      "apagarTudo"
    );
  }

  async function confirmarApagarTudo() {
    setPopupVisible(false);

    const ids = inscricoesFiltradas.map((inscricao) => inscricao.id);

    if (ids.length === 0) {
      abrirPopup("Aviso", "Não existem distribuições para apagar.");
      return;
    }

    const { error } = await supabase
      .from("inscricoes_estagio")
      .update({
        professor_id: null,
        orientador_id: null,
        professor_responsavel_id: null,
        distribuido_por: null,
        utilizador_distribuicao_id: null,
        data_distribuicao: null,
        estado: "pendente",
        estado_estagio: "por_distribuir",
      })
      .in("id", ids);

    if (error) {
      console.log("ERRO AO APAGAR TUDO:", error);
      abrirPopup("Erro", "Não foi possível apagar todas as distribuições.");
      return;
    }

    abrirPopup("Sucesso", "Todas as distribuições filtradas foram apagadas.");
    carregarDados();
  }

  async function terminarSessao() {
    setPopupVisible(false);
    await supabase.auth.signOut();
    router.replace("/backoffice/login" as any);
  }

  const inscricoesFiltradas = useMemo(() => {
    return inscricoes.filter((inscricao) => {
      const aluno = getUser(inscricao.aluno_id);
      const responsavel = getUser(inscricao.professor_responsavel_id);
      const distribuidor = getUser(inscricao.utilizador_distribuicao_id);
      const edicao = getEdicao(inscricao.edicao_estagio_id);

      const professores = textoProfessoresDaEdicao(
        inscricao.edicao_estagio_id
      );

      const orientadores = textoOrientadoresDaEdicao(
        inscricao.edicao_estagio_id
      );

      const texto = pesquisa.toLowerCase().trim();

      const correspondePesquisa =
        texto === "" ||
        aluno?.nome?.toLowerCase().includes(texto) ||
        aluno?.email?.toLowerCase().includes(texto) ||
        aluno?.numero_identificacao?.toLowerCase().includes(texto) ||
        professores.toLowerCase().includes(texto) ||
        orientadores.toLowerCase().includes(texto) ||
        responsavel?.nome?.toLowerCase().includes(texto) ||
        distribuidor?.nome?.toLowerCase().includes(texto) ||
        edicao?.ensinos_clinicos?.nome?.toLowerCase().includes(texto) ||
        edicao?.instituicoes?.nome?.toLowerCase().includes(texto) ||
        edicao?.servicos?.nome?.toLowerCase().includes(texto) ||
        textoOrigem(inscricao).toLowerCase().includes(texto) ||
        textoEstado(inscricao).toLowerCase().includes(texto);

      const correspondeAnoAluno =
        filtroAno === "todos"
          ? true
          : aluno?.ano_curricular === Number(filtroAno) ||
            edicao?.ensinos_clinicos?.ano_curricular === Number(filtroAno);

      return correspondePesquisa && correspondeAnoAluno;
    });
  }, [
    inscricoes,
    utilizadores,
    edicoes,
    professoresEstagio,
    orientadoresEstagio,
    pesquisa,
    filtroAno,
  ]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(inscricoesFiltradas.length / itensPorPagina)
  );

  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const inscricoesPaginadas = inscricoesFiltradas.slice(inicio, fim);

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
            {sidebarAberta && <Text style={styles.menuText}>Aprovar Contas</Text>}
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
            {sidebarAberta && <Text style={styles.menuText}>Ensinos Clínicos</Text>}
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
            style={[styles.menuItem, styles.menuItemActive]}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/distribuirAlunos/distribuirAlunos" as any
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
              <Text style={styles.titulo}>Distribuir Alunos</Text>
              <Text style={styles.subtitulo}>
                Consultar alunos distribuídos e respetivos estágios.
              </Text>
            </View>
          </View>

          <Pressable
            style={styles.botaoCriarHeader}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/distribuirAlunos/criarDistribuicao" as any
              )
            }
          >
            <Ionicons name="add-outline" size={22} color="#160909" />
            <Text style={styles.textoBotaoCriar}>Nova distribuição</Text>
          </Pressable>
        </View>

        <View style={styles.filtrosCard}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={22} color="#777" />

            <TextInput
              placeholder="Pesquisar aluno, número, hospital, serviço, professor, orientador ou origem..."
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

          <View style={styles.filtrosLinha}>
            <View style={styles.filtroBox}>
              <Text style={styles.filtroLabel}>Ano curricular do aluno</Text>

              <Pressable
                style={styles.selectToggleFiltro}
                onPress={() => setShowFiltroAno(!showFiltroAno)}
              >
                <Text style={styles.selectToggleText}>
                  {filtroAno === "todos" ? "Todos" : `${filtroAno}.º ano`}
                </Text>

                <Ionicons
                  name={
                    showFiltroAno ? "chevron-up-outline" : "chevron-down-outline"
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
                        setPaginaAtual(1);
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
          </View>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FDB515"
            style={{ marginTop: 40 }}
          />
        ) : inscricoesFiltradas.length === 0 ? (
          <View style={styles.vazioContainer}>
            <Ionicons name="git-branch-outline" size={52} color="#FDB515" />
            <Text style={styles.textoVazio}>
              Ainda não existem alunos para mostrar.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.tabelaCard}>
              <View style={styles.tabelaHeader}>
                <Text style={[styles.th, styles.colAluno]}>Aluno</Text>
                <Text style={[styles.th, styles.colNumero]}>Nº aluno</Text>
                <Text style={[styles.th, styles.colAno]}>Ano</Text>
                <Text style={[styles.th, styles.colHospital]}>Hospital</Text>
                <Text style={[styles.th, styles.colServico]}>Serviço</Text>
                <Text style={[styles.th, styles.colEstado]}>Estado</Text>
                <Text style={[styles.th, styles.colAcoes]}>Ações</Text>
              </View>

              {inscricoesPaginadas.map((inscricao) => {
                const aberto = linhaAberta === inscricao.id;

                const aluno = getUser(inscricao.aluno_id);
                const responsavel = getUser(inscricao.professor_responsavel_id);
                const distribuidor = getUser(
                  inscricao.utilizador_distribuicao_id
                );
                const edicao = getEdicao(inscricao.edicao_estagio_id);

                const distribuido = temDistribuicao(inscricao);

                return (
                  <View key={inscricao.id} style={styles.linhaContainer}>
                    <View style={styles.tabelaLinha}>
                      <View style={styles.colAluno}>
                        <Text style={styles.tdNome}>{aluno?.nome || "Aluno"}</Text>
                        <Text style={styles.tdSub}>{aluno?.email || ""}</Text>
                      </View>

                      <Text style={[styles.td, styles.colNumero]}>
                        {aluno?.numero_identificacao || "N/A"}
                      </Text>

                      <Text style={[styles.td, styles.colAno]}>
                        {aluno?.ano_curricular
                          ? `${aluno.ano_curricular}.º`
                          : edicao?.ensinos_clinicos?.ano_curricular
                          ? `${edicao.ensinos_clinicos.ano_curricular}.º`
                          : "N/A"}
                      </Text>

                      <Text style={[styles.td, styles.colHospital]}>
                        {edicao?.instituicoes?.nome || "Instituição"}
                      </Text>

                      <Text style={[styles.td, styles.colServico]}>
                        {edicao?.servicos?.nome || "Serviço"}
                      </Text>

                      <View style={styles.colEstado}>
                        <Text
                          style={[
                            styles.estadoBadge,
                            !distribuido && styles.estadoBadgePendente,
                            estaInativa(inscricao) && styles.estadoBadgePendente,
                          ]}
                        >
                          {textoEstado(inscricao)}
                        </Text>
                      </View>

                      <View style={[styles.acoes, styles.colAcoes]}>
                        <Pressable
                          style={styles.acaoBotao}
                          onPress={() =>
                            setLinhaAberta(aberto ? null : inscricao.id)
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
                            router.push(
                              `/backoffice/superadmin/distribuirAlunos/criarDistribuicao?inscricaoId=${inscricao.id}` as any
                            )
                          }
                        >
                          <Ionicons
                            name="pencil-outline"
                            size={19}
                            color="#160909"
                          />
                        </Pressable>

                        <Pressable
                          style={styles.acaoBotaoPerigo}
                          onPress={() => pedirApagarDistribuicao(inscricao.id)}
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
                        <View style={styles.detalheItemFull}>
                          <Text style={styles.detalheLabel}>Ensino clínico</Text>
                          <Text style={styles.detalheValor}>
                            {edicao?.ensinos_clinicos?.nome || "Não indicado"}
                          </Text>
                        </View>

                        <View style={styles.detalheItem}>
                          <Text style={styles.detalheLabel}>Ano letivo</Text>
                          <Text style={styles.detalheValor}>
                            {edicao?.ano_letivo || "Não indicado"}
                          </Text>
                        </View>

                        <View style={styles.detalheItem}>
                          <Text style={styles.detalheLabel}>Estado inscrição</Text>
                          <Text style={styles.detalheValor}>
                            {inscricao.estado || "Não indicado"}
                          </Text>
                        </View>

                        <View style={styles.detalheItem}>
                          <Text style={styles.detalheLabel}>Estado estágio</Text>
                          <Text style={styles.detalheValor}>
                            {inscricao.estado_estagio || "Não indicado"}
                          </Text>
                        </View>

                        <View style={styles.detalheItem}>
                          <Text style={styles.detalheLabel}>Professor</Text>
                          <Text style={styles.detalheValor}>
                            {textoProfessoresDaEdicao(
                              inscricao.edicao_estagio_id
                            )}
                          </Text>
                        </View>

                        <View style={styles.detalheItem}>
                          <Text style={styles.detalheLabel}>Orientador</Text>
                          <Text style={styles.detalheValor}>
                            {textoOrientadoresDaEdicao(
                              inscricao.edicao_estagio_id
                            )}
                          </Text>
                        </View>

                        <View style={styles.detalheItem}>
                          <Text style={styles.detalheLabel}>
                            Professor responsável
                          </Text>
                          <Text style={styles.detalheValor}>
                            {responsavel?.nome || "Ainda não indicado"}
                          </Text>
                        </View>

                        <View style={styles.detalheItem}>
                          <Text style={styles.detalheLabel}>Distribuído por</Text>
                          <Text style={styles.detalheValor}>
                            {textoOrigem(inscricao)}
                          </Text>
                        </View>

                        <View style={styles.detalheItem}>
                          <Text style={styles.detalheLabel}>
                            Utilizador distribuição
                          </Text>
                          <Text style={styles.detalheValor}>
                            {distribuidor?.nome || "Sem registo"}
                          </Text>
                        </View>

                        <View style={styles.detalheItem}>
                          <Text style={styles.detalheLabel}>
                            Data distribuição
                          </Text>
                          <Text style={styles.detalheValor}>
                            {formatarData(inscricao.data_distribuicao)}
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
                  A mostrar {inscricoesFiltradas.length === 0 ? 0 : inicio + 1}-
                  {Math.min(fim, inscricoesFiltradas.length)} de{" "}
                  {inscricoesFiltradas.length}
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
                      {[10, 15, 20].map((valor) => (
                        <Pressable
                          key={valor}
                          style={styles.porPaginaOpcao}
                          onPress={() => mudarItensPorPagina(valor)}
                        >
                          <Text style={styles.porPaginaOpcaoTexto}>{valor}</Text>
                        </Pressable>
                      ))}
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

            <View style={styles.botoesFinaisLinha}>
              <Pressable
                style={styles.botaoTudoInativo}
                onPress={pedirInativarTudo}
              >
                <Ionicons name="ban-outline" size={20} color="#FFFFFF" />
                <Text style={styles.textoBotaoFinal}>Colocar tudo inativo</Text>
              </Pressable>

              <Pressable style={styles.botaoApagarTudo} onPress={pedirApagarTudo}>
                <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
                <Text style={styles.textoBotaoFinal}>Apagar tudo</Text>
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
            ) : popupTipo === "apagar" ? (
              <View style={styles.popupBotoesLinha}>
                <Pressable
                  style={styles.popupBotaoCancelar}
                  onPress={() => {
                    setPopupVisible(false);
                    setIdParaApagar(null);
                  }}
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
            ) : popupTipo === "inativarTudo" ? (
              <View style={styles.popupBotoesLinha}>
                <Pressable
                  style={styles.popupBotaoCancelar}
                  onPress={() => setPopupVisible(false)}
                >
                  <Text style={styles.popupTextoCancelar}>Cancelar</Text>
                </Pressable>

                <Pressable
                  style={styles.popupBotaoSair}
                  onPress={confirmarInativarTudo}
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
                  onPress={confirmarApagarTudo}
                >
                  <Text style={styles.popupTextoSair}>Apagar tudo</Text>
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