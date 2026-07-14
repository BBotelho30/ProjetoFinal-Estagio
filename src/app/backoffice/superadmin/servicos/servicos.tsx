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
import styles from "./servicosStyles";

type Instituicao = {
  id: number;
  nome: string;
  ativo?: boolean | null;
};

type Servico = {
  id: number;
  nome: string;
  instituicao_id: number;
  ativo: boolean | null;
  instituicoes?: {
    nome: string;
  };
};

export default function Servicos() {
  const [sidebarAberta, setSidebarAberta] = useState(true);
  const contasPendentes = useContasPendentes();

  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);

  const [instituicaoSelecionada, setInstituicaoSelecionada] = useState<
    number | null
  >(null);
  const [nomeServico, setNomeServico] = useState("");
  const [modalVisivel, setModalVisivel] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [aCriar, setACriar] = useState(false);

  const [pesquisa, setPesquisa] = useState("");
  const [filtroAtivo, setFiltroAtivo] = useState<
    "ativos" | "inativos" | "todos"
  >("ativos");
  const [showFiltroAtivo, setShowFiltroAtivo] = useState(false);

  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(
    null,
  );

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTipo, setPopupTipo] = useState<
    "normal" | "sair" | "apagar" | "inativar" | "ativar"
  >("normal");

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(15);
  const [showPorPagina, setShowPorPagina] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  function abrirPopup(
    titulo: string,
    mensagem: string,
    tipo: "normal" | "sair" | "apagar" | "inativar" | "ativar" = "normal",
  ) {
    setPopupTitle(titulo);
    setPopupMessage(mensagem);
    setPopupTipo(tipo);
    setPopupVisible(true);
  }

  async function carregarDados() {
    setLoading(true);

    const { data: instData, error: instError } = await supabase
      .from("instituicoes")
      .select("id, nome, ativo")
      .eq("ativo", true)
      .order("nome", { ascending: true });

    const { data: servData, error: servError } = await supabase
      .from("servicos")
      .select("id, nome, instituicao_id, ativo, instituicoes(nome)")
      .order("nome", { ascending: true });

    if (instError || servError) {
      console.log("ERRO:", instError || servError);
      abrirPopup("Erro", "Não foi possível carregar os dados.");
    } else {
      setInstituicoes(instData || []);
      setServicos((servData as any) || []);
    }

    setLoading(false);
  }

  function abrirModalCriar() {
    setEditingId(null);
    setNomeServico("");
    setInstituicaoSelecionada(null);
    setDropdownOpen(false);
    setModalVisivel(true);
  }

  function abrirModalEditar(servico: Servico) {
    setEditingId(servico.id);
    setNomeServico(servico.nome);
    setInstituicaoSelecionada(servico.instituicao_id);
    setDropdownOpen(false);
    setModalVisivel(true);
  }

  function fecharModal() {
    setModalVisivel(false);
    setNomeServico("");
    setInstituicaoSelecionada(null);
    setDropdownOpen(false);
    setEditingId(null);
  }

  async function guardarServico() {
    if (aCriar) return;

    if (!instituicaoSelecionada) {
      abrirPopup("Erro", "Escolhe uma instituição.");
      return;
    }

    if (!nomeServico.trim()) {
      abrirPopup("Erro", "Escreve o nome do serviço.");
      return;
    }

    const nomesServicos = obterNomesServicosDoInput();

    if (nomesServicos.length === 0) {
      abrirPopup("Erro", "Escreve pelo menos um serviço.");
      return;
    }

    const repetidosNoInput = nomesRepetidosNoInput();

    if (repetidosNoInput.length > 0) {
      abrirPopup(
        "Serviço repetido",
        `Escreveste o mesmo serviço mais do que uma vez: ${[
          ...new Set(repetidosNoInput),
        ].join(", ")}.`,
      );
      return;
    }

    const existentesNaBD = await servicosJaExistentesNaInstituicaoBD();

    if (existentesNaBD === null) {
      return;
    }

    if (existentesNaBD.length > 0) {
      abrirPopup(
        "Serviço já existente",
        `Este serviço já existe nesta instituição: ${[
          ...new Set(existentesNaBD),
        ].join(", ")}.`,
      );
      return;
    }

    setACriar(true);

    let error: any = null;

    if (editingId) {
      const res = await supabase
        .from("servicos")
        .update({
          nome: nomesServicos[0],
          instituicao_id: instituicaoSelecionada,
        })
        .eq("id", editingId);

      error = res.error;
    } else {
      const servicosParaInserir = nomesServicos.map((nome) => ({
        nome,
        instituicao_id: instituicaoSelecionada,
        ativo: true,
      }));

      const res = await supabase.from("servicos").insert(servicosParaInserir);
      error = res.error;
    }

    setACriar(false);

    if (error) {
      console.log("ERRO AO GUARDAR SERVIÇO:", error);
      abrirPopup("Erro", error.message || "Ocorreu um erro.");
      return;
    }

    fecharModal();

    abrirPopup(
      "Sucesso",
      editingId
        ? "Serviço atualizado com sucesso."
        : "Serviço(s) criado(s) com sucesso.",
    );

    carregarDados();
  }

  function pedirAlterarAtivo(servico: Servico) {
    setServicoSelecionado(servico);

    if (servico.ativo === false) {
      abrirPopup(
        "Ativar serviço",
        `Tens a certeza que queres ativar ${servico.nome}?`,
        "ativar",
      );
    } else {
      abrirPopup(
        "Inativar serviço",
        `Tens a certeza que queres colocar ${servico.nome} como inativo?`,
        "inativar",
      );
    }
  }

  async function confirmarAlterarAtivo() {
    if (!servicoSelecionado) return;

    const novoAtivo = servicoSelecionado.ativo === false;

    setPopupVisible(false);

    const { error } = await supabase
      .from("servicos")
      .update({ ativo: novoAtivo })
      .eq("id", servicoSelecionado.id);

    if (error) {
      console.log("ERRO AO ALTERAR ESTADO:", error);
      abrirPopup("Erro", "Não foi possível atualizar o estado do serviço.");
      return;
    }

    abrirPopup(
      "Sucesso",
      novoAtivo
        ? "Serviço ativado com sucesso."
        : "Serviço colocado como inativo.",
    );

    setServicoSelecionado(null);
    carregarDados();
  }

  function pedirApagar(servico: Servico) {
    setServicoSelecionado(servico);

    abrirPopup(
      "Apagar serviço",
      `Tens a certeza que queres apagar ${servico.nome}? Esta ação não pode ser desfeita.`,
      "apagar",
    );
  }

  async function confirmarApagar() {
    if (!servicoSelecionado) return;

    setPopupVisible(false);

    const { error } = await supabase
      .from("servicos")
      .delete()
      .eq("id", servicoSelecionado.id);

    if (error) {
      console.log("ERRO AO APAGAR SERVIÇO:", error);
      abrirPopup(
        "Erro",
        "Não foi possível apagar o serviço, pois ja existem registos associados a ele.",
      );
      return;
    }

    abrirPopup("Sucesso", "Serviço apagado com sucesso.");
    setServicoSelecionado(null);
    carregarDados();
  }

  async function terminarSessao() {
    setPopupVisible(false);
    await supabase.auth.signOut();
    router.replace("/backoffice/login" as any);
  }

  const servicosFiltrados = useMemo(() => {
    return servicos.filter((servico) => {
      const textoPesquisa = pesquisa.toLowerCase().trim();

      const correspondePesquisa =
        textoPesquisa === "" ||
        servico.nome?.toLowerCase().includes(textoPesquisa) ||
        servico.instituicoes?.nome?.toLowerCase().includes(textoPesquisa);

      const correspondeEstado =
        filtroAtivo === "todos"
          ? true
          : filtroAtivo === "ativos"
            ? servico.ativo !== false
            : servico.ativo === false;

      return correspondePesquisa && correspondeEstado;
    });
  }, [servicos, pesquisa, filtroAtivo]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(servicosFiltrados.length / itensPorPagina),
  );

  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;

  const servicosPaginados = servicosFiltrados.slice(inicio, fim);

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

  function normalizarNomeServico(nome: string) {
    return nome
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ");
  }

  function escreverNomeServico(texto: string) {
    const textoFormatado = texto
      .replace(/[,;؛]+/g, "\n")
      .replace(/\n\s+/g, "\n");

    setNomeServico(textoFormatado);
  }

  function obterNomesServicosDoInput() {
    return nomeServico
      .replace(/[,;؛]+/g, "\n")
      .split("\n")
      .map((nome) => nome.trim())
      .filter((nome) => nome.length > 0);
  }

  function nomesRepetidosNoInput() {
    const nomes = obterNomesServicosDoInput();
    const vistos = new Set<string>();
    const repetidos: string[] = [];

    nomes.forEach((nome) => {
      const normalizado = normalizarNomeServico(nome);

      if (vistos.has(normalizado)) {
        repetidos.push(nome);
      } else {
        vistos.add(normalizado);
      }
    });

    return repetidos;
  }

  async function servicosJaExistentesNaInstituicaoBD() {
    if (!instituicaoSelecionada) return [];

    const nomesDoInput = obterNomesServicosDoInput();

    const { data, error } = await supabase
      .from("servicos")
      .select("id, nome, instituicao_id")
      .eq("instituicao_id", instituicaoSelecionada);

    if (error) {
      console.log("ERRO AO VERIFICAR SERVIÇOS EXISTENTES:", error);
      abrirPopup("Erro", "Não foi possível verificar se o serviço já existe.");
      return null;
    }

    const servicosDaInstituicao = ((data as any) || []) as Servico[];

    return nomesDoInput.filter((nomeInput) => {
      const nomeNormalizado = normalizarNomeServico(nomeInput);

      return servicosDaInstituicao.some((servico) => {
        const mesmoNome =
          normalizarNomeServico(servico.nome) === nomeNormalizado;

        const naoEOMesmoServicoEmEdicao =
          !editingId || servico.id !== editingId;

        return mesmoNome && naoEOMesmoServicoEmEdicao;
      });
    });
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
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {sidebarAberta && (
                <Text style={styles.menuText}>Aprovar Contas</Text>
              )}
              <ContasPendentesBadge count={contasPendentes} />
            </View>
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
            style={[styles.menuItem, styles.menuItemActive]}
            onPress={() =>
              router.push("/backoffice/superadmin/servicos/servicos" as any)
            }
          >
            <Ionicons name="medkit-outline" size={23} color="#160909" />
            {sidebarAberta && (
              <Text style={[styles.menuText, styles.menuTextActive]}>
                Serviços
              </Text>
            )}
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
              <Text style={styles.titulo}>Serviços</Text>
              <Text style={styles.subtitulo}>
                Criar e gerir serviços associados às instituições.
              </Text>
            </View>
          </View>

          <Pressable style={styles.botaoCriarHeader} onPress={abrirModalCriar}>
            <Ionicons name="add-outline" size={22} color="#160909" />
            <Text style={styles.textoBotaoCriar}>Criar serviço</Text>
          </Pressable>
        </View>

        <View style={styles.filtrosCard}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={22} color="#777" />
            <TextInput
              placeholder="Pesquisar por serviço ou instituição..."
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

          <View style={styles.filtroEstadoBox}>
            <Text style={styles.filtroLabel}>Estado</Text>

            <Pressable
              style={styles.selectToggleFiltro}
              onPress={() => setShowFiltroAtivo(!showFiltroAtivo)}
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
              <View style={styles.dropdownFiltro}>
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

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FDB515"
            style={{ marginTop: 40 }}
          />
        ) : servicosFiltrados.length === 0 ? (
          <View style={styles.vazioContainer}>
            <Ionicons name="medkit-outline" size={52} color="#FDB515" />
            <Text style={styles.textoVazio}>
              Não existem serviços para mostrar.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.tabelaCard}>
              <View style={styles.tabelaHeader}>
                <Text style={[styles.th, styles.colNome]}>Serviço</Text>
                <Text style={[styles.th, styles.colInstituicao]}>
                  Instituição
                </Text>
                <Text style={[styles.th, styles.colEstado]}>Estado</Text>
                <Text style={[styles.th, styles.colAcoes]}>Ações</Text>
              </View>

              {servicosPaginados.map((servico) => (
                <View key={servico.id} style={styles.tabelaLinha}>
                  <Text style={[styles.tdNome, styles.colNome]}>
                    {servico.nome}
                  </Text>

                  <Text style={[styles.td, styles.colInstituicao]}>
                    {servico.instituicoes?.nome || "Sem instituição"}
                  </Text>

                  <View style={styles.colEstado}>
                    <Text
                      style={[
                        styles.estadoBadge,
                        servico.ativo === false && styles.estadoBadgeInativo,
                      ]}
                    >
                      {servico.ativo === false ? "Inativo" : "Ativo"}
                    </Text>
                  </View>

                  <View style={[styles.acoes, styles.colAcoes]}>
                    <Pressable
                      style={styles.acaoBotao}
                      onPress={() => abrirModalEditar(servico)}
                    >
                      <Ionicons
                        name="pencil-outline"
                        size={19}
                        color="#160909"
                      />
                    </Pressable>

                    <Pressable
                      style={styles.acaoBotao}
                      onPress={() => pedirAlterarAtivo(servico)}
                    >
                      <Ionicons
                        name={
                          servico.ativo === false
                            ? "refresh-outline"
                            : "ban-outline"
                        }
                        size={19}
                        color="#160909"
                      />
                    </Pressable>

                    <Pressable
                      style={styles.acaoBotaoPerigo}
                      onPress={() => pedirApagar(servico)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={19}
                        color="#FFFFFF"
                      />
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.paginacaoCard}>
              <View style={styles.paginacaoInfo}>
                <Text style={styles.paginacaoTexto}>
                  A mostrar {servicosFiltrados.length === 0 ? 0 : inicio + 1}-
                  {Math.min(fim, servicosFiltrados.length)} de{" "}
                  {servicosFiltrados.length}
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
        visible={modalVisivel}
        transparent
        animationType="fade"
        onRequestClose={fecharModal}
      >
        <View style={styles.popupOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>
              {editingId ? "Editar Serviço" : "Criar Serviço"}
            </Text>

            <Text style={styles.label}>Instituição</Text>

            <Pressable
              style={styles.selectToggle}
              onPress={() => setDropdownOpen((prev) => !prev)}
            >
              <Text style={styles.selectToggleText}>
                {instituicaoSelecionada
                  ? instituicoes.find((i) => i.id === instituicaoSelecionada)
                      ?.nome
                  : "Selecionar instituição..."}
              </Text>
              <Ionicons
                name={
                  dropdownOpen ? "chevron-up-outline" : "chevron-down-outline"
                }
                size={22}
                color="#160909"
              />
            </Pressable>

            {dropdownOpen && (
              <ScrollView style={styles.instituicoesBox} nestedScrollEnabled>
                {instituicoes.length === 0 ? (
                  <Text style={styles.textoVazioModal}>
                    Ainda não existem instituições ativas.
                  </Text>
                ) : (
                  instituicoes.map((instituicao) => (
                    <Pressable
                      key={instituicao.id}
                      style={[
                        styles.opcaoInstituicao,
                        instituicaoSelecionada === instituicao.id &&
                          styles.opcaoInstituicaoSelecionada,
                      ]}
                      onPress={() => {
                        setInstituicaoSelecionada(instituicao.id);
                        setDropdownOpen(false);
                      }}
                    >
                      <Text style={styles.opcaoInstituicaoTexto}>
                        {instituicao.nome}
                      </Text>
                    </Pressable>
                  ))
                )}
              </ScrollView>
            )}

            <Text style={styles.label}>
              {editingId ? "Nome do serviço" : "Nome do(s) serviço(s)"}
            </Text>

            <TextInput
              placeholder={
                editingId
                  ? "Nome do serviço"
                  : "Ex: Urgência\nPediatria\nMedicina Interna"
              }
              placeholderTextColor="#8c8787"
              style={[
                styles.modalInput,
                !editingId && styles.modalInputMultiline,
              ]}
              value={nomeServico}
              onChangeText={escreverNomeServico}
              multiline={!editingId}
              textAlignVertical={!editingId ? "top" : "center"}
              blurOnSubmit={false}
            />

            {!editingId && (
              <Text style={styles.ajudaTexto}>
                Podes escrever vários serviços, um por linha, separados por
                vírgula ou ponto e vírgula.
              </Text>
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
                onPress={guardarServico}
                disabled={aCriar}
              >
                <Text style={styles.popupTextoConfirmar}>
                  {" "}
                  {aCriar
                    ? editingId
                      ? "A gravar..."
                      : "A criar..."
                    : editingId
                      ? "Guardar"
                      : "Criar"}
                </Text>
              </Pressable>
            </View>
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
                  onPress={confirmarAlterarAtivo}
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
