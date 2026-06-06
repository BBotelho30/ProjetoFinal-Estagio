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
        ensinos_clinicos(nome),
        instituicoes(nome),
        servicos(nome)
      `)
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
                  <Ionicons
                    name="calendar-outline"
                    size={28}
                    color="#160909"
                  />
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
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}