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
  professor_id: string | null;
  orientador_id: string | null;
  edicoes_estagio?: {
    id: number;
    ano_letivo: string;
    data_inicio: string | null;
    data_fim: string | null;
    ensinos_clinicos?: {
      nome: string;
      ano_curricular: number;
      horas_estimadas: number | null;
    };
    instituicoes?: {
      nome: string;
    };
    servicos?: {
      nome: string;
    };
  };
  professor?: {
    nome: string;
  } | null;
  orientador?: {
    nome: string;
  } | null;
  avaliacao?: {
    id: number;
    nota_professor: number | null;
    nota_orientador: number | null;
    nota_final: number | null;
    estado: string | null;
  } | null;
};

const CORES_ESTAGIOS = [
  "#2F80ED",
  "#A7F3D0",
  "#9B51E0",
  "#F8BBD0",
  "#C9A27E",
  "#800020",
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

      return b.id - a.id;
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
        professor_id,
        orientador_id,
        edicoes_estagio(
          id,
          ano_letivo,
          data_inicio,
          data_fim,
          ensinos_clinicos(nome, ano_curricular, horas_estimadas),
          instituicoes(nome),
          servicos(nome)
        ),
        professor:utilizadores!inscricoes_estagio_professor_id_fkey(nome),
        orientador:utilizadores!inscricoes_estagio_orientador_id_fkey(nome)
      `)
      .eq("aluno_id", userId)
      .order("id", { ascending: false });

    if (error) {
      console.log("ERRO ESTÁGIOS AVALIAÇÕES:", error);
      setEstagios([]);
      setLoading(false);
      return;
    }

    const listaValida = ((data as any) || []).filter((item: Estagio) => {
      return (
        item.estado !== "rejeitado" &&
        item.estado_estagio !== "inativo" &&
        item.estado_estagio !== "por_distribuir" &&
        (item.estado === "aprovado" ||
          item.estado_estagio === "em_curso" ||
          item.estado_estagio === "aguarda_relatorio" ||
          item.estado_estagio === "aguarda_avaliacao" ||
          item.estado_estagio === "concluido" ||
          Boolean(item.distribuido_por))
      );
    });

    const edicoesIds = listaValida.map((item: Estagio) => item.edicao_estagio_id);

    let avaliacoes: any[] = [];

    if (edicoesIds.length > 0) {
      const { data: avaliacoesData, error: avaliacoesError } = await supabase
        .from("avaliacoes")
        .select(`
          id,
          aluno_id,
          edicao_estagio_id,
          nota_professor,
          nota_orientador,
          nota_final,
          estado
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

    setEstagios(listaComAvaliacao as any);
    setLoading(false);
  }

  function formatarData(data: string | null | undefined) {
    if (!data) return "Sem data";

    const date = new Date(data);

    if (Number.isNaN(date.getTime())) return data;

    return date.toLocaleDateString("pt-PT");
  }

  function numeroDoEstagio(estagio: Estagio) {
    const nome = estagio.edicoes_estagio?.ensinos_clinicos?.nome || "";

    const match = nome.match(/Ensino Clínico\s*(\d+)/i);

    if (match?.[1]) {
      return Number(match[1]);
    }

    return null;
  }

  function corDoEstagio(estagio: Estagio) {
    const numero = numeroDoEstagio(estagio);

    if (!numero) return "#FDB515";

    return CORES_ESTAGIOS[numero - 1] || "#FDB515";
  }

  function textoEstadoAvaliacao(estagio: Estagio) {
    if (estagio.avaliacao?.nota_final !== null && estagio.avaliacao?.nota_final !== undefined) {
      return "Avaliada";
    }

    if (estagio.estado_estagio === "aguarda_avaliacao") {
      return "A aguardar avaliação";
    }

    if (estagio.estado_estagio === "concluido") {
      return "Concluído";
    }

    return "Sem nota";
  }

  function corEstadoAvaliacao(estagio: Estagio) {
    if (estagio.avaliacao?.nota_final !== null && estagio.avaliacao?.nota_final !== undefined) {
      return "#CDEFD6";
    }

    if (estagio.estado_estagio === "aguarda_avaliacao") {
      return "#DDEBFF";
    }

    return "#FDE8B4";
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
          <Ionicons name="arrow-back-outline" size={24} color="#160909" />
          <Text style={styles.voltarTexto}>Voltar</Text>
        </Pressable>

        <Text style={styles.titulo}>Avaliações</Text>

        <Text style={styles.subtitulo}>
          Escolhe o ensino clínico onde queres consultar a avaliação.
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
              size={34}
              color="#FDB515"
            />

            <Text style={styles.vazioTitulo}>Sem estágios</Text>

            <Text style={styles.vazioTexto}>
              Ainda não tens ensinos clínicos associados.
            </Text>
          </View>
        ) : (
          <View style={styles.lista}>
            {estagiosOrdenados.map((estagio) => (
              <View
                key={estagio.id}
                style={[
                  styles.card,
                  {
                    borderLeftColor: corDoEstagio(estagio),
                  },
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitulo}>
                      {estagio.edicoes_estagio?.ensinos_clinicos?.nome ||
                        "Ensino Clínico"}
                    </Text>

                    <Text style={styles.cardSubtitulo}>
                      {estagio.edicoes_estagio?.instituicoes?.nome ||
                        "Instituição"}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.badgeEstado,
                      {
                        backgroundColor: corEstadoAvaliacao(estagio),
                      },
                    ]}
                  >
                    <Text style={styles.badgeTexto}>
                      {textoEstadoAvaliacao(estagio)}
                    </Text>
                  </View>
                </View>

                <View style={styles.linhaInfo}>
                  <Ionicons name="calendar-outline" size={18} color="#777" />

                  <Text style={styles.infoTexto}>
                    {formatarData(estagio.edicoes_estagio?.data_inicio)} -{" "}
                    {formatarData(estagio.edicoes_estagio?.data_fim)}
                  </Text>
                </View>

                <Text style={styles.infoTexto}>
                  Serviço:{" "}
                  {estagio.edicoes_estagio?.servicos?.nome || "Não indicado"}
                </Text>

                <Text style={styles.infoTexto}>
                  Docente: {estagio.professor?.nome || "Não indicado"}
                </Text>

                <Text style={styles.infoTexto}>
                  Orientador: {estagio.orientador?.nome || "Não indicado"}
                </Text>

                <Text style={styles.infoTexto}>
                  Nota final:{" "}
                  {estagio.avaliacao?.nota_final !== null &&
                  estagio.avaliacao?.nota_final !== undefined
                    ? `${estagio.avaliacao.nota_final} valores`
                    : "Ainda não lançada"}
                </Text>

                <Pressable
                  style={styles.botaoDetalhes}
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
                  <Text style={styles.textoDetalhes}>Ver avaliação</Text>

                  <Ionicons
                    name="chevron-forward-outline"
                    size={18}
                    color="#160909"
                  />
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}