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
import styles from "./servicosStyles";

type Instituicao = {
  id: number;
  nome: string;
};

type Servico = {
  id: number;
  nome: string;
  instituicao_id: number;
  instituicoes?: {
    nome: string;
  };
};

export default function Servicos() {
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
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  async function carregarDados() {
    setLoading(true);

    const { data: instData, error: instError } = await supabase
      .from("instituicoes")
      .select("id, nome")
      .order("nome", { ascending: true });

    const { data: servData, error: servError } = await supabase
      .from("servicos")
      .select("id, nome, instituicao_id, instituicoes(nome)")
      .order("nome", { ascending: true });

    if (instError || servError) {
      console.log("ERRO:", instError || servError);
      Alert.alert("Erro", "Não foi possível carregar os dados.");
    } else {
      setInstituicoes(instData || []);
      setServicos((servData as any) || []);
    }

    setLoading(false);
  }

  async function criarServico() {
    if (aCriar) return;

    if (!instituicaoSelecionada) {
      Alert.alert("Erro", "Escolhe uma instituição.");
      return;
    }

    if (!nomeServico.trim()) {
      Alert.alert("Erro", "Escreve o nome do serviço.");
      return;
    }

    setACriar(true);

    let error: any = null;

    if (editingId) {
      const res = await supabase
        .from("servicos")
        .update({
          nome: nomeServico.trim(),
          instituicao_id: instituicaoSelecionada,
        })
        .eq("id", editingId);
      error = res.error;
    } else {
      const res = await supabase.from("servicos").insert([
        {
          nome: nomeServico.trim(),
          instituicao_id: instituicaoSelecionada,
        },
      ]);
      error = res.error;
    }

    if (error) {
      console.log("ERRO AO CRIAR/ATUALIZAR SERVIÇO:", error);
      Alert.alert("Erro", error.message || "Ocorreu um erro.");
      setACriar(false);
      return;
    }

    Alert.alert(
      "Sucesso",
      editingId
        ? "Serviço atualizado com sucesso!"
        : "Serviço criado com sucesso!",
    );
    setNomeServico("");
    setInstituicaoSelecionada(null);
    setModalVisivel(false);
    setDropdownOpen(false);
    setEditingId(null);
    setACriar(false);
    carregarDados();
  }

  function apagarServico(id: number) {
    setConfirmDeleteId(id);
  }

  async function confirmarApagar() {
    if (!confirmDeleteId) return;
    const id = confirmDeleteId;
    setConfirmDeleteId(null);

    const { error } = await supabase.from("servicos").delete().eq("id", id);
    if (error) {
      console.log("ERRO AO APAGAR SERVIÇO:", error);
      Alert.alert("Erro", "Não foi possível apagar o serviço.");
      return;
    }

    Alert.alert("Sucesso", "Serviço apagado.");
    carregarDados();
  }

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable
        style={styles.voltar}
        onPress={() => router.push("/superadmin/home" as any)}
      >
        <Ionicons name="arrow-back-outline" size={24} color="#160909" />
        <Text style={styles.voltarTexto}>Voltar</Text>
      </Pressable>

      <Text style={styles.titulo}>Serviços</Text>
      <Text style={styles.subtitulo}>
        Criar serviços associados às instituições.
      </Text>

      <Pressable
        style={styles.botao}
        onPress={() => {
          setEditingId(null);
          setNomeServico("");
          setInstituicaoSelecionada(null);
          setDropdownOpen(false);
          setModalVisivel(true);
        }}
      >
        <Text style={styles.textoBotaoCriar}>Criar serviço</Text>
      </Pressable>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#FDB515"
          style={{ marginTop: 30 }}
        />
      ) : servicos.length === 0 ? (
        <Text style={styles.textoVazio}>
          Ainda não existem serviços criados.
        </Text>
      ) : (
        <View style={styles.lista}>
          {servicos.map((servico) => (
            <View key={servico.id} style={styles.card}>
              <View style={styles.cardIcone}>
                <Ionicons name="medkit-outline" size={26} color="#160909" />
              </View>

              <View style={styles.cardInfo}>
                <Text style={styles.cardTitulo}>{servico.nome}</Text>
                <Text style={styles.cardTexto}>
                  {servico.instituicoes?.nome || "Sem instituição"}
                </Text>

                <View style={styles.cardActions}>
                  <Pressable
                    style={[styles.actionButton, styles.actionEdit]}
                    onPress={() => {
                      setEditingId(servico.id);
                      setNomeServico(servico.nome);
                      setInstituicaoSelecionada(servico.instituicao_id);
                      setModalVisivel(true);
                    }}
                  >
                    <Ionicons name="pencil-outline" size={18} color="#160909" />
                    <Text style={styles.actionText}>Editar</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.actionButton, styles.actionDelete]}
                    onPress={() => apagarServico(servico.id)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#fff" />
                    <Text style={[styles.actionText, { color: "#fff" }]}>
                      Apagar
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      <Modal visible={modalVisivel} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>
              {editingId ? "Editar Serviço" : "Criar Serviço"}
            </Text>

            <Text style={styles.label}>Escolhe a instituição</Text>

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
                    Ainda não existem instituições criadas.
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

            <TextInput
              placeholder="Nome do serviço"
              placeholderTextColor="#8c8787"
              style={styles.modalInput}
              value={nomeServico}
              onChangeText={setNomeServico}
            />

            <View style={styles.modalBotoes}>
              <Pressable
                style={styles.modalBotaoCancelar}
                onPress={() => {
                  setModalVisivel(false);
                  setNomeServico("");
                  setInstituicaoSelecionada(null);
                  setDropdownOpen(false);
                  setEditingId(null);
                }}
              >
                <Text style={styles.modalBotaoTexto}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={styles.modalBotaoCriar}
                onPress={criarServico}
                disabled={aCriar}
              >
                <Text style={styles.modalBotaoTexto}>
                  {aCriar
                    ? editingId
                      ? "A gravar..."
                      : "A criar..."
                    : editingId
                      ? "Salvar"
                      : "Criar"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de confirmação para apagar */}
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
              Tens a certeza que queres apagar este serviço? Esta ação não pode
              ser desfeita.
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
