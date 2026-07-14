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
import { supabase } from "../../../../lib/supabase";
import styles from "./avaliacaoAlunoStyles";

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
  estado: string | null;
  estado_estagio: string | null;
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
  id: number;
  aluno_id: string;
  edicao_estagio_id: number;
  professor_id: string | null;
  orientador_id: string | null;
  nota_orientador: number | null;
  nota_final: number | null;
  observacao_orientador: string | null;
  observacao_final: string | null;
  estado: string | null;
};

export default function AvaliacaoAlunoOrientador() {
  const params = useLocalSearchParams();

  const origemParam = params.origem ? String(params.origem) : "";

  const inscricaoIdParam = params.inscricaoId
    ? Number(params.inscricaoId)
    : null;

  const alunoIdParam = params.alunoId ? String(params.alunoId) : null;

  const edicaoIdParam = params.edicaoId ? Number(params.edicaoId) : null;

  const [loading, setLoading] = useState(true);
  const [aGuardar, setAGuardar] = useState(false);

  const [orientadorId, setOrientadorId] = useState<string | null>(null);

  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [inscricao, setInscricao] = useState<Inscricao | null>(null);
  const [edicao, setEdicao] = useState<Edicao | null>(null);
  const [avaliacao, setAvaliacao] = useState<Avaliacao | null>(null);

  const [notaOrientador, setNotaOrientador] = useState("");
  const [observacaoOrientador, setObservacaoOrientador] = useState("");

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTipo, setPopupTipo] = useState<"normal" | "confirmar">("normal");

  useEffect(() => {
    carregarDados();
  }, []);

  function abrirPopup(
    titulo: string,
    mensagem: string,
    tipo: "normal" | "confirmar" = "normal"
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

  function voltarPaginaAnterior() {
    if (origemParam === "home") {
      router.replace("/orientador/estagios/alunosEstagio/alunoEstagio" as any);
      return;
    }

    router.replace({
      pathname:
        "/orientador/estagios/detalhesAluno/detalhesAluno" as any,
      params: {
        inscricaoId: String(inscricao?.id || inscricaoIdParam || ""),
        alunoId: String(inscricao?.aluno_id || alunoIdParam || ""),
        edicaoId: String(inscricao?.edicao_estagio_id || edicaoIdParam || ""),
      },
    });
  }

  async function carregarDados() {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace("/login/login" as any);
      return;
    }

    const userId = authData.user.id;
    setOrientadorId(userId);

    let inscricaoIdFinal = inscricaoIdParam;

    if (!inscricaoIdFinal && alunoIdParam && edicaoIdParam) {
      const { data: inscricaoEncontrada, error: inscricaoEncontradaError } =
        await supabase
          .from("inscricoes_estagio")
          .select("id")
          .eq("aluno_id", alunoIdParam)
          .eq("edicao_estagio_id", edicaoIdParam)
          .eq("orientador_id", userId)
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
      .select(
        "id, aluno_id, edicao_estagio_id, professor_id, orientador_id, estado, estado_estagio"
      )
      .eq("id", inscricaoIdFinal)
      .eq("orientador_id", userId)
      .maybeSingle();

    if (inscricaoError || !inscricaoData) {
      console.log("ERRO INSCRIÇÃO AVALIAÇÃO:", inscricaoError);
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
      console.log("ERRO ALUNO AVALIAÇÃO:", alunoError);
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
      console.log("ERRO EDIÇÃO AVALIAÇÃO:", edicaoError);
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
        edicao_estagio_id,
        professor_id,
        orientador_id,
        nota_orientador,
        nota_final,
        observacao_orientador,
        observacao_final,
        estado
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

      if (avaliacaoAtual?.nota_orientador !== null && avaliacaoAtual?.nota_orientador !== undefined) {
        setNotaOrientador(String(avaliacaoAtual.nota_orientador));
      }

      if (avaliacaoAtual?.observacao_orientador) {
        setObservacaoOrientador(avaliacaoAtual.observacao_orientador);
      }
    }

    setLoading(false);
  }

  function pedirGuardarAvaliacao() {
    const nota = Number(String(notaOrientador).replace(",", "."));

    if (!notaOrientador.trim()) {
      abrirPopup("Aviso", "Tens de inserir uma nota.");
      return;
    }

    if (Number.isNaN(nota) || nota < 0 || nota > 20) {
      abrirPopup("Aviso", "A nota tem de estar entre 0 e 20 valores.");
      return;
    }

    abrirPopup(
      "Guardar avaliação",
      "Tens a certeza que queres guardar a avaliação deste aluno?",
      "confirmar"
    );
  }

  async function guardarAvaliacao() {
    if (!orientadorId || !inscricao) return;

    const nota = Number(String(notaOrientador).replace(",", "."));

    setAGuardar(true);

    if (avaliacao?.id) {
      const { error } = await supabase
        .from("avaliacoes")
        .update({
          nota_orientador: nota,
          observacao_orientador: observacaoOrientador.trim(),
          orientador_id: orientadorId,
          estado: avaliacao.nota_final ? "concluida" : "avaliacao_orientador",
        })
        .eq("id", avaliacao.id);

      setAGuardar(false);

      if (error) {
        console.log("ERRO ATUALIZAR AVALIAÇÃO:", error);
        abrirPopup("Erro", "Não foi possível guardar a avaliação.");
        return;
      }
    } else {
      const { error } = await supabase.from("avaliacoes").insert({
        aluno_id: inscricao.aluno_id,
        edicao_estagio_id: inscricao.edicao_estagio_id,
        professor_id: inscricao.professor_id,
        orientador_id: orientadorId,
        nota_orientador: nota,
        observacao_orientador: observacaoOrientador.trim(),
        estado: "avaliacao_orientador",
      });

      setAGuardar(false);

      if (error) {
        console.log("ERRO CRIAR AVALIAÇÃO:", error);
        abrirPopup("Erro", "Não foi possível guardar a avaliação.");
        return;
      }
    }

    setPopupVisible(false);

    abrirPopup("Sucesso", "A avaliação foi guardada com sucesso.");

    await carregarDados();
  }

  return (
    <View style={styles.page}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Pressable style={styles.voltar} onPress={voltarPaginaAnterior}>
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
                <Ionicons name="person-outline" size={32} color="#160909" />
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

            <Text style={styles.secaoTitulo}>Avaliação</Text>

            <View style={styles.resumoGrid}>
              <View style={styles.resumoBox}>
                <Text style={styles.resumoLabel}>Nota do orientador</Text>
                <Text style={styles.resumoValor}>
                  {avaliacao?.nota_orientador !== null &&
                  avaliacao?.nota_orientador !== undefined
                    ? `${avaliacao.nota_orientador} valores`
                    : "Por atribuir"}
                </Text>
              </View>

              <View style={styles.resumoBox}>
                <Text style={styles.resumoLabel}>Nota final</Text>
                <Text style={styles.resumoValor}>
                  {avaliacao?.nota_final !== null &&
                  avaliacao?.nota_final !== undefined
                    ? `${avaliacao.nota_final} valores`
                    : "Ainda não definida"}
                </Text>
              </View>

            </View>

            {avaliacao?.observacao_final ? (
              <View style={styles.observacaoOrientadorBox}>
                <Text style={styles.observacaoTitulo}>
                  Observação final do professor
                </Text>

                <Text style={styles.observacaoTexto}>
                  {avaliacao.observacao_final}
                </Text>
              </View>
            ) : null}

            <Text style={styles.secaoTitulo}>Avaliação do orientador</Text>

            <Text style={styles.label}>Nota</Text>

            <TextInput
              style={styles.input}
              placeholder="Ex: 16"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
              value={notaOrientador}
              onChangeText={setNotaOrientador}
            />

            <Text style={styles.ajudaTexto}>
              A nota deve estar entre 0 e 20 valores.
            </Text>

            <Text style={styles.label}>Observação</Text>

            <TextInput
              style={styles.textArea}
              placeholder="Escreve uma observação sobre o desempenho do aluno..."
              placeholderTextColor="#999"
              value={observacaoOrientador}
              onChangeText={setObservacaoOrientador}
              multiline
              textAlignVertical="top"
            />

            <Pressable
              style={[
                styles.botaoGuardar,
                aGuardar && styles.botaoDisabled,
              ]}
              onPress={pedirGuardarAvaliacao}
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

            {popupTipo === "confirmar" ? (
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
                  <Text style={styles.popupTextoConfirmar}>Guardar</Text>
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