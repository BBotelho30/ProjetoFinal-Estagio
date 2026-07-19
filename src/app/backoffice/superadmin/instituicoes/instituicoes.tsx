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
import styles from "./instituicoesStyles";

type Instituicao = {
  id: number;
  nome: string;
  endereco: string | null;
  ativo: boolean | null;
};

export default function CriarInstituicoes() {
  const [sidebarAberta, setSidebarAberta] = useState(true);
  const contasPendentes = useContasPendentes();

  const [modalVisivel, setModalVisivel] = useState(false);
  const [nomeInstituicao, setNomeInstituicao] = useState("");
  const [enderecoInstituicao, setEnderecoInstituicao] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [loading, setLoading] = useState(false);
  const [aCriar, setACriar] = useState(false);

  const [pesquisa, setPesquisa] = useState("");
  const [filtroAtivo, setFiltroAtivo] = useState<
    "ativas" | "inativas" | "todas"
  >("ativas");
  const [showFiltroAtivo, setShowFiltroAtivo] = useState(false);

  const [instituicaoSelecionada, setInstituicaoSelecionada] =
    useState<Instituicao | null>(null);

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
    carregarInstituicoes();
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

  async function carregarInstituicoes() {
    setLoading(true);

    const { data, error } = await supabase
      .from("instituicoes")
      .select("id, nome, endereco, ativo")
      .order("nome", { ascending: true });

    if (error) {
      console.log("ERRO AO CARREGAR INSTITUIÇÕES:", error);
      abrirPopup("Erro", "Não foi possível carregar as instituições.");
    } else {
      setInstituicoes(data || []);
    }

    setLoading(false);
  }

  function abrirModalCriar() {
    setEditingId(null);
    setNomeInstituicao("");
    setEnderecoInstituicao("");
    setModalVisivel(true);
  }

  function abrirModalEditar(instituicao: Instituicao) {
    setEditingId(instituicao.id);
    setNomeInstituicao(instituicao.nome);
    setEnderecoInstituicao(instituicao.endereco || "");
    setModalVisivel(true);
  }

  function fecharModal() {
    setModalVisivel(false);
    setNomeInstituicao("");
    setEnderecoInstituicao("");
    setEditingId(null);
  }

  function normalizarTexto(texto: string | null | undefined) {
    return (texto || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ");
  }

  async function instituicaoJaExisteNaCidadeBD() {
    const nomeNormalizado = normalizarTexto(nomeInstituicao);
    const enderecoNormalizado = normalizarTexto(enderecoInstituicao);

    const { data, error } = await supabase
      .from("instituicoes")
      .select("id, nome, endereco");

    if (error) {
      console.log("ERRO AO VERIFICAR INSTITUIÇÃO EXISTENTE:", error);
      abrirPopup(
        "Erro",
        "Não foi possível verificar se a instituição já existe.",
      );
      return null;
    }

    const lista = ((data as any) || []) as Instituicao[];

    return lista.find((instituicao) => {
      const mesmoNome = normalizarTexto(instituicao.nome) === nomeNormalizado;

      const mesmaCidadeOuEndereco =
        normalizarTexto(instituicao.endereco) === enderecoNormalizado;

      const naoEAMesmaEmEdicao = !editingId || instituicao.id !== editingId;

      return mesmoNome && mesmaCidadeOuEndereco && naoEAMesmaEmEdicao;
    });
  }

  async function guardarInstituicao() {
    if (aCriar) return;

    if (!nomeInstituicao.trim()) {
      abrirPopup("Erro", "Por favor, preenche o nome da instituição.");
      return;
    }

    if (!enderecoInstituicao.trim()) {
      abrirPopup("Erro", "Por favor, preenche o endereço ou cidade.");
      return;
    }

    const instituicaoExistente = await instituicaoJaExisteNaCidadeBD();

    if (instituicaoExistente === null) {
      return;
    }

    if (instituicaoExistente) {
      abrirPopup(
        "Instituição já existente",
        `Já existe uma instituição com este nome nesta cidade/endereço: ${instituicaoExistente.nome}.`,
      );
      return;
    }

    setACriar(true);

    let error: any = null;

    if (editingId) {
      const res = await supabase
        .from("instituicoes")
        .update({
          nome: nomeInstituicao.trim(),
          endereco: enderecoInstituicao.trim(),
        })
        .eq("id", editingId);

      error = res.error;
    } else {
      const res = await supabase.from("instituicoes").insert([
        {
          nome: nomeInstituicao.trim(),
          endereco: enderecoInstituicao.trim(),
          ativo: true,
        },
      ]);

      error = res.error;
    }

    setACriar(false);

    if (error) {
      console.log("ERRO AO GUARDAR INSTITUIÇÃO:", error);
      abrirPopup("Erro", error.message);
      return;
    }

    fecharModal();

    abrirPopup(
      "Sucesso",
      editingId
        ? "Instituição atualizada com sucesso."
        : "Instituição criada com sucesso.",
    );

    carregarInstituicoes();
  }

  function pedirAlterarAtivo(instituicao: Instituicao) {
    setInstituicaoSelecionada(instituicao);

    if (instituicao.ativo === false) {
      abrirPopup(
        "Ativar instituição",
        `Tens a certeza que queres ativar ${instituicao.nome}?`,
        "ativar",
      );
    } else {
      abrirPopup(
        "Inativar instituição",
        `Tens a certeza que queres colocar ${instituicao.nome} como inativa?`,
        "inativar",
      );
    }
  }

  async function confirmarAlterarAtivo() {
    if (!instituicaoSelecionada) return;

    const novoAtivo = instituicaoSelecionada.ativo === false;

    setPopupVisible(false);

    const { error } = await supabase
      .from("instituicoes")
      .update({ ativo: novoAtivo })
      .eq("id", instituicaoSelecionada.id);

    if (error) {
      console.log("ERRO AO ALTERAR ESTADO:", error);
      abrirPopup("Erro", "Não foi possível atualizar o estado da instituição.");
      return;
    }

    abrirPopup(
      "Sucesso",
      novoAtivo
        ? "Instituição ativada com sucesso."
        : "Instituição colocada como inativa.",
    );

    setInstituicaoSelecionada(null);
    carregarInstituicoes();
  }

  function pedirApagar(instituicao: Instituicao) {
    setInstituicaoSelecionada(instituicao);

    abrirPopup(
      "Apagar instituição",
      `Tens a certeza que queres apagar ${instituicao.nome}? Esta ação não pode ser desfeita.`,
      "apagar",
    );
  }

  async function confirmarApagar() {
    if (!instituicaoSelecionada) return;

    setPopupVisible(false);

    const { error } = await supabase
      .from("instituicoes")
      .delete()
      .eq("id", instituicaoSelecionada.id);

    if (error) {
      console.log("ERRO AO APAGAR INSTITUIÇÃO:", error);
      abrirPopup("Erro", "Não foi possível apagar a instituição.");
      return;
    }

    abrirPopup("Sucesso", "Instituição apagada com sucesso.");
    setInstituicaoSelecionada(null);
    carregarInstituicoes();
  }

  async function terminarSessao() {
    setPopupVisible(false);
    await supabase.auth.signOut();
    router.replace("/backoffice/superadmin/login/login" as any);
  }

  const instituicoesFiltradas = useMemo(() => {
    return instituicoes.filter((instituicao) => {
      const textoPesquisa = pesquisa.toLowerCase().trim();

      const correspondePesquisa =
        textoPesquisa === "" ||
        instituicao.nome?.toLowerCase().includes(textoPesquisa) ||
        instituicao.endereco?.toLowerCase().includes(textoPesquisa);

      const correspondeEstado =
        filtroAtivo === "todas"
          ? true
          : filtroAtivo === "ativas"
            ? instituicao.ativo !== false
            : instituicao.ativo === false;

      return correspondePesquisa && correspondeEstado;
    });
  }, [instituicoes, pesquisa, filtroAtivo]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(instituicoesFiltradas.length / itensPorPagina),
  );

  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;

  const instituicoesPaginadas = instituicoesFiltradas.slice(inicio, fim);

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
            style={[styles.menuItem, styles.menuItemActive]}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/instituicoes/instituicoes" as any,
              )
            }
          >
            <Ionicons name="business-outline" size={23} color="#160909" />
            {sidebarAberta && (
              <Text style={[styles.menuText, styles.menuTextActive]}>
                Instituições
              </Text>
            )}
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
              <Text style={styles.titulo}>Instituições</Text>
              <Text style={styles.subtitulo}>
                Gerir hospitais, unidades e instituições parceiras.
              </Text>
            </View>
          </View>

          <Pressable style={styles.botaoCriarHeader} onPress={abrirModalCriar}>
            <Ionicons name="add-outline" size={22} color="#160909" />
            <Text style={styles.textoBotaoCriar}>Criar instituição</Text>
          </Pressable>
        </View>

        <View style={styles.filtrosCard}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={22} color="#777" />
            <TextInput
              placeholder="Pesquisar por nome ou endereço..."
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
              style={styles.selectToggle}
              onPress={() => setShowFiltroAtivo(!showFiltroAtivo)}
            >
              <Text style={styles.selectToggleText}>
                {filtroAtivo === "ativas"
                  ? "Ativas"
                  : filtroAtivo === "inativas"
                    ? "Inativas"
                    : "Todas"}
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
                    setFiltroAtivo("ativas");
                    setPaginaAtual(1);
                    setShowFiltroAtivo(false);
                  }}
                >
                  <Text style={styles.dropdownOptionText}>Ativas</Text>
                </Pressable>

                <Pressable
                  style={styles.dropdownOption}
                  onPress={() => {
                    setFiltroAtivo("inativas");
                    setPaginaAtual(1);
                    setShowFiltroAtivo(false);
                  }}
                >
                  <Text style={styles.dropdownOptionText}>Inativas</Text>
                </Pressable>

                <Pressable
                  style={styles.dropdownOption}
                  onPress={() => {
                    setFiltroAtivo("todas");
                    setPaginaAtual(1);
                    setShowFiltroAtivo(false);
                  }}
                >
                  <Text style={styles.dropdownOptionText}>Todas</Text>
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
        ) : instituicoesFiltradas.length === 0 ? (
          <View style={styles.vazioContainer}>
            <Ionicons name="business-outline" size={52} color="#FDB515" />
            <Text style={styles.textoVazio}>
              Não existem instituições para mostrar.
            </Text>
          </View>
        ) : (
          <View style={styles.tabelaCard}>
            <View style={styles.tabelaHeader}>
              <Text style={[styles.th, styles.colNome]}>Instituição</Text>
              <Text style={[styles.th, styles.colEndereco]}>Endereço</Text>
              <Text style={[styles.th, styles.colEstado]}>Estado</Text>
              <Text style={[styles.th, styles.colAcoes]}>Ações</Text>
            </View>

            {instituicoesPaginadas.map((instituicao) => (
              <View key={instituicao.id} style={styles.tabelaLinha}>
                <Text style={[styles.tdNome, styles.colNome]}>
                  {instituicao.nome}
                </Text>

                <Text style={[styles.td, styles.colEndereco]}>
                  {instituicao.endereco || "Sem endereço definido"}
                </Text>

                <View style={styles.colEstado}>
                  <Text
                    style={[
                      styles.estadoBadge,
                      instituicao.ativo === false && styles.estadoBadgeInativo,
                    ]}
                  >
                    {instituicao.ativo === false ? "Inativa" : "Ativa"}
                  </Text>
                </View>

                <View style={[styles.acoes, styles.colAcoes]}>
                  <Pressable
                    style={styles.acaoBotao}
                    onPress={() => abrirModalEditar(instituicao)}
                  >
                    <Ionicons name="pencil-outline" size={19} color="#160909" />
                  </Pressable>

                  <Pressable
                    style={styles.acaoBotao}
                    onPress={() => pedirAlterarAtivo(instituicao)}
                  >
                    <Ionicons
                      name={
                        instituicao.ativo === false
                          ? "refresh-outline"
                          : "ban-outline"
                      }
                      size={19}
                      color="#160909"
                    />
                  </Pressable>

                  <Pressable
                    style={styles.acaoBotaoPerigo}
                    onPress={() => pedirApagar(instituicao)}
                  >
                    <Ionicons name="trash-outline" size={19} color="#FFFFFF" />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.paginacaoCard}>
          <View style={styles.paginacaoInfo}>
            <Text style={styles.paginacaoTexto}>
              A mostrar {inicio + 1}-
              {Math.min(fim, instituicoesFiltradas.length)} de{" "}
              {instituicoesFiltradas.length}
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

                  <Pressable
                    style={styles.porPaginaOpcao}
                    onPress={() => mudarItensPorPagina(20)}
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
              {editingId ? "Editar Instituição" : "Criar Instituição"}
            </Text>

            <Text style={styles.label}>Nome da instituição</Text>
            <TextInput
              placeholder="Nome da instituição"
              placeholderTextColor="#8c8787"
              style={styles.modalInput}
              value={nomeInstituicao}
              onChangeText={setNomeInstituicao}
            />

            <Text style={styles.label}>Endereço</Text>
            <TextInput
              placeholder="Endereço da instituição"
              placeholderTextColor="#8c8787"
              style={styles.modalInput}
              value={enderecoInstituicao}
              onChangeText={setEnderecoInstituicao}
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
                onPress={guardarInstituicao}
                disabled={aCriar}
              >
                <Text style={styles.popupTextoConfirmar}>
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
