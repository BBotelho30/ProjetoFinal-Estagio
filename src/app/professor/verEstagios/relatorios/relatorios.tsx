import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../../../../lib/supabase";
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

export default function RelatoriosProfessor() {
  const params = useLocalSearchParams();

  const origemParam = params.origem ? String(params.origem) : "";

  const inscricaoIdParam = params.inscricaoId ? Number(params.inscricaoId) : null;
  const alunoIdParam = params.alunoId ? String(params.alunoId) : null;
  const edicaoIdParam = params.edicaoId ? Number(params.edicaoId) : null;

  const [loading, setLoading] = useState(true);
  const [aGuardar, setAGuardar] = useState(false);

  const [professorId, setProfessorId] = useState<string | null>(null);

  const [inscricao, setInscricao] = useState<Inscricao | null>(null);
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [edicao, setEdicao] = useState<Edicao | null>(null);
  const [relatorio, setRelatorio] = useState<RelatorioFinal | null>(null);

  const [observacoes, setObservacoes] = useState("");

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTipo, setPopupTipo] = useState<"normal" | "validar">("normal");

  useEffect(() => {
    carregarDados();
  }, []);

  function abrirPopup(
    titulo: string,
    mensagem: string,
    tipo: "normal" | "validar" = "normal"
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

  function estadoTexto() {
    if (!relatorio) return "Sem relatório";

    if (relatorio.estado === "validado") return "Validado";
    if (relatorio.estado === "rejeitado") return "Rejeitado";
    if (relatorio.estado === "submetido") return "Submetido";

    return relatorio.estado || "Submetido";
  }

  function relatorioValidado() {
    return relatorio?.estado === "validado";
  }

  function nomeFicheiroDownload() {
    const nomeAluno = aluno?.nome
      ? aluno.nome.replace(/[^a-zA-Z0-9À-ÿ_-]/g, "_")
      : "aluno";

    return `relatorio_final_${nomeAluno}.pdf`;
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

    const { data: relatorioData, error: relatorioError } = await supabase
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
      .eq("inscricao_id", inscricaoIdFinal)
      .order("criado_em", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (relatorioError) {
      console.log("ERRO RELATÓRIO:", relatorioError);
      setRelatorio(null);
    } else {
      const relatorioAtual = (relatorioData as any) || null;

      setRelatorio(relatorioAtual);
      setObservacoes(relatorioAtual?.observacoes || "");
    }

    setLoading(false);
  }

  async function abrirRelatorio() {
    if (!relatorio?.ficheiro_url) {
      abrirPopup("Aviso", "Este relatório ainda não tem ficheiro associado.");
      return;
    }

    const podeAbrir = await Linking.canOpenURL(relatorio.ficheiro_url);

    if (!podeAbrir) {
      abrirPopup("Erro", "Não foi possível abrir o relatório.");
      return;
    }

    await Linking.openURL(relatorio.ficheiro_url);
  }

  async function descarregarRelatorio() {
    if (!relatorio?.ficheiro_url) {
      abrirPopup("Aviso", "Este relatório ainda não tem ficheiro associado.");
      return;
    }

    if (Platform.OS === "web") {
      const globalAny = globalThis as any;

      if (globalAny.document) {
        const link = globalAny.document.createElement("a");
        link.href = relatorio.ficheiro_url;
        link.download = nomeFicheiroDownload();
        link.target = "_blank";
        globalAny.document.body.appendChild(link);
        link.click();
        globalAny.document.body.removeChild(link);
        return;
      }
    }

    await Linking.openURL(relatorio.ficheiro_url);
  }

  function pedirValidar() {
    if (!relatorio) {
      abrirPopup("Aviso", "Ainda não existe relatório submetido.");
      return;
    }

    if (!relatorio.ficheiro_url) {
      abrirPopup("Aviso", "Este relatório ainda não tem ficheiro associado.");
      return;
    }

    abrirPopup(
      "Validar relatório",
      "Tens a certeza que queres validar este relatório final?",
      "validar"
    );
  }

  async function guardarObservacao() {
    if (!relatorio) {
      abrirPopup("Aviso", "Ainda não existe relatório submetido.");
      return;
    }

    setAGuardar(true);

    const { error } = await supabase
      .from("relatorios_finais")
      .update({
        observacoes: observacoes.trim(),
      })
      .eq("id", relatorio.id);

    setAGuardar(false);

    if (error) {
      console.log("ERRO AO GUARDAR OBSERVAÇÃO:", error);
      abrirPopup("Erro", "Não foi possível guardar a observação.");
      return;
    }

    abrirPopup("Sucesso", "Observação guardada com sucesso.");
    await carregarDados();
  }

  async function validarRelatorio() {
    if (!professorId || !relatorio) return;

    setAGuardar(true);

    const { error } = await supabase
      .from("relatorios_finais")
      .update({
        observacoes: observacoes.trim(),
        estado: "validado",
        validado_por: professorId,
        data_validacao: new Date().toISOString(),
      })
      .eq("id", relatorio.id);

    setAGuardar(false);

    if (error) {
      console.log("ERRO AO VALIDAR RELATÓRIO:", error);
      abrirPopup("Erro", "Não foi possível validar o relatório.");
      return;
    }

    setPopupVisible(false);
    abrirPopup("Sucesso", "Relatório validado com sucesso.");
    await carregarDados();
  }

  return (
    <View style={styles.page}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Pressable
        style={styles.voltar}
        onPress={() => {
            if (origemParam === "alunosRelatorios") {
            router.replace(
                "/professor/relatorios/alunosRelatorios/alunosRelatorios" as any
            );
            return;
            }

            router.replace({
            pathname:
                "/professor/verEstagios/detalhesAlunos/detalhesAlunos" as any,
            params: {
                inscricaoId: String(inscricao?.id || inscricaoIdParam || ""),
                alunoId: String(inscricao?.aluno_id || alunoIdParam || ""),
                edicaoId: String(inscricao?.edicao_estagio_id || edicaoIdParam || ""),
            },
            });
        }}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#160909" />
          <Text style={styles.voltarTexto}>Voltar</Text>
        </Pressable>

        <Text style={styles.titulo}>Relatório Final</Text>

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
                <Ionicons name="document-text-outline" size={34} color="#160909" />
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

            {!relatorio ? (
              <View style={styles.vazioCard}>
                <Ionicons
                  name="information-circle-outline"
                  size={38}
                  color="#FDB515"
                />

                <Text style={styles.vazioTitulo}>Sem relatório submetido</Text>

                <Text style={styles.vazioTexto}>
                  O aluno ainda não submeteu o relatório final deste estágio.
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.relatorioCard}>
                  <View style={styles.relatorioTopo}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.relatorioTitulo}>
                        Relatório submetido
                      </Text>

                      <Text style={styles.relatorioTexto}>
                        Submetido em {formatarDataHora(relatorio.criado_em)}
                      </Text>

                      {relatorio.data_validacao ? (
                        <Text style={styles.relatorioTexto}>
                          Validado em{" "}
                          {formatarDataHora(relatorio.data_validacao)}
                        </Text>
                      ) : null}
                    </View>

                    <View
                      style={[
                        styles.estadoBadge,
                        relatorioValidado() && styles.estadoBadgeValidado,
                      ]}
                    >
                      <Text
                        style={[
                          styles.estadoBadgeTexto,
                          relatorioValidado() &&
                            styles.estadoBadgeTextoValidado,
                        ]}
                      >
                        {estadoTexto()}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.acoesLinha}>
                    <Pressable
                      style={[
                        styles.acaoBotao,
                        !relatorio.ficheiro_url && styles.botaoDisabled,
                      ]}
                      onPress={abrirRelatorio}
                      disabled={!relatorio.ficheiro_url}
                    >
                      <Ionicons name="open-outline" size={22} color="#160909" />
                      <Text style={styles.acaoBotaoTexto}>Abrir</Text>
                    </Pressable>

                    <Pressable
                      style={[
                        styles.acaoBotao,
                        !relatorio.ficheiro_url && styles.botaoDisabled,
                      ]}
                      onPress={descarregarRelatorio}
                      disabled={!relatorio.ficheiro_url}
                    >
                      <Ionicons
                        name="download-outline"
                        size={22}
                        color="#160909"
                      />
                      <Text style={styles.acaoBotaoTexto}>Descarregar</Text>
                    </Pressable>
                  </View>
                </View>

                <Text style={styles.secaoTitulo}>Observação</Text>

                <TextInput
                  style={styles.textArea}
                  placeholder="Escreve uma observação sobre o relatório final..."
                  placeholderTextColor="#8c8787"
                  value={observacoes}
                  onChangeText={setObservacoes}
                  multiline
                  textAlignVertical="top"
                />

                <Pressable
                  style={[styles.botaoSecundario, aGuardar && styles.botaoDisabled]}
                  onPress={guardarObservacao}
                  disabled={aGuardar}
                >
                  <Ionicons name="save-outline" size={22} color="#160909" />
                  <Text style={styles.botaoSecundarioTexto}>
                    {aGuardar ? "A guardar..." : "Guardar observação"}
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.botaoValidar,
                    (aGuardar || relatorioValidado()) && styles.botaoDisabled,
                  ]}
                  onPress={pedirValidar}
                  disabled={aGuardar || relatorioValidado()}
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={23}
                    color="#160909"
                  />

                  <Text style={styles.botaoValidarTexto}>
                    {relatorioValidado()
                      ? "Relatório validado"
                      : "Validar relatório"}
                  </Text>
                </Pressable>
              </>
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

            {popupTipo === "validar" ? (
              <View style={styles.popupBotoesLinha}>
                <Pressable
                  style={styles.popupBotaoCancelar}
                  onPress={() => setPopupVisible(false)}
                >
                  <Text style={styles.popupTextoCancelar}>Cancelar</Text>
                </Pressable>

                <Pressable
                  style={styles.popupBotaoConfirmar}
                  onPress={validarRelatorio}
                  disabled={aGuardar}
                >
                  <Text style={styles.popupTextoConfirmar}>
                    {aGuardar ? "A validar..." : "Validar"}
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