import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../../../../../lib/supabase";
import styles from "./alunosPresencasStyles";

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
    distribuido_por: string | null;
    professor_id: string | null;
    orientador_id: string | null;
  };

type Edicao = {
  id: number;
  ensino_clinico_id: number | null;
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

type PresencaResumo = {
  inscricao_id: number;
  total: number;
  validadas: number;
  pendentes: number;
};

type LinhaAluno = {
  inscricao: Inscricao;
  aluno: Aluno | null;
  edicao: Edicao | null;
  resumo: PresencaResumo;
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

export default function AlunosPresencasOrientador() {
  const [loading, setLoading] = useState(true);

  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [edicoes, setEdicoes] = useState<Edicao[]>([]);
  const [resumosPresencas, setResumosPresencas] = useState<PresencaResumo[]>(
    []
  );

  const [pesquisa, setPesquisa] = useState("");
  const [anoSelecionado, setAnoSelecionado] = useState<number | "todos">(
    "todos"
  );
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const linhas = useMemo(() => {
    const lista: LinhaAluno[] = inscricoes.map((inscricao) => {
      const aluno =
        alunos.find((item) => item.id === inscricao.aluno_id) || null;

      const edicao =
        edicoes.find((item) => item.id === inscricao.edicao_estagio_id) || null;

      const resumo =
        resumosPresencas.find((item) => item.inscricao_id === inscricao.id) || {
          inscricao_id: inscricao.id,
          total: 0,
          validadas: 0,
          pendentes: 0,
        };

      return {
        inscricao,
        aluno,
        edicao,
        resumo,
      };
    });

    return lista.sort((a, b) => {
      const anoA = a.edicao?.ensinos_clinicos?.ano_curricular || 99;
      const anoB = b.edicao?.ensinos_clinicos?.ano_curricular || 99;

      if (anoA !== anoB) return anoA - anoB;

      const nomeA = a.aluno?.nome || "";
      const nomeB = b.aluno?.nome || "";

      return nomeA.localeCompare(nomeB);
    });
  }, [inscricoes, alunos, edicoes, resumosPresencas]);

  const anosDisponiveis = useMemo(() => {
    const anos = Array.from(
      new Set(
        linhas
          .map((linha) => linha.edicao?.ensinos_clinicos?.ano_curricular)
          .filter(Boolean)
      )
    ) as number[];

    return anos.sort((a, b) => a - b);
  }, [linhas]);

  const linhasFiltradas = useMemo(() => {
    let resultado = linhas.filter(
      (linha) => linha.resumo.total === 0 || linha.resumo.pendentes > 0
    );

    if (anoSelecionado !== "todos") {
      resultado = resultado.filter(
        (linha) =>
          linha.edicao?.ensinos_clinicos?.ano_curricular === anoSelecionado
      );
    }

    if (pesquisa.trim()) {
      const termo = pesquisa.trim().toLowerCase();

      resultado = resultado.filter((linha) => {
        const texto = [
          linha.aluno?.nome,
          linha.aluno?.email,
          linha.aluno?.numero_identificacao,
          linha.edicao?.ensinos_clinicos?.nome,
          linha.edicao?.instituicoes?.nome,
          linha.edicao?.servicos?.nome,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return texto.includes(termo);
      });
    }

    return resultado;
  }, [linhas, anoSelecionado, pesquisa]);

  function formatarData(data: string | null | undefined) {
    if (!data) return "Sem data";

    const date = new Date(data);

    if (Number.isNaN(date.getTime())) return "Sem data";

    return date.toLocaleDateString("pt-PT");
  }

  function numeroDoEstagio(linha: LinhaAluno) {
    const nome = linha.edicao?.ensinos_clinicos?.nome || "";

    const match = nome.match(/Ensino Clínico\s*(\d+)/i);

    if (match?.[1]) {
      return Number(match[1]);
    }

    const ensinoClinicoId = linha.edicao?.ensino_clinico_id;

    if (ensinoClinicoId) {
      return Number(ensinoClinicoId);
    }

    return null;
  }

  function corDoEstagio(linha: LinhaAluno) {
    const numero = numeroDoEstagio(linha);

    if (!numero) return "#FDB515";

    return CORES_ESTAGIOS[numero - 1] || "#FDB515";
  }

  function textoEstado(linha: LinhaAluno) {
    if (linha.resumo.total === 0) return "Sem registos";
    return `${linha.resumo.pendentes} por validar`;
  }

  async function carregarDados() {
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
    setInscricoes([]);
    setAlunos([]);
    setEdicoes([]);
    setResumosPresencas([]);
    setLoading(false);
    return;
  }

  const edicoesIds: number[] = Array.from(
    new Set(
      ((associacoesData as any) || [])
        .map((item: any) => Number(item.edicao_estagio_id))
        .filter((id: number) => !Number.isNaN(id))
    )
  );

  if (edicoesIds.length === 0) {
    setInscricoes([]);
    setAlunos([]);
    setEdicoes([]);
    setResumosPresencas([]);
    setLoading(false);
    return;
  }

  const { data: inscricoesData, error: inscricoesError } = await supabase
    .from("inscricoes_estagio")
    .select(
      `
      id,
      aluno_id,
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
    console.log("ERRO INSCRIÇÕES ORIENTADOR:", inscricoesError);
    setInscricoes([]);
    setLoading(false);
    return;
  }

  const inscricoesValidas = ((inscricoesData as any) || []).filter(
    (inscricao: Inscricao) =>
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
        Boolean(inscricao.orientador_id))
  ) as Inscricao[];

  setInscricoes(inscricoesValidas);

  const edicoesIdsValidas: number[] = Array.from(
    new Set(
      inscricoesValidas
        .map((inscricao) => Number(inscricao.edicao_estagio_id))
        .filter((id) => !Number.isNaN(id))
    )
  );

  if (edicoesIdsValidas.length === 0) {
    setAlunos([]);
    setEdicoes([]);
    setResumosPresencas([]);
    setLoading(false);
    return;
  }

  const { data: edicoesData, error: edicoesError } = await supabase
    .from("edicoes_estagio")
    .select(
      `
      id,
      ensino_clinico_id,
      data_inicio,
      data_fim,
      ano_letivo,
      ensinos_clinicos(nome, ano_curricular, tipo, horas_estimadas),
      instituicoes(nome),
      servicos(nome)
    `
    )
    .in("id", edicoesIdsValidas)
    .order("id", { ascending: false });

  if (edicoesError) {
    console.log("ERRO EDIÇÕES ORIENTADOR:", edicoesError);
    setEdicoes([]);
  } else {
    setEdicoes((edicoesData as any) || []);
  }

  const alunosIds: string[] = Array.from(
    new Set(
      inscricoesValidas
        .map((inscricao) => inscricao.aluno_id)
        .filter(Boolean)
    )
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

  const inscricoesIds = inscricoesValidas.map((inscricao) => inscricao.id);

  if (inscricoesIds.length > 0) {
    const { data: presencasData, error: presencasError } = await supabase
      .from("presencas")
      .select("id, inscricao_id, estado_orientador")
      .in("inscricao_id", inscricoesIds);

    if (presencasError) {
      console.log("ERRO PRESENÇAS ORIENTADOR:", presencasError);
      setResumosPresencas([]);
    } else {
      const resumos = inscricoesIds.map((inscricaoId) => {
        const presencasDaInscricao = ((presencasData as any) || []).filter(
          (presenca: any) => presenca.inscricao_id === inscricaoId
        );

        const total = presencasDaInscricao.length;

        const validadas = presencasDaInscricao.filter(
          (presenca: any) => presenca.estado_orientador === "validado"
        ).length;

        return {
          inscricao_id: inscricaoId,
          total,
          validadas,
          pendentes: total - validadas,
        };
      });

      setResumosPresencas(resumos);
    }
  } else {
    setResumosPresencas([]);
  }

  setLoading(false);
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
          onPress={() => router.replace("/orientador/home" as any)}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#160909" />
          <Text style={styles.voltarTexto}>Voltar</Text>
        </Pressable>

        <Text style={styles.titulo}>Presenças</Text>

        <Text style={styles.subtitulo}>
          Aqui aparecem apenas os alunos que orientas e que ainda precisam de
          validação.
        </Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FDB515"
            style={{ marginTop: 40 }}
          />
        ) : (
          <>
            <View style={styles.topRow}>
              <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color="#777" />

                <TextInput
                  style={styles.searchInput}
                  placeholder="Pesquisar aluno, número, estágio, hospital..."
                  placeholderTextColor="#999"
                  value={pesquisa}
                  onChangeText={setPesquisa}
                />
              </View>

              <Pressable
                style={styles.selectToggle}
                onPress={() => setMostrarFiltros(!mostrarFiltros)}
              >
                <Text style={styles.selectToggleText}>
                  {anoSelecionado === "todos"
                    ? "Todos"
                    : `${anoSelecionado}.º ano`}
                </Text>

                <Ionicons
                  name={
                    mostrarFiltros
                      ? "chevron-up-outline"
                      : "chevron-down-outline"
                  }
                  size={18}
                  color="#160909"
                />
              </Pressable>
            </View>

            {mostrarFiltros && (
              <View style={styles.dropdown}>
                <Pressable
                  style={[
                    styles.opcao,
                    anoSelecionado === "todos" && styles.opcaoSelecionada,
                  ]}
                  onPress={() => {
                    setAnoSelecionado("todos");
                    setMostrarFiltros(false);
                  }}
                >
                  <Text
                    style={[
                      styles.opcaoTexto,
                      anoSelecionado === "todos" &&
                        styles.opcaoTextoSelecionada,
                    ]}
                  >
                    Todos
                  </Text>
                </Pressable>

                {anosDisponiveis.map((ano) => (
                  <Pressable
                    key={ano}
                    style={[
                      styles.opcao,
                      anoSelecionado === ano && styles.opcaoSelecionada,
                    ]}
                    onPress={() => {
                      setAnoSelecionado(ano);
                      setMostrarFiltros(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.opcaoTexto,
                        anoSelecionado === ano &&
                          styles.opcaoTextoSelecionada,
                      ]}
                    >
                      {ano}.º ano
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}

            {linhasFiltradas.length === 0 ? (
              <View style={styles.vazioCard}>
                <Ionicons
                  name="information-circle-outline"
                  size={34}
                  color="#FDB515"
                />

                <Text style={styles.vazioTitulo}>Sem alunos pendentes</Text>

                <Text style={styles.vazioTexto}>
                  Não existem alunos com presenças por validar neste filtro.
                </Text>
              </View>
            ) : (
              <View style={styles.lista}>
                {linhasFiltradas.map((linha) => (
                  <Pressable
                    key={linha.inscricao.id}
                    style={[
                      styles.alunoCard,
                      {
                        borderLeftColor: corDoEstagio(linha),
                      },
                    ]}
                    onPress={() =>
                      router.push({
                        pathname:
                          "/orientador/estagios/presencas/presencasAluno" as any,
                        params: {
                          origem: "alunosPresencas",
                          inscricaoId: String(linha.inscricao.id),
                          alunoId: String(linha.inscricao.aluno_id),
                          edicaoId: String(linha.inscricao.edicao_estagio_id),
                        },
                      })
                    }
                  >
                    <View style={styles.cardTopo}>
                      <View style={styles.alunoIcone}>
                        <Ionicons
                          name="person-outline"
                          size={24}
                          color="#160909"
                        />
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.alunoNome}>
                          {linha.aluno?.nome || "Aluno"}
                        </Text>

                        <Text style={styles.alunoTexto}>
                          Nº {linha.aluno?.numero_identificacao || "N/A"} ·{" "}
                          {linha.aluno?.email || "Sem email"}
                        </Text>
                      </View>

                      <Ionicons
                        name="chevron-forward-outline"
                        size={24}
                        color="#160909"
                      />
                    </View>

                    <Text style={styles.estagioNome}>
                      {linha.edicao?.ensinos_clinicos?.nome ||
                        "Ensino Clínico"}
                    </Text>

                    <Text style={styles.estagioTexto}>
                      {linha.edicao?.ensinos_clinicos?.ano_curricular || "N/A"}
                      .º ano ·{" "}
                      {linha.edicao?.instituicoes?.nome || "Instituição"} ·{" "}
                      {linha.edicao?.servicos?.nome || "Serviço"}
                    </Text>

                    <Text style={styles.estagioTexto}>
                      {formatarData(linha.edicao?.data_inicio)} -{" "}
                      {formatarData(linha.edicao?.data_fim)}
                    </Text>

                    <View style={styles.infoLinha}>
                      <View style={styles.infoBox}>
                        <Text style={styles.infoNumero}>
                          {linha.resumo.total}
                        </Text>

                        <Text style={styles.infoLabel}>Registadas</Text>
                      </View>

                      <View style={styles.infoBox}>
                        <Text style={styles.infoNumero}>
                          {linha.resumo.pendentes}
                        </Text>

                        <Text style={styles.infoLabel}>Por validar</Text>
                      </View>
                    </View>

                    <View style={styles.estadoBadge}>
                      <Text style={styles.estadoTexto}>
                        {textoEstado(linha)}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}