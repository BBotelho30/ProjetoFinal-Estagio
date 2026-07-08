import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { supabase } from "../../../../lib/supabase";
import styles from "./detalhesAlunoStyles";

type Pessoa = {
  nome: string;
  email: string | null;
  foto_url: string | null;
};

type Aluno = {
  id: string;
  nome: string;
  email: string;
  foto_url: string | null;
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
  professor?: Pessoa | null;
  orientador?: Pessoa | null;
};

type Edicao = {
  id: number;
  data_inicio: string | null;
  data_fim: string | null;
  ano_letivo: string | null;
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

type Avaliacao = {
  nota_orientador: number | null;
  nota_final: number | null;
  observacao_orientador: string | null;
  estado: string | null;
};

export default function DetalhesAlunoOrientador() {
  const params = useLocalSearchParams();

  const inscricaoId = params.inscricaoId ? Number(params.inscricaoId) : null;
  const alunoId = params.alunoId ? String(params.alunoId) : "";
  const edicaoId = params.edicaoId ? Number(params.edicaoId) : null;

  const [loading, setLoading] = useState(true);

  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [inscricao, setInscricao] = useState<Inscricao | null>(null);
  const [edicao, setEdicao] = useState<Edicao | null>(null);
  const [avaliacao, setAvaliacao] = useState<Avaliacao | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  function formatarData(data: string | null | undefined) {
    if (!data) return "Sem data";

    const date = new Date(data);

    if (Number.isNaN(date.getTime())) return "Sem data";

    return date.toLocaleDateString("pt-PT");
  }

  function textoEstado(estado: string | null | undefined) {
    if (estado === "concluido") return "Concluído";
    if (estado === "aguarda_relatorio") return "A aguardar relatório";
    if (estado === "aguarda_avaliacao") return "A aguardar avaliação";
    return "Em curso";
  }

  function corEstado(estado: string | null | undefined) {
    if (estado === "concluido") return "#CDEFD6";
    return "#CDEFD6";
  }

  async function carregarDados() {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace("/login/login" as any);
      return;
    }

    const orientadorId = authData.user.id;

    if (!inscricaoId || !alunoId || !edicaoId) {
      console.log("PARÂMETROS INVÁLIDOS:", params);
      setLoading(false);
      return;
    }

    const { data: inscricaoData, error: inscricaoError } = await supabase
      .from("inscricoes_estagio")
      .select(`
        id,
        aluno_id,
        edicao_estagio_id,
        estado,
        estado_estagio,
        data_distribuicao,
        professor:utilizadores!inscricoes_estagio_professor_id_fkey(nome, email, foto_url),
        orientador:utilizadores!inscricoes_estagio_orientador_id_fkey(nome, email, foto_url)
      `)
      .eq("id", inscricaoId)
      .eq("aluno_id", alunoId)
      .eq("edicao_estagio_id", edicaoId)
      .eq("orientador_id", orientadorId)
      .maybeSingle();

    if (inscricaoError || !inscricaoData) {
      console.log("ERRO INSCRIÇÃO DETALHE ORIENTADOR:", inscricaoError);
      setLoading(false);
      return;
    }

    setInscricao((inscricaoData as any) || null);

    const { data: alunoData, error: alunoError } = await supabase
      .from("utilizadores")
      .select("id, nome, email, foto_url, numero_identificacao, ano_curricular")
      .eq("id", alunoId)
      .maybeSingle();

    if (alunoError) {
      console.log("ERRO ALUNO DETALHE ORIENTADOR:", alunoError);
      setAluno(null);
    } else {
      setAluno((alunoData as any) || null);
    }

    const { data: edicaoData, error: edicaoError } = await supabase
      .from("edicoes_estagio")
      .select(`
        id,
        data_inicio,
        data_fim,
        ano_letivo,
        ensinos_clinicos(nome, ano_curricular, tipo, horas_estimadas),
        instituicoes(nome),
        servicos(nome)
      `)
      .eq("id", edicaoId)
      .maybeSingle();

    if (edicaoError) {
      console.log("ERRO EDIÇÃO DETALHE ORIENTADOR:", edicaoError);
      setEdicao(null);
    } else {
      setEdicao((edicaoData as any) || null);
    }

    const { data: avaliacaoData, error: avaliacaoError } = await supabase
      .from("avaliacoes")
      .select("nota_orientador, nota_final, observacao_orientador, estado")
      .eq("aluno_id", alunoId)
      .eq("edicao_estagio_id", edicaoId)
      .maybeSingle();

    if (avaliacaoError) {
      console.log("ERRO AVALIAÇÃO ORIENTADOR:", avaliacaoError);
      setAvaliacao(null);
    } else {
      setAvaliacao((avaliacaoData as any) || null);
    }

    setLoading(false);
  }

  return (
    <View style={styles.page}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Pressable
          style={styles.voltar}
          onPress={() =>
            router.replace({
              pathname:
                "/orientador/estagios/alunosEstagio/alunosEstagio" as any,
              params: {
                edicaoId: String(edicaoId || ""),
              },
            })
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
            <View style={styles.alunoCard}>
              {aluno?.foto_url ? (
                <Image source={{ uri: aluno.foto_url }} style={styles.fotoAluno} />
              ) : (
                <View style={styles.alunoIcone}>
                  <Ionicons name="person-outline" size={36} color="#160909" />
                </View>
              )}

              <View style={{ flex: 1 }}>
                <Text style={styles.alunoNome}>{aluno?.nome || "Aluno"}</Text>

                <Text style={styles.alunoTexto}>
                  {aluno?.email || "Sem email"}
                </Text>

                <Text style={styles.alunoTexto}>
                  Nº {aluno?.numero_identificacao || "N/A"} ·{" "}
                  {aluno?.ano_curricular || "N/A"}.º ano
                </Text>

                <View
                  style={[
                    styles.alunoBadge,
                    {
                      backgroundColor: corEstado(inscricao?.estado_estagio),
                    },
                  ]}
                >
                  <Text style={styles.alunoBadgeTexto}>
                    {textoEstado(inscricao?.estado_estagio)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.estagioHero}>
              <Text style={styles.estagioHeroTitulo}>
                {edicao?.ensinos_clinicos?.nome || "Ensino Clínico"}
              </Text>

              <Text style={styles.estagioHeroTexto}>
                {edicao?.instituicoes?.nome || "Instituição"}
              </Text>

              <Text style={styles.estagioHeroTexto}>
                {edicao?.servicos?.nome || "Serviço"}
              </Text>

              <Text style={styles.estagioHeroTexto}>
                {formatarData(edicao?.data_inicio)} -{" "}
                {formatarData(edicao?.data_fim)}
              </Text>

              <View style={styles.estagioHeroBadge}>
                <Text style={styles.estagioHeroBadgeTexto}>Ativo</Text>
              </View>
            </View>

            <Text style={styles.secaoTitulo}>Equipa</Text>

            <View style={styles.pessoaCard}>
              <View style={styles.pessoaIcone}>
                <Ionicons name="person-circle-outline" size={54} color="#FDB515" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.pessoaLabel}>Professor Orientador</Text>
                <Text style={styles.pessoaNome}>
                  {inscricao?.professor?.nome || "Não indicado"}
                </Text>
              </View>
            </View>

            <View style={styles.pessoaCard}>
              <View style={styles.pessoaIcone}>
                <Ionicons name="person-circle-outline" size={54} color="#FDB515" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.pessoaLabel}>Orientador de Estágio</Text>
                <Text style={styles.pessoaNome}>
                  {inscricao?.orientador?.nome || "Não indicado"}
                </Text>
              </View>
            </View>

            <Text style={styles.secaoTitulo}>Informações</Text>

            <View style={styles.infoGrid}>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Ano curricular</Text>
                <Text style={styles.infoValor}>
                  {edicao?.ensinos_clinicos?.ano_curricular || "N/A"}.º ano
                </Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Tipo</Text>
                <Text style={styles.infoValor}>
                  {edicao?.ensinos_clinicos?.tipo || "Não indicado"}
                </Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Horas</Text>
                <Text style={styles.infoValor}>
                  {edicao?.ensinos_clinicos?.horas_estimadas || 0}h
                </Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Ano letivo</Text>
                <Text style={styles.infoValor}>
                  {edicao?.ano_letivo || "Não indicado"}
                </Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Data inscrição</Text>
                <Text style={styles.infoValor}>
                  {formatarData(inscricao?.data_distribuicao)}
                </Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Distribuído por</Text>
                <Text style={styles.infoValor}>Professor Responsável</Text>
              </View>
            </View>

            <Text style={styles.secaoTitulo}>Avaliação</Text>

            <View style={styles.avaliacaoCard}>
              {avaliacao?.nota_orientador || avaliacao?.nota_final ? (
                <>
                  <Text style={styles.avaliacaoNota}>
                    {avaliacao.nota_orientador || avaliacao.nota_final} valores
                  </Text>

                  <Text style={styles.avaliacaoTexto}>
                    {avaliacao.observacao_orientador || "Sem observações."}
                  </Text>
                </>
              ) : (
                <Text style={styles.avaliacaoTexto}>
                  A avaliação ainda não está disponível.
                </Text>
              )}
            </View>

            <Text style={styles.secaoTitulo}>Ações rápidas</Text>

            <View style={styles.acoesLista}>
              <Pressable
                style={styles.acaoCard}
                onPress={() =>
                  router.push({
                    pathname:
                      "/orientador/presencas/presencasAluno/presencasAluno" as any,
                    params: {
                      inscricaoId: String(inscricaoId || ""),
                      alunoId,
                      edicaoId: String(edicaoId || ""),
                      origem: "detalhesAluno",
                    },
                  })
                }
              >
                <Ionicons name="calendar-outline" size={24} color="#160909" />
                <Text style={styles.acaoTexto}>Validar presenças</Text>
                <Ionicons
                  name="chevron-forward-outline"
                  size={24}
                  color="#160909"
                />
              </Pressable>

              <Pressable
                style={styles.acaoCard}
                onPress={() =>
                  router.push({
                    pathname:
                      "/orientador/avaliacoes/avaliacaoAluno/avaliacaoAluno" as any,
                    params: {
                      inscricaoId: String(inscricaoId || ""),
                      alunoId,
                      edicaoId: String(edicaoId || ""),
                      origem: "detalhesAluno",
                    },
                  })
                }
              >
                <Ionicons name="star-outline" size={24} color="#160909" />
                <Text style={styles.acaoTexto}>Dar nota</Text>
                <Ionicons
                  name="chevron-forward-outline"
                  size={24}
                  color="#160909"
                />
              </Pressable>

              <Pressable
                style={styles.acaoCard}
                onPress={() =>
                  router.push({
                    pathname:
                      "/orientador/agenda/criarReuniao/criarReuniao" as any,
                    params: {
                      inscricaoId: String(inscricaoId || ""),
                      alunoId,
                      edicaoId: String(edicaoId || ""),
                      origem: "detalhesAluno",
                    },
                  })
                }
              >
                <Ionicons name="time-outline" size={24} color="#160909" />
                <Text style={styles.acaoTexto}>Agendar reunião</Text>
                <Ionicons
                  name="chevron-forward-outline"
                  size={24}
                  color="#160909"
                />
              </Pressable>

              <Pressable
                style={styles.acaoCard}
                onPress={() =>
                  router.push({
                    pathname:
                      "/orientador/comentarios/comentariosAluno/comentariosAluno" as any,
                    params: {
                      inscricaoId: String(inscricaoId || ""),
                      alunoId,
                      edicaoId: String(edicaoId || ""),
                      origem: "detalhesAluno",
                    },
                  })
                }
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={24}
                  color="#160909"
                />
                <Text style={styles.acaoTexto}>Comentários semanais</Text>
                <Ionicons
                  name="chevron-forward-outline"
                  size={24}
                  color="#160909"
                />
              </Pressable>

              <Pressable
                style={styles.acaoCard}
                onPress={() =>
                  router.push({
                    pathname:
                      "/orientador/relatorios/relatorioAluno/relatorioAluno" as any,
                    params: {
                      inscricaoId: String(inscricaoId || ""),
                      alunoId,
                      edicaoId: String(edicaoId || ""),
                      origem: "detalhesAluno",
                    },
                  })
                }
              >
                <Ionicons
                  name="document-text-outline"
                  size={24}
                  color="#160909"
                />
                <Text style={styles.acaoTexto}>Relatórios e anexos</Text>
                <Ionicons
                  name="chevron-forward-outline"
                  size={24}
                  color="#160909"
                />
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}