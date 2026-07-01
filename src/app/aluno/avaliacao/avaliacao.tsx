import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { supabase } from "../../../lib/supabase";
import styles from "./avaliacaoStyles";

type Avaliacao = {
  id: number;
  nota_final: number | null;
  estado: string | null;
  edicao_estagio_id: number;
  edicoes_estagio?: {
    ano_letivo: string;
    ensinos_clinicos?: {
      id: number;
      nome: string;
      ano_curricular: number;
      semestre: number;
    };
  };
};

export default function AvaliacoesAluno() {
  const { from } = useLocalSearchParams();
  const mostrarBottomBar = from === "bottom";

  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregarAvaliacoes() {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace("/login/login" as any);
      return;
    }

    const { data, error } = await supabase
      .from("avaliacoes")
      .select(`
        id,
        nota_final,
        estado,
        edicao_estagio_id,
        edicoes_estagio(
          ano_letivo,
          ensinos_clinicos(id, nome, ano_curricular, semestre)
        )
      `)
      .eq("aluno_id", authData.user.id)
      .order("id", { ascending: false });

    if (error) {
      console.log("ERRO AVALIAÇÕES:", error);
      setAvaliacoes([]);
    } else {
      setAvaliacoes((data as any) || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    carregarAvaliacoes();
  }, []);

  function mediaGlobal() {
    const comNota = avaliacoes.filter((a) => a.nota_final !== null);

    if (comNota.length === 0) return null;

    const soma = comNota.reduce(
      (total, a) => total + Number(a.nota_final || 0),
      0
    );

    return Number((soma / comNota.length).toFixed(2));
  }

  function corEstagio(id?: number) {
    const cores = [
      "#FDB515",
      "#64B5F6",
      "#1B998B",
      "#BA68C8",
      "#FFADAD",
      "#F4A261",
      "#A8DADC",
      "#E5989B",
      "#DDBEA9",
    ];

    if (!id) return cores[0];

    return cores[(id - 1) % cores.length];
  }

  function formatarNota(nota: number | null) {
    if (nota === null || nota === undefined) return "—";
    return Number(nota).toFixed(1);
  }

  const media = mediaGlobal();

  return (
    <View style={styles.page}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Pressable
          style={styles.voltar}
          onPress={() => router.push("/aluno/home" as any)}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#160909" />
          <Text style={styles.voltarTexto}>Voltar</Text>
        </Pressable>

        <Text style={styles.titulo}>Avaliações</Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FDB515"
            style={{ marginTop: 30 }}
          />
        ) : (
          <>
            <View style={styles.mediaCard}>
              <Text style={styles.mediaTitulo}>Média Global</Text>

              <View style={styles.mediaCirculo}>
                <Text style={styles.mediaValor}>
                  {media === null ? "—" : media}
                </Text>
              </View>
            </View>

            {avaliacoes.length === 0 ? (
              <Text style={styles.textoVazio}>
                Ainda não existem avaliações disponíveis.
              </Text>
            ) : (
              <View style={styles.lista}>
                {avaliacoes.map((avaliacao) => {
                  const ensino =
                    avaliacao.edicoes_estagio?.ensinos_clinicos;

                  const cor = corEstagio(ensino?.id);

                  return (
                    <View key={avaliacao.id} style={styles.card}>
                      <View
                        style={[
                          styles.barraCard,
                          { backgroundColor: cor },
                        ]}
                      />

                      <View style={styles.cardInfo}>
                        <Text style={styles.cardTitulo}>
                          {ensino?.nome || "Ensino Clínico"}
                        </Text>

                        <Text style={styles.cardTexto}>
                          Ano: {ensino?.ano_curricular || "—"}.º
                        </Text>

                        <Text style={styles.cardTexto}>
                          Semestre: S{ensino?.semestre || "—"}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.notaCirculo,
                          { borderColor: cor },
                        ]}
                      >
                        <Text style={[styles.notaValor, { color: cor }]}>
                          {formatarNota(avaliacao.nota_final)}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {mostrarBottomBar && (
        <View style={styles.bottomBar}>
          <Pressable
            style={styles.bottomItem}
            onPress={() => router.push("/aluno/home" as any)}
          >
            <Ionicons name="home-outline" size={24} color="#160909" />
            <Text style={styles.bottomTexto}>Home</Text>
          </Pressable>

          <Pressable
            style={styles.bottomItem}
            onPress={() => router.push("/aluno/presencas?from=bottom" as any)}
          >
            <Ionicons name="calendar-outline" size={24} color="#160909" />
            <Text style={styles.bottomTexto}>Presenças</Text>
          </Pressable>

          <Pressable style={styles.bottomItem}>
            <Ionicons name="star-outline" size={24} color="#FDB515" />
            <Text style={styles.bottomTextoAtivo}>Avaliações</Text>
          </Pressable>

          <Pressable
            style={styles.bottomItem}
            onPress={() =>
              router.push("/aluno/agenda/agenda?from=bottom" as any)
            }
          >
            <Ionicons name="people-outline" size={24} color="#160909" />
            <Text style={styles.bottomTexto}>Agenda</Text>
          </Pressable>

          <Pressable
            style={styles.bottomItem}
            onPress={() =>
              router.push("/aluno/estagios/estagio?from=bottom" as any)
            }
          >
            <Ionicons name="briefcase-outline" size={24} color="#160909" />
            <Text style={styles.bottomTexto}>Ensinos Clínicos</Text>
          </Pressable>

          <Pressable
            style={styles.bottomItem}
            onPress={() =>
              router.push("/aluno/preencherPerfil/perfil?from=bottom" as any)
            }
          >
            <Ionicons name="person-outline" size={24} color="#160909" />
            <Text style={styles.bottomTexto}>Perfil</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}