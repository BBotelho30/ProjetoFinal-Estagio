import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { supabase } from "../../../../lib/supabase";
import styles from "./estagioAvaliacoesStyles";

type Estagio = {
  id: number;
  edicao_estagio_id: number;
  estado_estagio: string | null;
  estado: string | null;
  distribuido_por: string | null;
  edicoes_estagio?: {
    id: number;
    ano_letivo: string | null;
    data_inicio: string | null;
    data_fim: string | null;
    ensinos_clinicos?: {
      nome: string;
      ano_curricular: number | null;
      semestre: number | null;
      horas_estimadas: number | null;
    } | null;
    instituicoes?: {
      nome: string;
    } | null;
    servicos?: {
      nome: string;
    } | null;
  } | null;
  avaliacao?: {
    id: number;
    nota_final: number | null;
    criado_em: string | null;
  } | null;
};

const CORES_ESTAGIOS = [
  "#2F80ED",
  "#8EC5FC",
  "#9B51E0",
  "#B8E0D2",
  "#FF6B9A",
  "#C9A27E",
  "#FDB515",
  "#8ED6FF",
  "#EB5757",
  "#BDBDBD",
  "#F2994A",
];

export default function EstagioAvaliacoesAluno() {
  const [loading, setLoading] = useState(true);
  const [estagios, setEstagios] = useState<Estagio[]>([]);

  useEffect(() => {
    carregarEstagios();
  }, []);

  const estagiosOrdenados = useMemo(() => {
    return [...estagios].sort((a, b) => {
      const anoA = a.edicoes_estagio?.ensinos_clinicos?.ano_curricular || 99;
      const anoB = b.edicoes_estagio?.ensinos_clinicos?.ano_curricular || 99;

      if (anoA !== anoB) return anoA - anoB;

      return a.id - b.id;
    });
  }, [estagios]);

  async function carregarEstagios() {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace("/login/login" as any);
      return;
    }

    const userId = authData.user.id;

    const { data, error } = await supabase
      .from("inscricoes_estagio")
      .select(`
        id,
        edicao_estagio_id,
        estado_estagio,
        estado,
        distribuido_por,
        edicoes_estagio(
          id,
          ano_letivo,
          data_inicio,
          data_fim,
          ensinos_clinicos(nome, ano_curricular, semestre, horas_estimadas),
          instituicoes(nome),
          servicos(nome)
        )
      `)
      .eq("aluno_id", userId)
      .order("id", { ascending: true });

    if (error) {
      console.log("ERRO ESTÁGIOS AVALIAÇÕES:", error);
      setEstagios([]);
      setLoading(false);
      return;
    }

    // Filtrar os estágios válidos (não rejeitados, não inativos e não por distribuir)
    const listaValida = (((data as any) || []) as Estagio[]).filter(
      (item: Estagio) => {
        return (
          item.estado !== "rejeitado" &&
          item.estado_estagio !== "inativo" &&
          item.estado_estagio !== "por_distribuir"
        );
      }
    );

    const edicoesIds = listaValida.map(
      (item: Estagio) => item.edicao_estagio_id
    );

    let avaliacoes: any[] = [];

    if (edicoesIds.length > 0) {
      const { data: avaliacoesData, error: avaliacoesError } = await supabase
        .from("avaliacoes")
        .select(`
          id,
          aluno_id,
          edicao_estagio_id,
          nota_final,
          criado_em
        `)
        .eq("aluno_id", userId)
        .in("edicao_estagio_id", edicoesIds);

      if (avaliacoesError) {
        console.log("ERRO AVALIAÇÕES:", avaliacoesError);
      } else {
        avaliacoes = (avaliacoesData as any) || [];
      }
    }

    const listaComAvaliacao = listaValida.map((estagio: Estagio) => {
      const avaliacao =
        avaliacoes.find(
          (item) => item.edicao_estagio_id === estagio.edicao_estagio_id
        ) || null;

      return {
        ...estagio,
        avaliacao,
      };
    });

    setEstagios(listaComAvaliacao);
    setLoading(false);
  }

  function formatarData(data: string | null | undefined) {
    if (!data) return "Sem data";

    const date = new Date(data);
    if (Number.isNaN(date.getTime())) return "Sem data";

    return date.toLocaleDateString("pt-PT");
  }

  function numeroDoEstagio(estagio: Estagio) {
  const nome = estagio.edicoes_estagio?.ensinos_clinicos?.nome || "";
  const match = nome.match(/Ensino Clínico\s*(\d+)/i);

    if (match?.[1]) return Number(match[1]);

    return null;
  }

  function corDoEstagio(estagio: Estagio) {
    const numero = numeroDoEstagio(estagio);

    if (!numero) return "#FDB515";

    return CORES_ESTAGIOS[numero - 1] || "#FDB515";
  }

  function notaTexto(nota: number | null | undefined) {
    if (nota === null || nota === undefined) return "--";
    return Number(nota).toFixed(1);
  }

  function semestreTexto(estagio: Estagio) {
    const semestre = estagio.edicoes_estagio?.ensinos_clinicos?.semestre;

    if (!semestre) return "N/A";

    return `S${semestre}`;
  }

  function anoTexto(estagio: Estagio) {
    const ano = estagio.edicoes_estagio?.ensinos_clinicos?.ano_curricular;

    if (!ano) return "N/A";

    return `${ano}.º ano`;
  }

  return (
    <View style={styles.page}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          style={styles.voltar}
          onPress={() => router.replace("/aluno/home" as any)}
        >
          <Ionicons name="arrow-back-outline" size={22} color="#160909" />
          <Text style={styles.voltarTexto}>Voltar</Text>
        </Pressable>

        <Text style={styles.titulo}>Avaliações</Text>

        <Text style={styles.subtitulo}>
          Consulta as tuas avaliações por ensino clínico.
        </Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FDB515"
            style={{ marginTop: 40 }}
          />
        ) : estagiosOrdenados.length === 0 ? (
          <View style={styles.vazioCard}>
            <Ionicons
              name="information-circle-outline"
              size={30}
              color="#FDB515"
            />
            <Text style={styles.vazioTitulo}>Sem avaliações</Text>
            <Text style={styles.vazioTexto}>
              Ainda não existem estágios disponíveis para mostrar.
            </Text>
          </View>
        ) : (
          <View style={styles.lista}>
            {estagiosOrdenados.map((estagio) => {
              const cor = corDoEstagio(estagio);
              const ensino = estagio.edicoes_estagio?.ensinos_clinicos;

              return (
                <Pressable
                  key={estagio.id}
                  style={styles.cardNota}
                  onPress={() =>
                    router.push({
                      pathname: "/aluno/avaliacao/avaliacao" as any,
                      params: {
                        inscricaoId: String(estagio.id),
                        edicaoId: String(estagio.edicao_estagio_id),
                        origem: "estagioAvaliacoes",
                      },
                    })
                  }
                >
                  <View
                    style={[
                      styles.barraCor,
                      { backgroundColor: cor },
                    ]}
                  />

                  <View style={styles.cardNotaConteudo}>
                    <View style={styles.infoArea}>
                      <Text style={styles.cardNotaTitulo}>
                        {ensino?.nome || "Ensino Clínico"}
                      </Text>

                      <Text style={styles.cardNotaTexto}>
                        Semestre: {semestreTexto(estagio)}
                      </Text>

                      <Text style={styles.cardNotaTexto}>
                        Ano: {anoTexto(estagio)}
                      </Text>

                      <Text style={styles.cardNotaTexto}>
                        Data de Avaliação:{" "}
                        {formatarData(estagio.avaliacao?.criado_em)}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.notaCirculo,
                        { borderColor: cor },
                      ]}
                    >
                      <Text
                        style={[
                          styles.notaCirculoTexto,
                          { color: cor },
                        ]}
                      >
                        {notaTexto(estagio.avaliacao?.nota_final)}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}