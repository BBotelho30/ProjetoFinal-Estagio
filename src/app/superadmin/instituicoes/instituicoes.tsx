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
import styles from "./instituicoesStyles";

type Instituicao = {
  id: number;
  nome: string;
  endereco: string | null;
};

export default function CriarInstituicoes() {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [nomeInstituicao, setNomeInstituicao] = useState("");
  const [enderecoInstituicao, setEnderecoInstituicao] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [loading, setLoading] = useState(false);
  const [aCriar, setACriar] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  async function carregarInstituicoes() {
    setLoading(true);

    const { data, error } = await supabase
      .from("instituicoes")
      .select("id, nome, endereco")
      .order("nome", { ascending: true });

    if (error) {
      console.log("ERRO AO CARREGAR INSTITUIÇÕES:", error);
      Alert.alert("Erro", "Não foi possível carregar as instituições.");
    } else {
      setInstituicoes(data || []);
    }

    setLoading(false);
  }

  async function criarInstituicao() {
    if (aCriar) return;

    if (!nomeInstituicao.trim()) {
      Alert.alert("Erro", "Por favor, preencha o nome da instituição.");
      return;
    }

    setACriar(true);

    let error: any = null;

    if (editingId) {
      const res = await supabase
        .from("instituicoes")
        .update({
          nome: nomeInstituicao.trim(),
          endereco: enderecoInstituicao.trim() || null,
        })
        .eq("id", editingId);
      error = res.error;
    } else {
      const res = await supabase.from("instituicoes").insert([
        {
          nome: nomeInstituicao.trim(),
          endereco: enderecoInstituicao.trim() || null,
        },
      ]);
      error = res.error;
    }

    if (error) {
      console.log("ERRO AO CRIAR INSTITUIÇÃO:", error);
      Alert.alert("Erro", error.message);
      setACriar(false);
      return;
    }

    Alert.alert(
      "Sucesso",
      editingId
        ? "Instituição atualizada com sucesso!"
        : "Instituição criada com sucesso!",
    );

    setModalVisivel(false);
    setNomeInstituicao("");
    setEnderecoInstituicao("");
    setEditingId(null);
    setACriar(false);

    carregarInstituicoes();
  }

  function apagarInstituicao(id: number) {
    setConfirmDeleteId(id);
  }

  async function confirmarApagar() {
    if (!confirmDeleteId) return;
    const id = confirmDeleteId;
    setConfirmDeleteId(null);

    const { error } = await supabase.from("instituicoes").delete().eq("id", id);
    if (error) {
      console.log("ERRO AO APAGAR INSTITUIÇÃO:", error);
      Alert.alert("Erro", "Não foi possível apagar a instituição.");
      return;
    }

    Alert.alert("Sucesso", "Instituição apagada.");
    carregarInstituicoes();
  }

  useEffect(() => {
    carregarInstituicoes();
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

      <Text style={styles.titulo}>Criar Instituições</Text>
      <Text style={styles.subtitulo}>
        Gerir hospitais, unidades e instituições parceiras.
      </Text>

      <Pressable
        style={styles.botao}
        onPress={() => {
          setEditingId(null);
          setNomeInstituicao("");
          setEnderecoInstituicao("");
          setModalVisivel(true);
        }}
      >
        <Text style={styles.textoBotaoCriar}>Criar instituição</Text>
      </Pressable>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#FDB515"
          style={{ marginTop: 30 }}
        />
      ) : instituicoes.length === 0 ? (
        <Text style={styles.textoVazio}>
          Ainda não existem instituições criadas.
        </Text>
      ) : (
        <View style={styles.lista}>
          {instituicoes.map((instituicao) => (
            <View key={instituicao.id} style={styles.card}>
              <View style={styles.cardIcone}>
                <Ionicons name="business-outline" size={26} color="#160909" />
              </View>

              <View style={styles.cardInfo}>
                <Text style={styles.cardTitulo}>{instituicao.nome}</Text>
                <Text style={styles.cardTexto}>
                  {instituicao.endereco || "Sem endereço definido"}
                </Text>

                <View style={styles.cardActions}>
                  <Pressable
                    style={[styles.actionButton, styles.actionEdit]}
                    onPress={() => {
                      setEditingId(instituicao.id);
                      setNomeInstituicao(instituicao.nome);
                      setEnderecoInstituicao(instituicao.endereco || "");
                      setModalVisivel(true);
                    }}
                  >
                    <Ionicons name="pencil-outline" size={18} color="#160909" />
                    <Text style={styles.actionText}>Editar</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.actionButton, styles.actionDelete]}
                    onPress={() => apagarInstituicao(instituicao.id)}
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
              {editingId ? "Editar Instituição" : "Criar Instituição"}
            </Text>

            <TextInput
              placeholder="Nome da instituição"
              placeholderTextColor="#8c8787"
              style={styles.modalInput}
              value={nomeInstituicao}
              onChangeText={setNomeInstituicao}
            />

            <TextInput
              placeholder="Endereço da instituição"
              placeholderTextColor="#8c8787"
              style={styles.modalInput}
              value={enderecoInstituicao}
              onChangeText={setEnderecoInstituicao}
            />

            <View style={styles.modalBotoes}>
              <Pressable
                style={styles.modalBotaoCancelar}
                onPress={() => {
                  setModalVisivel(false);
                  setNomeInstituicao("");
                  setEnderecoInstituicao("");
                  setEditingId(null);
                }}
              >
                <Text style={styles.modalBotaoTexto}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={styles.modalBotaoCriar}
                onPress={criarInstituicao}
                disabled={aCriar}
              >
                <Text style={styles.modalBotaoTexto1}>
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
              Tens a certeza que queres apagar esta instituição? Esta ação não
              pode ser desfeita.
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
