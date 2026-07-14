import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../../../../../lib/supabase";
import styles from "./avaliacoesStyles";

type Aluno = {
  id: string;
  nome: string;
  email: string;
  numero_identificacao: string | null;
  ano_curricular: number | null;
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

type Inscricao = {
  id: number;
  aluno_id: string;
  edicao_estagio_id: number;
  estado: string | null;
  estado_estagio: string | null;
};

type Avaliacao = {
  id: number;
  aluno_id: string;
  professor_id: string | null;
  orientador_id: string | null;
  edicao_estagio_id: number;
  nota_professor: number | null;
  nota_orientador: number | null;
  nota_final: number | null;
  observacao_professor: string | null;
  observacao_orientador: string | null;
  observacao_final: string | null;
  estado: string | null;
  criado_em: string | null;
};

export default function AvaliacoesProfessor() {
  const params = useLocalSearchParams();

  const inscricaoIdParam = params.inscricaoId
    ? Number(params.inscricaoId)
    : null;
  const alunoIdParam = params.alunoId ? String(params.alunoId) : null;
  const edicaoIdParam = params.edicaoId ? Number(params.edicaoId) : null;

  const [loading, setLoading] = useState(true);
  const [aGuardar, setAGuardar] = useState(false);

  const [professorId, setProfessorId] = useState<string | null>(null);

  const [inscricao, setInscricao] = useState<Inscricao | null>(null);
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [edicao, setEdicao] = useState<Edicao | null>(null);
  const [avaliacao, setAvaliacao] = useState<Avaliacao | null>(null);

  const [notaProfessor, setNotaProfessor] = useState("");
  const [observacaoProfessor, setObservacaoProfessor] = useState("");

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTipo, setPopupTipo] = useState<"normal" | "confirmarGuardar">(
    "normal"
  );

  useEffect(() => {
    carregarDados();
  }, []);

  function abrirPopup(
    titulo: string,
    mensagem: string,
    tipo: "normal" | "confirmarGuardar" = "normal"
  ) {
    setPopupTitle(titulo);
    setPopupMessage(mensagem);
    setPopupTipo(tipo);
    setPopupVisible(true);
  }

  function formatarData(data: string | null | undefined) {
    if (!data) return "Sem data";

    const date = new Date(data);

    if (Number.isNaN(date.getTime())) return "Sem data";

    return date.toLocaleDateString("pt-PT");
  }

  function formatarNota(nota: number | null | undefined) {
    if (nota === null || nota === undefined) return "Ainda sem nota";
    return `${Number(nota).toFixed(1)} valores`;
  }

  function notaValida() {
    const nota = Number(notaProfessor.replace(",", "."));

    if (notaProfessor.trim() === "") return false;
    if (Number.isNaN(nota)) return false;
    if (nota < 0 || nota > 20) return false;

    return true;
  }

  function calcularNotaFinal(notaProfessorNumero: number) {
    const notaOrientador = avaliacao?.nota_orientador;

    if (notaOrientador !== null && notaOrientador !== undefined) {
      return Number(
        ((notaProfessorNumero + Number(notaOrientador)) / 2).toFixed(2)
      );
    }

    return notaProfessorNumero;
  }

  async function carregarDados() {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace("/login/login" as any);
      return;
    }

    setProfessorId(authData.user.id);

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
        "Não foi possível identificar a inscrição deste aluno."
      );
      setLoading(false);
      return;
    }

    const { data: inscricaoData, error: inscricaoError } = await supabase
      .from("inscricoes_estagio")
      .select("id, aluno_id, edicao_estagio_id, estado, estado_estagio")
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
        ensinos_clinicos(nome, ano_curricular, tipo, horas_estimadas),
        instituicoes(nome),
        servicos(nome)
      `
      )
      .eq("id", inscricaoAtual.edicao_estagio_id)
      .maybeSingle();

    if (edicaoError) {
      console.log("ERRO EDIÇÃO:", edicaoError);
      setEdicao(null);
    } else {
      setEdicao((edicaoData as any) || null);
    }

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
      `
      )
      .eq("aluno_id", inscricaoAtual.aluno_id)
      .eq("edicao_estagio_id", inscricaoAtual.edicao_estagio_id)
      .maybeSingle();

    if (avaliacaoError) {
      console.log("ERRO AVALIAÇÃO:", avaliacaoError);
      setAvaliacao(null);
    } else {
      const avaliacaoAtual = (avaliacaoData as any) || null;
      setAvaliacao(avaliacaoAtual);

      if (
        avaliacaoAtual?.nota_professor !== null &&
        avaliacaoAtual?.nota_professor !== undefined
      ) {
        setNotaProfessor(String(avaliacaoAtual.nota_professor));
      }

      if (avaliacaoAtual?.observacao_professor) {
        setObservacaoProfessor(avaliacaoAtual.observacao_professor);
      }
    }

    setLoading(false);
  }

  function pedirGuardar() {
    if (!notaValida()) {
      abrirPopup("Erro", "A nota tem de estar entre 0 e 20 valores.");
      return;
    }

    abrirPopup(
      "Guardar avaliação",
      "Tens a certeza que queres guardar a nota e a observação deste aluno?",
      "confirmarGuardar"
    );
  }

  async function guardarAvaliacao() {
    if (!professorId || !inscricao) return;

    if (!notaValida()) {
      abrirPopup("Erro", "A nota tem de estar entre 0 e 20 valores.");
      return;
    }

    setAGuardar(true);

    const notaProfessorNumero = Number(notaProfessor.replace(",", "."));
    const notaFinal = calcularNotaFinal(notaProfessorNumero);

    if (avaliacao?.id) {
      const { error } = await supabase
        .from("avaliacoes")
        .update({
          professor_id: professorId,
          nota_professor: notaProfessorNumero,
          observacao_professor: observacaoProfessor.trim(),
          nota_final: notaFinal,
          observacao_final:
            avaliacao.observacao_orientador && observacaoProfessor.trim()
              ? `Professor: ${observacaoProfessor.trim()}\nOrientador: ${avaliacao.observacao_orientador}`
              : observacaoProfessor.trim(),
          estado: "avaliado_professor",
        })
        .eq("id", avaliacao.id);

      setAGuardar(false);

      if (error) {
        console.log("ERRO AO ATUALIZAR AVALIAÇÃO:", error);
        abrirPopup("Erro", "Não foi possível guardar a avaliação.");
        return;
      }

      setPopupVisible(false);
      abrirPopup("Sucesso", "Avaliação atualizada com sucesso.");
      await carregarDados();
      return;
    }

    const { error } = await supabase.from("avaliacoes").insert([
      {
        aluno_id: inscricao.aluno_id,
        edicao_estagio_id: inscricao.edicao_estagio_id,
        professor_id: professorId,
        nota_professor: notaProfessorNumero,
        nota_final: notaFinal,
        observacao_professor: observacaoProfessor.trim(),
        observacao_final: observacaoProfessor.trim(),
        estado: "avaliado_professor",
      },
    ]);

    setAGuardar(false);

    if (error) {
      console.log("ERRO AO CRIAR AVALIAÇÃO:", error);
      abrirPopup("Erro", "Não foi possível guardar a avaliação.");
      return;
    }

    setPopupVisible(false);
    abrirPopup("Sucesso", "Avaliação guardada com sucesso.");
    await carregarDados();
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
                "/professor/verEstagios/detalhesAlunos/detalhesAlunos" as any,
              params: {
                inscricaoId: String(inscricao?.id || inscricaoIdParam || ""),
                alunoId: String(inscricao?.aluno_id || alunoIdParam || ""),
                edicaoId: String(
                  inscricao?.edicao_estagio_id || edicaoIdParam || ""
                ),
              },
            })
          }
        >
          <Ionicons name="arrow-back-outline" size={24} color="#160909" />
          <Text style={styles.voltarTexto}>Voltar</Text>
        </Pressable>

        <Text style={styles.titulo}>Avaliação</Text>

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
            </View>

            <Text style={styles.secaoTitulo}>Avaliação atual</Text>

            <View style={styles.resumoGrid}>
              <View style={styles.resumoBox}>
                <Text style={styles.resumoLabel}>Nota professor</Text>
                <Text style={styles.resumoValor}>
                  {formatarNota(avaliacao?.nota_professor)}
                </Text>
              </View>

              <View style={styles.resumoBox}>
                <Text style={styles.resumoLabel}>Nota orientador</Text>
                <Text style={styles.resumoValor}>
                  {formatarNota(avaliacao?.nota_orientador)}
                </Text>
              </View>

              <View style={styles.resumoBoxFull}>
                <Text style={styles.resumoLabel}>Nota final</Text>
                <Text style={styles.resumoValor}>
                  {formatarNota(avaliacao?.nota_final)}
                </Text>
              </View>
            </View>

            <View style={styles.observacaoOrientadorBox}>
              <View style={styles.observacaoHeader}>
                <Text style={styles.observacaoTitulo}>
                  Observação do orientador
                </Text>
              </View>

              <Text style={styles.observacaoTexto}>
                {avaliacao?.observacao_orientador ||
                  "Ainda não existe observação registada pelo orientador."}
              </Text>
            </View>

            <Text style={styles.secaoTitulo}>Dar nota</Text>

            <Text style={styles.label}>Nota do professor</Text>

            <TextInput
              placeholder="Ex: 16"
              placeholderTextColor="#8c8787"
              style={styles.input}
              value={notaProfessor}
              onChangeText={setNotaProfessor}
              keyboardType="decimal-pad"
            />

            <Text style={styles.ajudaTexto}>
              A nota deve estar entre 0 e 20 valores.
            </Text>

            <Text style={styles.label}>Observação do professor</Text>

            <TextInput
              placeholder="Escreve uma observação sobre o desempenho do aluno..."
              placeholderTextColor="#8c8787"
              style={styles.textArea}
              value={observacaoProfessor}
              onChangeText={setObservacaoProfessor}
              multiline
              textAlignVertical="top"
            />

            <Pressable
              style={[styles.botaoGuardar, aGuardar && styles.botaoDisabled]}
              onPress={pedirGuardar}
              disabled={aGuardar}
            >
              <Ionicons name="save-outline" size={22} color="#160909" />
              <Text style={styles.botaoGuardarTexto}>
                {aGuardar ? "A guardar..." : "Guardar avaliação"}
              </Text>
            </Pressable>
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

            {popupTipo === "confirmarGuardar" ? (
              <View style={styles.popupBotoesLinha}>
                <Pressable
                  style={styles.popupBotaoCancelar}
                  onPress={() => setPopupVisible(false)}
                >
                  <Text style={styles.popupTextoCancelar}>Cancelar</Text>
                </Pressable>

                <Pressable
                  style={styles.popupBotaoConfirmar}
                  onPress={guardarAvaliacao}
                  disabled={aGuardar}
                >
                  <Text style={styles.popupTextoConfirmar}>
                    {aGuardar ? "A guardar..." : "Guardar"}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={styles.popupOkButton}
                onPress={() => setPopupVisible(false)}
              >
                <Text style={styles.popupOkText}>OK</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}