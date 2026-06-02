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
  const [instituicaoSelecionada, setInstituicaoSelecionada] = useState<number | null>(null);
  const [nomeServico, setNomeServico] = useState("");
  const [modalVisivel, setModalVisivel] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aCriar, setACriar] = useState(false);

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

    const { error } = await supabase.from("servicos").insert([
      {
        nome: nomeServico.trim(),
        instituicao_id: instituicaoSelecionada,
      },
    ]);

    if (error) {
      console.log("ERRO AO CRIAR SERVIÇO:", error);
      Alert.alert("Erro", error.message);
      setACriar(false);
      return;
    }

    Alert.alert("Sucesso", "Serviço criado com sucesso!");
    setNomeServico("");
    setInstituicaoSelecionada(null);
    setModalVisivel(false);
    setACriar(false);
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

      <Pressable style={styles.botao} onPress={() => setModalVisivel(true)}>
        <Text style={styles.textoBotaoCriar}>Criar serviço</Text>
      </Pressable>

      {loading ? (
        <ActivityIndicator size="large" color="#FDB515" style={{ marginTop: 30 }} />
      ) : servicos.length === 0 ? (
        <Text style={styles.textoVazio}>Ainda não existem serviços criados.</Text>
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
              </View>
            </View>
          ))}
        </View>
      )}

      <Modal visible={modalVisivel} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Criar Serviço</Text>

            <Text style={styles.label}>Escolhe a instituição</Text>

            <ScrollView style={styles.instituicoesBox}>
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
                    onPress={() => setInstituicaoSelecionada(instituicao.id)}
                  >
                    <Text style={styles.opcaoInstituicaoTexto}>
                      {instituicao.nome}
                    </Text>
                  </Pressable>
                ))
              )}
            </ScrollView>

            <TextInput
              placeholder="Nome do serviço"
              placeholderTextColor="#8c8787"
              style={styles.modalInput}
              value={nomeServico}
              onChangeText={setNomeServico}
            />. 

            <View style={styles.modalBotoes}>
              <Pressable
                style={styles.modalBotaoCancelar}
                onPress={() => {
                  setModalVisivel(false);
                  setNomeServico("");
                  setInstituicaoSelecionada(null);
                }}
              >
                <Text style={styles.modalBotaoTexto}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={styles.modalBotaoCriar}
                onPress={criarServico}
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