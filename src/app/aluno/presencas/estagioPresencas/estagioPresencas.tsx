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
import styles from "./estagioPresencasS";

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
};

const CORES_ESTAGIOS = [
  "#2F80ED", // Ensino Clínico 1
  "#A7F3D0", // Ensino Clínico 2
  "#9B51E0", // Ensino Clínico 3
  "#F8BBD0", // Ensino Clínico 4
  "#C9A27E", // Ensino Clínico 5
  "#800020", // Ensino Clínico 6
  "#FDB515", // Ensino Clínico 7
  "#8ED6FF", // Ensino Clínico 8
  "#EB5757", // Ensino Clínico 9
  "#BDBDBD", // Ensino Clínico 10
  "#F2994A", // Ensino Clínico 11
];

export default function EstagioPresencasAluno() {
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
        )
      `)
      .eq("aluno_id", authData.user.id)
      .order("id", { ascending: false });

    if (error) {
      console.log("ERRO ESTÁGIOS PRESENÇAS:", error);
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

    const listaComNomes = await Promise.all(
      listaValida.map(async (estagio: Estagio) => {
        let professor = null;
        let orientador = null;

        if (estagio.professor_id) {
          const { data: professorData } = await supabase
            .from("utilizadores")
            .select("nome")
            .eq("id", estagio.professor_id)
            .maybeSingle();

          professor = professorData;
        }

        if (estagio.orientador_id) {
          const { data: orientadorData } = await supabase
            .from("utilizadores")
            .select("nome")
            .eq("id", estagio.orientador_id)
            .maybeSingle();

          orientador = orientadorData;
        }

        return {
          ...estagio,
          professor,
          orientador,
        };
      })
    );

    setEstagios(listaComNomes as any);
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

  function textoEstado(estado: string | null) {
    if (estado === "aguarda_relatorio") return "A aguardar relatório";
    if (estado === "aguarda_avaliacao") return "A aguardar avaliação";
    if (estado === "concluido") return "Concluído";
    return "Em curso";
  }

  function corEstado(estado: string | null) {
    if (estado === "concluido") return "#CDEFD6";
    if (estado === "aguarda_relatorio") return "#FDE8B4";
    if (estado === "aguarda_avaliacao") return "#DDEBFF";
    return "#CDEFD6";
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

        <Text style={styles.titulo}>Presenças</Text>

        <Text style={styles.subtitulo}>
          Escolhe o ensino clínico onde queres consultar ou registar presenças.
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
                        backgroundColor: corEstado(estagio.estado_estagio),
                      },
                    ]}
                  >
                    <Text style={styles.badgeTexto}>
                      {textoEstado(estagio.estado_estagio)}
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

                <Pressable
                  style={styles.botaoDetalhes}
                  onPress={() =>
                    router.push({
                      pathname: "/aluno/presencas/presencas" as any,
                      params: {
                        inscricaoId: String(estagio.id),
                        edicaoId: String(estagio.edicao_estagio_id),
                        origem: "estagioPresencas",
                      },
                    })
                  }
                >
                  <Text style={styles.textoDetalhes}>Ver presenças</Text>

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