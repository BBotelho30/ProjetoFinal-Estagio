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
import { supabase } from "../../../../lib/supabase";
import styles from "./alunoEstagioStyles";

type Aluno = {
  id: string;
  nome: string;
  email: string;
  numero_identificacao: string | null;
  ano_curricular: number | null;
};

type Inscricao = {
  id: number;
  aluno_id: string;
  edicao_estagio_id: number;
  estado: string | null;
  estado_estagio: string | null;
  data_distribuicao: string | null;
};

type Edicao = {
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
};

export default function AlunosEstagioOrientador() {
  const params = useLocalSearchParams();
  const edicaoId = Number(params.edicaoId);

  const [loading, setLoading] = useState(true);
  const [edicao, setEdicao] = useState<Edicao | null>(null);
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);

  useEffect(() => {
    carregarDados();
  }, []);

  function formatarData(data: string | null | undefined) {
    if (!data) return "Sem data";

    const date = new Date(data);

    if (Number.isNaN(date.getTime())) return "Sem data";

    return date.toLocaleDateString("pt-PT");
  }

  function alunoDaInscricao(alunoId: string) {
    return alunos.find((aluno) => aluno.id === alunoId) || null;
  }

  function estagioConcluido() {
    if (inscricoes.length === 0) return false;

    return inscricoes.every(
      (inscricao) => inscricao.estado_estagio === "concluido"
    );
  }

  function textoEstado() {
    if (estagioConcluido()) return "Concluído";

    return "Em curso";
  }

  async function carregarDados() {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace("/login/login" as any);
      return;
    }

    const orientadorId = authData.user.id;

    const { data: edicaoData, error: edicaoError } = await supabase
      .from("edicoes_estagio")
      .select(
        `
        id,
        data_inicio,
        data_fim,
        ano_letivo,
        vagas,
        ensinos_clinicos(nome, ano_curricular, tipo, horas_estimadas),
        instituicoes(nome),
        servicos(nome)
      `
      )
      .eq("id", edicaoId)
      .maybeSingle();

    if (edicaoError) {
      console.log("ERRO EDIÇÃO ORIENTADOR:", edicaoError);
      setLoading(false);
      return;
    }

    setEdicao((edicaoData as any) || null);

    const { data: inscricoesData, error: inscricoesError } = await supabase
      .from("inscricoes_estagio")
      .select(
        "id, aluno_id, edicao_estagio_id, estado, estado_estagio, data_distribuicao"
      )
      .eq("edicao_estagio_id", edicaoId);

    if (inscricoesError) {
      console.log("ERRO INSCRIÇÕES ORIENTADOR:", inscricoesError);
      setInscricoes([]);
      setLoading(false);
      return;
    }

    const listaInscricoes = ((inscricoesData as any) || []).filter(
      (inscricao: Inscricao) =>
        inscricao.estado !== "rejeitado" &&
        inscricao.estado_estagio !== "inativo" &&
        inscricao.estado_estagio !== "por_distribuir" &&
        (inscricao.estado === "aprovado" ||
          inscricao.estado_estagio === "em_curso" ||
          inscricao.estado_estagio === "aguarda_relatorio" ||
          inscricao.estado_estagio === "aguarda_avaliacao" ||
          inscricao.estado_estagio === "concluido")
    ) as Inscricao[];

    setInscricoes(listaInscricoes);

    const alunosIds = Array.from(
      new Set(listaInscricoes.map((inscricao) => inscricao.aluno_id))
    );

    if (alunosIds.length > 0) {
      const { data: alunosData, error: alunosError } = await supabase
        .from("utilizadores")
        .select("id, nome, email, numero_identificacao, ano_curricular")
        .in("id", alunosIds)
        .order("nome", { ascending: true });

      if (alunosError) {
        console.log("ERRO ALUNOS ORIENTADOR:", alunosError);
        setAlunos([]);
      } else {
        setAlunos((alunosData as any) || []);
      }
    } else {
      setAlunos([]);
    }

    setLoading(false);
  }

  return (
    <View style={styles.page}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Pressable
          style={styles.voltar}
          onPress={() =>
            router.replace("/orientador/estagios/estagios" as any)
          }
        >
          <Ionicons name="arrow-back-outline" size={24} color="#160909" />
          <Text style={styles.voltarTexto}>Voltar</Text>
        </Pressable>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FDB515"
            style={{ marginTop: 40 }}
          />
        ) : (
          <>
            <View style={styles.heroCard}>
              <Text style={styles.heroTitulo}>
                {edicao?.ensinos_clinicos?.nome || "Ensino Clínico"}
              </Text>

              <Text style={styles.heroTexto}>
                {edicao?.instituicoes?.nome || "Instituição"}
              </Text>

              <Text style={styles.heroTexto}>
                {edicao?.servicos?.nome || "Serviço"}
              </Text>

              <Text style={styles.heroTexto}>
                {formatarData(edicao?.data_inicio)} -{" "}
                {formatarData(edicao?.data_fim)}
              </Text>

              <View
                style={[
                  styles.heroBadge,
                  estagioConcluido() && styles.heroBadgeConcluido,
                ]}
              >
                <Text
                  style={[
                    styles.heroBadgeTexto,
                    estagioConcluido() && styles.heroBadgeTextoConcluido,
                  ]}
                >
                  {textoEstado()}
                </Text>
              </View>
            </View>

            <Text style={styles.secaoTitulo}>Alunos</Text>

            {inscricoes.length === 0 ? (
              <Text style={styles.mensagemVazia}>
                Ainda não existem alunos associados a este estágio.
              </Text>
            ) : (
              <View style={styles.lista}>
                {inscricoes.map((inscricao) => {
                  const aluno = alunoDaInscricao(inscricao.aluno_id);

                  return (
                    <Pressable
                      key={inscricao.id}
                      style={styles.alunoCard}
                      onPress={() =>
                        router.push({
                          pathname:
                            "/orientador/estagios/detalhesAluno/detalhesAluno" as any,
                          params: {
                            inscricaoId: String(inscricao.id),
                            alunoId: String(inscricao.aluno_id),
                            edicaoId: String(edicaoId),
                          },
                        })
                      }
                    >
                      <View style={styles.alunoIcone}>
                        <Ionicons
                          name="person-outline"
                          size={25}
                          color="#160909"
                        />
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.alunoNome}>
                          {aluno?.nome || "Aluno"}
                        </Text>

                        <Text style={styles.alunoTexto}>
                          {aluno?.email || "Sem email"}
                        </Text>

                        <Text style={styles.alunoTexto}>
                          Nº {aluno?.numero_identificacao || "N/A"} ·{" "}
                          {aluno?.ano_curricular || "N/A"}.º ano
                        </Text>

                        {inscricao.estado_estagio === "concluido" ? (
                          <Text style={styles.alunoConcluidoTexto}>
                            Estágio concluído
                          </Text>
                        ) : null}
                      </View>

                      <Ionicons
                        name="chevron-forward-outline"
                        size={24}
                        color="#160909"
                      />
                    </Pressable>
                  );
                })}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}