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
import styles from "./editarEstagioStyles";

type EdicaoEstagio = {
  id: number;
  ano_letivo: string;
  vagas: number;
  data_inicio: string | null;
  data_fim: string | null;
  estado: string;
  permite_reposicao_horas: boolean;
  limite_faltas_percentagem: number;
  max_horas_dia: number;
  ensinos_clinicos?: {
    id: number;
    nome: string;
    ano_curricular: number | null;
  };
  instituicoes?: {
    id: number;
    nome: string;
  };
  servicos?: {
    id: number;
    nome: string;
  };
};

type EnsinoOption = {
  id: number;
  nome: string;
  ano_curricular: number | null;
};

type InstituicaoOption = {
  id: number;
  nome: string;
};

type ServicoOption = {
  id: number;
  nome: string;
  instituicao_id: number;
};

export default function Estagios() {
  const [sidebarAberta, setSidebarAberta] = useState(true);
  const contasPendentes = useContasPendentes();

  const [edicoes, setEdicoes] = useState<EdicaoEstagio[]>([]);
  const [loading, setLoading] = useState(true);

  const [pesquisa, setPesquisa] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<
    "ativos" | "inativos" | "todos"
  >("ativos");
  const [filtroAno, setFiltroAno] = useState("todos");

  const [showFiltroEstado, setShowFiltroEstado] = useState(false);
  const [showFiltroAno, setShowFiltroAno] = useState(false);

  const [edicaoAberta, setEdicaoAberta] = useState<number | null>(null);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(15);
  const [showPorPagina, setShowPorPagina] = useState(false);

  const [modalVisivel, setModalVisivel] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [anoLetivoForm, setAnoLetivoForm] = useState("");
  const [vagasForm, setVagasForm] = useState("");
  const [dataInicioForm, setDataInicioForm] = useState("");
  const [dataFimForm, setDataFimForm] = useState("");
  const [permiteReposicao, setPermiteReposicao] = useState(false);
  const [limiteFaltas, setLimiteFaltas] = useState("15");
  const [maxHorasDia, setMaxHorasDia] = useState("7");
  const [salvando, setSalvando] = useState(false);

  const [ensinos, setEnsinos] = useState<EnsinoOption[]>([]);
  const [instituicoes, setInstituicoes] = useState<InstituicaoOption[]>([]);
  const [servicos, setServicos] = useState<ServicoOption[]>([]);

  const [ensinoSelecionado, setEnsinoSelecionado] = useState<number | null>(
    null,
  );
  const [instituicaoSelecionada, setInstituicaoSelecionada] = useState<
    number | null
  >(null);
  const [servicoSelecionado, setServicoSelecionado] = useState<number | null>(
    null,
  );

  const [ensinoOpen, setEnsinoOpen] = useState(false);
  const [instituicaoOpen, setInstituicaoOpen] = useState(false);
  const [servicoOpen, setServicoOpen] = useState(false);
  const [reposicaoOpen, setReposicaoOpen] = useState(false);

  const [edicaoSelecionada, setEdicaoSelecionada] =
    useState<EdicaoEstagio | null>(null);

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTipo, setPopupTipo] = useState<
    "normal" | "sair" | "apagar" | "inativar" | "ativar" | "todosInativos"
  >("normal");

  useEffect(() => {
    carregarEdicoes();
  }, []);

  function abrirPopup(
    titulo: string,
    mensagem: string,
    tipo:
      | "normal"
      | "sair"
      | "apagar"
      | "inativar"
      | "ativar"
      | "todosInativos" = "normal",
  ) {
    setPopupTitle(titulo);
    setPopupMessage(mensagem);
    setPopupTipo(tipo);
    setPopupVisible(true);
  }

  function estaInativo(edicao: EdicaoEstagio) {
    return edicao.estado?.toLowerCase() === "inativo";
  }

  async function carregarEdicoes() {
    setLoading(true);

    const { data, error } = await supabase
      .from("edicoes_estagio")
      .select(
        `
        id,
        ano_letivo,
        vagas,
        data_inicio,
        data_fim,
        estado,
        permite_reposicao_horas,
        limite_faltas_percentagem,
        max_horas_dia,
        ensinos_clinicos(id, nome, ano_curricular),
        instituicoes(id, nome),
        servicos(id, nome)
      `,
      )
      .order("id", { ascending: false });

    if (error) {
      console.log("ERRO AO CARREGAR EDIÇÕES:", error);
      abrirPopup("Erro", "Não foi possível carregar as edições de estágio.");
    } else {
      setEdicoes((data as any) || []);
    }

    setLoading(false);
  }

  async function carregarOpcoes() {
    const { data: ensData } = await supabase
      .from("ensinos_clinicos")
      .select("id, nome, ano_curricular, ativo")
      .neq("ativo", false)
      .order("ano_curricular", { ascending: true })
      .order("nome", { ascending: true });

    const { data: instData } = await supabase
      .from("instituicoes")
      .select("id, nome, ativo")
      .neq("ativo", false)
      .order("nome", { ascending: true });

    const { data: servData } = await supabase
      .from("servicos")
      .select("id, nome, instituicao_id, ativo")
      .neq("ativo", false)
      .order("nome", { ascending: true });

    setEnsinos((ensData as any) || []);
    setInstituicoes((instData as any) || []);
    setServicos((servData as any) || []);
  }

  async function abrirEditar(edicao: EdicaoEstagio) {
    await carregarOpcoes();

    setEditingId(edicao.id);
    setAnoLetivoForm(edicao.ano_letivo || "");
    setVagasForm(String(edicao.vagas || ""));
    setDataInicioForm(edicao.data_inicio || "");
    setDataFimForm(edicao.data_fim || "");
    setPermiteReposicao(!!edicao.permite_reposicao_horas);
    setLimiteFaltas(String(edicao.limite_faltas_percentagem || 15));
    setMaxHorasDia(String(edicao.max_horas_dia || 7));
    setEnsinoSelecionado(edicao.ensinos_clinicos?.id || null);
    setInstituicaoSelecionada(edicao.instituicoes?.id || null);
    setServicoSelecionado(edicao.servicos?.id || null);

    setEnsinoOpen(false);
    setInstituicaoOpen(false);
    setServicoOpen(false);
    setReposicaoOpen(false);

    setModalVisivel(true);
  }

  function fecharModal() {
    setModalVisivel(false);
    setEditingId(null);
    setAnoLetivoForm("");
    setVagasForm("");
    setDataInicioForm("");
    setDataFimForm("");
    setPermiteReposicao(false);
    setLimiteFaltas("15");
    setMaxHorasDia("7");
    setEnsinoSelecionado(null);
    setInstituicaoSelecionada(null);
    setServicoSelecionado(null);
    setEnsinoOpen(false);
    setInstituicaoOpen(false);
    setServicoOpen(false);
    setReposicaoOpen(false);
  }

  async function salvarEdicao() {
    if (salvando || !editingId) return;

    if (!anoLetivoForm.trim() || !vagasForm.trim()) {
      abrirPopup("Erro", "Preenche o ano letivo e o número de vagas.");
      return;
    }

    if (!limiteFaltas.trim() || !maxHorasDia.trim()) {
      abrirPopup(
        "Erro",
        "Preenche o limite de faltas e o máximo de horas por dia.",
      );
      return;
    }

    setSalvando(true);

    const updateData: any = {
      ano_letivo: anoLetivoForm.trim(),
      vagas: Number(vagasForm),
      data_inicio: dataInicioForm.trim() || null,
      data_fim: dataFimForm.trim() || null,
      permite_reposicao_horas: permiteReposicao,
      limite_faltas_percentagem: Number(limiteFaltas),
      max_horas_dia: Number(maxHorasDia),
    };

    if (ensinoSelecionado) updateData.ensino_clinico_id = ensinoSelecionado;
    if (instituicaoSelecionada)
      updateData.instituicao_id = instituicaoSelecionada;
    if (servicoSelecionado) updateData.servico_id = servicoSelecionado;

    const { error } = await supabase
      .from("edicoes_estagio")
      .update(updateData)
      .eq("id", editingId);

    setSalvando(false);

    if (error) {
      console.log("ERRO AO ATUALIZAR EDIÇÃO:", error);
      abrirPopup("Erro", "Não foi possível atualizar a edição.");
      return;
    }

    fecharModal();
    abrirPopup("Sucesso", "Edição atualizada com sucesso.");
    carregarEdicoes();
  }

  function pedirAlterarEstado(edicao: EdicaoEstagio) {
    setEdicaoSelecionada(edicao);

    if (estaInativo(edicao)) {
      abrirPopup(
        "Ativar edição",
        "Tens a certeza que queres voltar a ativar esta edição de estágio?",
        "ativar",
      );
    } else {
      abrirPopup(
        "Inativar edição",
        "Tens a certeza que queres colocar esta edição de estágio como inativa?",
        "inativar",
      );
    }
  }

  async function confirmarAlterarEstado() {
    if (!edicaoSelecionada) return;

    const novoEstado = estaInativo(edicaoSelecionada) ? "ativo" : "inativo";

    setPopupVisible(false);

    const { error } = await supabase
      .from("edicoes_estagio")
      .update({ estado: novoEstado })
      .eq("id", edicaoSelecionada.id);

    if (error) {
      console.log("ERRO AO ALTERAR ESTADO:", error);
      abrirPopup("Erro", "Não foi possível alterar o estado da edição.");
      return;
    }

    abrirPopup(
      "Sucesso",
      novoEstado === "ativo"
        ? "Edição ativada com sucesso."
        : "Edição colocada como inativa.",
    );

    setEdicaoSelecionada(null);
    carregarEdicoes();
  }

  function pedirApagar(edicao: EdicaoEstagio) {
    setEdicaoSelecionada(edicao);

    abrirPopup(
      "Apagar edição",
      "Tens a certeza que queres apagar esta edição de estágio? Esta ação não pode ser desfeita.",
      "apagar",
    );
  }

  async function confirmarApagar() {
    if (!edicaoSelecionada) return;

    setPopupVisible(false);

    const { error } = await supabase
      .from("edicoes_estagio")
      .delete()
      .eq("id", edicaoSelecionada.id);

    if (error) {
      console.log("ERRO AO APAGAR EDIÇÃO:", error);
      abrirPopup("Erro", "Não foi possível apagar a edição de estágio.");
      return;
    }

    abrirPopup("Sucesso", "Edição apagada com sucesso.");
    setEdicaoSelecionada(null);
    carregarEdicoes();
  }

  function pedirTodosInativos() {
    abrirPopup(
      "Colocar todos inativos",
      "Tens a certeza que queres colocar todas as edições de estágio como inativas?",
      "todosInativos",
    );
  }

  async function confirmarTodosInativos() {
    setPopupVisible(false);

    const { error } = await supabase
      .from("edicoes_estagio")
      .update({ estado: "inativo" })
      .neq("estado", "inativo");

    if (error) {
      console.log("ERRO AO INATIVAR TODOS:", error);
      abrirPopup("Erro", "Não foi possível colocar todos como inativos.");
      return;
    }

    abrirPopup("Sucesso", "Todas as edições foram colocadas como inativas.");
    carregarEdicoes();
  }

  async function terminarSessao() {
    setPopupVisible(false);
    await supabase.auth.signOut();
    router.replace("/backoffice/superadmin/login/login" as any);
  }

  const edicoesFiltradas = useMemo(() => {
    return edicoes.filter((edicao) => {
      const texto = pesquisa.toLowerCase().trim();

      const correspondePesquisa =
        texto === "" ||
        edicao.ensinos_clinicos?.nome?.toLowerCase().includes(texto) ||
        edicao.instituicoes?.nome?.toLowerCase().includes(texto) ||
        edicao.servicos?.nome?.toLowerCase().includes(texto) ||
        edicao.ano_letivo?.toLowerCase().includes(texto);

      const correspondeEstado =
        filtroEstado === "todos"
          ? true
          : filtroEstado === "ativos"
            ? !estaInativo(edicao)
            : estaInativo(edicao);

      const correspondeAno =
        filtroAno === "todos"
          ? true
          : edicao.ensinos_clinicos?.ano_curricular === Number(filtroAno);

      return correspondePesquisa && correspondeEstado && correspondeAno;
    });
  }, [edicoes, pesquisa, filtroEstado, filtroAno]);

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
            style={[styles.menuItem, styles.menuItemActive]}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/editarEstagio/editarEstagio" as any,
              )
            }
          >
            <Ionicons name="calendar-outline" size={23} color="#160909" />
            {sidebarAberta && (
              <Text style={[styles.menuText, styles.menuTextActive]}>
                Edições de Estágio
              </Text>
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
              <Text style={styles.titulo}>Edições de Estágio</Text>
              <Text style={styles.subtitulo}>
                Consultar e gerir vagas por ensino clínico, instituição e
                serviço.
              </Text>
            </View>
          </View>

          <Pressable
            style={styles.botaoCriarHeader}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/editarEstagio/criar-estagio" as any,
              )
            }
          >
            <Ionicons name="add-outline" size={22} color="#160909" />
            <Text style={styles.textoBotaoCriar}>Criar edição</Text>
          </Pressable>
        </View>

        <View style={styles.filtrosCard}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={22} color="#777" />

            <TextInput
              placeholder="Pesquisar por ensino, instituição, serviço ou ano letivo..."
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
              <Text style={styles.filtroLabel}>Estado</Text>

              <Pressable
                style={styles.selectToggleFiltro}
                onPress={() => {
                  setShowFiltroEstado(!showFiltroEstado);
                  setShowFiltroAno(false);
                  setShowPorPagina(false);
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
                      setPaginaAtual(1);
                      setShowFiltroEstado(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>Ativos</Text>
                  </Pressable>

                  <Pressable
                    style={styles.dropdownOption}
                    onPress={() => {
                      setFiltroEstado("inativos");
                      setPaginaAtual(1);
                      setShowFiltroEstado(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>Inativos</Text>
                  </Pressable>

                  <Pressable
                    style={styles.dropdownOption}
                    onPress={() => {
                      setFiltroEstado("todos");
                      setPaginaAtual(1);
                      setShowFiltroEstado(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>Todos</Text>
                  </Pressable>
                </View>
              )}
            </View>

            <View style={styles.filtroBox}>
              <Text style={styles.filtroLabel}>Ano curricular</Text>

              <Pressable
                style={styles.selectToggleFiltro}
                onPress={() => {
                  setShowFiltroAno(!showFiltroAno);
                  setShowFiltroEstado(false);
                  setShowPorPagina(false);
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

                  {["1", "2", "3", "4"].map((ano) => (
                    <Pressable
                      key={ano}
                      style={styles.dropdownOption}
                      onPress={() => {
                        setFiltroAno(ano);
                        setPaginaAtual(1);
                        setShowFiltroAno(false);
                      }}
                    >
                      <Text style={styles.dropdownOptionText}>{ano}.º ano</Text>
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
            <Ionicons name="calendar-outline" size={52} color="#FDB515" />
            <Text style={styles.textoVazio}>
              Ainda não existem edições de estágio.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.tabelaCard}>
              <View style={styles.tabelaHeader}>
                <Text style={[styles.th, styles.colEnsino]}>
                  Ensino Clínico
                </Text>
                <Text style={[styles.th, styles.colAnoCurricular]}>Ano</Text>
                <Text style={[styles.th, styles.colAnoLetivo]}>Ano letivo</Text>
                <Text style={[styles.th, styles.colVagas]}>Vagas</Text>
                <Text style={[styles.th, styles.colEstado]}>Estado</Text>
                <Text style={[styles.th, styles.colAcoes]}>Ações</Text>
              </View>

              {edicoesPaginadas.map((edicao) => {
                const aberto = edicaoAberta === edicao.id;
                const inativo = estaInativo(edicao);

                return (
                  <View key={edicao.id} style={styles.linhaContainer}>
                    <View style={styles.tabelaLinha}>
                      <Text
                        style={[styles.tdNome, styles.colEnsino]}
                        numberOfLines={1}
                      >
                        {edicao.ensinos_clinicos?.nome || "Ensino Clínico"}
                      </Text>

                      <Text style={[styles.td, styles.colAnoCurricular]}>
                        {edicao.ensinos_clinicos?.ano_curricular
                          ? `${edicao.ensinos_clinicos.ano_curricular}.º`
                          : "N/A"}
                      </Text>

                      <Text style={[styles.td, styles.colAnoLetivo]}>
                        {edicao.ano_letivo}
                      </Text>

                      <Text style={[styles.td, styles.colVagas]}>
                        {edicao.vagas}
                      </Text>

                      <View style={styles.colEstado}>
                        <Text
                          style={[
                            styles.estadoBadge,
                            inativo && styles.estadoBadgeInativo,
                          ]}
                        >
                          {inativo ? "Inativo" : "Ativo"}
                        </Text>
                      </View>

                      <View style={[styles.acoes, styles.colAcoes]}>
                        <Pressable
                          style={styles.acaoBotao}
                          onPress={() =>
                            setEdicaoAberta(aberto ? null : edicao.id)
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
                          onPress={() => abrirEditar(edicao)}
                        >
                          <Ionicons
                            name="pencil-outline"
                            size={19}
                            color="#160909"
                          />
                        </Pressable>

                        <Pressable
                          style={styles.acaoBotao}
                          onPress={() => pedirAlterarEstado(edicao)}
                        >
                          <Ionicons
                            name={inativo ? "refresh-outline" : "ban-outline"}
                            size={19}
                            color="#160909"
                          />
                        </Pressable>

                        <Pressable
                          style={styles.acaoBotaoPerigo}
                          onPress={() => pedirApagar(edicao)}
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
                        <View style={styles.detalheItem}>
                          <Text style={styles.detalheLabel}>Instituição</Text>
                          <Text style={styles.detalheValor}>
                            {edicao.instituicoes?.nome || "Sem instituição"}
                          </Text>
                        </View>

                        <View style={styles.detalheItem}>
                          <Text style={styles.detalheLabel}>Serviço</Text>
                          <Text style={styles.detalheValor}>
                            {edicao.servicos?.nome || "Sem serviço"}
                          </Text>
                        </View>

                        <View style={styles.detalheItem}>
                          <Text style={styles.detalheLabel}>Período</Text>
                          <Text style={styles.detalheValor}>
                            {edicao.data_inicio || "Sem data"} até{" "}
                            {edicao.data_fim || "Sem data"}
                          </Text>
                        </View>

                        <View style={styles.detalheItem}>
                          <Text style={styles.detalheLabel}>
                            Reposição de horas
                          </Text>
                          <Text style={styles.detalheValor}>
                            {edicao.permite_reposicao_horas ? "Sim" : "Não"}
                          </Text>
                        </View>

                        <View style={styles.detalheItem}>
                          <Text style={styles.detalheLabel}>
                            Limite de faltas
                          </Text>
                          <Text style={styles.detalheValor}>
                            {edicao.limite_faltas_percentagem || 15}%
                          </Text>
                        </View>

                        <View style={styles.detalheItem}>
                          <Text style={styles.detalheLabel}>
                            Máx. horas/dia
                          </Text>
                          <Text style={styles.detalheValor}>
                            {edicao.max_horas_dia || 7}h/dia
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
                  A mostrar {edicoesFiltradas.length === 0 ? 0 : inicio + 1}-
                  {Math.min(fim, edicoesFiltradas.length)} de{" "}
                  {edicoesFiltradas.length}
                </Text>

                <View style={styles.porPaginaContainer}>
                  <Text style={styles.porPaginaLabel}>Por página:</Text>

                  <Pressable
                    style={styles.porPaginaBotao}
                    onPress={() => {
                      setShowPorPagina(!showPorPagina);
                      setShowFiltroEstado(false);
                      setShowFiltroAno(false);
                    }}
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

            <Pressable
              style={styles.botaoTodosInativos}
              onPress={pedirTodosInativos}
            >
              <Ionicons name="ban-outline" size={20} color="#FFFFFF" />
              <Text style={styles.textoTodosInativos}>
                Colocar todos inativos
              </Text>
            </Pressable>
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
              <Text style={styles.modalTitulo}>Editar Edição</Text>

              <Text style={styles.label}>Ano Letivo</Text>
              <TextInput
                placeholder="ex: 2025/2026"
                placeholderTextColor="#8c8787"
                style={styles.modalInput}
                value={anoLetivoForm}
                onChangeText={setAnoLetivoForm}
              />

              <Text style={styles.label}>Ensino Clínico</Text>
              <Pressable
                style={styles.selectToggle}
                onPress={() => {
                  setEnsinoOpen((s) => !s);
                  setInstituicaoOpen(false);
                  setServicoOpen(false);
                  setReposicaoOpen(false);
                }}
              >
                <Text style={styles.selectToggleText}>
                  {ensinoSelecionado
                    ? ensinos.find((e) => e.id === ensinoSelecionado)?.nome
                    : "Selecionar ensino..."}
                </Text>
                <Ionicons
                  name={
                    ensinoOpen ? "chevron-up-outline" : "chevron-down-outline"
                  }
                  size={22}
                  color="#160909"
                />
              </Pressable>

              {ensinoOpen && (
                <ScrollView style={styles.instituicoesBox} nestedScrollEnabled>
                  {ensinos.map((ensino) => (
                    <Pressable
                      key={ensino.id}
                      style={[
                        styles.opcao,
                        ensinoSelecionado === ensino.id &&
                          styles.opcaoSelecionada,
                      ]}
                      onPress={() => {
                        setEnsinoSelecionado(ensino.id);
                        setEnsinoOpen(false);
                      }}
                    >
                      <Text style={styles.opcaoTexto}>{ensino.nome}</Text>
                      <Text style={styles.opcaoSubtexto}>
                        {ensino.ano_curricular
                          ? `${ensino.ano_curricular}.º ano`
                          : "Ano não definido"}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              )}

              <Text style={styles.label}>Instituição</Text>
              <Pressable
                style={styles.selectToggle}
                onPress={() => {
                  setInstituicaoOpen((s) => !s);
                  setEnsinoOpen(false);
                  setServicoOpen(false);
                  setReposicaoOpen(false);
                }}
              >
                <Text style={styles.selectToggleText}>
                  {instituicaoSelecionada
                    ? instituicoes.find((i) => i.id === instituicaoSelecionada)
                        ?.nome
                    : "Selecionar instituição..."}
                </Text>
                <Ionicons
                  name={
                    instituicaoOpen
                      ? "chevron-up-outline"
                      : "chevron-down-outline"
                  }
                  size={22}
                  color="#160909"
                />
              </Pressable>

              {instituicaoOpen && (
                <ScrollView style={styles.instituicoesBox} nestedScrollEnabled>
                  {instituicoes.map((instituicao) => (
                    <Pressable
                      key={instituicao.id}
                      style={[
                        styles.opcao,
                        instituicaoSelecionada === instituicao.id &&
                          styles.opcaoSelecionada,
                      ]}
                      onPress={() => {
                        setInstituicaoSelecionada(instituicao.id);
                        setServicoSelecionado(null);
                        setInstituicaoOpen(false);
                      }}
                    >
                      <Text style={styles.opcaoTexto}>{instituicao.nome}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              )}

              <Text style={styles.label}>Serviço</Text>
              <Pressable
                style={styles.selectToggle}
                onPress={() => {
                  setServicoOpen((s) => !s);
                  setEnsinoOpen(false);
                  setInstituicaoOpen(false);
                  setReposicaoOpen(false);
                }}
              >
                <Text style={styles.selectToggleText}>
                  {servicoSelecionado
                    ? servicos.find((s) => s.id === servicoSelecionado)?.nome
                    : "Selecionar serviço..."}
                </Text>
                <Ionicons
                  name={
                    servicoOpen ? "chevron-up-outline" : "chevron-down-outline"
                  }
                  size={22}
                  color="#160909"
                />
              </Pressable>

              {servicoOpen && (
                <ScrollView style={styles.instituicoesBox} nestedScrollEnabled>
                  {servicos
                    .filter((s) => s.instituicao_id === instituicaoSelecionada)
                    .map((servico) => (
                      <Pressable
                        key={servico.id}
                        style={[
                          styles.opcao,
                          servicoSelecionado === servico.id &&
                            styles.opcaoSelecionada,
                        ]}
                        onPress={() => {
                          setServicoSelecionado(servico.id);
                          setServicoOpen(false);
                        }}
                      >
                        <Text style={styles.opcaoTexto}>{servico.nome}</Text>
                      </Pressable>
                    ))}
                </ScrollView>
              )}

              <Text style={styles.label}>Vagas</Text>
              <TextInput
                placeholder="ex: 10"
                placeholderTextColor="#8c8787"
                style={styles.modalInput}
                value={vagasForm}
                onChangeText={setVagasForm}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Data Início</Text>
              <TextInput
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#8c8787"
                style={styles.modalInput}
                value={dataInicioForm}
                onChangeText={setDataInicioForm}
              />

              <Text style={styles.label}>Data Fim</Text>
              <TextInput
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#8c8787"
                style={styles.modalInput}
                value={dataFimForm}
                onChangeText={setDataFimForm}
              />

              <Text style={styles.label}>Permite Reposição de Horas?</Text>
              <Pressable
                style={styles.selectToggle}
                onPress={() => {
                  setReposicaoOpen((s) => !s);
                  setEnsinoOpen(false);
                  setInstituicaoOpen(false);
                  setServicoOpen(false);
                }}
              >
                <Text style={styles.selectToggleText}>
                  {permiteReposicao ? "Sim" : "Não"}
                </Text>
                <Ionicons
                  name={
                    reposicaoOpen
                      ? "chevron-up-outline"
                      : "chevron-down-outline"
                  }
                  size={22}
                  color="#160909"
                />
              </Pressable>

              {reposicaoOpen && (
                <View style={styles.dropdownModal}>
                  <Pressable
                    style={[
                      styles.opcao,
                      permiteReposicao === true && styles.opcaoSelecionada,
                    ]}
                    onPress={() => {
                      setPermiteReposicao(true);
                      setReposicaoOpen(false);
                    }}
                  >
                    <Text style={styles.opcaoTexto}>Sim</Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.opcao,
                      permiteReposicao === false && styles.opcaoSelecionada,
                    ]}
                    onPress={() => {
                      setPermiteReposicao(false);
                      setMaxHorasDia("7");
                      setReposicaoOpen(false);
                    }}
                  >
                    <Text style={styles.opcaoTexto}>Não</Text>
                  </Pressable>
                </View>
              )}

              <Text style={styles.label}>Limite de Faltas (%)</Text>
              <TextInput
                placeholder="15"
                placeholderTextColor="#8c8787"
                style={styles.modalInput}
                value={limiteFaltas}
                onChangeText={setLimiteFaltas}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Máximo de Horas por Dia</Text>
              <TextInput
                placeholder="7"
                placeholderTextColor="#8c8787"
                style={styles.modalInput}
                value={maxHorasDia}
                onChangeText={setMaxHorasDia}
                keyboardType="numeric"
              />

              <View style={styles.popupBotoesLinha}>
                <Pressable
                  style={styles.popupBotaoCancelar}
                  onPress={fecharModal}
                >
                  <Text style={styles.popupTextoCancelar}>Cancelar</Text>
                </Pressable>

                <Pressable
                  style={styles.popupBotaoConfirmar}
                  onPress={salvarEdicao}
                  disabled={salvando}
                >
                  <Text style={styles.popupTextoConfirmar}>
                    {salvando ? "A gravar..." : "Guardar"}
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
                  onPress={confirmarApagar}
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
                  onPress={confirmarAlterarEstado}
                >
                  <Text style={styles.popupTextoConfirmar}>
                    {popupTipo === "ativar" ? "Ativar" : "Inativar"}
                  </Text>
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
                  onPress={confirmarTodosInativos}
                >
                  <Text style={styles.popupTextoSair}>Inativar todos</Text>
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
