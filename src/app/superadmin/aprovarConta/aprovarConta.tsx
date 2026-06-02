import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { supabase } from "../../../lib/supabase";
import styles from "./aprovarContaStyles";

type Utilizador = {
  id: string;
  nome: string;
  email: string;
  tipo: string;
  estado: string;
};

export default function AprovarContas() {
  const [utilizadores, setUtilizadores] = useState<Utilizador[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregarUtilizadoresPendentes() {
    // Iniciar o carregamento
    setLoading(true);

    // Vai buscar utilizadores com estado "pendente"
    const { data, error } = await supabase
      .from("utilizadores")
      .select("id, nome, email, tipo, estado")
      .eq("estado", "pendente")
      .order("criado_em", { ascending: false  }); // Ordenar por data de criação, do mais recente para o mais antigo

    if (error) {
      console.log("ERRO AO CARREGAR:", error);
      Alert.alert("Erro", "Não foi possível carregar as contas pendentes.");
    } else {
      setUtilizadores(data || []);
    }

    setLoading(false);
  }

  async function atualizarEstado(id: string, novoEstado: "aprovado" | "rejeitado") {
    const { error } = await supabase
      .from("utilizadores")
      .update({ estado: novoEstado })
      .eq("id", id);

    if (error) {
      console.log("ERRO AO ATUALIZAR:", error);
      Alert.alert("Erro", "Não foi possível atualizar o estado da conta.");
      return;
    }

    Alert.alert(
      "Sucesso",
      novoEstado === "aprovado"
        ? "Conta aprovada com sucesso."
        : "Conta rejeitada com sucesso."
    );

    carregarUtilizadoresPendentes();
  }

  useEffect(() => {
    carregarUtilizadoresPendentes();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Pressable style={styles.voltar} onPress={() => router.push("/superadmin/home" as any)}>
        <Ionicons name="arrow-back-outline" size={24} color="#160909" />
        <Text style={styles.voltarTexto}>Voltar</Text>
      </Pressable>

      <Text style={styles.titulo}>Aprovar Contas</Text>
      <Text style={styles.subtitulo}>
        Validar registos de alunos, professores e orientadores.
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FDB515" style={{ marginTop: 40 }} />
      ) : utilizadores.length === 0 ? (
        <View style={styles.vazioContainer}>
          <Ionicons name="checkmark-circle-outline" size={48} color="#FDB515" />
          <Text style={styles.vazioTexto}>Não existem contas pendentes.</Text>
        </View>
      ) : (
        <View style={styles.lista}>
          {utilizadores.map((user) => (
            <View key={user.id} style={styles.card}>
              <View style={styles.cardTopo}>
                <View style={styles.avatar}>
                  <Ionicons name="person-outline" size={26} color="#160909" />
                </View>

                <View style={styles.info}>
                  <Text style={styles.nome}>{user.nome}</Text>
                  <Text style={styles.email}>{user.email}</Text>
                </View>
              </View>

              <View style={styles.linhaInfo}>
                <Text style={styles.label}>Tipo:</Text>
                <Text style={styles.valor}>{user.tipo}</Text>
              </View>

              <View style={styles.linhaInfo}>
                <Text style={styles.label}>Estado:</Text>
                <Text style={styles.estadoPendente}>Pendente</Text>
              </View>

              <View style={styles.botoes}>
                <Pressable
                  style={[styles.botao, styles.botaoAprovar]}
                  onPress={() => atualizarEstado(user.id, "aprovado")}
                >
                  <Ionicons name="checkmark-outline" size={20} color="#160909" />
                  <Text style={styles.botaoTexto}>Aprovar</Text>
                </Pressable>

                <Pressable
                  style={[styles.botao, styles.botaoRejeitar]}
                  onPress={() => atualizarEstado(user.id, "rejeitado")}
                >
                  <Ionicons name="close-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.botaoTextoRejeitar}>Rejeitar</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}