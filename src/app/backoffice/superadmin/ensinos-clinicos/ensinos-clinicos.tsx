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
import styles from "./clinicosStyle";

type EnsinoClinico = {
  id: number;
  nome: string;
  ano_curricular: number;
  semestre: number;
  tipo: string;
  horas_estimadas: number;
  descricao: string | null;
  ativo: boolean | null;
};

export default function EnsinosClinicos() {
  const [sidebarAberta, setSidebarAberta] = useState(true);
  const contasPendentes = useContasPendentes();

  const [ensinos, setEnsinos] = useState<EnsinoClinico[]>([]);
  const [loading, setLoading] = useState(true);
  const [aGuardar, setAGuardar] = useState(false);

  const [modalVisivel, setModalVisivel] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [novoNome, setNovoNome] = useState("");
  const [novoAno, setNovoAno] = useState("");
  const [novoSemestre, setNovoSemestre] = useState("");
  const [novoTipo, setNovoTipo] = useState("Contacto ou tutorial");
  const [novasHoras, setNovasHoras] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");

  const [pesquisa, setPesquisa] = useState("");
  const [filtroAno, setFiltroAno] = useState("todos");
  const [filtroAtivo, setFiltroAtivo] = useState<
    "ativos" | "inativos" | "todos"
  >("ativos");

  const [showFiltroAno, setShowFiltroAno] = useState(false);
  const [showFiltroAtivo, setShowFiltroAtivo] = useState(false);

  const [ensinoAberto, setEnsinoAberto] = useState<number | null>(null);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(15);
  const [showPorPagina, setShowPorPagina] = useState(false);

  const [ensinoSelecionado, setEnsinoSelecionado] =
    useState<EnsinoClinico | null>(null);

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTipo, setPopupTipo] = useState<
    "normal" | "sair" | "apagar" | "inativar" | "ativar"
  >("normal");

  useEffect(() => {
    carregarEnsinosClinicos();
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

  async function carregarEnsinosClinicos() {
    setLoading(true);

    const { data, error } = await supabase
      .from("ensinos_clinicos")
      .select(
        "id, nome, ano_curricular, semestre, tipo, horas_estimadas, descricao, ativo",
      )
      .order("ano_curricular", { ascending: true })
      .order("semestre", { ascending: true })
      .order("nome", { ascending: true });

    if (error) {
      console.log("ERRO AO CARREGAR ENSINOS:", error);
      abrirPopup("Erro", "Não foi possível carregar os ensinos clínicos.");
    } else {
      setEnsinos(data || []);
    }

    setLoading(false);
  }

  function abrirModalCriar() {
    setEditingId(null);
    setNovoNome("");
    setNovoAno("");
    setNovoSemestre("");
    setNovoTipo("Contacto ou tutorial");
    setNovasHoras("");
    setNovaDescricao("");
    setModalVisivel(true);
  }

  function abrirModalEditar(ensino: EnsinoClinico) {
    setEditingId(ensino.id);
    setNovoNome(ensino.nome || "");
    setNovoAno(String(ensino.ano_curricular || ""));
    setNovoSemestre(String(ensino.semestre || ""));
    setNovoTipo(ensino.tipo || "Contacto ou tutorial");
    setNovasHoras(String(ensino.horas_estimadas || ""));
    setNovaDescricao(ensino.descricao || "");
    setModalVisivel(true);
  }

  function fecharModal() {
    setModalVisivel(false);
    setEditingId(null);
    setNovoNome("");
    setNovoAno("");
    setNovoSemestre("");
    setNovoTipo("Contacto ou tutorial");
    setNovasHoras("");
    setNovaDescricao("");
  }

  async function guardarEnsinoClinico() {
    if (aGuardar) return;

    if (!novoNome.trim()) {
      abrirPopup("Erro", "Preenche o nome do ensino clínico.");
      return;
    }

    if (!novoAno.trim() || Number.isNaN(Number(novoAno))) {
      abrirPopup("Erro", "Preenche corretamente o ano curricular.");
      return;
    }

    if (!novoSemestre.trim() || Number.isNaN(Number(novoSemestre))) {
      abrirPopup("Erro", "Preenche corretamente o semestre.");
      return;
    }

    if (!novasHoras.trim() || Number.isNaN(Number(novasHoras))) {
      abrirPopup("Erro", "Preenche corretamente as horas estimadas.");
      return;
    }

    setAGuardar(true);

    let error: any = null;

    if (editingId) {
      const res = await supabase
        .from("ensinos_clinicos")
        .update({
          nome: novoNome.trim(),
          ano_curricular: Number(novoAno),
          semestre: Number(novoSemestre),
          tipo: novoTipo,
          horas_estimadas: Number(novasHoras),
          descricao: novaDescricao.trim() || null,
        })
        .eq("id", editingId);

      error = res.error;
    } else {
      const res = await supabase.from("ensinos_clinicos").insert([
        {
          nome: novoNome.trim(),
          ano_curricular: Number(novoAno),
          semestre: Number(novoSemestre),
          tipo: novoTipo,
          horas_estimadas: Number(novasHoras),
          descricao: novaDescricao.trim() || null,
          ativo: true,
        },
      ]);

      error = res.error;
    }

    setAGuardar(false);

    if (error) {
      console.log("ERRO AO GUARDAR ENSINO:", error);
      abrirPopup("Erro", error.message || "Não foi possível guardar.");
      return;
    }

    fecharModal();

    abrirPopup(
      "Sucesso",
      editingId
        ? "Ensino clínico atualizado com sucesso."
        : "Ensino clínico criado com sucesso.",
    );

    carregarEnsinosClinicos();
  }

  function pedirAlterarAtivo(ensino: EnsinoClinico) {
    setEnsinoSelecionado(ensino);

    if (ensino.ativo === false) {
      abrirPopup(
        "Ativar ensino clínico",
        `Tens a certeza que queres ativar "${ensino.nome}"?`,
        "ativar",
      );
    } else {
      abrirPopup(
        "Inativar ensino clínico",
        `Tens a certeza que queres colocar "${ensino.nome}" como inativo?`,
        "inativar",
      );
    }
  }

  async function confirmarAlterarAtivo() {
    if (!ensinoSelecionado) return;

    const novoEstado = ensinoSelecionado.ativo === false;

    setPopupVisible(false);

    const { error } = await supabase
      .from("ensinos_clinicos")
      .update({ ativo: novoEstado })
      .eq("id", ensinoSelecionado.id);

    if (error) {
      console.log("ERRO AO ALTERAR ESTADO:", error);
      abrirPopup(
        "Erro",
        "Não foi possível alterar o estado do ensino clínico.",
      );
      return;
    }

    abrirPopup(
      "Sucesso",
      novoEstado
        ? "Ensino clínico ativado com sucesso."
        : "Ensino clínico colocado como inativo.",
    );

    setEnsinoSelecionado(null);
    carregarEnsinosClinicos();
  }

  function pedirApagar(ensino: EnsinoClinico) {
    setEnsinoSelecionado(ensino);

    abrirPopup(
      "Apagar ensino clínico",
      `Tens a certeza que queres apagar "${ensino.nome}"? Esta ação não pode ser desfeita.`,
      "apagar",
    );
  }

  async function confirmarApagar() {
    if (!ensinoSelecionado) return;

    setPopupVisible(false);

    const { error } = await supabase
      .from("ensinos_clinicos")
      .delete()
      .eq("id", ensinoSelecionado.id);

    if (error) {
      console.log("ERRO AO APAGAR ENSINO:", error);
      abrirPopup("Erro", "Não foi possível apagar o ensino clínico.");
      return;
    }

    abrirPopup("Sucesso", "Ensino clínico apagado com sucesso.");
    setEnsinoSelecionado(null);
    carregarEnsinosClinicos();
  }

  async function terminarSessao() {
    setPopupVisible(false);
    await supabase.auth.signOut();
    router.replace("/backoffice/login" as any);
  }

  const ensinosFiltrados = useMemo(() => {
    return ensinos.filter((ensino) => {
      const textoPesquisa = pesquisa.toLowerCase().trim();

      const correspondePesquisa =
        textoPesquisa === "" ||
        ensino.nome?.toLowerCase().includes(textoPesquisa) ||
        ensino.tipo?.toLowerCase().includes(textoPesquisa) ||
        ensino.descricao?.toLowerCase().includes(textoPesquisa);

      const correspondeAno =
        filtroAno === "todos"
          ? true
          : ensino.ano_curricular === Number(filtroAno);

      const correspondeAtivo =
        filtroAtivo === "todos"
          ? true
          : filtroAtivo === "ativos"
            ? ensino.ativo !== false
            : ensino.ativo === false;

      return correspondePesquisa && correspondeAno && correspondeAtivo;
    });
  }, [ensinos, pesquisa, filtroAno, filtroAtivo]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(ensinosFiltrados.length / itensPorPagina),
  );

  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;

  const ensinosPaginados = ensinosFiltrados.slice(inicio, fim);

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
            style={[styles.menuItem, styles.menuItemActive]}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/ensinos-clinicos/ensinos-clinicos" as any,
              )
            }
          >
            <Ionicons name="school-outline" size={23} color="#160909" />
            {sidebarAberta && (
              <Text style={[styles.menuText, styles.menuTextActive]}>
                Ensinos Clínicos
              </Text>
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
              <Text style={styles.titulo}>Ensinos Clínicos</Text>
              <Text style={styles.subtitulo}>
                Gerir os ensinos clínicos da Licenciatura em Enfermagem.
              </Text>
            </View>
          </View>

          <Pressable style={styles.botaoCriarHeader} onPress={abrirModalCriar}>
            <Ionicons name="add-outline" size={22} color="#160909" />
            <Text style={styles.textoBotaoCriar}>Criar ensino</Text>
          </Pressable>
        </View>

        <View style={styles.filtrosCard}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={22} color="#777" />

            <TextInput
              placeholder="Pesquisar por nome, descrição ou tipo..."
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
                style={styles.selectToggle}
                onPress={() => {
                  setShowFiltroAno(!showFiltroAno);
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
        ) : ensinosFiltrados.length === 0 ? (
          <View style={styles.vazioContainer}>
            <Ionicons name="school-outline" size={52} color="#FDB515" />
            <Text style={styles.textoVazio}>
              Não existem ensinos clínicos para mostrar.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.tabelaCard}>
              <View style={styles.tabelaHeader}>
                <Text style={[styles.th, styles.colNome]}>Ensino Clínico</Text>
                <Text style={[styles.th, styles.colAno]}>Ano</Text>
                <Text style={[styles.th, styles.colSemestre]}>Semestre</Text>
                <Text style={[styles.th, styles.colDescricao]}>Descrição</Text>
                <Text style={[styles.th, styles.colAcoes]}>Ações</Text>
              </View>

              {ensinosPaginados.map((ensino) => {
                const aberto = ensinoAberto === ensino.id;

                return (
                  <View key={ensino.id} style={styles.linhaContainer}>
                    <View style={styles.tabelaLinha}>
                      <Text style={[styles.tdNome, styles.colNome]}>
                        {ensino.nome}
                      </Text>

                      <Text style={[styles.td, styles.colAno]}>
                        {ensino.ano_curricular}.º ano
                      </Text>

                      <Text style={[styles.td, styles.colSemestre]}>
                        {ensino.semestre}.º semestre
                      </Text>

                      <Text
                        style={[styles.td, styles.colDescricao]}
                        numberOfLines={1}
                      >
                        {ensino.descricao || "Sem descrição"}
                      </Text>

                      <View style={[styles.acoes, styles.colAcoes]}>
                        <Pressable
                          style={styles.acaoBotao}
                          onPress={() =>
                            setEnsinoAberto(aberto ? null : ensino.id)
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
                          onPress={() => abrirModalEditar(ensino)}
                        >
                          <Ionicons
                            name="pencil-outline"
                            size={19}
                            color="#160909"
                          />
                        </Pressable>

                        <Pressable
                          style={styles.acaoBotao}
                          onPress={() => pedirAlterarAtivo(ensino)}
                        >
                          <Ionicons
                            name={
                              ensino.ativo === false
                                ? "refresh-outline"
                                : "ban-outline"
                            }
                            size={19}
                            color="#160909"
                          />
                        </Pressable>

                        <Pressable
                          style={styles.acaoBotaoPerigo}
                          onPress={() => pedirApagar(ensino)}
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
                          <Text style={styles.detalheLabel}>Tipo</Text>
                          <Text style={styles.detalheValor}>
                            {ensino.tipo || "Não indicado"}
                          </Text>
                        </View>

                        <View style={styles.detalheItem}>
                          <Text style={styles.detalheLabel}>
                            Horas estimadas
                          </Text>
                          <Text style={styles.detalheValor}>
                            {ensino.horas_estimadas} horas
                          </Text>
                        </View>

                        <View style={styles.detalheItem}>
                          <Text style={styles.detalheLabel}>Estado</Text>
                          <Text
                            style={[
                              styles.estadoTexto,
                              ensino.ativo === false &&
                                styles.estadoTextoInativo,
                            ]}
                          >
                            {ensino.ativo === false ? "Inativo" : "Ativo"}
                          </Text>
                        </View>

                        <View style={styles.detalheItemFull}>
                          <Text style={styles.detalheLabel}>
                            Descrição completa
                          </Text>
                          <Text style={styles.detalheValor}>
                            {ensino.descricao || "Sem descrição definida."}
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
                  A mostrar {ensinosFiltrados.length === 0 ? 0 : inicio + 1}-
                  {Math.min(fim, ensinosFiltrados.length)} de{" "}
                  {ensinosFiltrados.length}
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
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitulo}>
                {editingId ? "Editar Ensino Clínico" : "Criar Ensino Clínico"}
              </Text>

              <TextInput
                placeholder="Nome do ensino clínico"
                placeholderTextColor="#8c8787"
                style={styles.modalInput}
                value={novoNome}
                onChangeText={setNovoNome}
              />

              <TextInput
                placeholder="Ano curricular"
                placeholderTextColor="#8c8787"
                style={styles.modalInput}
                value={novoAno}
                onChangeText={setNovoAno}
                keyboardType="numeric"
              />

              <TextInput
                placeholder="Semestre"
                placeholderTextColor="#8c8787"
                style={styles.modalInput}
                value={novoSemestre}
                onChangeText={setNovoSemestre}
                keyboardType="numeric"
              />

              <Text style={styles.tipoTitulo}>Tipo</Text>

              <View style={styles.tipoContainer}>
                <Pressable
                  style={[
                    styles.tipoOpcao,
                    novoTipo === "Contacto" && styles.tipoOpcaoSelecionada,
                  ]}
                  onPress={() => setNovoTipo("Contacto")}
                >
                  <Text style={styles.tipoTexto}>Contacto</Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.tipoOpcao,
                    novoTipo === "Tutorial" && styles.tipoOpcaoSelecionada,
                  ]}
                  onPress={() => setNovoTipo("Tutorial")}
                >
                  <Text style={styles.tipoTexto}>Tutorial</Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.tipoOpcao,
                    novoTipo === "Contacto ou tutorial" &&
                      styles.tipoOpcaoSelecionada,
                  ]}
                  onPress={() => setNovoTipo("Contacto ou tutorial")}
                >
                  <Text style={styles.tipoTexto}>Ambos</Text>
                </Pressable>
              </View>

              <TextInput
                placeholder="Horas estimadas"
                placeholderTextColor="#8c8787"
                style={styles.modalInput}
                value={novasHoras}
                onChangeText={setNovasHoras}
                keyboardType="numeric"
              />

              <TextInput
                placeholder="Descrição"
                placeholderTextColor="#8c8787"
                style={[styles.modalInput, styles.modalInputDescricao]}
                value={novaDescricao}
                onChangeText={setNovaDescricao}
                multiline
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
                  onPress={guardarEnsinoClinico}
                  disabled={aGuardar}
                >
                  <Text style={styles.popupTextoConfirmar}>
                    {aGuardar
                      ? editingId
                        ? "A gravar..."
                        : "A criar..."
                      : editingId
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
