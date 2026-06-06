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

  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [loading, setLoading] = useState(false);
  const [aCriar, setACriar] = useState(false);

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

    const { error } = await supabase.from("instituicoes").insert([
      {
        nome: nomeInstituicao.trim(),
        endereco: enderecoInstituicao.trim() || null,
      },
    ]);

    if (error) {
      console.log("ERRO AO CRIAR INSTITUIÇÃO:", error);
      Alert.alert("Erro", error.message);
      setACriar(false);
      return;
    }

    Alert.alert("Sucesso", "Instituição criada com sucesso!");

    setModalVisivel(false);
    setNomeInstituicao("");
    setEnderecoInstituicao("");
    setACriar(false);

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

      <Pressable style={styles.botao} onPress={() => setModalVisivel(true)}>
        <Text style={styles.textoBotaoCriar}>Criar instituição</Text>
      </Pressable>

      {loading ? (
        <ActivityIndicator size="large" color="#FDB515" style={{ marginTop: 30 }} />
      ) : instituicoes.length === 0 ? (
        <Text style={styles.textoVazio}>Ainda não existem instituições criadas.</Text>
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
              </View>
            </View>
          ))}
        </View>
      )}

      <Modal visible={modalVisivel} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Criar Instituição</Text>

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
                  {aCriar ? "A criar..." : "Criar"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}