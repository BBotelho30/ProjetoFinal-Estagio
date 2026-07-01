import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../../../lib/supabase";
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
  ensinos_clinicos?: { id: number; nome: string };
  instituicoes?: { id: number; nome: string };
  servicos?: { id: number; nome: string };
};

export default function Estagios() {
  const [edicoes, setEdicoes] = useState<EdicaoEstagio[]>([]);
  const [loading, setLoading] = useState(true);

  const [pesquisa, setPesquisa] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filtroEstagio, setFiltroEstagio] = useState("todos");

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
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

  const [ensinos, setEnsinos] = useState<Array<{ id: number; nome: string }>>([]);
  const [instituicoes, setInstituicoes] = useState<Array<{ id: number; nome: string }>>([]);
  const [servicos, setServicos] = useState<Array<{ id: number; nome: string; instituicao_id: number }>>([]);

  const [ensinoSelecionado, setEnsinoSelecionado] = useState<number | null>(null);
  const [instituicaoSelecionada, setInstituicaoSelecionada] = useState<number | null>(null);
  const [servicoSelecionado, setServicoSelecionado] = useState<number | null>(null);

  const [ensinoOpen, setEnsinoOpen] = useState(false);
  const [instituicaoOpen, setInstituicaoOpen] = useState(false);
  const [servicoOpen, setServicoOpen] = useState(false);
  const [reposicaoOpen, setReposicaoOpen] = useState(false);

  const [popupVisivel, setPopupVisivel] = useState(false);
  const [popupTitulo, setPopupTitulo] = useState("");
  const [popupMensagem, setPopupMensagem] = useState("");

  function mostrarPopup(titulo: string, mensagem: string) {
    setPopupTitulo(titulo);
    setPopupMensagem(mensagem);
    setPopupVisivel(true);
  }

  async function carregarEdicoes() {
    setLoading(true);

    const { data, error } = await supabase
      .from("edicoes_estagio")
      .select(`
        id,
        ano_letivo,
        vagas,
        data_inicio,
        data_fim,
        estado,
        permite_reposicao_horas,
        limite_faltas_percentagem,
        max_horas_dia,
        ensinos_clinicos(id, nome),
        instituicoes(id, nome),
        servicos(id, nome)
      `)
      .order("id", { ascending: false });

    if (error) {
      console.log("ERRO AO CARREGAR EDIÇÕES:", error);
      mostrarPopup("Erro", "Não foi possível carregar as edições de estágio.");
    } else {
      setEdicoes((data as any) || []);
    }

    setLoading(false);
  }

  async function carregarOpcoes() {
    const { data: ensData } = await supabase
      .from("ensinos_clinicos")
      .select("id, nome")
      .order("id", { ascending: true });

    const { data: instData } = await supabase
      .from("instituicoes")
      .select("id, nome")
      .order("nome", { ascending: true });

    const { data: servData } = await supabase
      .from("servicos")
      .select("id, nome, instituicao_id")
      .order("nome", { ascending: true });

    setEnsinos(ensData || []);
    setInstituicoes(instData || []);
    setServicos(servData || []);
  }

  useEffect(() => {
    carregarEdicoes();
  }, []);

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

    setModalVisivel(true);
  }

  async function salvarEdicao() {
    if (salvando || !editingId) return;

    if (!anoLetivoForm.trim() || !vagasForm.trim()) {
      mostrarPopup("Erro", "Preenche o ano letivo e o número de vagas.");
      return;
    }

    if (!limiteFaltas.trim() || !maxHorasDia.trim()) {
      mostrarPopup("Erro", "Preenche o limite de faltas e o máximo de horas por dia.");
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
    if (instituicaoSelecionada) updateData.instituicao_id = instituicaoSelecionada;
    if (servicoSelecionado) updateData.servico_id = servicoSelecionado;

    const { error } = await supabase
      .from("edicoes_estagio")
      .update(updateData)
      .eq("id", editingId);

    setSalvando(false);

    if (error) {
      console.log("ERRO AO ATUALIZAR EDIÇÃO:", error);
      mostrarPopup("Erro", "Não foi possível atualizar a edição.");
      return;
    }

    setModalVisivel(false);
    setEditingId(null);
    mostrarPopup("Sucesso", "Edição atualizada com sucesso.");
    carregarEdicoes();
  }

  async function confirmarApagar() {
    if (!confirmDeleteId) return;

    const id = confirmDeleteId;
    setConfirmDeleteId(null);

    const { error } = await supabase
      .from("edicoes_estagio")
      .delete()
      .eq("id", id);

    if (error) {
      console.log("ERRO AO APAGAR EDIÇÃO:", error);
      mostrarPopup("Erro", "Não foi possível apagar a edição de estágio.");
      return;
    }

    mostrarPopup("Sucesso", "Edição apagada.");
    carregarEdicoes();
  }

function corBarra(idEstagio?: number) {
  const cores = [
    "#FDB515",
    "#8EC5FC",
    "#CDB4DB",
    "#B8E0D2",
    "#FFADAD",
    "#F4A261",
    "#A8DADC",
    "#E5989B",
    "#DDBEA9",
  ];

  if (!idEstagio) return "#FDB515";

  return cores[(idEstagio - 1) % cores.length];
}

  const edicoesFiltradas = edicoes.filter((edicao) => {
    const texto = pesquisa.toLowerCase();

    const correspondePesquisa =
      edicao.ensinos_clinicos?.nome?.toLowerCase().includes(texto) ||
      edicao.instituicoes?.nome?.toLowerCase().includes(texto) ||
      edicao.servicos?.nome?.toLowerCase().includes(texto) ||
      edicao.ano_letivo?.toLowerCase().includes(texto);

  
    const correspondeEstagio =
      filtroEstagio === "todos"
        ? true
        : edicao.ensinos_clinicos?.nome === filtroEstagio;

    return correspondePesquisa && correspondeEstagio;
  });

    const nomesEstagios = Array.from(
    new Set(
      edicoes
        .map((edicao) => edicao.ensinos_clinicos?.nome)
        .filter(Boolean)
    )
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable
        style={styles.voltar}
        onPress={() => router.push("/superadmin/home" as any)}
      >
        <Ionicons name="arrow-back-outline" size={24} color="#160909" />
        <Text style={styles.voltarTexto}>Voltar</Text>
      </Pressable>

      <Text style={styles.titulo}>Edições de Estágio</Text>

      <Text style={styles.subtitulo}>
        Criar e consultar vagas por ensino clínico, instituição e serviço.
      </Text>

      <Pressable
        style={styles.botao}
        onPress={() => router.push("/superadmin/editarEstagio/criar-estagio" as any)}
      >
        <Text style={styles.textoBotaoCriar}>Criar edição</Text>
      </Pressable>

      <View style={styles.topRow}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={24} color="#777" />
          <TextInput
            placeholder="Pesquisar"
            placeholderTextColor="#8c8787"
            style={styles.searchInput}
            value={pesquisa}
            onChangeText={setPesquisa}
          />
        </View>

        <Pressable
          style={styles.filterToggle}
          onPress={() => setShowFilters((s) => !s)}
        >
          <Text style={styles.filterToggleText}>Filtrar</Text>
          <Ionicons
            name={showFilters ? "chevron-up-outline" : "chevron-down-outline"}
            size={18}
            color="#160909"
          />
        </Pressable>
      </View>

      {showFilters && (
        <View style={styles.filterDropdown}>
                <Pressable style={[styles.filterOption, filtroEstagio === "todos" && styles.filterOptionActive,]} onPress={() => { setFiltroEstagio("todos");
          setShowFilters(false);
        }}>
        <Text style={[styles.filterOptionText, filtroEstagio === "todos" && styles.filterOptionTextActive,]}>
          Todos
        </Text>
      </Pressable>

      {nomesEstagios.map((nome) => (
        <Pressable
          key={nome}
          style={[
            styles.filterOption,
            filtroEstagio === nome && styles.filterOptionActive,
          ]}
          onPress={() => {
            setFiltroEstagio(nome as string);
            setShowFilters(false);
          }}
        >
          <Text
            style={[
              styles.filterOptionText,
              filtroEstagio === nome && styles.filterOptionTextActive,
            ]}
          >
            {nome}
          </Text>
        </Pressable>
      ))}
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#FDB515" style={{ marginTop: 30 }} />
      ) : edicoesFiltradas.length === 0 ? (
        <Text style={styles.textoVazio}>Ainda não existem edições de estágio.</Text>
      ) : (
        <View style={styles.lista}>
          {edicoesFiltradas.map((edicao) => (
        <View
          key={edicao.id}
          style={[
            styles.card,
            {
              borderLeftColor: corBarra(
                edicao.ensinos_clinicos?.id
              ),
            },
          ]}
        >
              <View style={styles.cardTopo}>
                <View style={styles.cardIcone}>
                  <Ionicons name="calendar-outline" size={28} color="#160909" />
                </View>

                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitulo}>
                    {edicao.ensinos_clinicos?.nome || "Ensino Clínico"}
                  </Text>

                  <Text style={styles.cardSubtitulo}>
                    {edicao.ano_letivo} · {edicao.vagas} vagas
                  </Text>
                </View>
              </View>

              <Text style={styles.cardTexto}>
                Instituição: {edicao.instituicoes?.nome || "Sem instituição"}
              </Text>

              <Text style={styles.cardTexto}>
                Serviço: {edicao.servicos?.nome || "Sem serviço"}
              </Text>

              <Text style={styles.cardTexto}>
                Período: {edicao.data_inicio || "sem data"} até{" "}
                {edicao.data_fim || "sem data"}
              </Text>

              <Text style={styles.cardTexto}>
                Reposição de horas: {edicao.permite_reposicao_horas ? "Sim" : "Não"}
              </Text>

              <Text style={styles.cardTexto}>
                Limite de faltas: {edicao.limite_faltas_percentagem || 15}% · Máx.{" "}
                {edicao.max_horas_dia || 7}h/dia
              </Text>

              <Text style={styles.estado}>Estado: {edicao.estado}</Text>

              <View style={styles.cardActions}>
                <Pressable
                  style={[styles.actionButton, styles.actionEdit]}
                  onPress={() => abrirEditar(edicao)}
                >
                  <Ionicons name="pencil-outline" size={18} color="#160909" />
                  <Text style={styles.actionText}>Editar</Text>
                </Pressable>

                <Pressable
                  style={[styles.actionButton, styles.actionDelete]}
                  onPress={() => setConfirmDeleteId(edicao.id)}
                >
                  <Ionicons name="trash-outline" size={18} color="#fff" />
                  <Text style={[styles.actionText, { color: "#fff" }]}>
                    Apagar
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}

      <Modal visible={modalVisivel} transparent animationType="fade">
        <View style={styles.modalOverlay}>
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
                  name={ensinoOpen ? "chevron-up-outline" : "chevron-down-outline"}
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
                        ensinoSelecionado === ensino.id && styles.opcaoSelecionada,
                      ]}
                      onPress={() => {
                        setEnsinoSelecionado(ensino.id);
                        setEnsinoOpen(false);
                      }}
                    >
                      <Text style={styles.opcaoTexto}>{ensino.nome}</Text>
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
                    ? instituicoes.find((i) => i.id === instituicaoSelecionada)?.nome
                    : "Selecionar instituição..."}
                </Text>
                <Ionicons
                  name={instituicaoOpen ? "chevron-up-outline" : "chevron-down-outline"}
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
                  name={servicoOpen ? "chevron-up-outline" : "chevron-down-outline"}
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
                          servicoSelecionado === servico.id && styles.opcaoSelecionada,
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
                  name={reposicaoOpen ? "chevron-up-outline" : "chevron-down-outline"}
                  size={22}
                  color="#160909"
                />
              </Pressable>

              {reposicaoOpen && (
                <View style={styles.dropdown}>
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

              <View style={styles.modalBotoes}>
                <Pressable
                  style={styles.modalBotaoCancelar}
                  onPress={() => {
                    setModalVisivel(false);
                    setEditingId(null);
                  }}
                >
                  <Text style={styles.modalBotaoTexto}>Cancelar</Text>
                </Pressable>

                <Pressable
                  style={styles.modalBotaoCriar}
                  onPress={salvarEdicao}
                  disabled={salvando}
                >
                  <Text style={styles.modalBotaoTextoEscuro}>
                    {salvando ? "A gravar..." : "Salvar"}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={confirmDeleteId !== null} transparent animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>Confirmar eliminação</Text>
            <Text style={styles.popupMessage}>
              Tens a certeza que queres apagar esta edição de estágio?
            </Text>

            <View style={styles.modalBotoes}>
              <Pressable
                style={styles.modalBotaoCancelar}
                onPress={() => setConfirmDeleteId(null)}
              >
                <Text style={styles.modalBotaoTexto}>Cancelar</Text>
              </Pressable>

              <Pressable style={styles.modalBotaoApagar} onPress={confirmarApagar}>
                <Text style={styles.modalBotaoTexto}>Apagar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={popupVisivel} transparent animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>{popupTitulo}</Text>
            <Text style={styles.popupMessage}>{popupMensagem}</Text>

            <Pressable
              style={styles.popupOkButton}
              onPress={() => setPopupVisivel(false)}
            >
              <Text style={styles.popupOkText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}