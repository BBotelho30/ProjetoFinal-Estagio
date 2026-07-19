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

type InscricaoEstagio = {
  id: number;
  edicao_estagio_id: number;
  estado: string | null;
  estado_estagio: string | null;
  distribuido_por: string | null;
  professor_id: string | null;
  orientador_id: string | null;
};

type Estagio = {
  id: number;
  edicao_estagio_id: number;
  max_alunos: number | null;
  total_alunos: number;
  inscricoes: InscricaoEstagio[];
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

export default function VerEstagiosProfessor() {
  const [loading, setLoading] = useState(true);
  const [estagios, setEstagios] = useState<Estagio[]>([]);
  const [tab, setTab] = useState<"ativos" | "historico">("ativos");

  useEffect(() => {
    carregarEstagios();
  }, []);

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

  function formatarData(data: string | null | undefined) {
    if (!data) return "Sem data";

    const date = new Date(data);

    if (Number.isNaN(date.getTime())) return "Sem data";

    return date.toLocaleDateString("pt-PT");
  }

  function estagioConcluido(estagio: Estagio) {
    if (!estagio.inscricoes || estagio.inscricoes.length === 0) return false;

    return estagio.inscricoes.every(
      (inscricao) => inscricao.estado_estagio === "concluido"
    );
  }

  function estaAtivo(estagio: Estagio) {
    return !estagioConcluido(estagio);
  }

  function textoEstado(estagio: Estagio) {
    if (estagioConcluido(estagio)) return "Concluído";

    return "Em curso";
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
  }

  const equipas = ((equipasData as any) || []) as Estagio[];

  const edicoesDasEquipas: number[] = Array.from(
    new Set(
      equipas
        .map((item) => Number(item.edicao_estagio_id))
        .filter((id) => !Number.isNaN(id))
    )
  );

  const { data: inscricoesProfessorData, error: inscricoesProfessorError } =
    await supabase
      .from("inscricoes_estagio")
      .select(
        `
        id,
        edicao_estagio_id,
        estado,
        estado_estagio,
        distribuido_por,
        professor_id,
        orientador_id
      `
      )
      .eq("professor_id", userId);

  if (inscricoesProfessorError) {
    console.log(
      "ERRO INSCRIÇÕES DIRETAS DO PROFESSOR:",
      inscricoesProfessorError
    );
  }

  const edicoesDasInscricoes: number[] = Array.from(
    new Set(
      ((inscricoesProfessorData as any) || [])
        .map((item: any) => Number(item.edicao_estagio_id))
        .filter((id: number) => !Number.isNaN(id))
    )
  );

  const edicoesIds = Array.from(
    new Set([...edicoesDasEquipas, ...edicoesDasInscricoes])
  );

  if (edicoesIds.length === 0) {
    setEstagios([]);
    setLoading(false);
    return;
  }

  const { data: edicoesData, error: edicoesError } = await supabase
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
    .in("id", edicoesIds)
    .order("id", { ascending: false });

  if (edicoesError) {
    console.log("ERRO EDIÇÕES DO PROFESSOR:", edicoesError);
    setEstagios([]);
    setLoading(false);
    return;
  }

  const { data: inscricoesData, error: inscricoesError } = await supabase
    .from("inscricoes_estagio")
    .select(
      `
      id,
      edicao_estagio_id,
      estado,
      estado_estagio,
      distribuido_por,
      professor_id,
      orientador_id
    `
    )
    .in("edicao_estagio_id", edicoesIds);

  if (inscricoesError) {
    console.log("ERRO ALUNOS ESTÁGIOS:", inscricoesError);
    setEstagios([]);
    setLoading(false);
    return;
  }

  const inscricoesValidas = (((inscricoesData as any) ||
    []) as InscricaoEstagio[]).filter((inscricao) => {
    const pertenceAoProfessor =
      inscricao.professor_id === userId ||
      edicoesDasEquipas.includes(Number(inscricao.edicao_estagio_id));

    const estaValida =
      inscricao.estado !== "rejeitado" &&
      inscricao.estado_estagio !== "inativo" &&
      inscricao.estado_estagio !== "por_distribuir" &&
      (inscricao.estado === "aprovado" ||
        inscricao.estado_estagio === "em_curso" ||
        inscricao.estado_estagio === "aguarda_relatorio" ||
        inscricao.estado_estagio === "aguarda_avaliacao" ||
        inscricao.estado_estagio === "concluido" ||
        Boolean(inscricao.distribuido_por) ||
        Boolean(inscricao.professor_id) ||
        Boolean(inscricao.orientador_id));

    return pertenceAoProfessor && estaValida;
  });

  const estagiosComTotais = ((edicoesData as any) || [])
    .map((edicao: any) => {
      const inscricoesDaEdicao = inscricoesValidas.filter(
        (inscricao) => inscricao.edicao_estagio_id === edicao.id
      );

      const equipa = equipas.find(
        (item) => item.edicao_estagio_id === edicao.id
      );

      return {
        id: equipa?.id || edicao.id,
        edicao_estagio_id: edicao.id,
        max_alunos: equipa?.max_alunos || null,
        total_alunos: inscricoesDaEdicao.length,
        inscricoes: inscricoesDaEdicao,
        edicoes_estagio: edicao,
      };
    })
    .filter((estagio: Estagio) => estagio.total_alunos > 0);

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
              const cor = corDoEstagio(estagio);

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
                    <Text style={styles.estadoTexto}>{textoEstado(estagio)}</Text>
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