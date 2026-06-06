import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { supabase } from "../../../lib/supabase";
import styles from "./clinicosStyle";

type EnsinoClinico = {
  id: number;
  nome: string;
  ano_curricular: number;
  semestre: number;
  tipo: string;
  horas_estimadas: number;
  descricao: string | null;
};

export default function EnsinosClinicos() {
  const [ensinos, setEnsinos] = useState<EnsinoClinico[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregarEnsinosClinicos() {
    setLoading(true);

    const { data, error } = await supabase
      .from("ensinos_clinicos")
      .select("id, nome, ano_curricular, semestre, tipo, horas_estimadas, descricao")
      .order("id", { ascending: true });

    if (error) {
      console.log("ERRO AO CARREGAR ENSINOS CLÍNICOS:", error);
      Alert.alert("Erro", "Não foi possível carregar os ensinos clínicos.");
    } else {
      setEnsinos(data || []);
    }

    setLoading(false);
  }

  function mostrarTipo(tipo: string) {
    if (tipo === "ambos") return "Contacto ou tutorial";
    if (tipo === "contacto") return "Contacto";
    if (tipo === "tutorial") return "Tutorial";
    return tipo;
  }

  useEffect(() => {
    carregarEnsinosClinicos();
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

      <Text style={styles.titulo}>Ensinos Clínicos</Text>
      <Text style={styles.subtitulo}>
        Consultar os ensinos clínicos da Licenciatura em Enfermagem.
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FDB515" style={{ marginTop: 30 }} />
      ) : ensinos.length === 0 ? (
        <Text style={styles.textoVazio}>
          Ainda não existem ensinos clínicos registados.
        </Text>
      ) : (
        <View style={styles.lista}>
          {ensinos.map((ensino) => (
            <View key={ensino.id} style={styles.card}>
              <View style={styles.cardTopo}>
                <View style={styles.cardIcone}>
                  <Ionicons name="school-outline" size={28} color="#160909" />
                </View>

                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitulo}>{ensino.nome}</Text>
                  <Text style={styles.cardSubtitulo}>
                    {ensino.ano_curricular}.º ano · {ensino.semestre}.º semestre
                  </Text>
                </View>
              </View>

              <View style={styles.detalhes}>
                <View style={styles.badge}>
                  <Ionicons name="time-outline" size={18} color="#160909" />
                  <Text style={styles.badgeTexto}>
                    {ensino.horas_estimadas} horas
                  </Text>
                </View>

                <View style={styles.badge}>
                  <Ionicons name="document-text-outline" size={18} color="#160909" />
                  <Text style={styles.badgeTexto}>{mostrarTipo(ensino.tipo)}</Text>
                </View>
              </View>

              {ensino.descricao ? (
                <Text style={styles.descricao}>{ensino.descricao}</Text>
              ) : null}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}