import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { supabase } from "../../../../lib/supabase";
import styles from "./presencasAlunoStyles";

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

type Presenca = {
  id: number;
  inscricao_id: number;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  duracao: number | null;
  tipo: string | null;
  assinatura_orientador: boolean | null;
  estado: string | null;
  estado_orientador: string | null;
  estado_professor: string | null;
  observacoes: string | null;
  horas_reposicao: number | null;
};

export default function PresencasOrientador() {
  const params = useLocalSearchParams();

  const origemParam = params.origem ? String(params.origem) : "";

  const inscricaoIdParam = params.inscricaoId
    ? Number(params.inscricaoId)
    : null;

  const alunoIdParam = params.alunoId ? String(params.alunoId) : null;

  const edicaoIdParam = params.edicaoId ? Number(params.edicaoId) : null;

  const [loading, setLoading] = useState(true);
  const [aValidar, setAValidar] = useState(false);

  const [orientadorId, setOrientadorId] = useState<string | null>(null);

  const [inscricao, setInscricao] = useState<Inscricao | null>(null);
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [edicao, setEdicao] = useState<Edicao | null>(null);
  const [presencas, setPresencas] = useState<Presenca[]>([]);

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  const [popupTipo, setPopupTipo] = useState<
    "normal" | "validarTudo" | "validarUma"
  >("normal");

  const [presencaSelecionada, setPresencaSelecionada] = useState<number | null>(
    null
  );

  useEffect(() => {
    carregarDados();
  }, []);

  function abrirPopup(
    titulo: string,
    mensagem: string,
    tipo: "normal" | "validarTudo" | "validarUma" = "normal"
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

  function formatarHora(hora: string | null | undefined) {
    if (!hora) return "--:--";

    return hora.slice(0, 5);
  }

  function textoEstadoOrientador(presenca: Presenca) {
    if (presenca.estado_orientador === "validado") return "Validado";
    if (presenca.estado_orientador === "rejeitado") return "Rejeitado";

    return "Pendente";
  }

  function presencaValidada(presenca: Presenca) {
    return presenca.estado_orientador === "validado";
  }

  function voltarPaginaAnterior() {
    if (origemParam === "home") {
      router.replace("orientador/estagios/alunosEstagio/alunoEstagio" as any);
      return;
    }

    if (origemParam === "detalhesAluno") {
      router.replace({
        pathname:
          "/orientador/estagios/detalhesAluno/detalhesAluno" as any,
        params: {
          inscricaoId: String(inscricao?.id || inscricaoIdParam || ""),
          alunoId: String(inscricao?.aluno_id || alunoIdParam || ""),
          edicaoId: String(inscricao?.edicao_estagio_id || edicaoIdParam || ""),
        },
      });

      return;
    }

    if (origemParam === "alunosPresencas") {
      router.replace(
        "/orientador/presencas/alunoPresencas/alunoPresencas" as any
      );

      return;
    }

    router.replace("/orientador/home" as any);
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
      .select("id, aluno_id, edicao_estagio_id, estado, estado_estagio")
      .eq("id", inscricaoIdFinal)
      .eq("orientador_id", userId)
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
        ensinos_clinicos(nome, ano_curricular),
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

    const { data: presencasData, error: presencasError } = await supabase
      .from("presencas")
      .select(
        `
        id,
        inscricao_id,
        data,
        hora_inicio,
        hora_fim,
        duracao,
        tipo,
        assinatura_orientador,
        estado,
        estado_orientador,
        estado_professor,
        observacoes,
        horas_reposicao
      `
      )
      .eq("inscricao_id", inscricaoIdFinal)
      .order("data", { ascending: true })
      .order("hora_inicio", { ascending: true });

    if (presencasError) {
      console.log("ERRO PRESENÇAS:", presencasError);
      setPresencas([]);
    } else {
      setPresencas((presencasData as any) || []);
    }

    setLoading(false);
  }

  const totais = useMemo(() => {
    const totalHoras = presencas.reduce(
      (soma, presenca) => soma + Number(presenca.duracao || 0),
      0
    );

    const totalValidadas = presencas.filter(
      (presenca) => presenca.estado_orientador === "validado"
    ).length;

    const totalPendentes = presencas.length - totalValidadas;

    return {
      totalHoras,
      totalValidadas,
      totalPendentes,
      totalPresencas: presencas.length,
    };
  }, [presencas]);

  function pedirValidarPresenca(presencaId: number) {
    setPresencaSelecionada(presencaId);

    abrirPopup(
      "Validar presença",
      "Tens a certeza que queres validar esta presença?",
      "validarUma"
    );
  }

  function pedirValidarTudo() {
    if (presencas.length === 0) {
      abrirPopup("Aviso", "Não existem presenças para validar.");
      return;
    }

    const pendentes = presencas.filter(
      (presenca) => presenca.estado_orientador !== "validado"
    );

    if (pendentes.length === 0) {
      abrirPopup("Aviso", "Todas as presenças já estão validadas.");
      return;
    }

    abrirPopup(
      "Validar tudo",
      `Tens a certeza que queres validar ${pendentes.length} presença(s) pendente(s)?`,
      "validarTudo"
    );
  }

  async function validarPresenca() {
    if (!orientadorId || !presencaSelecionada) return;

    setAValidar(true);

    const { error } = await supabase
      .from("presencas")
      .update({
        estado_orientador: "validado",
        assinatura_orientador: true,
      })
      .eq("id", presencaSelecionada);

    setAValidar(false);

    if (error) {
      console.log("ERRO VALIDAR PRESENÇA ORIENTADOR:", error);
      abrirPopup("Erro", "Não foi possível validar esta presença.");
      return;
    }

    setPopupVisible(false);
    setPresencaSelecionada(null);

    await carregarDados();
  }

  async function validarTudo() {
    if (!orientadorId || !inscricao) return;

    const idsPendentes = presencas
      .filter((presenca) => presenca.estado_orientador !== "validado")
      .map((presenca) => presenca.id);

    if (idsPendentes.length === 0) {
      abrirPopup("Aviso", "Todas as presenças já estão validadas.");
      return;
    }

    setAValidar(true);

    const { error } = await supabase
      .from("presencas")
      .update({
        estado_orientador: "validado",
        assinatura_orientador: true,
      })
      .in("id", idsPendentes);

    setAValidar(false);

    if (error) {
      console.log("ERRO VALIDAR TUDO ORIENTADOR:", error);
      abrirPopup("Erro", "Não foi possível validar todas as presenças.");
      return;
    }

    setPopupVisible(false);

    await carregarDados();
  }

  return (
    <View style={styles.page}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Pressable style={styles.voltar} onPress={voltarPaginaAnterior}>
          <Ionicons name="arrow-back-outline" size={24} color="#160909" />

          <Text style={styles.voltarTexto}>Voltar</Text>
        </Pressable>

        <Text style={styles.titulo}>Presenças</Text>

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
                <Ionicons name="person-outline" size={30} color="#160909" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.alunoNome}>{aluno?.nome || "Aluno"}</Text>

                <Text style={styles.alunoTexto}>
                  Nº {aluno?.numero_identificacao || "N/A"} ·{" "}
                  {aluno?.ano_curricular || "N/A"}.º ano
                </Text>

                <Text style={styles.alunoTexto}>
                  {edicao?.ensinos_clinicos?.nome || "Ensino Clínico"}
                </Text>

                <Text style={styles.alunoTexto}>
                  {edicao?.instituicoes?.nome || "Instituição"} ·{" "}
                  {edicao?.servicos?.nome || "Serviço"}
                </Text>
              </View>
            </View>

            <View style={styles.resumoGrid}>
              <View style={styles.resumoBox}>
                <Text style={styles.resumoNumero}>{totais.totalPresencas}</Text>
                <Text style={styles.resumoLabel}>Registos</Text>
              </View>

              <View style={styles.resumoBox}>
                <Text style={styles.resumoNumero}>
                  {Number(totais.totalHoras).toFixed(1)}h
                </Text>
                <Text style={styles.resumoLabel}>Horas</Text>
              </View>

              <View style={styles.resumoBox}>
                <Text style={styles.resumoNumero}>{totais.totalValidadas}</Text>
                <Text style={styles.resumoLabel}>Validadas</Text>
              </View>

              <View style={styles.resumoBox}>
                <Text style={styles.resumoNumero}>{totais.totalPendentes}</Text>
                <Text style={styles.resumoLabel}>Pendentes</Text>
              </View>
            </View>

            <Pressable
              style={[
                styles.botaoValidarTudo,
                totais.totalPendentes === 0 && styles.botaoDisabled,
              ]}
              onPress={pedirValidarTudo}
              disabled={totais.totalPendentes === 0 || aValidar}
            >
              <Ionicons
                name="checkmark-done-outline"
                size={22}
                color="#160909"
              />

              <Text style={styles.botaoValidarTudoTexto}>
                {aValidar ? "A validar..." : "Validar tudo"}
              </Text>
            </Pressable>

            <Text style={styles.secaoTitulo}>Registos diários</Text>

            {presencas.length === 0 ? (
              <Text style={styles.mensagemVazia}>
                Ainda não existem presenças registadas por este aluno.
              </Text>
            ) : (
              <View style={styles.lista}>
                {presencas.map((presenca) => {
                  const validada = presencaValidada(presenca);

                  return (
                    <View key={presenca.id} style={styles.presencaCard}>
                      <View style={styles.presencaTopo}>
                        <View>
                          <Text style={styles.presencaData}>
                            {formatarData(presenca.data)}
                          </Text>

                          <Text style={styles.presencaHora}>
                            {formatarHora(presenca.hora_inicio)} -{" "}
                            {formatarHora(presenca.hora_fim)}
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.estadoBadge,
                            validada && styles.estadoBadgeValidado,
                          ]}
                        >
                          <Text
                            style={[
                              styles.estadoBadgeTexto,
                              validada && styles.estadoBadgeTextoValidado,
                            ]}
                          >
                            {textoEstadoOrientador(presenca)}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.presencaInfoLinha}>
                        <View style={styles.infoMiniBox}>
                          <Text style={styles.infoMiniLabel}>Tipo</Text>

                          <Text style={styles.infoMiniValor}>
                            {presenca.tipo || "N/A"}
                          </Text>
                        </View>

                        <View style={styles.infoMiniBox}>
                          <Text style={styles.infoMiniLabel}>Duração</Text>

                          <Text style={styles.infoMiniValor}>
                            {presenca.duracao || 0}h
                          </Text>
                        </View>

                        <View style={styles.infoMiniBox}>
                          <Text style={styles.infoMiniLabel}>Reposição</Text>

                          <Text style={styles.infoMiniValor}>
                            {presenca.horas_reposicao || 0}h
                          </Text>
                        </View>
                      </View>

                      <View style={styles.validacoesLinha}>
                        <View style={styles.validacaoItem}>
                          <Ionicons
                            name={
                              presenca.estado_orientador === "validado"
                                ? "checkmark-circle-outline"
                                : "time-outline"
                            }
                            size={20}
                            color={
                              presenca.estado_orientador === "validado"
                                ? "#225943"
                                : "#B77900"
                            }
                          />

                          <Text style={styles.validacaoTexto}>
                            Orientador:{" "}
                            {presenca.estado_orientador === "validado"
                              ? "validado"
                              : "pendente"}
                          </Text>
                        </View>

                        <View style={styles.validacaoItem}>
                          <Ionicons
                            name={
                              presenca.estado_professor === "validado"
                                ? "checkmark-circle-outline"
                                : "time-outline"
                            }
                            size={20}
                            color={
                              presenca.estado_professor === "validado"
                                ? "#225943"
                                : "#B77900"
                            }
                          />

                          <Text style={styles.validacaoTexto}>
                            Professor:{" "}
                            {presenca.estado_professor === "validado"
                              ? "validado"
                              : "pendente"}
                          </Text>
                        </View>
                      </View>

                      {presenca.observacoes ? (
                        <Text style={styles.observacoes}>
                          Observações: {presenca.observacoes}
                        </Text>
                      ) : null}

                      {validada ? (
                        <Text style={styles.validadoTexto}>
                          Validado pelo orientador
                        </Text>
                      ) : (
                        <Pressable
                          style={styles.botaoValidarDia}
                          onPress={() => pedirValidarPresenca(presenca.id)}
                          disabled={aValidar}
                        >
                          <Ionicons
                            name="checkmark-outline"
                            size={22}
                            color="#160909"
                          />

                          <Text style={styles.botaoValidarDiaTexto}>
                            Validar este dia
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  );
                })}
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

            {popupTipo === "validarUma" ? (
              <View style={styles.popupBotoesLinha}>
                <Pressable
                  style={styles.popupBotaoCancelar}
                  onPress={() => {
                    setPopupVisible(false);
                    setPresencaSelecionada(null);
                  }}
                >
                  <Text style={styles.popupTextoCancelar}>Cancelar</Text>
                </Pressable>

                <Pressable
                  style={styles.popupBotaoConfirmar}
                  onPress={validarPresenca}
                  disabled={aValidar}
                >
                  <Text style={styles.popupTextoConfirmar}>Validar</Text>
                </Pressable>
              </View>
            ) : popupTipo === "validarTudo" ? (
              <View style={styles.popupBotoesLinha}>
                <Pressable
                  style={styles.popupBotaoCancelar}
                  onPress={() => setPopupVisible(false)}
                >
                  <Text style={styles.popupTextoCancelar}>Cancelar</Text>
                </Pressable>

                <Pressable
                  style={styles.popupBotaoConfirmar}
                  onPress={validarTudo}
                  disabled={aValidar}
                >
                  <Text style={styles.popupTextoConfirmar}>Validar tudo</Text>
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