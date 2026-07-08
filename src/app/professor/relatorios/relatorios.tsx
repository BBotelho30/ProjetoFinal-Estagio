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
import { supabase } from "../../../lib/supabase";
import styles from "./relatoriosStyles";

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

type RelatorioFinal = {
  id: number;
  inscricao_id: number;
  ficheiro_url: string | null;
  observacoes: string | null;
  estado: string | null;
  validado_por: string | null;
  data_validacao: string | null;
  criado_em: string | null;
};

type LinhaAluno = {
  inscricao: Inscricao;
  aluno: Aluno | null;
  edicao: Edicao | null;
  relatorio: RelatorioFinal | null;
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

export default function AlunosRelatoriosProfessor() {
  const [loading, setLoading] = useState(true);

  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [edicoes, setEdicoes] = useState<Edicao[]>([]);
  const [relatorios, setRelatorios] = useState<RelatorioFinal[]>([]);

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

      const relatorio =
        relatorios.find((item) => item.inscricao_id === inscricao.id) || null;

      return {
        inscricao,
        aluno,
        edicao,
        relatorio,
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
  }, [inscricoes, alunos, edicoes, relatorios]);

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
    let resultado = linhas.filter((linha) => {
      if (!linha.relatorio) return false;

      return (
        linha.relatorio.estado !== "validado" &&
        linha.relatorio.estado !== "rejeitado"
      );
    });

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
          linha.relatorio?.estado,
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

  function formatarDataHora(data: string | null | undefined) {
    if (!data) return "Sem data";

    const date = new Date(data);

    if (Number.isNaN(date.getTime())) return "Sem data";

    return `${date.toLocaleDateString("pt-PT")} às ${date.toLocaleTimeString(
      "pt-PT",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    )}`;
  }

  function numeroDoEstagio(linha: LinhaAluno) {
    const nome = linha.edicao?.ensinos_clinicos?.nome || "";

    const match = nome.match(/Ensino Clínico\s*(\d+)/i);

    if (match?.[1]) {
      return Number(match[1]);
    }

    return null;
  }

  function corDoEstagio(linha: LinhaAluno) {
    const numero = numeroDoEstagio(linha);

    if (!numero) return "#FDB515";

    return CORES_ESTAGIOS[numero - 1] || "#FDB515";
  }

  function textoEstado(linha: LinhaAluno) {
    if (!linha.relatorio) return "Sem relatório";

    if (linha.relatorio.estado === "submetido") return "Por validar";

    return linha.relatorio.estado || "Por validar";
  }

  async function carregarDados() {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace("/login/login" as any);
      return;
    }

    const professorId = authData.user.id;

    const { data: professoresEstagioData, error: professoresEstagioError } =
      await supabase
        .from("professores_estagio")
        .select("edicao_estagio_id")
        .eq("professor_id", professorId);

    if (professoresEstagioError) {
      console.log("ERRO PROFESSORES ESTÁGIO:", professoresEstagioError);
      setLoading(false);
      return;
    }

    const edicoesIds: number[] = Array.from(
      new Set(
        ((professoresEstagioData as any) || [])
          .map((item: any) => Number(item.edicao_estagio_id))
          .filter((id: number) => !Number.isNaN(id))
      )
    );

    if (edicoesIds.length === 0) {
      setInscricoes([]);
      setAlunos([]);
      setEdicoes([]);
      setRelatorios([]);
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
      .in("id", edicoesIds)
      .order("id", { ascending: false });

    if (edicoesError) {
      console.log("ERRO EDIÇÕES:", edicoesError);
      setEdicoes([]);
    } else {
      setEdicoes((edicoesData as any) || []);
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
        distribuido_por
      `
      )
      .in("edicao_estagio_id", edicoesIds);

    if (inscricoesError) {
      console.log("ERRO INSCRIÇÕES:", inscricoesError);
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
          Boolean(inscricao.distribuido_por))
    ) as Inscricao[];

    setInscricoes(inscricoesValidas);

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
        console.log("ERRO ALUNOS:", alunosError);
        setAlunos([]);
      } else {
        setAlunos((alunosData as any) || []);
      }
    } else {
      setAlunos([]);
    }

    const inscricoesIds = inscricoesValidas.map((inscricao) => inscricao.id);

    if (inscricoesIds.length > 0) {
      const { data: relatoriosData, error: relatoriosError } = await supabase
        .from("relatorios_finais")
        .select(
          `
          id,
          inscricao_id,
          ficheiro_url,
          observacoes,
          estado,
          validado_por,
          data_validacao,
          criado_em
        `
        )
        .in("inscricao_id", inscricoesIds)
        .order("criado_em", { ascending: false });

      if (relatoriosError) {
        console.log("ERRO RELATÓRIOS:", relatoriosError);
        setRelatorios([]);
      } else {
        const todos = ((relatoriosData as any) || []) as RelatorioFinal[];

        /**
         * Se existir mais do que um relatório para a mesma inscrição,
         * fica apenas o mais recente.
         */
        const maisRecentes: RelatorioFinal[] = [];

        todos.forEach((relatorio) => {
          const jaExiste = maisRecentes.find(
            (item) => item.inscricao_id === relatorio.inscricao_id
          );

          if (!jaExiste) {
            maisRecentes.push(relatorio);
          }
        });

        setRelatorios(maisRecentes);
      }
    } else {
      setRelatorios([]);
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
          onPress={() => router.replace("/professor/home" as any)}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#160909" />
          <Text style={styles.voltarTexto}>Voltar</Text>
        </Pressable>

        <Text style={styles.titulo}>Relatórios</Text>

        <Text style={styles.subtitulo}>
          Aqui aparecem apenas os alunos com relatório final por validar.
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

            {mostrarFiltros ? (
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
            ) : null}

            {linhasFiltradas.length === 0 ? (
              <View style={styles.vazioCard}>
                <Ionicons
                  name="information-circle-outline"
                  size={34}
                  color="#FDB515"
                />

                <Text style={styles.vazioTitulo}>Sem relatórios pendentes</Text>

                <Text style={styles.vazioTexto}>
                  Não existem relatórios finais por validar neste filtro.
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
                        pathname: "/professor/relatorios/relatorios" as any,
                        params: {
                          origem: "alunosRelatorios",
                          inscricaoId: String(linha.inscricao.id),
                          alunoId: String(linha.inscricao.aluno_id),
                          edicaoId: String(linha.inscricao.edicao_estagio_id),
                        },
                      })
                    }
                  >
                    <View style={styles.cardTopo}>
                      <View
                        style={[
                          styles.alunoIcone,
                          {
                            backgroundColor: corDoEstagio(linha),
                          },
                        ]}
                      >
                        <Ionicons
                          name="document-text-outline"
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
                      {linha.edicao?.ensinos_clinicos?.nome || "Ensino Clínico"}
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
                        <Text style={styles.infoLabel}>Submetido em</Text>
                        <Text style={styles.infoValor}>
                          {formatarDataHora(linha.relatorio?.criado_em)}
                        </Text>
                      </View>

                      <View style={styles.infoBox}>
                        <Text style={styles.infoLabel}>Ficheiro</Text>
                        <Text style={styles.infoValor}>
                          {linha.relatorio?.ficheiro_url ? "Disponível" : "N/A"}
                        </Text>
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