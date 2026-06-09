import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  ensinos_clinicos?: {
    nome: string;
  };
  instituicoes?: {
    nome: string;
  };
  servicos?: {
    nome: string;
  };
};


export default function Estagios() {
  const [edicoes, setEdicoes] = useState<EdicaoEstagio[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [anoLetivoForm, setAnoLetivoForm] = useState("");
  const [vagasForm, setVagasForm] = useState("");
  const [dataInicioForm, setDataInicioForm] = useState("");
  const [dataFimForm, setDataFimForm] = useState("");
  const [salvando, setSalvando] = useState(false);
  // opções para selects
  const [ensinos, setEnsinos] = useState<Array<{ id: number; nome: string }>>(
    [],
  );
  const [instituicoes, setInstituicoes] = useState<
    Array<{ id: number; nome: string }>
  >([]);
  const [servicos, setServicos] = useState<
    Array<{ id: number; nome: string; instituicao_id: number }>
  >([]);

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
        ensinos_clinicos(id, nome),
        instituicoes(id, nome),
        servicos(id, nome)
      `,
      )
      .order("id", { ascending: false });

    if (error) {
      console.log("ERRO AO CARREGAR EDIÇÕES:", error);
      Alert.alert("Erro", "Não foi possível carregar as edições de estágio.");
    } else {
      setEdicoes((data as any) || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    carregarEdicoes();
  }, []);

  async function salvarEdicao() {
    if (salvando) return;
    if (!editingId) return;

    if (!anoLetivoForm.trim() || !vagasForm.trim()) {
      Alert.alert("Erro", "Preenche o ano letivo e o número de vagas.");
      return;
    }

    setSalvando(true);

    const updateData: any = {
      ano_letivo: anoLetivoForm.trim(),
      vagas: Number(vagasForm),
      data_inicio: dataInicioForm.trim() || null,
      data_fim: dataFimForm.trim() || null,
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
      Alert.alert("Erro", "Não foi possível atualizar a edição.");
      return;
    }

    Alert.alert("Sucesso", "Edição atualizada com sucesso.");
    setModalVisivel(false);
    setEditingId(null);
    setAnoLetivoForm("");
    setVagasForm("");
    setDataInicioForm("");
    setDataFimForm("");
    setEnsinoSelecionado(null);
    setInstituicaoSelecionada(null);
    setServicoSelecionado(null);
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
      Alert.alert("Erro", "Não foi possível apagar a edição de estágio.");
      return;
    }

    Alert.alert("Sucesso", "Edição apagada.");
    carregarEdicoes();
  }

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
        onPress={() =>
          router.push("/superadmin/editarEstagio/criar-estagio" as any)
        }
      >
        <Text style={styles.textoBotaoCriar}>Criar edição</Text>
      </Pressable>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#FDB515"
          style={{ marginTop: 30 }}
        />
      ) : edicoes.length === 0 ? (
        <Text style={styles.textoVazio}>
          Ainda não existem edições de estágio criadas.
        </Text>
      ) : (
        <View style={styles.lista}>
          {edicoes.map((edicao) => (
            <View key={edicao.id} style={styles.card}>
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
                {`Período: ${edicao.data_inicio || "sem data"} até ${edicao.data_fim || "sem data"}`}
              </Text>

              <Text style={styles.estado}>Estado: {edicao.estado}</Text>
              <View style={styles.cardActions}>
                <Pressable
                  style={[styles.actionButton, styles.actionEdit]}
                  onPress={() => {
                    // abrir modal de edição e preencher campos
                    setEditingId(edicao.id);
                    setAnoLetivoForm(edicao.ano_letivo || "");
                    setVagasForm(String(edicao.vagas || ""));
                    setDataInicioForm(edicao.data_inicio || "");
                    setDataFimForm(edicao.data_fim || "");
                    // carregar opções e definir seleções por id (quando disponíveis)
                    (async () => {
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

                      // tentar mapear pelos ids retornados no próprio edicao (quando disponível)
                      const ensinoId =
                        (edicao as any).ensinos_clinicos?.id ||
                        (ensData || []).find(
                          (e: any) => e.nome === edicao.ensinos_clinicos?.nome,
                        )?.id;
                      const instituicaoId =
                        (edicao as any).instituicoes?.id ||
                        (instData || []).find(
                          (i: any) => i.nome === edicao.instituicoes?.nome,
                        )?.id;
                      const servicoId =
                        (edicao as any).servicos?.id ||
                        (servData || []).find(
                          (s: any) => s.nome === edicao.servicos?.nome,
                        )?.id;

                      setEnsinoSelecionado(ensinoId || null);
                      setInstituicaoSelecionada(instituicaoId || null);
                      setServicoSelecionado(servicoId || null);
                      setModalVisivel(true);
                    })();
                  }}
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

      {/* Modal de edição */}
      <Modal visible={modalVisivel} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Editar Edição</Text>

            {/* Ano Letivo field moved to top; duplicate below removed */}
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
                {ensinos.length === 0 ? (
                  <Text style={styles.textoVazioModal}>
                    Ainda não existem ensinos clínicos.
                  </Text>
                ) : (
                  ensinos.map((ensino) => (
                    <Pressable
                      key={ensino.id}
                      style={[
                        styles.opcaoInstituicao,
                        ensinoSelecionado === ensino.id &&
                          styles.opcaoInstituicaoSelecionada,
                      ]}
                      onPress={() => {
                        setEnsinoSelecionado(ensino.id);
                        setEnsinoOpen(false);
                      }}
                    >
                      <Text style={styles.opcaoInstituicaoTexto}>
                        {ensino.nome}
                      </Text>
                    </Pressable>
                  ))
                )}
              </ScrollView>
            )}

            <Text style={styles.label}>Instituição</Text>
            <Pressable
              style={styles.selectToggle}
              onPress={() => {
                setInstituicaoOpen((s) => !s);
                setEnsinoOpen(false);
                setServicoOpen(false);
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
                {instituicoes.length === 0 ? (
                  <Text style={styles.textoVazioModal}>
                    Ainda não existem instituições.
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
                        setServicoSelecionado(null);
                        setInstituicaoOpen(false);
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

            <Text style={styles.label}>Serviço</Text>
            <Pressable
              style={styles.selectToggle}
              onPress={() => {
                setServicoOpen((s) => !s);
                setEnsinoOpen(false);
                setInstituicaoOpen(false);
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
                {servicos.filter(
                  (s) => s.instituicao_id === instituicaoSelecionada,
                ).length === 0 ? (
                  <Text style={styles.textoVazioModal}>
                    Seleciona uma instituição com serviços.
                  </Text>
                ) : (
                  servicos
                    .filter((s) => s.instituicao_id === instituicaoSelecionada)
                    .map((servico) => (
                      <Pressable
                        key={servico.id}
                        style={[
                          styles.opcaoInstituicao,
                          servicoSelecionado === servico.id &&
                            styles.opcaoInstituicaoSelecionada,
                        ]}
                        onPress={() => {
                          setServicoSelecionado(servico.id);
                          setServicoOpen(false);
                        }}
                      >
                        <Text style={styles.opcaoInstituicaoTexto}>
                          {servico.nome}
                        </Text>
                      </Pressable>
                    ))
                )}
              </ScrollView>
            )}

            {/* Ano Letivo field moved to top; duplicate below removed */}

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

            {/* estado removido: não é necessário conforme pedido */}

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
                <Text style={styles.modalBotaoTexto}>
                  {salvando ? "A gravar..." : "Salvar"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de confirmação para apagar edição */}
      <Modal
        visible={confirmDeleteId !== null}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Confirmar eliminação</Text>
            <Text
              style={{ textAlign: "center", marginBottom: 18, color: "#333" }}
            >
              Tens a certeza que queres apagar esta edição de estágio? Esta ação
              não pode ser desfeita.
            </Text>

            <View style={styles.modalBotoes}>
              <Pressable
                style={styles.modalBotaoCancelar}
                onPress={() => setConfirmDeleteId(null)}
              >
                <Text style={styles.modalBotaoTexto}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={styles.modalBotaoCriar}
                onPress={confirmarApagar}
              >
                <Text style={styles.modalBotaoTexto}>Apagar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
