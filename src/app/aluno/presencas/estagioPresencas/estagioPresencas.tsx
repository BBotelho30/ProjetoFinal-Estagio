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

type PessoaResumo = {
  nome: string;
} | null;

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
  professor?: PessoaResumo;
  orientador?: PessoaResumo;
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

  async function buscarProfessorDaEdicao(edicaoId: number) {
    const { data, error } = await supabase
      .from("professores_estagio")
      .select(`
        professor:utilizadores!professores_estagio_professor_id_fkey(nome)
      `)
      .eq("edicao_estagio_id", edicaoId)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.log("ERRO PROFESSOR DA EDIÇÃO PRESENÇAS:", error);
      return null;
    }

    return (data as any)?.professor || null;
  }

  async function buscarOrientadorDaEdicao(edicaoId: number) {
    const { data, error } = await supabase
      .from("orientadores_estagio")
      .select(`
        orientador:utilizadores!orientadores_estagio_orientador_id_fkey(nome)
      `)
      .eq("edicao_estagio_id", edicaoId)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.log("ERRO ORIENTADOR DA EDIÇÃO PRESENÇAS:", error);
      return null;
    }

    return (data as any)?.orientador || null;
  }

  async function carregarEstagios() {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace("/login/login" as any);
      return;
    }

    const alunoId = authData.user.id;

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
      .eq("aluno_id", alunoId)
      .order("id", { ascending: false });

    if (error) {
      console.log("ERRO ESTÁGIOS PRESENÇAS:", error);
      setEstagios([]);
      setLoading(false);
      return;
    }

    console.log("TODOS ESTÁGIOS PRESENÇAS:", data);

    const listaValida = ((data as any) || []).filter((item: Estagio) => {
      return item.estado_estagio !== "concluido";
    }) as Estagio[];

    console.log("ESTÁGIOS FILTRADOS PRESENÇAS:", listaValida);

    const listaComNomes = await Promise.all(
      listaValida.map(async (estagio: Estagio) => {
        const edicaoId = estagio.edicoes_estagio?.id;

        let professorFinal = estagio.professor || null;
        let orientadorFinal = estagio.orientador || null;

        if (estagio.professor_id && !professorFinal) {
          const { data: professorData, error: professorError } = await supabase
            .from("utilizadores")
            .select("nome")
            .eq("id", estagio.professor_id)
            .maybeSingle();

          if (professorError) {
            console.log("ERRO PROFESSOR DIRETO:", professorError);
          }

          professorFinal = (professorData as any) || null;
        }

        if (estagio.orientador_id && !orientadorFinal) {
          const { data: orientadorData, error: orientadorError } =
            await supabase
              .from("utilizadores")
              .select("nome")
              .eq("id", estagio.orientador_id)
              .maybeSingle();

          if (orientadorError) {
            console.log("ERRO ORIENTADOR DIRETO:", orientadorError);
          }

          orientadorFinal = (orientadorData as any) || null;
        }

        if (edicaoId && !professorFinal) {
          professorFinal = await buscarProfessorDaEdicao(edicaoId);
        }

        if (edicaoId && !orientadorFinal) {
          orientadorFinal = await buscarOrientadorDaEdicao(edicaoId);
        }

        return {
          ...estagio,
          professor: professorFinal,
          orientador: orientadorFinal,
        };
      })
    );

    console.log("ESTÁGIOS COM NOMES PRESENÇAS:", listaComNomes);

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

    const ensinoClinicoId = estagio.edicoes_estagio?.id;

    if (ensinoClinicoId) {
      return Number(ensinoClinicoId);
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
    if (estado === "por_distribuir") return "Por distribuir";
    if (estado === "inativo") return "Inativo";
    return "Em curso";
  }

  function corEstado(estado: string | null) {
    if (estado === "concluido") return "#CDEFD6";
    if (estado === "aguarda_relatorio") return "#FDE8B4";
    if (estado === "aguarda_avaliacao") return "#DDEBFF";
    if (estado === "por_distribuir") return "#E9E9E9";
    if (estado === "inativo") return "#E9E9E9";
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