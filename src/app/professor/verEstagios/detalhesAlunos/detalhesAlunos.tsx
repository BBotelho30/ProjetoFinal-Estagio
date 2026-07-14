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
import styles from "./detalhesAlunosStyles";

type Aluno = {
  id: string;
  nome: string;
  email: string;
  numero_identificacao: string | null;
  ano_curricular: number | null;
  telefone?: string | null;
  morada?: string | null;
  foto_url?: string | null;
};

type Inscricao = {
  id: number;
  aluno_id: string;
  edicao_estagio_id: number;
  estado: string | null;
  estado_estagio: string | null;
  data_inscricao: string | null;
  data_distribuicao: string | null;
  distribuido_por: string | null;
};

type Edicao = {
  id: number;
  data_inicio: string | null;
  data_fim: string | null;
  ano_letivo: string | null;
  vagas: number | null;
  estado: string | null;
  ensinos_clinicos?: {
    id?: number;
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

type Utilizador = {
  id: string;
  nome: string;
  email: string;
  tipo: string;
  foto_url: string | null;
};

type Avaliacao = {
  id: number;
  nota_professor: number | null;
  nota_orientador: number | null;
  nota_final: number | null;
  observacao_professor: string | null;
  observacao_orientador: string | null;
  observacao_final: string | null;
  estado: string | null;
  criado_em: string | null;
};

export default function DetalheAlunoProfessor() {
  const params = useLocalSearchParams();

  const inscricaoId = params.inscricaoId ? Number(params.inscricaoId) : null;
  const alunoId = params.alunoId ? String(params.alunoId) : null;
  const edicaoId = params.edicaoId ? Number(params.edicaoId) : null;

  const [loading, setLoading] = useState(true);

  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [inscricao, setInscricao] = useState<Inscricao | null>(null);
  const [edicao, setEdicao] = useState<Edicao | null>(null);

  const [professores, setProfessores] = useState<Utilizador[]>([]);
  const [orientadores, setOrientadores] = useState<Utilizador[]>([]);

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

  function textoEstado() {
    if (!inscricao) return "Sem estado";

    if (inscricao.estado_estagio === "inativo") return "Inativo";
    if (inscricao.estado_estagio === "concluido") return "Concluído";
    if (inscricao.estado === "aprovado") return "Em curso";

    return inscricao.estado_estagio || inscricao.estado || "Sem estado";
  }

  function textoOrigem() {
    if (!inscricao?.distribuido_por) return "Sem origem";

    if (inscricao.distribuido_por === "admin") return "SuperAdmin";

    if (inscricao.distribuido_por === "professor_responsavel") {
      return "Professor Responsável";
    }

    return inscricao.distribuido_por;
  }

  async function carregarDados() {
    setLoading(true);

    if (!inscricaoId || !alunoId || !edicaoId) {
      console.log("PARÂMETROS EM FALTA:", {
        inscricaoId,
        alunoId,
        edicaoId,
      });
      setLoading(false);
      return;
    }

    const { data: alunoData, error: alunoError } = await supabase
      .from("utilizadores")
      .select(
        "id, nome, email, numero_identificacao, ano_curricular, telefone, morada, foto_url",
      )
      .eq("id", alunoId)
      .maybeSingle();

    if (alunoError) {
      console.log("ERRO ALUNO:", alunoError);
    } else {
      setAluno((alunoData as any) || null);
    }

    const { data: inscricaoData, error: inscricaoError } = await supabase
      .from("inscricoes_estagio")
      .select(
        `
        id,
        aluno_id,
        edicao_estagio_id,
        estado,
        estado_estagio,
        data_inscricao,
        data_distribuicao,
        distribuido_por
      `,
      )
      .eq("id", inscricaoId)
      .maybeSingle();

    if (inscricaoError) {
      console.log("ERRO INSCRIÇÃO:", inscricaoError);
    } else {
      setInscricao((inscricaoData as any) || null);
    }

    const { data: edicaoData, error: edicaoError } = await supabase
      .from("edicoes_estagio")
      .select(
        `
        id,
        data_inicio,
        data_fim,
        ano_letivo,
        vagas,
        estado,
        ensinos_clinicos(id, nome, ano_curricular, tipo, horas_estimadas),
        instituicoes(nome),
        servicos(nome)
      `,
      )
      .eq("id", edicaoId)
      .maybeSingle();

    if (edicaoError) {
      console.log("ERRO EDIÇÃO:", edicaoError);
    } else {
      setEdicao((edicaoData as any) || null);
    }

    await carregarEquipa(edicaoId);
    await carregarAvaliacao(alunoId, edicaoId);

    setLoading(false);
  }

  async function carregarEquipa(edicaoIdAtual: number) {
    const { data: professoresData, error: professoresError } = await supabase
      .from("professores_estagio")
      .select("professor_id")
      .eq("edicao_estagio_id", edicaoIdAtual);

    const { data: orientadoresData, error: orientadoresError } = await supabase
      .from("orientadores_estagio")
      .select("orientador_id")
      .eq("edicao_estagio_id", edicaoIdAtual);

    if (professoresError || orientadoresError) {
      console.log("ERRO EQUIPA:", professoresError || orientadoresError);
      setProfessores([]);
      setOrientadores([]);
      return;
    }

    const professoresIds =
      ((professoresData as any) || []).map((item: any) => item.professor_id) ||
      [];

    const orientadoresIds =
      ((orientadoresData as any) || []).map(
        (item: any) => item.orientador_id,
      ) || [];

    if (professoresIds.length > 0) {
      const { data, error } = await supabase
        .from("utilizadores")
        .select("id, nome, email, tipo, foto_url")
        .in("id", professoresIds);

      if (error) {
        console.log("ERRO PROFESSORES:", error);
        setProfessores([]);
      } else {
        setProfessores((data as any) || []);
      }
    } else {
      setProfessores([]);
    }

    if (orientadoresIds.length > 0) {
      const { data, error } = await supabase
        .from("utilizadores")
        .select("id, nome, email, tipo, foto_url")
        .in("id", orientadoresIds);

      if (error) {
        console.log("ERRO ORIENTADORES:", error);
        setOrientadores([]);
      } else {
        setOrientadores((data as any) || []);
      }
    } else {
      setOrientadores([]);
    }
  }

  async function carregarAvaliacao(
    alunoIdAtual: string,
    edicaoIdAtual: number,
  ) {
    const { data, error } = await supabase
      .from("avaliacoes")
      .select(
        `
      id,
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
      .eq("aluno_id", alunoIdAtual)
      .eq("edicao_estagio_id", edicaoIdAtual)
      .maybeSingle();

    if (error) {
      console.log("AVALIAÇÃO NÃO CARREGADA:", error);
      setAvaliacao(null);
      return;
    }

    setAvaliacao((data as any) || null);
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
            router.replace({
              pathname:
                "/professor/verEstagios/alunosEstagio/alunosEstagio" as any,
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
            <View style={styles.alunoHero}>
              {aluno?.foto_url ? (
                <Image
                  source={{ uri: aluno.foto_url }}
                  style={styles.fotoAluno}
                />
              ) : (
                <View style={styles.alunoIconeGrande}>
                  <Ionicons name="person-outline" size={42} color="#160909" />
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

                <View style={styles.estadoBadge}>
                  <Text style={styles.estadoBadgeTexto}>{textoEstado()}</Text>
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

              <View style={styles.estagioBadge}>
                <Text style={styles.estagioBadgeTexto}>
                  {edicao?.estado || "ativo"}
                </Text>
              </View>
            </View>

            <Text style={styles.secaoTitulo}>Equipa</Text>

            <View style={styles.equipaCard}>
              <View style={styles.equipaIcone}>
                {professores && professores[0]?.foto_url ? (
                  <Image
                    source={{ uri: professores[0].foto_url }}
                    style={styles.equipaFoto}
                  />
                ) : (
                  <Ionicons
                    name="person-circle-outline"
                    size={44}
                    color="#FDB515"
                  />
                )}
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.equipaTitulo}>Professor Orientador</Text>

                <Text style={styles.equipaTexto}>
                  {professores.length > 0
                    ? professores.map((professor) => professor.nome).join(", ")
                    : "Não indicado"}
                </Text>
              </View>
            </View>

            <View style={styles.equipaCard}>
              <View style={styles.equipaIcone}>
                {orientadores && orientadores[0]?.foto_url ? (
                  <Image
                    source={{ uri: orientadores[0].foto_url }}
                    style={styles.equipaFoto}
                  />
                ) : (
                  <Ionicons
                    name="person-circle-outline"
                    size={44}
                    color="#FDB515"
                  />
                )}
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.equipaTitulo}>Orientador de Estágio</Text>

                <Text style={styles.equipaTexto}>
                  {orientadores.length > 0
                    ? orientadores
                        .map((orientador) => orientador.nome)
                        .join(", ")
                    : "Não indicado"}
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
                  {edicao?.ensinos_clinicos?.tipo || "ambos"}
                </Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Horas</Text>
                <Text style={styles.infoValor}>
                  {edicao?.ensinos_clinicos?.horas_estimadas || "N/A"}h
                </Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Ano letivo</Text>
                <Text style={styles.infoValor}>
                  {edicao?.ano_letivo || "N/A"}
                </Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Data inscrição</Text>
                <Text style={styles.infoValor}>
                  {formatarData(inscricao?.data_inscricao)}
                </Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Distribuído por</Text>
                <Text style={styles.infoValor}>{textoOrigem()}</Text>
              </View>
            </View>

            <Text style={styles.secaoTitulo}>Ações rápidas</Text>

            <View style={styles.acoesLista}>
              <Pressable
                style={styles.acaoCard}
                onPress={() =>
                  router.push({
                    pathname:
                      "/professor/verEstagios/detalhesAlunos/presencas/presencas" as any,
                    params: {
                      alunoId: alunoId || "",
                      edicaoId: String(edicaoId || ""),
                      inscricaoId: String(inscricaoId || ""),
                    },
                  })
                }
              >
                <View style={styles.acaoLeft}>
                  <Ionicons name="calendar-outline" size={24} color="#160909" />
                  <Text style={styles.acaoTexto}>Validar presenças</Text>
                </View>

                <Ionicons
                  name="chevron-forward-outline"
                  size={25}
                  color="#160909"
                />
              </Pressable>

              <Pressable
                style={styles.acaoCard}
                onPress={() =>
                  router.push({
                    pathname:
                      "/professor/verEstagios/detalhesAlunos/avaliacoes/avaliacoes" as any,
                    params: {
                      alunoId: alunoId || "",
                      edicaoId: String(edicaoId || ""),
                      inscricaoId: String(inscricaoId || ""),
                    },
                  })
                }
              >
                <View style={styles.acaoLeft}>
                  <Ionicons name="star-outline" size={24} color="#160909" />
                  <Text style={styles.acaoTexto}>Dar nota</Text>
                </View>

                <Ionicons
                  name="chevron-forward-outline"
                  size={25}
                  color="#160909"
                />
              </Pressable>

              <Pressable
                style={styles.acaoCard}
                onPress={() =>
                  router.push({
                    pathname: "/professor/verEstagios/reunioes/reunioes" as any,
                    params: {
                      alunoId: alunoId || "",
                      edicaoId: String(edicaoId || ""),
                      inscricaoId: String(inscricaoId || ""),
                    },
                  })
                }
              >
                <View style={styles.acaoLeft}>
                  <Ionicons name="time-outline" size={24} color="#160909" />
                  <Text style={styles.acaoTexto}>Agendar reunião</Text>
                </View>

                <Ionicons
                  name="chevron-forward-outline"
                  size={25}
                  color="#160909"
                />
              </Pressable>

              <Pressable
                style={styles.acaoCard}
                onPress={() =>
                  router.push({
                    pathname:
                      "/professor/verEstagios/relatorios/relatorios" as any,
                    params: {
                      alunoId: alunoId || "",
                      edicaoId: String(edicaoId || ""),
                      inscricaoId: String(inscricaoId || ""),
                    },
                  })
                }
              >
                <View style={styles.acaoLeft}>
                  <Ionicons
                    name="document-text-outline"
                    size={24}
                    color="#160909"
                  />
                  <Text style={styles.acaoTexto}>Ver relatório final</Text>
                </View>

                <Ionicons
                  name="chevron-forward-outline"
                  size={25}
                  color="#160909"
                />
              </Pressable>


              <Pressable
                style={styles.acaoCard}
                onPress={() =>
                  router.push({
                    pathname:
                      "/professor/verEstagios/relatorioOrientador/relatorioOrientador" as any,
                    params: {
                      alunoId: alunoId || "",
                      edicaoId: String(edicaoId || ""),
                      inscricaoId: String(inscricaoId || ""),
                    },
                  })
                }
              >
                <View style={styles.acaoLeft}>
                  <Ionicons
                    name="document-text-outline"
                    size={24}
                    color="#160909"
                  />
                  <Text style={styles.acaoTexto}>Ver anexos orientador</Text>
                </View>

                <Ionicons
                  name="chevron-forward-outline"
                  size={25}
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
