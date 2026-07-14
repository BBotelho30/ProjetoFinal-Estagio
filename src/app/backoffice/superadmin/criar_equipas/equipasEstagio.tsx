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
import styles from "./equipasEstagioStyles";

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

type ProfessorEstagio = {
  id: number;
  edicao_estagio_id: number;
  max_alunos: number;
  professor_id?: string;
  utilizadores?: {
    nome: string;
    email?: string;
    numero_identificacao?: string | null;
  } | null;
};

type OrientadorEstagio = {
  id: number;
  edicao_estagio_id: number;
  max_alunos: number;
  orientador_id?: string;
  utilizadores?: {
    nome: string;
    email?: string;
    numero_identificacao?: string | null;
  } | null;
};

type Inscricao = {
  id: number;
  edicao_estagio_id: number;
  estado: string | null;
  estado_estagio: string | null;
  distribuido_por: string | null;
  data_distribuicao: string | null;
};

export default function EquipasEstagio() {
  const [sidebarAberta, setSidebarAberta] = useState(true);
  const contasPendentes = useContasPendentes();

  const [edicoes, setEdicoes] = useState<Edicao[]>([]);
  const [professores, setProfessores] = useState<ProfessorEstagio[]>([]);
  const [orientadores, setOrientadores] = useState<OrientadorEstagio[]>([]);
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);

  const [loading, setLoading] = useState(true);

  const [pesquisa, setPesquisa] = useState("");
  const [filtroAno, setFiltroAno] = useState("todos");
  const [showFiltroAno, setShowFiltroAno] = useState(false);

  const [equipaAberta, setEquipaAberta] = useState<number | null>(null);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(15);
  const [showPorPagina, setShowPorPagina] = useState(false);

  const [edicaoParaApagar, setEdicaoParaApagar] = useState<number | null>(null);

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
    tipo:
      | "normal"
      | "sair"
      | "apagar"
      | "inativarTudo"
      | "apagarTudo" = "normal",
  ) {
    setPopupTitle(titulo);
    setPopupMessage(mensagem);
    setPopupTipo(tipo);
    setPopupVisible(true);
  }

  async function carregarDados() {
    setLoading(true);

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
      `,
      )
      .order("id", { ascending: false });

    const { data: professoresData, error: professoresError } = await supabase
      .from("professores_estagio")
      .select(
        `
        id,
        edicao_estagio_id,
        professor_id,
        max_alunos,
        utilizadores(nome, email, numero_identificacao)
      `,
      );

    const { data: orientadoresData, error: orientadoresError } = await supabase
      .from("orientadores_estagio")
      .select(
        `
        id,
        edicao_estagio_id,
        orientador_id,
        max_alunos,
        utilizadores(nome, email, numero_identificacao)
      `,
      );

    const { data: inscricoesData, error: inscricoesError } = await supabase
      .from("inscricoes_estagio")
      .select(
        `
        id,
        edicao_estagio_id,
        estado,
        estado_estagio,
        distribuido_por,
        data_distribuicao
      `,
      );

    if (
      edicoesError ||
      professoresError ||
      orientadoresError ||
      inscricoesError
    ) {
      console.log(
        "ERRO:",
        edicoesError ||
          professoresError ||
          orientadoresError ||
          inscricoesError,
      );

      abrirPopup("Erro", "Não foi possível carregar os dados.");
    } else {
      setEdicoes((edicoesData as any) || []);
      setProfessores((professoresData as any) || []);
      setOrientadores((orientadoresData as any) || []);
      setInscricoes((inscricoesData as any) || []);
    }

    setLoading(false);
  }

  function professoresDaEdicao(edicaoId: number) {
    return professores.filter((prof) => prof.edicao_estagio_id === edicaoId);
  }

  function orientadoresDaEdicao(edicaoId: number) {
    return orientadores.filter(
      (orient) => orient.edicao_estagio_id === edicaoId,
    );
  }

  function inscricoesDaEdicao(edicaoId: number) {
    return inscricoes.filter(
      (inscricao) => inscricao.edicao_estagio_id === edicaoId,
    );
  }

  function inscricaoEstaDistribuida(inscricao: Inscricao) {
    return (
      inscricao.estado === "aprovado" ||
      inscricao.estado_estagio === "em_curso" ||
      inscricao.estado_estagio === "inativo" ||
      Boolean(inscricao.distribuido_por)
    );
  }

  function inscricoesDistribuidasDaEdicao(edicaoId: number) {
    return inscricoesDaEdicao(edicaoId).filter(
      (inscricao) =>
        inscricao.estado !== "rejeitado" &&
        inscricao.estado_estagio !== "por_distribuir" &&
        inscricaoEstaDistribuida(inscricao),
    );
  }

  function contarAtribuidos(edicaoId: number) {
    return inscricoesDistribuidasDaEdicao(edicaoId).length;
  }

  function atribuidosTexto(atribuidos: number, disponiveis: number) {
    return `${atribuidos} atribuído(s) · ${disponiveis} disponível(eis)`;
  }

  function dataUltimaDistribuicao(edicaoId: number) {
    const lista = inscricoesDistribuidasDaEdicao(edicaoId)
      .filter((inscricao) => Boolean(inscricao.data_distribuicao))
      .sort((a, b) => {
        const dataA = new Date(a.data_distribuicao || "").getTime();
        const dataB = new Date(b.data_distribuicao || "").getTime();

        return dataB - dataA;
      });

    if (lista.length === 0) {
      return "Ainda sem distribuição";
    }

    const data = new Date(lista[0].data_distribuicao || "");

    if (Number.isNaN(data.getTime())) {
      return "Ainda sem distribuição";
    }

    return data.toLocaleDateString("pt-PT");
  }

  function origemDistribuicaoResumo(edicaoId: number) {
    const lista = inscricoesDistribuidasDaEdicao(edicaoId);

    if (lista.length === 0) {
      return "Sem distribuição";
    }

    const porAdmin = lista.filter(
      (inscricao) => inscricao.distribuido_por === "admin",
    ).length;

    const porResponsavel = lista.filter(
      (inscricao) => inscricao.distribuido_por === "professor_responsavel",
    ).length;

    const semOrigem = lista.filter(
      (inscricao) => !inscricao.distribuido_por,
    ).length;

    const partes: string[] = [];

    if (porAdmin > 0) {
      partes.push(`${porAdmin} SuperAdmin`);
    }

    if (porResponsavel > 0) {
      partes.push(`${porResponsavel} Prof. Responsável`);
    }

    if (semOrigem > 0) {
      partes.push(`${semOrigem} sem origem`);
    }

    return partes.join(" · ");
  }

  function origemDistribuicaoDetalhe(edicaoId: number) {
    const lista = inscricoesDistribuidasDaEdicao(edicaoId);

    if (lista.length === 0) {
      return "Ainda não existem alunos distribuídos nesta edição.";
    }

    const porAdmin = lista.filter(
      (inscricao) => inscricao.distribuido_por === "admin",
    ).length;

    const porResponsavel = lista.filter(
      (inscricao) => inscricao.distribuido_por === "professor_responsavel",
    ).length;

    const semOrigem = lista.filter(
      (inscricao) => !inscricao.distribuido_por,
    ).length;

    const partes: string[] = [];

    if (porAdmin > 0) {
      partes.push(`${porAdmin} aluno(s) distribuído(s) pelo SuperAdmin`);
    }

    if (porResponsavel > 0) {
      partes.push(
        `${porResponsavel} aluno(s) distribuído(s) pelo Professor Responsável`,
      );
    }

    if (semOrigem > 0) {
      partes.push(`${semOrigem} aluno(s) sem origem registada`);
    }

    return partes.join(" · ");
  }

  function pedirApagarEquipa(edicaoId: number) {
    setEdicaoParaApagar(edicaoId);

    abrirPopup(
      "Apagar equipa",
      "Tens a certeza que queres apagar os professores e orientadores associados a esta edição?",
      "apagar",
    );
  }

  async function apagarEquipa() {
    if (!edicaoParaApagar) return;

    setPopupVisible(false);

    const { error: profError } = await supabase
      .from("professores_estagio")
      .delete()
      .eq("edicao_estagio_id", edicaoParaApagar);

    const { error: orientError } = await supabase
      .from("orientadores_estagio")
      .delete()
      .eq("edicao_estagio_id", edicaoParaApagar);

    setEdicaoParaApagar(null);

    if (profError || orientError) {
      console.log("ERRO AO APAGAR EQUIPA:", profError || orientError);
      abrirPopup("Erro", "Não foi possível apagar a equipa.");
      return;
    }

    abrirPopup("Sucesso", "Equipa apagada com sucesso.");
    carregarDados();
  }

  function pedirInativarTudo() {
    abrirPopup(
      "Colocar tudo inativo",
      "Tens a certeza que queres colocar todas as edições com equipa como inativas?",
      "inativarTudo",
    );
  }

  async function confirmarInativarTudo() {
    setPopupVisible(false);

    const ids = edicoesComEquipa.map((edicao) => edicao.id);

    if (ids.length === 0) {
      abrirPopup("Aviso", "Não existem equipas para inativar.");
      return;
    }

    const { error } = await supabase
      .from("edicoes_estagio")
      .update({ estado: "inativo" })
      .in("id", ids);

    if (error) {
      console.log("ERRO AO INATIVAR TUDO:", error);
      abrirPopup("Erro", "Não foi possível colocar tudo como inativo.");
      return;
    }

    abrirPopup(
      "Sucesso",
      "Todas as edições com equipa foram colocadas como inativas.",
    );

    carregarDados();
  }

  function pedirApagarTudo() {
    abrirPopup(
      "Apagar tudo",
      "Tens a certeza que queres apagar todas as equipas? Isto remove todos os professores e orientadores associados às edições.",
      "apagarTudo",
    );
  }

  async function confirmarApagarTudo() {
    setPopupVisible(false);

    const ids = edicoesComEquipa.map((edicao) => edicao.id);

    if (ids.length === 0) {
      abrirPopup("Aviso", "Não existem equipas para apagar.");
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
      console.log("ERRO AO APAGAR TUDO:", profError || orientError);
      abrirPopup("Erro", "Não foi possível apagar todas as equipas.");
      return;
    }

    abrirPopup("Sucesso", "Todas as equipas foram apagadas com sucesso.");
    carregarDados();
  }

  async function terminarSessao() {
    setPopupVisible(false);
    await supabase.auth.signOut();
    router.replace("/backoffice/login" as any);
  }

  const edicoesComEquipa = useMemo(() => {
    return edicoes.filter((edicao) => {
      const profs = professores.filter(
        (prof) => prof.edicao_estagio_id === edicao.id,
      );

      const orients = orientadores.filter(
        (orient) => orient.edicao_estagio_id === edicao.id,
      );

      return profs.length > 0 || orients.length > 0;
    });
  }, [edicoes, professores, orientadores]);

  const edicoesFiltradas = useMemo(() => {
    return edicoesComEquipa.filter((edicao) => {
      const texto = pesquisa.toLowerCase().trim();

      const profs = professores.filter(
        (prof) => prof.edicao_estagio_id === edicao.id,
      );

      const orients = orientadores.filter(
        (orient) => orient.edicao_estagio_id === edicao.id,
      );

      const correspondePesquisa =
        texto === "" ||
        edicao.ensinos_clinicos?.nome?.toLowerCase().includes(texto) ||
        edicao.instituicoes?.nome?.toLowerCase().includes(texto) ||
        edicao.servicos?.nome?.toLowerCase().includes(texto) ||
        edicao.ano_letivo?.toLowerCase().includes(texto) ||
        origemDistribuicaoResumo(edicao.id).toLowerCase().includes(texto) ||
        profs.some((p) =>
          p.utilizadores?.nome?.toLowerCase().includes(texto),
        ) ||
        orients.some((o) =>
          o.utilizadores?.nome?.toLowerCase().includes(texto),
        );

      const correspondeAno =
        filtroAno === "todos"
          ? true
          : edicao.ensinos_clinicos?.ano_curricular === Number(filtroAno);

      return correspondePesquisa && correspondeAno;
    });
  }, [
    edicoesComEquipa,
    pesquisa,
    filtroAno,
    professores,
    orientadores,
    inscricoes,
  ]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(edicoesFiltradas.length / itensPorPagina),
  );

  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const edicoesPaginadas = edicoesFiltradas.slice(inicio, fim);

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
            style={styles.menuItem}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/professoresResponsaveis/professoresResponsaveis" as any,
              )
            }
          >
            <Ionicons name="ribbon-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && (
              <Text style={styles.menuText}>Professores Responsáveis</Text>
            )}
          </Pressable>

          <Pressable
            style={[styles.menuItem, styles.menuItemActive]}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/criar_equipas/equipasEstagio" as any,
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
              <Text style={styles.titulo}>Equipas dos Estágios</Text>
              <Text style={styles.subtitulo}>
                Consultar professores, orientadores e origem das distribuições.
              </Text>
            </View>
          </View>

          <Pressable
            style={styles.botaoCriarHeader}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/criar_equipas/criarEquipaEstagio" as any,
              )
            }
          >
            <Ionicons name="add-outline" size={22} color="#160909" />
            <Text style={styles.textoBotaoCriar}>Criar equipa</Text>
          </Pressable>
        </View>

        <View style={styles.filtrosCard}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={22} color="#777" />

            <TextInput
              placeholder="Pesquisar ensino, hospital, serviço, professor, orientador ou origem..."
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
              <Text style={styles.filtroLabel}>Ano curricular</Text>

              <Pressable
                style={styles.selectToggleFiltro}
                onPress={() => setShowFiltroAno(!showFiltroAno)}
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
        ) : edicoesFiltradas.length === 0 ? (
          <View style={styles.vazioContainer}>
            <Ionicons name="people-circle-outline" size={52} color="#FDB515" />
            <Text style={styles.textoVazio}>
              Ainda não existem equipas criadas.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.tabelaCard}>
              <View style={styles.tabelaHeader}>
                <Text style={[styles.th, styles.colEnsino]}>
                  Ensino Clínico
                </Text>
                <Text style={[styles.th, styles.colLocal]}>Local</Text>
                <Text style={[styles.th, styles.colAno]}>Ano</Text>
                <Text style={[styles.th, styles.colVagas]}>Vagas</Text>
                <Text style={[styles.th, styles.colEquipa]}>Equipa</Text>
                <Text style={[styles.th, styles.colDistribuicao]}>
                  Distribuição
                </Text>
                <Text style={[styles.th, styles.colAcoes]}>Ações</Text>
              </View>

              {edicoesPaginadas.map((edicao) => {
                const aberto = equipaAberta === edicao.id;

                const profs = professoresDaEdicao(edicao.id);
                const orients = orientadoresDaEdicao(edicao.id);

                const atribuidos = contarAtribuidos(edicao.id);
                const disponiveis = edicao.vagas - atribuidos;

                const resumoOrigem = origemDistribuicaoResumo(edicao.id);
                const semDistribuicao = resumoOrigem === "Sem distribuição";

                return (
                  <View key={edicao.id} style={styles.linhaContainer}>
                    <View style={styles.tabelaLinha}>
                      <Text
                        style={[styles.tdNome, styles.colEnsino]}
                        numberOfLines={1}
                      >
                        {edicao.ensinos_clinicos?.nome || "Ensino Clínico"}
                      </Text>

                      <View style={styles.colLocal}>
                        <Text style={styles.td} numberOfLines={1}>
                          {edicao.instituicoes?.nome || "Instituição"}
                        </Text>
                        <Text style={styles.tdSub} numberOfLines={1}>
                          {edicao.servicos?.nome || "Serviço"}
                        </Text>
                      </View>

                      <Text style={[styles.td, styles.colAno]}>
                        {edicao.ensinos_clinicos?.ano_curricular
                          ? `${edicao.ensinos_clinicos.ano_curricular}.º`
                          : "N/A"}
                      </Text>

                      <Text style={[styles.td, styles.colVagas]}>
                        {edicao.vagas}
                      </Text>

                      <Text style={[styles.td, styles.colEquipa]}>
                        {profs.length} prof. / {orients.length} orient.
                      </Text>

                      <View style={styles.colDistribuicao}>
                        <Text
                          style={[
                            styles.origemBadge,
                            semDistribuicao && styles.origemBadgePendente,
                          ]}
                          numberOfLines={1}
                        >
                          {resumoOrigem}
                        </Text>
                      </View>

                      <View style={[styles.acoes, styles.colAcoes]}>
                        <Pressable
                          style={styles.acaoBotao}
                          onPress={() =>
                            setEquipaAberta(aberto ? null : edicao.id)
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
                              `/backoffice/superadmin/criar_equipas/criarEquipaEstagio?edicaoId=${edicao.id}` as any,
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
                          onPress={() => pedirApagarEquipa(edicao.id)}
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
                        <View style={styles.detalhesLinhaSuperior}>
                          <View style={styles.detalheItem}>
                            <Text style={styles.detalheLabel}>Ano letivo</Text>
                            <Text style={styles.detalheValor}>
                              {edicao.ano_letivo}
                            </Text>
                          </View>

                          <View style={styles.detalheItem}>
                            <Text style={styles.detalheLabel}>Alunos</Text>
                            <Text style={styles.detalheValor}>
                              {atribuidosTexto(atribuidos, disponiveis)}
                            </Text>
                          </View>

                          <View style={styles.detalheItem}>
                            <Text style={styles.detalheLabel}>
                              Última distribuição
                            </Text>
                            <Text style={styles.detalheValor}>
                              {dataUltimaDistribuicao(edicao.id)}
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

                        <View style={styles.detalhesLinhaInferior}>
                          <View style={styles.detalheItemGrande}>
                            <Text style={styles.detalheLabel}>Professores</Text>

                            {profs.length === 0 ? (
                              <Text style={styles.detalheValor}>
                                Ainda não existem professores associados.
                              </Text>
                            ) : (
                              profs.map((prof) => (
                                <Text key={prof.id} style={styles.detalheValor}>
                                  • {prof.utilizadores?.nome || "Professor"} —
                                  limite {prof.max_alunos}
                                </Text>
                              ))
                            )}
                          </View>

                          <View style={styles.detalheItemGrande}>
                            <Text style={styles.detalheLabel}>
                              Orientadores
                            </Text>

                            {orients.length === 0 ? (
                              <Text style={styles.detalheValor}>
                                Ainda não existem orientadores associados.
                              </Text>
                            ) : (
                              orients.map((orient) => (
                                <Text
                                  key={orient.id}
                                  style={styles.detalheValor}
                                >
                                  • {orient.utilizadores?.nome || "Orientador"}{" "}
                                  — limite {orient.max_alunos}
                                </Text>
                              ))
                            )}
                          </View>
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
                  A mostrar {edicoesFiltradas.length === 0 ? 0 : inicio + 1}-
                  {Math.min(fim, edicoesFiltradas.length)} de{" "}
                  {edicoesFiltradas.length}
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
                          <Text style={styles.porPaginaOpcaoTexto}>
                            {valor}
                          </Text>
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

              <Pressable
                style={styles.botaoApagarTudo}
                onPress={pedirApagarTudo}
              >
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
                  onPress={() => {
                    setPopupVisible(false);
                    setEdicaoParaApagar(null);
                  }}
                >
                  <Text style={styles.popupTextoCancelar}>Cancelar</Text>
                </Pressable>

                <Pressable style={styles.popupBotaoSair} onPress={apagarEquipa}>
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
