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
import styles from "./avaliacaoStyles";

type EstagioAtual = {
  id: number;
  edicao_estagio_id: number;
  estado_estagio: string | null;
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

type Avaliacao = {
  id: number;
  nota_final: number | null;
  observacao_professor: string | null;
  observacao_orientador: string | null;
  observacao_final: string | null;
  estado: string | null;
  criado_em: string | null;
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

export default function AvaliacaoAluno() {
  const params = useLocalSearchParams();

  const from = params.from ? String(params.from) : "";
  const origem = params.origem ? String(params.origem) : "";

  const inscricaoIdParam = params.inscricaoId
    ? Number(params.inscricaoId)
    : null;

  const edicaoIdParam = params.edicaoId ? Number(params.edicaoId) : null;

  const mostrarBottomBar = from === "bottom";

  const [loading, setLoading] = useState(true);
  const [estagio, setEstagio] = useState<EstagioAtual | null>(null);
  const [avaliacao, setAvaliacao] = useState<Avaliacao | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace("/login/login" as any);
      return;
    }

    const userId = authData.user.id;

    let query = supabase
      .from("inscricoes_estagio")
      .select(`
        id,
        edicao_estagio_id,
        estado_estagio,
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
      .eq("aluno_id", userId);

    if (inscricaoIdParam) {
      query = query.eq("id", inscricaoIdParam);
    } else if (edicaoIdParam) {
      query = query.eq("edicao_estagio_id", edicaoIdParam);
    } else {
      query = query.order("id", { ascending: false }).limit(1);
    }

    const { data: estagioData, error: estagioError } = await query.maybeSingle();

    if (estagioError) {
      console.log("ERRO ESTÁGIO AVALIAÇÃO:", estagioError);
      setEstagio(null);
      setAvaliacao(null);
      setLoading(false);
      return;
    }

    if (!estagioData) {
      setEstagio(null);
      setAvaliacao(null);
      setLoading(false);
      return;
    }

    setEstagio(estagioData as any);

    const { data: avaliacaoData, error: avaliacaoError } = await supabase
      .from("avaliacoes")
      .select(`
        id,
        nota_final,
        observacao_professor,
        observacao_orientador,
        observacao_final,
        estado,
        criado_em
      `)
      .eq("aluno_id", userId)
      .eq("edicao_estagio_id", (estagioData as any).edicao_estagio_id)
      .maybeSingle();

    if (avaliacaoError) {
      console.log("ERRO AVALIAÇÃO:", avaliacaoError);
      setAvaliacao(null);
    } else {
      setAvaliacao((avaliacaoData as any) || null);
    }

    setLoading(false);
  }

  function formatarData(data: string | null | undefined) {
    if (!data) return "Sem data";

    const date = new Date(data);

    if (Number.isNaN(date.getTime())) return data;

    return date.toLocaleDateString("pt-PT");
  }

  function numeroDoEstagio() {
    const nome = estagio?.edicoes_estagio?.ensinos_clinicos?.nome || "";

    const match = nome.match(/Ensino Clínico\s*(\d+)/i);

    if (match?.[1]) {
      return Number(match[1]);
    }

    return null;
  }

  function corDoEstagio() {
    const numero = numeroDoEstagio();

    if (!numero) return "#FDB515";

    return CORES_ESTAGIOS[numero - 1] || "#FDB515";
  }

  function temNotaFinal() {
    return avaliacao?.nota_final !== null && avaliacao?.nota_final !== undefined;
  }

  function textoEstadoAvaliacao() {
    if (temNotaFinal()) {
      return "Avaliada";
    }

    if (estagio?.estado_estagio === "aguarda_avaliacao") {
      return "A aguardar avaliação";
    }

    if (estagio?.estado_estagio === "concluido") {
      return "Concluído";
    }

    return "Sem nota";
  }

  function corEstadoAvaliacao() {
    if (temNotaFinal()) {
      return "#CDEFD6";
    }

    if (estagio?.estado_estagio === "aguarda_avaliacao") {
      return "#DDEBFF";
    }

    return "#FDE8B4";
  }

  function voltarPaginaAnterior() {
    if (origem === "estagioAvaliacoes") {
      router.replace(
        "/aluno/avaliacao/estagioAvaliacoes/estagioAvaliacoes" as any
      );
      return;
    }

    if (origem === "detalheEstagio" && estagio) {
      router.replace({
        pathname: "/aluno/estagios/detalheEstagio/detalheEstagio" as any,
        params: {
          inscricaoId: String(estagio.id),
          edicaoId: String(estagio.edicao_estagio_id),
        },
      });
      return;
    }

    if (mostrarBottomBar) {
      router.replace("/aluno/home" as any);
      return;
    }

    router.replace("/aluno/estagios/estagio" as any);
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
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={styles.voltar} onPress={voltarPaginaAnterior}>
          <Ionicons name="arrow-back-outline" size={24} color="#160909" />
          <Text style={styles.voltarTexto}>Voltar</Text>
        </Pressable>

        <Text style={styles.titulo}>Avaliação</Text>

        {!estagio ? (
          <View style={styles.vazioCard}>
            <Ionicons
              name="information-circle-outline"
              size={34}
              color="#FDB515"
            />

            <Text style={styles.vazioTitulo}>Sem estágio</Text>

            <Text style={styles.vazioTexto}>
              Não foi encontrado nenhum ensino clínico para consultar.
            </Text>
          </View>
        ) : (
          <>
            <View
              style={[
                styles.cardEstagio,
                {
                  borderLeftColor: corDoEstagio(),
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
                      backgroundColor: corEstadoAvaliacao(),
                    },
                  ]}
                >
                  <Text style={styles.badgeTexto}>
                    {textoEstadoAvaliacao()}
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
            </View>

            <View style={styles.notaPrincipalCard}>
              <Text style={styles.notaLabel}>Nota final</Text>

              <Text style={styles.notaValor}>
                {temNotaFinal() ? avaliacao?.nota_final : "--"}
              </Text>

              <Text style={styles.notaSubtexto}>
                {temNotaFinal()
                  ? "valores"
                  : "Ainda não foi lançada nota final."}
              </Text>
            </View>

            <View style={styles.detalhesCard}>
              <Text style={styles.secaoTitulo}>Detalhes da avaliação</Text>

              <View style={styles.linhaNota}>
                <Text style={styles.linhaNotaLabel}>Estado</Text>
                <Text style={styles.linhaNotaValor}>
                  {avaliacao?.estado || textoEstadoAvaliacao()}
                </Text>
              </View>

              <View style={styles.linhaNota}>
                <Text style={styles.linhaNotaLabel}>Data de lançamento</Text>
                <Text style={styles.linhaNotaValor}>
                  {formatarData(avaliacao?.criado_em)}
                </Text>
              </View>
            </View>

            <View style={styles.observacoesCard}>
              <Text style={styles.secaoTitulo}>Observações</Text>

              <Text style={styles.observacaoTitulo}>Professor</Text>
              <Text style={styles.observacaoTexto}>
                {avaliacao?.observacao_professor ||
                  "Sem observação do professor."}
              </Text>

              <Text style={styles.observacaoTitulo}>Orientador</Text>
              <Text style={styles.observacaoTexto}>
                {avaliacao?.observacao_orientador ||
                  "Sem observação do orientador."}
              </Text>

              <Text style={styles.observacaoTitulo}>Observação final</Text>
              <Text style={styles.observacaoTexto}>
                {avaliacao?.observacao_final || "Sem observação final."}
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      {mostrarBottomBar && (
        <View style={styles.bottomBar}>
          <Pressable
            style={styles.bottomItem}
            onPress={() => router.push("/aluno/home" as any)}
          >
            <Ionicons name="home-outline" size={24} color="#160909" />
            <Text style={styles.bottomTexto}>Home</Text>
          </Pressable>

          <Pressable
            style={styles.bottomItem}
            onPress={() =>
              router.push(
                "/aluno/presencas/estagioPresencas/estagioPresencas?from=bottom" as any
              )
            }
          >
            <Ionicons name="calendar-outline" size={24} color="#160909" />
            <Text style={styles.bottomTexto}>Presenças</Text>
          </Pressable>

          <Pressable style={styles.bottomItem}>
            <Ionicons name="star-outline" size={24} color="#FDB515" />
            <Text style={styles.bottomTextoAtivo}>Avaliações</Text>
          </Pressable>

          <Pressable
            style={styles.bottomItem}
            onPress={() =>
              router.push("/aluno/agenda/agenda?from=bottom" as any)
            }
          >
            <Ionicons name="people-outline" size={24} color="#160909" />
            <Text style={styles.bottomTexto}>Agenda</Text>
          </Pressable>

          <Pressable
            style={styles.bottomItem}
            onPress={() =>
              router.push("/aluno/estagios/estagio?from=bottom" as any)
            }
          >
            <Ionicons name="briefcase-outline" size={24} color="#160909" />
            <Text style={styles.bottomTexto}>Ensinos Clínicos</Text>
          </Pressable>

          <Pressable
            style={styles.bottomItem}
            onPress={() =>
              router.push("/aluno/preencherPerfil/perfil?from=bottom" as any)
            }
          >
            <Ionicons name="person-outline" size={24} color="#160909" />
            <Text style={styles.bottomTexto}>Perfil</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}