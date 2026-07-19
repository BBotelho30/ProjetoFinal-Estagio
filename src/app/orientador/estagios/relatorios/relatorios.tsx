import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../../../../lib/supabase";
import styles from "./relatoriosStyles";

type Inscricao = {
  id: number;
  aluno_id: string;
  edicao_estagio_id: number;
  orientador_id: string | null;
};

type Edicao = {
  id: number;
  data_inicio: string | null;
  data_fim: string | null;
  ensinos_clinicos?: {
    nome: string;
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

type FicheiroEscolhido = {
  name: string;
  uri: string;
  mimeType?: string;
};

export default function RelatorioAlunoOrientador() {
  const params = useLocalSearchParams();

  const origem = params.origem ? String(params.origem) : "home";
  const inscricaoIdParam = params.inscricaoId
    ? Number(params.inscricaoId)
    : null;
  const alunoIdParam = params.alunoId ? String(params.alunoId) : null;
  const edicaoIdParam = params.edicaoId ? Number(params.edicaoId) : null;

  const [loading, setLoading] = useState(true);
  const [aGuardar, setAGuardar] = useState(false);

  const [orientadorId, setOrientadorId] = useState<string | null>(null);
  const [inscricao, setInscricao] = useState<Inscricao | null>(null);
  const [edicao, setEdicao] = useState<Edicao | null>(null);
  const [relatorios, setRelatorios] = useState<RelatorioOrientador[]>([]);

  const [ficheiro, setFicheiro] = useState<FicheiroEscolhido | null>(null);
  const [observacao, setObservacao] = useState("");

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
    tipo: "normal" | "confirmar" = "normal",
  ) {
    setPopupTitle(titulo);
    setPopupMessage(mensagem);
    setPopupTipo(tipo);
    setPopupVisible(true);
  }

  function voltarPaginaAnterior() {
    if (origem === "detalhesAluno") {
      router.replace({
        pathname: "/orientador/estagios/detalhesAluno/detalhesAluno" as any,
        params: {
          inscricaoId: String(inscricao?.id || inscricaoIdParam || ""),
          alunoId: String(inscricao?.aluno_id || alunoIdParam || ""),
          edicaoId: String(inscricao?.edicao_estagio_id || edicaoIdParam || ""),
        },
      });
      return;
    }

    if (origem === "estagioRelatorios") {
      router.replace(
        "/orientador/estagios/relatorios/estagioRelatorios/estagioRelatorios" as any,
      );
      return;
    }

    router.replace("/orientador/home" as any);
  }

  function formatarData(data: string | null | undefined) {
    if (!data) return "Sem data";

    const date = new Date(data);

    if (Number.isNaN(date.getTime())) return "Sem data";

    return date.toLocaleDateString("pt-PT");
  }

  function estadoTexto() {
    return relatorios.length > 0 ? "Submetido" : "Não submetido";
  }

  function limparNomeFicheiro(nome: string) {
    return nome
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .replace(/_+/g, "_");
  }

      async function carregarDados() {
      setLoading(true);

      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError) {
        console.log("ERRO AUTH:", authError);
        abrirPopup("Erro", "Não foi possível validar a sessão.");
        setLoading(false);
        return;
      }

      if (!authData.user) {
        router.replace("/login/login" as any);
        return;
      }

      const userId = authData.user.id;
      setOrientadorId(userId);

      let inscricaoIdFinal = inscricaoIdParam;

      if (!inscricaoIdFinal && alunoIdParam && edicaoIdParam) {
        const { data: inscricaoEncontrada, error: erroInscricaoEncontrada } =
          await supabase
            .from("inscricoes_estagio")
            .select("id")
            .eq("aluno_id", alunoIdParam)
            .eq("edicao_estagio_id", edicaoIdParam)
            .maybeSingle();

        if (erroInscricaoEncontrada) {
          console.log("ERRO A ENCONTRAR INSCRIÇÃO:", erroInscricaoEncontrada);
        } else {
          inscricaoIdFinal = inscricaoEncontrada?.id || null;
        }
      }

      if (!inscricaoIdFinal) {
        setLoading(false);
        abrirPopup("Erro", "Não foi possível identificar este estágio/aluno.");
        return;
      }

      const { data: inscricaoData, error: inscricaoError } = await supabase
        .from("inscricoes_estagio")
        .select("id, aluno_id, edicao_estagio_id, orientador_id")
        .eq("id", inscricaoIdFinal)
        .maybeSingle();

      if (inscricaoError || !inscricaoData) {
        console.log("ERRO INSCRIÇÃO:", inscricaoError);
        setLoading(false);
        abrirPopup(
          "Erro",
          inscricaoError?.message || "Não foi possível carregar a inscrição."
        );
        return;
      }

      const inscricaoAtual = inscricaoData as Inscricao;

      const { data: associacaoOrientador, error: associacaoError } = await supabase
        .from("orientadores_estagio")
        .select("id")
        .eq("orientador_id", userId)
        .eq("edicao_estagio_id", inscricaoAtual.edicao_estagio_id)
        .maybeSingle();

      if (associacaoError || !associacaoOrientador) {
        console.log("ORIENTADOR SEM ACESSO AO RELATÓRIO:", associacaoError);
        setLoading(false);
        abrirPopup("Erro", "Não tens acesso aos relatórios deste aluno.");
        return;
      }

      setInscricao(inscricaoAtual);

      const { data: edicaoData, error: edicaoError } = await supabase
        .from("edicoes_estagio")
        .select(
          `
          id,
          data_inicio,
          data_fim,
          ensinos_clinicos(nome),
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
        `
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

  async function escolherFicheiro() {
    const resultado = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (resultado.canceled) return;

    const asset = resultado.assets?.[0];

    if (!asset) return;

    setFicheiro({
      name: asset.name,
      uri: asset.uri,
      mimeType: asset.mimeType || "application/pdf",
    });
  }

  function pedirSubmissao() {
    const temFicheiro = Boolean(ficheiro);
    const temObservacao = observacao.trim().length > 0;

    if (!temFicheiro && !temObservacao) {
      abrirPopup(
        "Aviso",
        "Anexa um PDF ou escreve uma observação antes de submeter.",
      );
      return;
    }

    abrirPopup(
      "Submeter relatório",
      "Tens a certeza que queres submeter este relatório/anexo?",
      "confirmar",
    );
  }

  async function uploadFicheiro() {
    if (!ficheiro || !inscricao || !orientadorId) {
      return {
        url: null,
        erro: "Faltam dados para enviar o ficheiro.",
      };
    }

    try {
      const resposta = await fetch(ficheiro.uri);
      const blob = await resposta.blob();

      const extensao = ficheiro.name.includes(".")
        ? ficheiro.name.split(".").pop()
        : "pdf";

      const nomeLimpo = limparNomeFicheiro(ficheiro.name);
      const nomeStorage = `${orientadorId}/${inscricao.id}/${Date.now()}_${nomeLimpo}`;

      const { error: uploadError } = await supabase.storage
        .from("relatorios-orientador")
        .upload(nomeStorage, blob, {
          contentType: ficheiro.mimeType || "application/pdf",
          upsert: false,
        });

      if (uploadError) {
        console.log("ERRO UPLOAD:", uploadError);
        return {
          url: null,
          erro: uploadError.message,
        };
      }

      const { data } = supabase.storage
        .from("relatorios-orientador")
        .getPublicUrl(nomeStorage);

      return {
        url: data.publicUrl,
        erro: null,
      };
    } catch (erro: any) {
      console.log("ERRO FETCH/UPLOAD:", erro);
      return {
        url: null,
        erro: erro?.message || "Erro inesperado ao preparar o ficheiro.",
      };
    }
  }

  async function submeterRelatorio() {
    if (aGuardar) return;

    if (!inscricao || !orientadorId) {
      abrirPopup("Erro", "Não foi possível identificar a inscrição.");
      return;
    }

    const temFicheiro = Boolean(ficheiro);
    const temObservacao = observacao.trim().length > 0;

    if (!temFicheiro && !temObservacao) {
      abrirPopup(
        "Aviso",
        "Anexa um PDF ou escreve uma observação antes de submeter.",
      );
      return;
    }

    setAGuardar(true);

    let ficheiroUrl: string | null = null;

    if (ficheiro) {
      const resultadoUpload = await uploadFicheiro();

      if (!resultadoUpload.url) {
        setAGuardar(false);
        abrirPopup(
          "Erro no upload",
          resultadoUpload.erro ||
            "Não foi possível enviar o ficheiro. Verifica o bucket relatorios-orientador.",
        );
        return;
      }

      ficheiroUrl = resultadoUpload.url;
    }

    const agora = new Date().toISOString();

    const payload = {
      inscricao_id: inscricao.id,
      aluno_id: inscricao.aluno_id,
      edicao_estagio_id: inscricao.edicao_estagio_id,
      orientador_id: orientadorId,
      titulo: ficheiro?.name || "Observação do orientador",
      observacao: observacao.trim() || null,
      ficheiro_nome: ficheiro?.name || null,
      ficheiro_url: ficheiroUrl,
      data_submissao: agora,
      criado_em: agora,
    };

    const { error } = await supabase
      .from("relatorios_orientador")
      .insert(payload);

    setAGuardar(false);

    if (error) {
      console.log("ERRO AO GUARDAR RELATÓRIO:", error);
      abrirPopup("Erro ao guardar", error.message);
      return;
    }

    setPopupVisible(false);
    setFicheiro(null);
    setObservacao("");

    abrirPopup("Sucesso", "Relatório/anexo submetido com sucesso.");
    await carregarDados();
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

        <Text style={styles.titulo}>Relatório e Anexos</Text>

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

              <Text style={styles.estagioTexto}>
                {formatarData(edicao?.data_inicio)} -{" "}
                {formatarData(edicao?.data_fim)}
              </Text>
            </View>

            <View style={styles.estadoBox}>
              <Text style={styles.estadoLabel}>Estado</Text>
              <Text style={styles.estadoValor}>{estadoTexto()}</Text>
            </View>

            <Text style={styles.label}>Documento</Text>

            <Pressable style={styles.anexarBox} onPress={escolherFicheiro}>
              <View style={styles.anexarLinha}>
                <Ionicons name="attach-outline" size={24} color="#160909" />
                <Text style={styles.anexarTexto}>
                  {ficheiro ? ficheiro.name : "Anexar PDF"}
                </Text>
              </View>
            </Pressable>

            <Text style={styles.label}>Observações</Text>

            <TextInput
              style={styles.textArea}
              placeholder="Escreve observações, se necessário..."
              placeholderTextColor="#8c8787"
              value={observacao}
              onChangeText={setObservacao}
              multiline
              textAlignVertical="top"
            />

            <Pressable
              style={[styles.botaoSubmeter, aGuardar && styles.botaoDisabled]}
              onPress={pedirSubmissao}
              disabled={aGuardar}
            >
              <Text style={styles.botaoSubmeterTexto}>
                {aGuardar ? "A submeter..." : "Submeter Relatório"}
              </Text>
            </Pressable>

            <Text style={styles.secaoTitulo}>Os meus documentos</Text>

            {relatorios.length === 0 ? (
              <View style={styles.vazioBox}>
                <Text style={styles.vazioTitulo}>
                  Ainda não entregaste nada
                </Text>

                <Text style={styles.vazioTexto}>
                  Quando submeteres documentos ou observações, vão aparecer
                  aqui.
                </Text>
              </View>
            ) : (
              <View style={styles.lista}>
                {relatorios.map((relatorio) => (
                  <View key={relatorio.id} style={styles.relatorioCard}>
                    <Text style={styles.relatorioNome}>
                      {relatorio.ficheiro_nome ||
                        relatorio.titulo ||
                        "Observação do orientador"}
                    </Text>

                    <Text style={styles.relatorioData}>
                      Entregue em{" "}
                      {formatarData(
                        relatorio.data_submissao || relatorio.criado_em,
                      )}
                    </Text>

                    {relatorio.observacao ? (
                      <Text style={styles.relatorioObs}>
                        {relatorio.observacao}
                      </Text>
                    ) : null}

                    {relatorio.ficheiro_url ? (
                      <Pressable
                        style={styles.botaoAbrir}
                        onPress={() => abrirDocumento(relatorio.ficheiro_url)}
                      >
                        <Ionicons
                          name="open-outline"
                          size={18}
                          color="#160909"
                        />
                        <Text style={styles.botaoAbrirTexto}>
                          Abrir documento
                        </Text>
                      </Pressable>
                    ) : null}
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
                  onPress={submeterRelatorio}
                  disabled={aGuardar}
                >
                  <Text style={styles.popupTextoConfirmar}>
                    {aGuardar ? "A submeter..." : "Confirmar"}
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
