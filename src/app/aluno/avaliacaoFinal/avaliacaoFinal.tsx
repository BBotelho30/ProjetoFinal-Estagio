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
import styles from "./avaliacaoFinalStyles";

type Estagio = {
  id: number;
  aluno_id: string;
  edicao_estagio_id: number;
  estado_estagio: string | null;
  edicoes_estagio?: {
    id: number;
    data_inicio: string | null;
    data_fim: string | null;
    ensinos_clinicos?: {
      id: number;
      nome: string;
      ano_curricular: number;
      semestre: number;
    } | null;
    instituicoes?: {
      nome: string;
    } | null;
    servicos?: {
      nome: string;
    } | null;
  } | null;
};

type Avaliacao = {
  id: number;
  aluno_id: string | null;
  professor_id: string | null;
  orientador_id: string | null;
  edicao_estagio_id: number | null;
  nota_professor: number | null;
  nota_orientador: number | null;
  nota_final: number | null;
  observacao_professor: string | null;
  observacao_orientador: string | null;
  estado: string | null;
  criado_em: string | null;
};

export default function AvaliacaoAluno() {
  const params = useLocalSearchParams();

  const inscricaoId = params.inscricaoId ? Number(params.inscricaoId) : null;
  const edicaoId = params.edicaoId ? Number(params.edicaoId) : null;
  const origem = params.origem ? String(params.origem) : "home";

  const [loading, setLoading] = useState(true);
  const [estagio, setEstagio] = useState<Estagio | null>(null);
  const [avaliacao, setAvaliacao] = useState<Avaliacao | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  function formatarData(data?: string | null) {
    if (!data) return "Sem data";

    const date = new Date(data);

    if (Number.isNaN(date.getTime())) return "Sem data";

    return date.toLocaleDateString("pt-PT");
  }

  function formatarNota(nota?: number | null) {
    if (nota === null || nota === undefined) return "Ainda não atribuída";
    return `${nota} valores`;
  }

  function podeMostrarNotaFinal() {
    return (
      avaliacao?.nota_professor !== null &&
      avaliacao?.nota_professor !== undefined &&
      avaliacao?.nota_orientador !== null &&
      avaliacao?.nota_orientador !== undefined
    );
  }

  async function carregarDados() {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace("/login/login" as any);
      return;
    }

    const alunoId = authData.user.id;

    let query = supabase
      .from("inscricoes_estagio")
      .select(
        `
        id,
        aluno_id,
        edicao_estagio_id,
        estado_estagio,
        edicoes_estagio(
          id,
          data_inicio,
          data_fim,
          ensinos_clinicos(id, nome, ano_curricular, semestre),
          instituicoes(nome),
          servicos(nome)
        )
      `,
      )
      .eq("aluno_id", alunoId);

    if (inscricaoId) {
      query = query.eq("id", inscricaoId);
    } else if (edicaoId) {
      query = query.eq("edicao_estagio_id", edicaoId);
    } else {
      query = query.order("id", { ascending: false }).limit(1);
    }

    const { data: estagioData, error: estagioError } =
      await query.maybeSingle();

    if (estagioError) {
      console.log("ERRO ESTÁGIO AVALIAÇÃO:", estagioError);
      setEstagio(null);
      setAvaliacao(null);
      setLoading(false);
      return;
    }

    if (!estagioData) {
      console.log("SEM ESTÁGIO PARA AVALIAÇÃO");
      setEstagio(null);
      setAvaliacao(null);
      setLoading(false);
      return;
    }

    const estagioAtual = estagioData as any;
    setEstagio(estagioAtual);

    console.log("ALUNO ID:", alunoId);
    console.log("EDIÇÃO ID PARA AVALIAÇÃO:", estagioAtual.edicao_estagio_id);

    const { data: avaliacaoData, error: avaliacaoError } = await supabase
      .from("avaliacoes")
      .select(
        `
        id,
        aluno_id,
        professor_id,
        orientador_id,
        edicao_estagio_id,
        nota_professor,
        nota_orientador,
        nota_final,
        observacao_professor,
        observacao_orientador,
        observacao_final,
        estado,
        criado_em
      `,
      )
      .eq("aluno_id", alunoId)
      .eq("edicao_estagio_id", estagioAtual.edicao_estagio_id)
      .order("criado_em", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (avaliacaoError) {
      console.log("ERRO AVALIAÇÃO ALUNO:", avaliacaoError);
      setAvaliacao(null);
    } else {
      console.log("AVALIAÇÃO ENCONTRADA:", avaliacaoData);
      setAvaliacao((avaliacaoData as any) || null);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FDB515" />
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Pressable
          style={styles.voltar}
          onPress={() =>
            inscricaoId
              ? router.push(
                  `/aluno/estagios/detalheEstagio/detalheEstagio?id=${inscricaoId}` as any,
                )
              : router.push("/aluno/home" as any)
          }
        >
          <Ionicons name="arrow-back-outline" size={24} color="#160909" />
          <Text style={styles.voltarTexto}>Voltar</Text>
        </Pressable>

        <Text style={styles.titulo}>Avaliação Final</Text>

        {!estagio ? (
          <Text style={styles.textoVazio}>
            Não foi possível encontrar o estágio selecionado.
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

              <Text style={styles.estagioTexto}>
                {formatarData(estagio.edicoes_estagio?.data_inicio)} -{" "}
                {formatarData(estagio.edicoes_estagio?.data_fim)}
              </Text>
            </View>

            <View style={styles.notaCard}>
              <Text style={styles.notaTitulo}>Nota final</Text>

              <Text style={styles.notaValor}>
                {podeMostrarNotaFinal() ? avaliacao?.nota_final : "--"}
              </Text>

              <Text style={styles.notaData}>
                {podeMostrarNotaFinal()
                  ? "valores"
                  : "Aguardando a avaliação do professor e do orientador."}
              </Text>
            </View>

            <Text style={styles.label}>Observação do professor</Text>

            <View style={styles.observacoesCard}>
              <View style={styles.observacaoHeader}>
                <Ionicons name="school-outline" size={24} color="#FDB515" />
                <Text style={styles.observacaoHeaderTexto}>Professor</Text>
              </View>

              <Text style={styles.observacoesTexto}>
                {avaliacao?.observacao_professor ||
                  "Ainda não existe observação registada pelo professor."}
              </Text>
            </View>

            <Text style={styles.label}>Observação do orientador</Text>

            <View style={styles.observacoesCard}>
              <View style={styles.observacaoHeader}>
                <Ionicons name="people-outline" size={24} color="#FDB515" />
                <Text style={styles.observacaoHeaderTexto}>Orientador</Text>
              </View>

              <Text style={styles.observacoesTexto}>
                {avaliacao?.observacao_orientador ||
                  "Ainda não existe observação registada pelo orientador."}
              </Text>
            </View>

            {!avaliacao ? (
              <Text style={styles.infoBloqueado}>
                Ainda não existe avaliação final registada para este estágio.
              </Text>
            ) : (
              <Text style={styles.infoBloqueado}>
                Estado: {avaliacao.estado || "pendente"} ·{" "}
                {formatarData(avaliacao.criado_em)}
              </Text>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
