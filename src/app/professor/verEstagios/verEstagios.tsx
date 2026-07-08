import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { supabase } from "../../../lib/supabase";
import styles from "./verEstagiosStyles";

type Estagio = {
  id: number;
  edicao_estagio_id: number;
  max_alunos: number | null;
  total_alunos: number;
  edicoes_estagio?: {
    id: number;
    data_inicio: string | null;
    data_fim: string | null;
    ano_letivo: string | null;
    vagas: number | null;
    ensinos_clinicos?: {
      nome: string;
      ano_curricular: number;
      tipo: string | null;
      horas_estimadas: number | null;
    } | null;
    instituicoes?: {
      nome: string;
    } | null;
    servicos?: {
      nome: string;
    } | null;
  } | null;
};

const CORES_ESTAGIOS = [
  "#2F80ED", // 1 azul
  "#A7F3D0", // 2 verde clarinho
  "#9B51E0", // 3 roxo
  "#F8BBD0", // 4 rosa
  "#C9A27E", // 5 castanho claro
  "#800020", // 6 bordo
  "#FDB515", // 7 amarelo
  "#8ED6FF", // 8 azul claro
  "#EB5757", // 9 vermelho
  "#BDBDBD", // 10 cinzento
  "#F2994A", // 11 laranja
];

export default function VerEstagiosProfessor() {
  const [loading, setLoading] = useState(true);
  const [estagios, setEstagios] = useState<Estagio[]>([]);
  const [tab, setTab] = useState<"ativos" | "historico">("ativos");

  useEffect(() => {
    carregarEstagios();
  }, []);

  function corDoEstagio(index: number) {
    return CORES_ESTAGIOS[index % CORES_ESTAGIOS.length];
  }

  function formatarData(data: string | null | undefined) {
    if (!data) return "Sem data";

    const date = new Date(data);

    if (Number.isNaN(date.getTime())) return "Sem data";

    return date.toLocaleDateString("pt-PT");
  }

  function estaAtivo(estagio: Estagio) {
    const estado = estagio.edicoes_estagio as any;

    if (estado?.estado === "inativo") return false;

    const dataFim = estagio.edicoes_estagio?.data_fim;

    if (!dataFim) return true;

    return new Date(dataFim) >= new Date();
  }

  async function carregarEstagios() {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace("/login/login" as any);
      return;
    }

    const userId = authData.user.id;

    const { data: equipasData, error: equipasError } = await supabase
      .from("professores_estagio")
      .select(
        `
        id,
        edicao_estagio_id,
        max_alunos,
        edicoes_estagio(
          id,
          data_inicio,
          data_fim,
          ano_letivo,
          vagas,
          ensinos_clinicos(nome, ano_curricular, tipo, horas_estimadas),
          instituicoes(nome),
          servicos(nome)
        )
      `
      )
      .eq("professor_id", userId)
      .order("id", { ascending: false });

    if (equipasError) {
      console.log("ERRO ESTÁGIOS PROFESSOR:", equipasError);
      setEstagios([]);
      setLoading(false);
      return;
    }

    const equipas = ((equipasData as any) || []) as Estagio[];

    const edicoesIds = equipas.map((item) => item.edicao_estagio_id);

    let inscricoesDistribuidas: any[] = [];

    if (edicoesIds.length > 0) {
      const { data: inscricoesData, error: inscricoesError } = await supabase
        .from("inscricoes_estagio")
        .select("id, edicao_estagio_id, estado, estado_estagio, distribuido_por")
        .in("edicao_estagio_id", edicoesIds);

      if (inscricoesError) {
        console.log("ERRO ALUNOS ESTÁGIOS:", inscricoesError);
      } else {
        inscricoesDistribuidas = ((inscricoesData as any) || []).filter(
          (inscricao: any) =>
            inscricao.estado !== "rejeitado" &&
            inscricao.estado_estagio !== "inativo" &&
            inscricao.estado_estagio !== "por_distribuir" &&
            (inscricao.estado === "aprovado" ||
              inscricao.estado_estagio === "em_curso" ||
              Boolean(inscricao.distribuido_por))
        );
      }
    }

    const estagiosComTotais = equipas.map((equipa) => {
      const totalAlunos = inscricoesDistribuidas.filter(
        (inscricao) => inscricao.edicao_estagio_id === equipa.edicao_estagio_id
      ).length;

      return {
        ...equipa,
        total_alunos: totalAlunos,
      };
    });

    setEstagios(estagiosComTotais);
    setLoading(false);
  }

  const estagiosFiltrados = estagios.filter((estagio) => {
    if (tab === "ativos") return estaAtivo(estagio);
    return !estaAtivo(estagio);
  });

  return (
    <View style={styles.page}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Pressable style={styles.voltar} onPress={() => router.push("/professor/home" as any)}>
          <Ionicons name="arrow-back-outline" size={24} color="#160909" />
          <Text style={styles.voltarTexto}>Voltar</Text>
        </Pressable>

        <Text style={styles.titulo}>Estágios</Text>

        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, tab === "ativos" && styles.tabAtiva]}
            onPress={() => setTab("ativos")}
          >
            <Text style={[styles.tabTexto, tab === "ativos" && styles.tabTextoAtivo]}>
              Ativos
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tab, tab === "historico" && styles.tabAtiva]}
            onPress={() => setTab("historico")}
          >
            <Text style={[styles.tabTexto, tab === "historico" && styles.tabTextoAtivo]}>
              Histórico
            </Text>
          </Pressable>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#FDB515" style={{ marginTop: 40 }} />
        ) : estagiosFiltrados.length === 0 ? (
          <Text style={styles.mensagemVazia}>
            Não existem estágios para mostrar.
          </Text>
        ) : (
          <View style={styles.lista}>
            {estagiosFiltrados.map((estagio, index) => {
              const cor = corDoEstagio(index);

              return (
                <View
                  key={estagio.id}
                  style={[styles.estagioCard, { borderLeftColor: cor }]}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.estagioTitulo}>
                      {estagio.edicoes_estagio?.ensinos_clinicos?.nome ||
                        "Ensino Clínico"}
                    </Text>

                    <View style={styles.estadoBadge}>
                      <Text style={styles.estadoTexto}>Em curso</Text>
                    </View>
                  </View>

                  <Text style={styles.estagioHospital}>
                    {estagio.edicoes_estagio?.instituicoes?.nome || "Instituição"}
                  </Text>

                  <View style={styles.dataLinha}>
                    <Ionicons name="calendar-outline" size={18} color="#777" />
                    <Text style={styles.estagioTexto}>
                      {formatarData(estagio.edicoes_estagio?.data_inicio)} -{" "}
                      {formatarData(estagio.edicoes_estagio?.data_fim)}
                    </Text>
                  </View>

                  <Text style={styles.estagioTexto}>
                    Serviço: {estagio.edicoes_estagio?.servicos?.nome || "Serviço"}
                  </Text>

                  <Text style={styles.estagioTexto}>
                    Alunos: {estagio.total_alunos}
                  </Text>

                  <Pressable
  style={styles.botaoDetalhes}
  onPress={() =>
    router.push({
      pathname:
        "/professor/verEstagios/alunosEstagio/alunosEstagio" as any,
      params: {
        edicaoId: String(estagio.edicao_estagio_id),
      },
    })
  }
>
  <Text style={styles.botaoDetalhesTexto}>Ver alunos</Text>
  <Ionicons
    name="chevron-forward-outline"
    size={22}
    color="#160909"
  />
</Pressable>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}