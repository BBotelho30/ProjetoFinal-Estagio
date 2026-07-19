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
import { supabase } from "../../../lib/supabase";
import styles from "./estagiosStyles";

type EdicaoOrientador = {
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

type InscricaoOrientador = {
  id: number;
  aluno_id: string;
  edicao_estagio_id: number;
  estado: string | null;
  estado_estagio: string | null;
};

type EstagioAgrupado = {
  edicao_estagio_id: number;
  edicao: EdicaoOrientador;
  inscricoes: InscricaoOrientador[];
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

export default function EnsinosClinicosOrientador() {
  const [loading, setLoading] = useState(true);
  const [estagios, setEstagios] = useState<EstagioAgrupado[]>([]);
  const [tab, setTab] = useState<"ativos" | "historico">("ativos");

  useEffect(() => {
    carregarEstagios();
  }, []);

  const estagiosFiltrados = useMemo(() => {
    return estagios.filter((estagio) => {
      const concluido = estagioConcluido(estagio);

      if (tab === "historico") return concluido;

      return !concluido;
    });
  }, [estagios, tab]);

  function numeroDoEstagio(nomeEstagio?: string | null) {
    const nome = nomeEstagio || "";
    const match = nome.match(/Ensino Clínico\s*(\d+)/i);

    if (match?.[1]) return Number(match[1]);

    return null;
  }

  function corDoEstagio(nomeEstagio?: string | null) {
    const numero = numeroDoEstagio(nomeEstagio);

    if (!numero) return "#FDB515";

    return CORES_ESTAGIOS[numero - 1] || "#FDB515";
  }

  function formatarData(data: string | null | undefined) {
    if (!data) return "Sem data";

    const date = new Date(data);

    if (Number.isNaN(date.getTime())) return "Sem data";

    return date.toLocaleDateString("pt-PT");
  }

  function estagioConcluido(estagio: EstagioAgrupado) {
    if (estagio.inscricoes.length === 0) return false;

    return estagio.inscricoes.every(
      (inscricao) => inscricao.estado_estagio === "concluido"
    );
  }

  function textoEstado(estagio: EstagioAgrupado) {
    if (estagioConcluido(estagio)) return "Concluído";

    return "Em curso";
  }

  function corBadge(estagio: EstagioAgrupado) {
    if (estagioConcluido(estagio)) return "#CDEFD6";

    return "#CDEFD6";
  }

  async function carregarEstagios() {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace("/login/login" as any);
      return;
    }

    const orientadorId = authData.user.id;

    const { data: associacoesData, error: associacoesError } = await supabase
      .from("orientadores_estagio")
      .select("edicao_estagio_id")
      .eq("orientador_id", orientadorId);

    if (associacoesError) {
      console.log("ERRO ASSOCIAÇÕES ORIENTADOR:", associacoesError);
      setEstagios([]);
      setLoading(false);
      return;
    }

    const edicoesIds = Array.from(
      new Set(
        ((associacoesData as any) || [])
          .map((item: any) => item.edicao_estagio_id)
          .filter(Boolean)
      )
    );

    if (edicoesIds.length === 0) {
      setEstagios([]);
      setLoading(false);
      return;
    }

    const { data: edicoesData, error: edicoesError } = await supabase
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
      .in("id", edicoesIds);

    if (edicoesError) {
      console.log("ERRO EDIÇÕES ORIENTADOR:", edicoesError);
      setEstagios([]);
      setLoading(false);
      return;
    }

    const { data: inscricoesData, error: inscricoesError } = await supabase
      .from("inscricoes_estagio")
      .select(`
        id,
        aluno_id,
        edicao_estagio_id,
        estado,
        estado_estagio
      `)
      .in("edicao_estagio_id", edicoesIds)
      .neq("estado", "rejeitado")
      .neq("estado_estagio", "inativo")
      .neq("estado_estagio", "por_distribuir")
      .order("id", { ascending: false });

    if (inscricoesError) {
      console.log("ERRO INSCRIÇÕES ORIENTADOR:", inscricoesError);
      setEstagios([]);
      setLoading(false);
      return;
    }

    const listaEdicoes = ((edicoesData as any) || []) as EdicaoOrientador[];
    const listaInscricoes = ((inscricoesData as any) ||
      []) as InscricaoOrientador[];

    const listaFinal: EstagioAgrupado[] = listaEdicoes.map((edicao) => {
      const inscricoesDaEdicao = listaInscricoes.filter(
        (inscricao) => inscricao.edicao_estagio_id === edicao.id
      );

      return {
        edicao_estagio_id: edicao.id,
        edicao,
        inscricoes: inscricoesDaEdicao,
      };
    });

    setEstagios(listaFinal);
    setLoading(false);
  }

  return (
    <View style={styles.page}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Pressable
          style={styles.voltar}
          onPress={() => router.replace("/orientador/home" as any)}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#160909" />
          <Text style={styles.voltarTexto}>Voltar</Text>
        </Pressable>

        <Text style={styles.titulo}>Os meus estágios</Text>

        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, tab === "ativos" && styles.tabAtiva]}
            onPress={() => setTab("ativos")}
          >
            <Text
              style={[
                styles.tabTexto,
                tab === "ativos" && styles.tabTextoAtivo,
              ]}
            >
              Ativos
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tab, tab === "historico" && styles.tabAtiva]}
            onPress={() => setTab("historico")}
          >
            <Text
              style={[
                styles.tabTexto,
                tab === "historico" && styles.tabTextoAtivo,
              ]}
            >
              Histórico
            </Text>
          </Pressable>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FDB515"
            style={{ marginTop: 40 }}
          />
        ) : estagiosFiltrados.length === 0 ? (
          <Text style={styles.mensagemVazia}>
            {tab === "ativos"
              ? "Não existem estágios ativos para mostrar."
              : "Ainda não existem estágios concluídos."}
          </Text>
        ) : (
          <View style={styles.lista}>
            {estagiosFiltrados.map((estagio) => {
              const edicao = estagio.edicao;

              const nomeEstagio =
                edicao?.ensinos_clinicos?.nome || "Ensino Clínico";

              return (
                <View
                  key={estagio.edicao_estagio_id}
                  style={[
                    styles.estagioCard,
                    {
                      borderLeftColor: corDoEstagio(nomeEstagio),
                    },
                  ]}
                >
                  <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.estagioTitulo}>{nomeEstagio}</Text>

                      <Text style={styles.estagioHospital}>
                        {edicao?.instituicoes?.nome || "Instituição"}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.estadoBadge,
                        {
                          backgroundColor: corBadge(estagio),
                        },
                      ]}
                    >
                      <Text style={styles.estadoTexto}>
                        {textoEstado(estagio)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.dataLinha}>
                    <Ionicons name="calendar-outline" size={18} color="#777" />

                    <Text style={styles.estagioTexto}>
                      {formatarData(edicao?.data_inicio)} -{" "}
                      {formatarData(edicao?.data_fim)}
                    </Text>
                  </View>

                  <Text style={styles.estagioTexto}>
                    Serviço: {edicao?.servicos?.nome || "Não indicado"}
                  </Text>

                  <Text style={styles.estagioTexto}>
                    Ano letivo: {edicao?.ano_letivo || "Não indicado"}
                  </Text>

                  <Text style={styles.estagioTexto}>
                    Alunos: {estagio.inscricoes.length}
                  </Text>

                  <Pressable
                    style={styles.botaoDetalhes}
                    onPress={() =>
                      router.push({
                        pathname:
                          "/orientador/estagios/alunosEstagio/alunoEstagio" as any,
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