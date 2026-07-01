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
import styles from "./comentarioSemanalStyles";

type Estagio = {
  id: number;
  estado_estagio: string | null;
  edicoes_estagio?: {
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
};

type Comentario = {
  id: number;
  semana: number;
  data_comentario: string | null;
  comentario: string;
};

export default function ComentariosSemanais() {
  const { inscricaoId } = useLocalSearchParams();

  const [estagio, setEstagio] = useState<Estagio | null>(null);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregarDados() {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace("/login/login" as any);
      return;
    }

    let query = supabase
      .from("inscricoes_estagio")
      .select(`
        id,
        estado_estagio,
        edicoes_estagio(
          ensinos_clinicos(nome),
          instituicoes(nome),
          servicos(nome)
        )
      `);

    if (inscricaoId) {
      query = query.eq("id", Number(inscricaoId));
    } else {
      query = query
        .eq("aluno_id", authData.user.id)
        .neq("estado_estagio", "concluido")
        .order("id", { ascending: false })
        .limit(1);
    }

    const { data: estagioData, error: estagioError } = await query.maybeSingle();

    if (estagioError) {
      console.log("ERRO ESTÁGIO COMENTÁRIOS:", estagioError);
      setLoading(false);
      return;
    }

    setEstagio((estagioData as any) || null);

    if (estagioData) {
      const { data: comentariosData, error: comentariosError } = await supabase
        .from("comentarios_semanais")
        .select("id, semana, data_comentario, comentario")
        .eq("inscricao_id", (estagioData as any).id)
        .order("semana", { ascending: true })
        .order("data_comentario", { ascending: true });

      if (comentariosError) {
        console.log("ERRO COMENTÁRIOS:", comentariosError);
        setComentarios([]);
      } else {
        setComentarios((comentariosData as any) || []);
      }
    }

    setLoading(false);
  }

  useEffect(() => {
    carregarDados();
  }, []);

  function formatarData(data: string | null) {
    if (!data) return "Sem data";
    return new Date(data).toLocaleDateString("pt-PT");
  }

  return (
    <View style={styles.page}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Pressable
          style={styles.voltar}
          onPress={() =>
            inscricaoId
              ? router.push(
                  `/aluno/estagios/detalheEstagio/detalheEstagio?id=${inscricaoId}` as any
                )
              : router.push("/aluno/home" as any)
          }
        >
          <Ionicons name="arrow-back-outline" size={24} color="#160909" />
          <Text style={styles.voltarTexto}>Voltar</Text>
        </Pressable>

        <Text style={styles.titulo}>Comentários Semanais</Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FDB515"
            style={{ marginTop: 30 }}
          />
        ) : !estagio ? (
          <Text style={styles.textoVazio}>
            Não existe estágio disponível para consultar comentários.
          </Text>
        ) : (
          <>
            <View style={styles.estagioCard}>
              <Text style={styles.estagioTitulo}>
                {estagio.edicoes_estagio?.ensinos_clinicos?.nome ||
                  "Ensino Clínico"}
              </Text>

              <Text style={styles.estagioTexto}>
                {estagio.edicoes_estagio?.instituicoes?.nome || "Instituição"} ·{" "}
                {estagio.edicoes_estagio?.servicos?.nome || "Serviço"}
              </Text>
            </View>

            {comentarios.length === 0 ? (
              <Text style={styles.textoVazio}>
                Ainda não existem comentários semanais disponíveis.
              </Text>
            ) : (
              <View style={styles.lista}>
                {comentarios.map((comentario) => (
                  <View key={comentario.id} style={styles.cardComentario}>
                    <View style={styles.cardTopo}>
                      <View style={styles.semanaBadge}>
                        <Text style={styles.semanaTexto}>
                          Semana {comentario.semana}
                        </Text>
                      </View>

                      <Text style={styles.dataTexto}>
                        {formatarData(comentario.data_comentario)}
                      </Text>
                    </View>

                    <Text style={styles.comentarioTexto}>
                      {comentario.comentario}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}