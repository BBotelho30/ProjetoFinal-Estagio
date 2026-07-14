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
import styles from "./comentariosSemanaisStyles";

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
  orientador_id: string | null;
  estado: string | null;
  estado_estagio: string | null;
};

type Edicao = {
  id: number;
  ensino_clinico_id: number | null;
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

type Comentario = {
  id: number;
  inscricao_id: number;
  aluno_id: string;
  edicao_estagio_id: number;
  orientador_id: string;
  semana: string | null;
  comentario: string;
  data: string | null;
  criado_em: string | null;
};

export default function ComentariosAlunoOrientador() {
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
  const [comentarios, setComentarios] = useState<Comentario[]>([]);

  const [dataComentario, setDataComentario] = useState("");
  const [comentario, setComentario] = useState("");

  const [calendarioVisible, setCalendarioVisible] = useState(false);
  const [mesAtual, setMesAtual] = useState(new Date());

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

  function formatarNumero(numero: number) {
    return String(numero).padStart(2, "0");
  }

  function dataParaTexto(data: Date) {
    const dia = formatarNumero(data.getDate());
    const mes = formatarNumero(data.getMonth() + 1);
    const ano = data.getFullYear();

    return `${dia}-${mes}-${ano}`;
  }

  function textoParaDataISO(dataTexto: string) {
    const partes = dataTexto.split("-");

    if (partes.length !== 3) return null;

    const dia = Number(partes[0]);
    const mes = Number(partes[1]);
    const ano = Number(partes[2]);

    if (!dia || !mes || !ano) return null;

    if (dia < 1 || dia > 31) return null;
    if (mes < 1 || mes > 12) return null;

    return `${ano}-${formatarNumero(mes)}-${formatarNumero(dia)}`;
  }

  function formatarData(data: string | null | undefined) {
    if (!data) return "Sem data";

    const date = new Date(data);

    if (Number.isNaN(date.getTime())) return "Sem data";

    return date.toLocaleDateString("pt-PT");
  }

  function diasDoMes() {
    const ano = mesAtual.getFullYear();
    const mes = mesAtual.getMonth();

    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);

    const dias: Array<Date | null> = [];

    const diaSemanaInicio = primeiroDia.getDay();

    for (let i = 0; i < diaSemanaInicio; i++) {
      dias.push(null);
    }

    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      dias.push(new Date(ano, mes, dia));
    }

    return dias;
  }

  function mudarMes(valor: number) {
    setMesAtual(
      new Date(mesAtual.getFullYear(), mesAtual.getMonth() + valor, 1)
    );
  }

  function escolherData(data: Date) {
    setDataComentario(dataParaTexto(data));
    setCalendarioVisible(false);
  }

  function voltarPaginaAnterior() {
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
      .select(
        "id, aluno_id, edicao_estagio_id, orientador_id, estado, estado_estagio"
      )
      .eq("id", inscricaoIdFinal)
      .eq("orientador_id", userId)
      .maybeSingle();

    if (inscricaoError || !inscricaoData) {
      console.log("ERRO INSCRIÇÃO COMENTÁRIOS:", inscricaoError);
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
      console.log("ERRO ALUNO COMENTÁRIOS:", alunoError);
      setAluno(null);
    } else {
      setAluno((alunoData as any) || null);
    }

    const { data: edicaoData, error: edicaoError } = await supabase
      .from("edicoes_estagio")
      .select(
        `
        id,
        ensino_clinico_id,
        ano_letivo,
        ensinos_clinicos(nome, ano_curricular),
        instituicoes(nome),
        servicos(nome)
      `
      )
      .eq("id", inscricaoAtual.edicao_estagio_id)
      .maybeSingle();

    if (edicaoError) {
      console.log("ERRO EDIÇÃO COMENTÁRIOS:", edicaoError);
      setEdicao(null);
    } else {
      setEdicao((edicaoData as any) || null);
    }

    const { data: comentariosData, error: comentariosError } = await supabase
      .from("comentarios_semanais")
      .select(
        `
        id,
        inscricao_id,
        aluno_id,
        edicao_estagio_id,
        orientador_id,
        semana,
        comentario,
        data,
        criado_em
      `
      )
      .eq("inscricao_id", inscricaoAtual.id)
      .order("data", { ascending: false })
      .order("id", { ascending: false });

    if (comentariosError) {
      console.log("ERRO COMENTÁRIOS:", comentariosError);
      setComentarios([]);
    } else {
      setComentarios((comentariosData as any) || []);
    }

    if (!dataComentario) {
      setDataComentario(dataParaTexto(new Date()));
    }

    setLoading(false);
  }

  function pedirGuardarComentario() {
    if (!dataComentario.trim()) {
      abrirPopup("Aviso", "Indica a data do comentário.");
      return;
    }

    const dataISO = textoParaDataISO(dataComentario.trim());

    if (!dataISO) {
      abrirPopup("Aviso", "A data deve estar no formato DD-MM-AAAA.");
      return;
    }

    if (!comentario.trim()) {
      abrirPopup("Aviso", "Escreve o comentário semanal.");
      return;
    }

    abrirPopup(
      "Guardar comentário",
      "Tens a certeza que queres guardar este comentário?",
      "confirmar"
    );
  }

  async function guardarComentario() {
    if (!orientadorId || !inscricao) return;

    const dataISO = textoParaDataISO(dataComentario.trim());

    if (!dataISO) {
      abrirPopup("Erro", "A data está inválida.");
      return;
    }

    setAGuardar(true);

    const agora = new Date().toISOString();

    const { error } = await supabase.from("comentarios_semanais").insert({
      inscricao_id: inscricao.id,
      aluno_id: inscricao.aluno_id,
      edicao_estagio_id: inscricao.edicao_estagio_id,
      orientador_id: orientadorId,
      semana: null,
      comentario: comentario.trim(),
      data: dataISO,
      criado_em: agora,
    });

    setAGuardar(false);

    if (error) {
      console.log("ERRO GUARDAR COMENTÁRIO:", error);
      abrirPopup("Erro", "Não foi possível guardar o comentário.");
      return;
    }

    setPopupVisible(false);
    setComentario("");
    setDataComentario(dataParaTexto(new Date()));

    abrirPopup("Sucesso", "Comentário guardado com sucesso.");

    await carregarDados();
  }

  return (
    <View style={styles.page}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Pressable style={styles.voltar} onPress={voltarPaginaAnterior}>
          <Ionicons name="arrow-back-outline" size={24} color="#160909" />
          <Text style={styles.voltarTexto}>Voltar</Text>
        </Pressable>

        <Text style={styles.titulo}>Comentários Semanais</Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FDB515"
            style={{ marginTop: 40 }}
          />
        ) : (
          <>
            <View style={styles.estagioCard}>
              <Text style={styles.estagioTitulo}>
                {edicao?.ensinos_clinicos?.nome || "Ensino Clínico"}
              </Text>

              <Text style={styles.estagioTexto}>
                {edicao?.instituicoes?.nome || "Instituição"} ·{" "}
                {edicao?.servicos?.nome || "Serviço"}
              </Text>
            </View>

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
                  {aluno?.email || "Sem email"}
                </Text>
              </View>
            </View>

            <Text style={styles.secaoTitulo}>Novo comentário</Text>

            <Text style={styles.label}>Data</Text>

            <Pressable
              style={styles.inputBotao}
              onPress={() => setCalendarioVisible(true)}
            >
              <Text
                style={[
                  styles.inputBotaoTexto,
                  !dataComentario && styles.inputBotaoPlaceholder,
                ]}
              >
                {dataComentario || "Escolher data"}
              </Text>

              <Ionicons name="calendar-outline" size={23} color="#160909" />
            </Pressable>

            <Text style={styles.label}>Comentário</Text>

            <TextInput
              style={styles.textArea}
              placeholder="Escreve aqui o acompanhamento do aluno..."
              placeholderTextColor="#8c8787"
              value={comentario}
              onChangeText={setComentario}
              multiline
              textAlignVertical="top"
            />

            <Pressable
              style={[styles.botaoGuardar, aGuardar && styles.botaoDisabled]}
              onPress={pedirGuardarComentario}
              disabled={aGuardar}
            >
              <Ionicons name="save-outline" size={22} color="#160909" />

              <Text style={styles.botaoGuardarTexto}>
                {aGuardar ? "A guardar..." : "Guardar comentário"}
              </Text>
            </Pressable>

            <Text style={styles.secaoTitulo}>Comentários já registados</Text>

            {comentarios.length === 0 ? (
              <Text style={styles.mensagemVazia}>
                Ainda não existem comentários semanais disponíveis.
              </Text>
            ) : (
              <View style={styles.lista}>
                {comentarios.map((item) => (
                  <View key={item.id} style={styles.comentarioCard}>
                    <View style={styles.comentarioHeader}>
                      <View style={styles.comentarioIcone}>
                        <Ionicons
                          name="chatbubble-ellipses-outline"
                          size={24}
                          color="#160909"
                        />
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.comentarioSemana}>
                          {formatarData(item.data)}
                        </Text>

                        <Text style={styles.comentarioData}>
                          Registado em {formatarData(item.criado_em)}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.comentarioTexto}>
                      {item.comentario}
                    </Text>
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
                  onPress={guardarComentario}
                  disabled={aGuardar}
                >
                  <Text style={styles.popupTextoConfirmar}>
                    {aGuardar ? "A guardar..." : "Confirmar"}
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

      <Modal
        visible={calendarioVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCalendarioVisible(false)}
      >
        <View style={styles.popupOverlay}>
          <View style={styles.calendarioContainer}>
            <View style={styles.calendarioHeader}>
              <Pressable
                onPress={() => mudarMes(-1)}
                style={styles.calendarioSeta}
              >
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color="#160909"
                />
              </Pressable>

              <Text style={styles.calendarioTitulo}>
                {mesAtual.toLocaleDateString("pt-PT", {
                  month: "long",
                  year: "numeric",
                })}
              </Text>

              <Pressable
                onPress={() => mudarMes(1)}
                style={styles.calendarioSeta}
              >
                <Ionicons
                  name="chevron-forward-outline"
                  size={24}
                  color="#160909"
                />
              </Pressable>
            </View>

            <View style={styles.diasSemanaLinha}>
              {["D", "S", "T", "Q", "Q", "S", "S"].map((dia, index) => (
                <Text key={index} style={styles.diaSemanaTexto}>
                  {dia}
                </Text>
              ))}
            </View>

            <View style={styles.calendarioGrid}>
              {diasDoMes().map((dia, index) => {
                const selecionado =
                  dia && dataComentario === dataParaTexto(dia);

                return (
                  <Pressable
                    key={index}
                    style={[
                      styles.diaBotao,
                      selecionado && styles.diaBotaoSelecionado,
                      !dia && styles.diaBotaoVazio,
                    ]}
                    disabled={!dia}
                    onPress={() => dia && escolherData(dia)}
                  >
                    <Text
                      style={[
                        styles.diaBotaoTexto,
                        selecionado && styles.diaBotaoTextoSelecionado,
                      ]}
                    >
                      {dia ? dia.getDate() : ""}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={styles.popupOkButton}
              onPress={() => setCalendarioVisible(false)}
            >
              <Text style={styles.popupOkText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}