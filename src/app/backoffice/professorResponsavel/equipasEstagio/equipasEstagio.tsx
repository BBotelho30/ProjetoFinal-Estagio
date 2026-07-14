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
import styles from "./equipasEstagioStyles";

type EnsinoResponsavel = {
  ensino_clinico_id: number;
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

type ProfessorEstagio = {
  id: number;
  edicao_estagio_id: number;
  professor_id: string;
  max_alunos: number;
  utilizadores?: {
    nome: string;
    email: string;
    numero_identificacao: string | null;
  } | null;
};

type OrientadorEstagio = {
  id: number;
  edicao_estagio_id: number;
  orientador_id: string;
  max_alunos: number;
  utilizadores?: {
    nome: string;
    email: string;
    numero_identificacao: string | null;
    instituicoes?: {
      nome: string;
    } | null;
    servicos?: {
      nome: string;
    } | null;
  } | null;
};

type Inscricao = {
  id: number;
  edicao_estagio_id: number;
  estado: string | null;
  estado_estagio: string | null;
  professor_id: string | null;
  orientador_id: string | null;
  distribuido_por: string | null;
  data_distribuicao: string | null;
};

export default function EquipasEstagioProfessorResponsavel() {
  const [sidebarAberta, setSidebarAberta] = useState(true);

  const [edicoes, setEdicoes] = useState<Edicao[]>([]);
  const [professoresEstagio, setProfessoresEstagio] = useState<
    ProfessorEstagio[]
  >([]);
  const [orientadoresEstagio, setOrientadoresEstagio] = useState<
    OrientadorEstagio[]
  >([]);
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);

  const [pesquisa, setPesquisa] = useState("");
  const [filtroAno, setFiltroAno] = useState("todos");
  const [filtroAnoAberto, setFiltroAnoAberto] = useState(false);

  const [edicaoAberta, setEdicaoAberta] = useState<number | null>(null);

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
    | "apagarEquipa"
    | "apagarTudo"
    | "inativarEquipa"
    | "ativarEquipa"
    | "todosInativos"
  >("normal");

  const [edicaoSelecionada, setEdicaoSelecionada] = useState<number | null>(
    null
  );

  useEffect(() => {
    carregarDados();
  }, []);

  function abrirPopup(
    titulo: string,
    mensagem: string,
    tipo:
      | "normal"
      | "sair"
      | "apagarEquipa"
      | "apagarTudo"
      | "inativarEquipa"
      | "ativarEquipa"
      | "todosInativos" = "normal"
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
      setProfessoresEstagio([]);
      setOrientadoresEstagio([]);
      setInscricoes([]);
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

    if (edicoesIds.length === 0) {
      setEdicoes([]);
      setProfessoresEstagio([]);
      setOrientadoresEstagio([]);
      setInscricoes([]);
      setLoading(false);
      return;
    }

    const { data: professoresData, error: professoresError } = await supabase
      .from("professores_estagio")
      .select(
        `
        id,
        edicao_estagio_id,
        professor_id,
        max_alunos,
        utilizadores(nome, email, numero_identificacao)
      `
      )
      .in("edicao_estagio_id", edicoesIds);

    const { data: orientadoresData, error: orientadoresError } = await supabase
      .from("orientadores_estagio")
      .select(
        `
        id,
        edicao_estagio_id,
        orientador_id,
        max_alunos,
        utilizadores(
          nome,
          email,
          numero_identificacao,
          instituicoes(nome),
          servicos(nome)
        )
      `
      )
      .in("edicao_estagio_id", edicoesIds);

    const { data: inscricoesData, error: inscricoesError } = await supabase
      .from("inscricoes_estagio")
      .select(
        `
        id,
        edicao_estagio_id,
        estado,
        estado_estagio,
        professor_id,
        orientador_id,
        distribuido_por,
        data_distribuicao
      `
      )
      .in("edicao_estagio_id", edicoesIds);

    if (professoresError || orientadoresError || inscricoesError) {
      console.log(
        "ERRO EQUIPAS:",
        professoresError || orientadoresError || inscricoesError
      );
      abrirPopup("Erro", "Não foi possível carregar as equipas.");
      setLoading(false);
      return;
    }

    const listaProfessores = ((professoresData as any) ||
      []) as ProfessorEstagio[];
    const listaOrientadores = ((orientadoresData as any) ||
      []) as OrientadorEstagio[];
    const listaInscricoes = ((inscricoesData as any) || []) as Inscricao[];

    const edicoesComEquipa = listaEdicoes.filter((edicao) => {
      const temProfessor = listaProfessores.some(
        (professor) => professor.edicao_estagio_id === edicao.id
      );

      const temOrientador = listaOrientadores.some(
        (orientador) => orientador.edicao_estagio_id === edicao.id
      );

      return temProfessor || temOrientador;
    });

    setEdicoes(edicoesComEquipa);
    setProfessoresEstagio(listaProfessores);
    setOrientadoresEstagio(listaOrientadores);
    setInscricoes(listaInscricoes);
    setLoading(false);
  }

  function estaInativo(edicao: Edicao) {
    return edicao.estado?.toLowerCase() === "inativo";
  }

  function professoresDaEdicao(edicaoId: number) {
    return professoresEstagio.filter(
      (professor) => professor.edicao_estagio_id === edicaoId
    );
  }

  function orientadoresDaEdicao(edicaoId: number) {
    return orientadoresEstagio.filter(
      (orientador) => orientador.edicao_estagio_id === edicaoId
    );
  }

  function inscricoesDaEdicao(edicaoId: number) {
    return inscricoes.filter(
      (inscricao) => inscricao.edicao_estagio_id === edicaoId
    );
  }

  function alunosDistribuidos(edicaoId: number) {
    return inscricoesDaEdicao(edicaoId).filter(
      (inscricao) =>
        inscricao.estado !== "rejeitado" &&
        inscricao.estado_estagio !== "inativo" &&
        (inscricao.estado === "aprovado" ||
          inscricao.estado_estagio === "em_curso")
    );
  }

  function totalAlunosDistribuidos(edicaoId: number) {
    return alunosDistribuidos(edicaoId).length;
  }

  function vagasDisponiveis(edicao: Edicao) {
    return Math.max(
      0,
      Number(edicao.vagas || 0) - totalAlunosDistribuidos(edicao.id)
    );
  }

  function ultimaDistribuicao(edicaoId: number) {
    const datas = inscricoesDaEdicao(edicaoId)
      .map((inscricao) => inscricao.data_distribuicao)
      .filter(Boolean) as string[];

    if (datas.length === 0) return "Sem data registada";

    const ultima = datas.sort().reverse()[0];

    return new Date(ultima).toLocaleDateString("pt-PT");
  }

  function origemDistribuicaoResumo(edicaoId: number) {
    const lista = alunosDistribuidos(edicaoId);

    if (lista.length === 0) return "Sem distribuição";

    const admin = lista.filter(
      (inscricao) => inscricao.distribuido_por === "admin"
    ).length;

    const responsavel = lista.filter(
      (inscricao) => inscricao.distribuido_por === "professor_responsavel"
    ).length;

    const semOrigem = lista.filter(
      (inscricao) => !inscricao.distribuido_por
    ).length;

    const partes: string[] = [];

    if (admin > 0) partes.push(`${admin} admin`);
    if (responsavel > 0) partes.push(`${responsavel} responsável`);
    if (semOrigem > 0) partes.push(`${semOrigem} sem origem`);

    return partes.join(" · ");
  }

  function origemDistribuicaoDetalhe(edicaoId: number) {
    const lista = alunosDistribuidos(edicaoId);

    if (lista.length === 0) return "Sem distribuição";

    const admin = lista.filter(
      (inscricao) => inscricao.distribuido_por === "admin"
    ).length;

    const responsavel = lista.filter(
      (inscricao) => inscricao.distribuido_por === "professor_responsavel"
    ).length;

    const semOrigem = lista.filter(
      (inscricao) => !inscricao.distribuido_por
    ).length;

    const partes: string[] = [];

    if (admin > 0) {
      partes.push(`${admin} aluno(s) distribuído(s) pelo SuperAdmin`);
    }

    if (responsavel > 0) {
      partes.push(
        `${responsavel} aluno(s) distribuído(s) pelo Professor Responsável`
      );
    }

    if (semOrigem > 0) {
      partes.push(`${semOrigem} aluno(s) sem origem registada`);
    }

    return partes.join(" · ");
  }

  function textoOrientador(orientador: OrientadorEstagio) {
    return `${orientador.utilizadores?.nome || "Orientador"} — limite ${
      orientador.max_alunos || 8
    }`;
  }

  function textoProfessor(professor: ProfessorEstagio) {
    return `${professor.utilizadores?.nome || "Professor"} — limite ${
      professor.max_alunos || 8
    }`;
  }

  function nomesProfessoresPesquisa(edicaoId: number) {
    return professoresDaEdicao(edicaoId)
      .map((professor) => textoProfessor(professor))
      .join(" ");
  }

  function nomesOrientadoresPesquisa(edicaoId: number) {
    return orientadoresDaEdicao(edicaoId)
      .map((orientador) => textoOrientador(orientador))
      .join(" ");
  }

  function estadoTexto(estado: string | null) {
    if (!estado || estado === "ativo") return "Ativo";
    if (estado === "inativo") return "Inativo";
    return estado;
  }

  const anosDisponiveis = useMemo(() => {
    const anos = edicoes
      .map((edicao) => edicao.ensinos_clinicos?.ano_curricular)
      .filter(Boolean);

    return Array.from(new Set(anos));
  }, [edicoes]);

  const edicoesFiltradas = useMemo(() => {
    const termo = pesquisa.toLowerCase().trim();

    return edicoes.filter((edicao) => {
      const texto = `
        ${edicao.ensinos_clinicos?.nome || ""}
        ${edicao.instituicoes?.nome || ""}
        ${edicao.servicos?.nome || ""}
        ${edicao.ano_letivo || ""}
        ${nomesProfessoresPesquisa(edicao.id)}
        ${nomesOrientadoresPesquisa(edicao.id)}
        ${origemDistribuicaoResumo(edicao.id)}
        ${estadoTexto(edicao.estado)}
      `.toLowerCase();

      const passaPesquisa = !termo || texto.includes(termo);

      const passaAno =
        filtroAno === "todos" ||
        String(edicao.ensinos_clinicos?.ano_curricular) === filtroAno;

      return passaPesquisa && passaAno;
    });
  }, [
    edicoes,
    pesquisa,
    filtroAno,
    professoresEstagio,
    orientadoresEstagio,
    inscricoes,
  ]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(edicoesFiltradas.length / itensPorPagina)
  );

  const inicioPagina = (paginaAtual - 1) * itensPorPagina;
  const fimPagina = paginaAtual * itensPorPagina;

  const edicoesPagina = edicoesFiltradas.slice(inicioPagina, fimPagina);

  function abrirApagarEquipa(edicaoId: number) {
    setEdicaoSelecionada(edicaoId);

    abrirPopup(
      "Apagar equipa",
      "Tens a certeza que queres apagar os professores e orientadores desta equipa?",
      "apagarEquipa"
    );
  }

  function abrirAlterarEstado(edicao: Edicao) {
    setEdicaoSelecionada(edicao.id);

    if (estaInativo(edicao)) {
      abrirPopup(
        "Ativar equipa",
        "Tens a certeza que queres voltar a ativar esta equipa?",
        "ativarEquipa"
      );
    } else {
      abrirPopup(
        "Colocar equipa inativa",
        "Tens a certeza que queres colocar esta equipa como inativa?",
        "inativarEquipa"
      );
    }
  }

  async function alterarEstadoEquipa(novoEstado: "ativo" | "inativo") {
    if (!edicaoSelecionada) return;

    const { error } = await supabase
      .from("edicoes_estagio")
      .update({ estado: novoEstado })
      .eq("id", edicaoSelecionada);

    if (error) {
      console.log("ERRO AO ALTERAR ESTADO:", error);
      abrirPopup("Erro", "Não foi possível alterar o estado da equipa.");
      return;
    }

    setPopupVisible(false);
    setEdicaoSelecionada(null);
    await carregarDados();
  }

  async function colocarTodosInativos() {
    const ids = edicoesFiltradas
      .filter((edicao) => !estaInativo(edicao))
      .map((edicao) => edicao.id);

    if (ids.length === 0) {
      abrirPopup("Aviso", "Todas as equipas filtradas já estão inativas.");
      return;
    }

    const { error } = await supabase
      .from("edicoes_estagio")
      .update({ estado: "inativo" })
      .in("id", ids);

    if (error) {
      console.log("ERRO AO COLOCAR TODOS INATIVOS:", error);
      abrirPopup("Erro", "Não foi possível colocar as equipas como inativas.");
      return;
    }

    setPopupVisible(false);
    await carregarDados();
  }

  async function apagarEquipa() {
    if (!edicaoSelecionada) return;

    const edicaoId = edicaoSelecionada;

    const { error: profError } = await supabase
      .from("professores_estagio")
      .delete()
      .eq("edicao_estagio_id", edicaoId);

    const { error: orientError } = await supabase
      .from("orientadores_estagio")
      .delete()
      .eq("edicao_estagio_id", edicaoId);

    if (profError || orientError) {
      console.log("ERRO APAGAR EQUIPA:", profError || orientError);
      abrirPopup("Erro", "Não foi possível apagar a equipa.");
      return;
    }

    setPopupVisible(false);
    setEdicaoSelecionada(null);
    await carregarDados();
  }

  async function apagarTudoFiltrado() {
    const ids = edicoesFiltradas.map((edicao) => edicao.id);

    if (ids.length === 0) {
      abrirPopup("Aviso", "Não existem equipas filtradas para apagar.");
      return;
    }

    const { error: profError } = await supabase
      .from("professores_estagio")
      .delete()
      .in("edicao_estagio_id", ids);

    const { error: orientError } = await supabase
      .from("orientadores_estagio")
      .delete()
      .in("edicao_estagio_id", ids);

    if (profError || orientError) {
      console.log("ERRO APAGAR TUDO:", profError || orientError);
      abrirPopup("Erro", "Não foi possível apagar as equipas filtradas.");
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
            style={[styles.menuItem, styles.menuItemActive]}
            onPress={() =>
              router.push(
                "/backoffice/professorResponsavel/equipasEstagio/equipasEstagio" as any
              )
            }
          >
            <Ionicons name="people-circle-outline" size={23} color="#160909" />
            {sidebarAberta && (
              <Text style={[styles.menuText, styles.menuTextActive]}>
                Equipas
              </Text>
            )}
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
              <Text style={styles.titulo}>Equipas dos Estágios</Text>
              <Text style={styles.subtitulo}>
                Consultar professores, orientadores e origem das distribuições.
              </Text>
            </View>
          </View>

          <Pressable
            style={styles.botaoCriar}
            onPress={() =>
              router.push(
                "/backoffice/professorResponsavel/equipasEstagio/criarEquipaEstagio" as any
              )
            }
          >
            <Ionicons name="add-outline" size={22} color="#160909" />
            <Text style={styles.botaoCriarTexto}>Criar equipa</Text>
          </Pressable>
        </View>

        <View style={styles.filtrosCard}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={22} color="#667085" />

            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar ensino, hospital, serviço, professor, orientador ou origem..."
              placeholderTextColor="#8c8787"
              value={pesquisa}
              onChangeText={(valor) => {
                setPesquisa(valor);
                setPaginaAtual(1);
              }}
            />
          </View>

          <View style={styles.filtroBox}>
            <Text style={styles.filtroLabel}>Ano curricular</Text>

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
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FDB515"
            style={{ marginTop: 40 }}
          />
        ) : edicoesPagina.length === 0 ? (
          <View style={styles.vazioCard}>
            <Ionicons
              name="information-circle-outline"
              size={30}
              color="#FDB515"
            />

            <Text style={styles.vazioTitulo}>Sem equipas para mostrar</Text>

            <Text style={styles.vazioTexto}>
              Ainda não existem edições de estágio associadas aos ensinos que
              coordenas, ou não existem resultados para a pesquisa atual.
            </Text>
          </View>
        ) : (
          <View style={styles.tabelaCard}>
            <View style={styles.tabelaHeader}>
              <Text style={[styles.th, styles.colEnsino]}>Ensino Clínico</Text>
              <Text style={[styles.th, styles.colLocal]}>Local</Text>
              <Text style={[styles.th, styles.colAno]}>Ano</Text>
              <Text style={[styles.th, styles.colVagas]}>Vagas</Text>
              <Text style={[styles.th, styles.colEquipa]}>Equipa</Text>
              <Text style={[styles.th, styles.colEstado]}>Estado</Text>
              <Text style={[styles.th, styles.colDistribuicao]}>
                Distribuição
              </Text>
              <Text style={[styles.th, styles.colAcoes]}>Ações</Text>
            </View>

            {edicoesPagina.map((edicao) => {
              const aberta = edicaoAberta === edicao.id;
              const totalDistribuidos = totalAlunosDistribuidos(edicao.id);
              const disponiveis = vagasDisponiveis(edicao);
              const inativo = estaInativo(edicao);
              const resumoOrigem = origemDistribuicaoResumo(edicao.id);
              const semDistribuicao = resumoOrigem === "Sem distribuição";

              return (
                <View key={edicao.id} style={styles.linhaContainer}>
                  <View
                    style={[
                      styles.tabelaLinha,
                      inativo && styles.tabelaLinhaInativa,
                    ]}
                  >
                    <Text
                      style={[styles.tdPrincipal, styles.colEnsino]}
                      numberOfLines={1}
                    >
                      {edicao.ensinos_clinicos?.nome || "Ensino Clínico"}
                    </Text>

                    <View style={styles.colLocal}>
                      <Text style={styles.tdPrincipal} numberOfLines={1}>
                        {edicao.instituicoes?.nome || "Instituição"}
                      </Text>

                      <Text style={styles.tdSecundario} numberOfLines={1}>
                        {edicao.servicos?.nome || "Serviço"}
                      </Text>
                    </View>

                    <Text style={[styles.tdPrincipal, styles.colAno]}>
                      {edicao.ensinos_clinicos?.ano_curricular
                        ? `${edicao.ensinos_clinicos.ano_curricular}.º`
                        : "N/A"}
                    </Text>

                    <Text style={[styles.tdPrincipal, styles.colVagas]}>
                      {edicao.vagas}
                    </Text>

                    <Text
                      style={[styles.tdPrincipal, styles.colEquipa]}
                      numberOfLines={1}
                    >
                      {professoresDaEdicao(edicao.id).length} prof. /{" "}
                      {orientadoresDaEdicao(edicao.id).length} orient.
                    </Text>

                    <View style={styles.colEstado}>
                      <View
                        style={[
                          styles.estadoBadge,
                          inativo && styles.estadoBadgeInativo,
                        ]}
                      >
                        <Text
                          style={[
                            styles.estadoBadgeTexto,
                            inativo && styles.estadoBadgeTextoInativo,
                          ]}
                        >
                          {estadoTexto(edicao.estado)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.colDistribuicao}>
                      <View
                        style={[
                          styles.badgeDistribuicao,
                          semDistribuicao && styles.badgeDistribuicaoPendente,
                        ]}
                      >
                        <Text
                          style={[
                            styles.badgeDistribuicaoTexto,
                            semDistribuicao &&
                              styles.badgeDistribuicaoTextoPendente,
                          ]}
                          numberOfLines={1}
                        >
                          {resumoOrigem}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.colAcoes, styles.acoes]}>
                      <Pressable
                        style={styles.acaoBotao}
                        onPress={() =>
                          setEdicaoAberta(aberta ? null : edicao.id)
                        }
                      >
                        <Ionicons
                          name={
                            aberta
                              ? "chevron-up-outline"
                              : "chevron-down-outline"
                          }
                          size={20}
                          color="#160909"
                        />
                      </Pressable>

                      <Pressable
                        style={styles.acaoBotao}
                        onPress={() =>
                          router.push({
                            pathname:
                              "/backoffice/professorResponsavel/equipasEstagio/criarEquipaEstagio" as any,
                            params: {
                              edicaoId: String(edicao.id),
                            },
                          })
                        }
                      >
                        <Ionicons
                          name="pencil-outline"
                          size={20}
                          color="#160909"
                        />
                      </Pressable>

                      <Pressable
                        style={
                          inativo
                            ? styles.acaoBotaoAtivar
                            : styles.acaoBotaoEscuro
                        }
                        onPress={() => abrirAlterarEstado(edicao)}
                      >
                        <Ionicons
                          name={inativo ? "checkmark-outline" : "ban-outline"}
                          size={20}
                          color={inativo ? "#160909" : "#FFFFFF"}
                        />
                      </Pressable>

                      <Pressable
                        style={styles.acaoBotaoPerigo}
                        onPress={() => abrirApagarEquipa(edicao.id)}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={20}
                          color="#FFFFFF"
                        />
                      </Pressable>
                    </View>
                  </View>

                  {aberta && (
                    <View style={styles.detalhesLinha}>
                      <View style={styles.detalhesLinhaSuperior}>
                        <View style={styles.detalheItem}>
                          <Text style={styles.detalheLabel}>Ano letivo</Text>
                          <Text style={styles.detalheValor}>
                            {edicao.ano_letivo || "Sem ano letivo"}
                          </Text>
                        </View>

                        <View style={styles.detalheItem}>
                          <Text style={styles.detalheLabel}>Alunos</Text>
                          <Text style={styles.detalheValor}>
                            {totalDistribuidos} atribuído(s) · {disponiveis}{" "}
                            disponível(eis)
                          </Text>
                        </View>

                        <View style={styles.detalheItem}>
                          <Text style={styles.detalheLabel}>
                            Última distribuição
                          </Text>
                          <Text style={styles.detalheValor}>
                            {ultimaDistribuicao(edicao.id)}
                          </Text>
                        </View>

                        <View style={styles.detalheItem}>
                          <Text style={styles.detalheLabel}>
                            Origem da distribuição
                          </Text>
                          <Text style={styles.detalheValor}>
                            {origemDistribuicaoDetalhe(edicao.id)}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.detalhesPessoasLinha}>
                        <View style={styles.detalhePessoaBloco}>
                          <Text style={styles.detalheLabel}>Professores</Text>

                          {professoresDaEdicao(edicao.id).length === 0 ? (
                            <Text style={styles.detalheValor}>Sem professor</Text>
                          ) : (
                            professoresDaEdicao(edicao.id).map((professor) => (
                              <Text key={professor.id} style={styles.detalheValor}>
                                • {textoProfessor(professor)}
                              </Text>
                            ))
                          )}
                        </View>

                        <View style={styles.detalhePessoaBloco}>
                          <Text style={styles.detalheLabel}>Orientadores</Text>

                          {orientadoresDaEdicao(edicao.id).length === 0 ? (
                            <Text style={styles.detalheValor}>
                              Sem orientador
                            </Text>
                          ) : (
                            orientadoresDaEdicao(edicao.id).map(
                              (orientador) => (
                                <Text
                                  key={orientador.id}
                                  style={styles.detalheValor}
                                >
                                  • {textoOrientador(orientador)}
                                </Text>
                              )
                            )
                          )}
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {!loading && edicoesFiltradas.length > 0 && (
          <View style={styles.footerTabela}>
            <Text style={styles.footerTexto}>
              A mostrar {inicioPagina + 1}-
              {Math.min(fimPagina, edicoesFiltradas.length)} de{" "}
              {edicoesFiltradas.length}
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

        {!loading && edicoesFiltradas.length > 0 && (
          <View style={styles.botoesFinais}>
            <Pressable
              style={styles.botaoTodosInativos}
              onPress={() =>
                abrirPopup(
                  "Colocar tudo inativo",
                  "Tens a certeza que queres colocar todas as equipas filtradas como inativas?",
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
                  "Apagar equipas",
                  "Tens a certeza que queres apagar todas as equipas filtradas? As inscrições dos alunos não serão apagadas.",
                  "apagarTudo"
                )
              }
            >
              <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
              <Text style={styles.botaoApagarTudoTexto}>Apagar equipas</Text>
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
            ) : popupTipo === "apagarEquipa" ? (
              <View style={styles.popupBotoesLinha}>
                <Pressable
                  style={styles.popupBotaoCancelar}
                  onPress={() => setPopupVisible(false)}
                >
                  <Text style={styles.popupTextoCancelar}>Cancelar</Text>
                </Pressable>

                <Pressable style={styles.popupBotaoSair} onPress={apagarEquipa}>
                  <Text style={styles.popupTextoSair}>Apagar</Text>
                </Pressable>
              </View>
            ) : popupTipo === "inativarEquipa" ? (
              <View style={styles.popupBotoesLinha}>
                <Pressable
                  style={styles.popupBotaoCancelar}
                  onPress={() => setPopupVisible(false)}
                >
                  <Text style={styles.popupTextoCancelar}>Cancelar</Text>
                </Pressable>

                <Pressable
                  style={styles.popupBotaoSair}
                  onPress={() => alterarEstadoEquipa("inativo")}
                >
                  <Text style={styles.popupTextoSair}>Inativar</Text>
                </Pressable>
              </View>
            ) : popupTipo === "ativarEquipa" ? (
              <View style={styles.popupBotoesLinha}>
                <Pressable
                  style={styles.popupBotaoCancelar}
                  onPress={() => setPopupVisible(false)}
                >
                  <Text style={styles.popupTextoCancelar}>Cancelar</Text>
                </Pressable>

                <Pressable
                  style={styles.popupBotaoConfirmar}
                  onPress={() => alterarEstadoEquipa("ativo")}
                >
                  <Text style={styles.popupTextoConfirmar}>Ativar</Text>
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
                  onPress={colocarTodosInativos}
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