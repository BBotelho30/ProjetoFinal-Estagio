import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { supabase } from "../../../../lib/supabase";
import styles from "./relatorioOrientadorStyles";

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
  professor_id: string | null;
  orientador_id: string | null;
};

type Edicao = {
  id: number;
  data_inicio: string | null;
  data_fim: string | null;
  ano_letivo: string | null;
  ensinos_clinicos?: {
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
};

type RelatorioOrientador = {
  id: number;
  inscricao_id: number;
  aluno_id: string;
  edicao_estagio_id: number;
  orientador_id: string;
  titulo: string | null;
  observacao: string | null;
  ficheiro_nome: string | null;
  ficheiro_url: string | null;
  data_submissao: string | null;
  criado_em: string | null;
};

export default function RelatoriosOrientadorProfessor() {
  const params = useLocalSearchParams();

  const inscricaoIdParam = params.inscricaoId
    ? Number(params.inscricaoId)
    : null;
  const alunoIdParam = params.alunoId ? String(params.alunoId) : null;
  const edicaoIdParam = params.edicaoId ? Number(params.edicaoId) : null;

  const [loading, setLoading] = useState(true);

  const [inscricao, setInscricao] = useState<Inscricao | null>(null);
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [edicao, setEdicao] = useState<Edicao | null>(null);
  const [relatorios, setRelatorios] = useState<RelatorioOrientador[]>([]);

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  function abrirPopup(titulo: string, mensagem: string) {
    setPopupTitle(titulo);
    setPopupMessage(mensagem);
    setPopupVisible(true);
  }

  function voltarPaginaAnterior() {
    router.replace({
      pathname: "/professor/verEstagios/detalhesAlunos/detalhesAlunos" as any,
      params: {
        inscricaoId: String(inscricao?.id || inscricaoIdParam || ""),
        alunoId: String(inscricao?.aluno_id || alunoIdParam || ""),
        edicaoId: String(inscricao?.edicao_estagio_id || edicaoIdParam || ""),
      },
    });
  }

  function formatarData(data: string | null | undefined) {
    if (!data) return "Sem data";

    const date = new Date(data);

    if (Number.isNaN(date.getTime())) return "Sem data";

    return date.toLocaleDateString("pt-PT");
  }

  function estadoTexto() {
    if (relatorios.length === 0) return "Sem documentos";
    if (relatorios.length === 1) return "1 documento submetido";
    return `${relatorios.length} documentos submetidos`;
  }

  async function carregarDados() {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace("/login/login" as any);
      return;
    }

    let inscricaoIdFinal = inscricaoIdParam;

    if (!inscricaoIdFinal && alunoIdParam && edicaoIdParam) {
      const { data: inscricaoEncontrada, error: inscricaoEncontradaError } =
        await supabase
          .from("inscricoes_estagio")
          .select("id")
          .eq("aluno_id", alunoIdParam)
          .eq("edicao_estagio_id", edicaoIdParam)
          .maybeSingle();

      if (inscricaoEncontradaError) {
        console.log("ERRO A ENCONTRAR INSCRIÇÃO:", inscricaoEncontradaError);
      } else {
        inscricaoIdFinal = inscricaoEncontrada?.id || null;
      }
    }

    if (!inscricaoIdFinal) {
      abrirPopup(
        "Erro",
        "Não foi possível identificar a inscrição deste aluno.",
      );
      setLoading(false);
      return;
    }

    const { data: inscricaoData, error: inscricaoError } = await supabase
      .from("inscricoes_estagio")
      .select("id, aluno_id, edicao_estagio_id, professor_id, orientador_id")
      .eq("id", inscricaoIdFinal)
      .maybeSingle();

    if (inscricaoError || !inscricaoData) {
      console.log("ERRO INSCRIÇÃO:", inscricaoError);
      abrirPopup("Erro", "Não foi possível carregar a inscrição.");
      setLoading(false);
      return;
    }

    const inscricaoAtual = inscricaoData as Inscricao;
    setInscricao(inscricaoAtual);

    const { data: alunoData, error: alunoError } = await supabase
      .from("utilizadores")
      .select("id, nome, email, numero_identificacao, ano_curricular")
      .eq("id", inscricaoAtual.aluno_id)
      .maybeSingle();

    if (alunoError) {
      console.log("ERRO ALUNO:", alunoError);
      setAluno(null);
    } else {
      setAluno((alunoData as any) || null);
    }

    const { data: edicaoData, error: edicaoError } = await supabase
      .from("edicoes_estagio")
      .select(
        `
        id,
        data_inicio,
        data_fim,
        ano_letivo,
        ensinos_clinicos(nome, ano_curricular, semestre),
        instituicoes(nome),
        servicos(nome)
      `,
      )
      .eq("id", inscricaoAtual.edicao_estagio_id)
      .maybeSingle();

    if (edicaoError) {
      console.log("ERRO EDIÇÃO:", edicaoError);
      setEdicao(null);
    } else {
      setEdicao((edicaoData as any) || null);
    }

    const { data: relatoriosData, error: relatoriosError } = await supabase
      .from("relatorios_orientador")
      .select(
        `
        id,
        inscricao_id,
        aluno_id,
        edicao_estagio_id,
        orientador_id,
        titulo,
        observacao,
        ficheiro_nome,
        ficheiro_url,
        data_submissao,
        criado_em
      `,
      )
      .eq("inscricao_id", inscricaoAtual.id)
      .order("data_submissao", { ascending: false })
      .order("id", { ascending: false });

    if (relatoriosError) {
      console.log("ERRO RELATÓRIOS ORIENTADOR:", relatoriosError);
      setRelatorios([]);
    } else {
      setRelatorios((relatoriosData as any) || []);
    }

    setLoading(false);
  }

  async function abrirDocumento(url: string | null) {
    if (!url) {
      abrirPopup("Erro", "Este documento não está disponível.");
      return;
    }

    await Linking.openURL(url);
  }

  return (
    <View style={styles.page}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Pressable style={styles.voltar} onPress={voltarPaginaAnterior}>
          <Ionicons name="arrow-back-outline" size={24} color="#160909" />
          <Text style={styles.voltarTexto}>Voltar</Text>
        </Pressable>

        <Text style={styles.titulo}>Anexos do Orientador</Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FDB515"
            style={{ marginTop: 40 }}
          />
        ) : (
          <>
            <View style={styles.alunoCard}>
              <View style={styles.alunoIcone}>
                <Ionicons name="person-outline" size={34} color="#160909" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.alunoNome}>{aluno?.nome || "Aluno"}</Text>

                <Text style={styles.alunoTexto}>
                  Nº {aluno?.numero_identificacao || "N/A"} ·{" "}
                  {aluno?.ano_curricular || "N/A"}.º ano
                </Text>

                <Text style={styles.alunoTexto}>
                  {aluno?.email || "Sem email"}
                </Text>
              </View>
            </View>

            <View style={styles.estagioCard}>
              <Text style={styles.estagioTitulo}>
                {edicao?.ensinos_clinicos?.nome || "Ensino Clínico"}
              </Text>

              <Text style={styles.estagioTexto}>
                {edicao?.instituicoes?.nome || "Instituição"} ·{" "}
                {edicao?.servicos?.nome || "Serviço"}
              </Text>

              <Text style={styles.estagioTexto}>
                {formatarData(edicao?.data_inicio)} -{" "}
                {formatarData(edicao?.data_fim)}
              </Text>

              <Text style={styles.estagioTexto}>
                Ano letivo: {edicao?.ano_letivo || "Não definido"}
              </Text>
            </View>

            <View style={styles.estadoBox}>
              <Text style={styles.estadoLabel}>Estado</Text>
              <Text style={styles.estadoValor}>{estadoTexto()}</Text>
            </View>

            <Text style={styles.secaoTitulo}>Documentos submetidos</Text>

            {relatorios.length === 0 ? (
              <View style={styles.vazioBox}>
                <Text style={styles.vazioTitulo}>Sem documentos</Text>

                <Text style={styles.vazioTexto}>
                  O orientador ainda não submeteu relatórios ou anexos para este
                  aluno.
                </Text>
              </View>
            ) : (
              <View style={styles.lista}>
                {relatorios.map((relatorio) => (
                  <View key={relatorio.id} style={styles.relatorioCard}>
                    <View style={styles.relatorioHeader}>
                      <View style={styles.relatorioIcone}>
                        <Ionicons
                          name="document-text-outline"
                          size={24}
                          color="#160909"
                        />
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.relatorioNome}>
                          {relatorio.titulo ||
                            relatorio.ficheiro_nome ||
                            "Documento do orientador"}
                        </Text>

                        <Text style={styles.relatorioData}>
                          Submetido em{" "}
                          {formatarData(
                            relatorio.data_submissao || relatorio.criado_em,
                          )}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.labelPequena}>Observações</Text>

                    <View style={styles.observacaoBox}>
                      <Text style={styles.relatorioObs}>
                        {relatorio.observacao ||
                          "Sem observações registadas pelo orientador."}
                      </Text>
                    </View>

                    <Pressable
                      style={styles.botaoAbrir}
                      onPress={() => abrirDocumento(relatorio.ficheiro_url)}
                    >
                      <Ionicons name="open-outline" size={18} color="#160909" />
                      <Text style={styles.botaoAbrirTexto}>
                        Abrir documento
                      </Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      <Modal
        visible={popupVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPopupVisible(false)}
      >
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>{popupTitle}</Text>

            <Text style={styles.popupMessage}>{popupMessage}</Text>

            <Pressable
              style={styles.popupOkButton}
              onPress={() => setPopupVisible(false)}
            >
              <Text style={styles.popupOkText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
