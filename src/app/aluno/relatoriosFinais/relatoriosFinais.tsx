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
import { supabase } from "../../../lib/supabase";
import styles from "./relatoriosFinaisStyles";

type Estagio = {
  id: number;
  aluno_id: string;
  edicao_estagio_id: number;
  estado_estagio: string | null;
  edicoes_estagio?: {
    id: number;
    data_inicio: string | null;
    data_fim: string | null;
    ensinos_clinicos?: {
      id: number;
      nome: string;
      ano_curricular: number;
      semestre: number;
    };
    instituicoes?: {
      nome: string;
    };
    servicos?: {
      nome: string;
    };
  };
};

type Relatorio = {
  id: number;
  inscricao_id: number;
  ficheiro_url: string | null;
  observacoes: string | null;
  estado: string | null;
  validado_por: string | null;
  data_validacao: string | null;
  criado_em: string | null;
};

type DocumentoEscolhido = {
  name: string;
  uri: string;
  mimeType?: string;
};

export default function RelatorioFinal() {
  const params = useLocalSearchParams();

  const inscricaoId = params.inscricaoId ? String(params.inscricaoId) : "";
  const edicaoId = params.edicaoId ? String(params.edicaoId) : "";
  const origem = params.origem ? String(params.origem) : "home";

  const [estagio, setEstagio] = useState<Estagio | null>(null);
  const [relatorio, setRelatorio] = useState<Relatorio | null>(null);
  const [loading, setLoading] = useState(true);

  const [documento, setDocumento] = useState<DocumentoEscolhido | null>(null);
  const [aGuardar, setAGuardar] = useState(false);

  const [popupVisivel, setPopupVisivel] = useState(false);
  const [popupTitulo, setPopupTitulo] = useState("");
  const [popupMensagem, setPopupMensagem] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  function mostrarPopup(titulo: string, mensagem: string) {
    setPopupTitulo(titulo);
    setPopupMensagem(mensagem);
    setPopupVisivel(true);
  }

  function voltarPaginaAnterior() {
    const temDadosDoEstagio =
      Boolean(estagio?.id || inscricaoId) &&
      Boolean(estagio?.edicao_estagio_id || edicaoId);

    if (
      origem === "detalhesEstagio" ||
      origem === "detalheEstagio" ||
      origem === "detalhe" ||
      temDadosDoEstagio
    ) {
      router.replace({
        pathname: "/aluno/estagios/detalheEstagio/detalheEstagio" as any,
        params: {
          inscricaoId: String(estagio?.id || inscricaoId || ""),
          edicaoId: String(estagio?.edicao_estagio_id || edicaoId || ""),
        },
      });

      return;
    }

    router.replace("/aluno/home" as any);
  }

  async function carregarDados() {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace("/login/login" as any);
      return;
    }

    const alunoId = authData.user.id;

    let query = supabase
      .from("inscricoes_estagio")
      .select(`
        id,
        aluno_id,
        edicao_estagio_id,
        estado_estagio,
        edicoes_estagio(
          id,
          data_inicio,
          data_fim,
          ensinos_clinicos(id, nome, ano_curricular, semestre),
          instituicoes(nome),
          servicos(nome)
        )
      `)
      .eq("aluno_id", alunoId);

    if (inscricaoId) {
      query = query.eq("id", Number(inscricaoId));
    } else {
      query = query
        .neq("estado_estagio", "concluido")
        .order("id", { ascending: false })
        .limit(1);
    }

    const { data: estagioData, error: estagioError } = await query.maybeSingle();

    if (estagioError) {
      console.log("ERRO ESTÁGIO RELATÓRIO:", estagioError);
      mostrarPopup("Erro", "Não foi possível carregar o estágio.");
      setLoading(false);
      return;
    }

    const estagioAtual = (estagioData as any) || null;

    setEstagio(estagioAtual);

    if (estagioAtual) {
      const { data: relatorioData, error: relatorioError } = await supabase
        .from("relatorios_finais")
        .select(`
          id,
          inscricao_id,
          ficheiro_url,
          observacoes,
          estado,
          validado_por,
          data_validacao,
          criado_em
        `)
        .eq("inscricao_id", estagioAtual.id)
        .order("criado_em", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (relatorioError) {
        console.log("ERRO RELATÓRIO:", relatorioError);
      }

      setRelatorio((relatorioData as any) || null);
    }

    setLoading(false);
  }

  function podeSubmeter() {
    if (!estagio) return false;
    if (estagio.estado_estagio === "concluido") return false;
    if (relatorio?.estado === "validado") return false;

    return true;
  }

  function textoEstado(estado?: string | null) {
    if (estado === "validado") return "Validado";
    if (estado === "rejeitado") return "Rejeitado";
    if (estado === "submetido") return "Submetido";

    return "Não submetido";
  }

  function corEstado(estado?: string | null) {
    if (estado === "validado") return "#CDEFD6";
    if (estado === "rejeitado") return "#F8C8C8";
    if (estado === "submetido") return "#FDE8B4";

    return "#E9E9E9";
  }

  function formatarData(data?: string | null) {
    if (!data) return "Sem data";

    const date = new Date(data);

    if (Number.isNaN(date.getTime())) return "Sem data";

    return date.toLocaleDateString("pt-PT");
  }

  async function escolherDocumento() {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled) return;

    const asset = result.assets?.[0];

    if (!asset) return;

    setDocumento({
      name: asset.name,
      uri: asset.uri,
      mimeType: asset.mimeType || "application/pdf",
    });
  }

  async function uploadDocumento() {
    if (!documento || !estagio) return null;

    const ext = documento.name?.split(".").pop() || "pdf";

    const path = `${estagio.aluno_id}/${estagio.id}/${Date.now()}.${ext}`;

    const response = await fetch(documento.uri);
    const blob = await response.blob();

    const { error: uploadError } = await supabase.storage
      .from("relatorios-finais")
      .upload(path, blob, {
        upsert: true,
        contentType: documento.mimeType || "application/pdf",
      });

    if (uploadError) {
      console.log("ERRO STORAGE RELATÓRIO:", uploadError);
      return {
        url: null,
        erro: uploadError.message,
      };
    }

    const { data } = supabase.storage
      .from("relatorios-finais")
      .getPublicUrl(path);

    return {
      url: data.publicUrl,
      erro: null,
    };
  }

  async function submeterRelatorio() {
    if (aGuardar) return;

    if (!estagio) {
      mostrarPopup("Erro", "Não existe estágio selecionado.");
      return;
    }

    if (!documento && !relatorio?.ficheiro_url) {
      mostrarPopup("Erro", "Tens de anexar um PDF.");
      return;
    }

    setAGuardar(true);

    let ficheiroUrl = relatorio?.ficheiro_url || null;

    if (documento) {
      const resultadoUpload = await uploadDocumento();

      if (!resultadoUpload?.url) {
        setAGuardar(false);
        mostrarPopup(
          "Erro",
          resultadoUpload?.erro ||
            "Não foi possível enviar o ficheiro. Verifica as permissões do Storage."
        );
        return;
      }

      ficheiroUrl = resultadoUpload.url;
    }

  const payload = {
    inscricao_id: estagio.id,
    ficheiro_url: ficheiroUrl,
    estado: "submetido",
  };

    const { error } = relatorio
      ? await supabase
          .from("relatorios_finais")
          .update(payload)
          .eq("id", relatorio.id)
      : await supabase.from("relatorios_finais").insert(payload);

    setAGuardar(false);

    if (error) {
      console.log("ERRO GUARDAR RELATÓRIO FINAL:", error);
      mostrarPopup("Erro", error.message);
      return;
    }

    setDocumento(null);

    mostrarPopup("Sucesso", "Relatório final submetido com sucesso.");

    await carregarDados();
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FDB515" />
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Pressable style={styles.voltar} onPress={voltarPaginaAnterior}>
          <Ionicons name="arrow-back-outline" size={24} color="#160909" />

          <Text style={styles.voltarTexto}>Voltar</Text>
        </Pressable>

        <Text style={styles.titulo}>Relatório Final</Text>

        {!estagio ? (
          <Text style={styles.textoVazio}>
            Não existe estágio disponível para submeter relatório.
          </Text>
        ) : (
          <>
            <View style={styles.estagioCard}>
              <Text style={styles.estagioTitulo}>
                {estagio.edicoes_estagio?.ensinos_clinicos?.nome ||
                  "Ensino Clínico"}
              </Text>

              <Text style={styles.estagioTexto}>
                {estagio.edicoes_estagio?.instituicoes?.nome || "Instituição"} ·{" "}
                {estagio.edicoes_estagio?.servicos?.nome || "Serviço"}
              </Text>

              <Text style={styles.estagioTexto}>
                {formatarData(estagio.edicoes_estagio?.data_inicio)} -{" "}
                {formatarData(estagio.edicoes_estagio?.data_fim)}
              </Text>
            </View>

            <View
              style={[
                styles.estadoCard,
                {
                  backgroundColor: corEstado(relatorio?.estado),
                },
              ]}
            >
              <Text style={styles.estadoTitulo}>Estado</Text>

              <Text style={styles.estadoTexto}>
                {textoEstado(relatorio?.estado)}
              </Text>
            </View>

            <Text style={styles.label}>Documento</Text>

            {relatorio?.ficheiro_url ? (
              <Pressable
                style={styles.documentoCard}
                onPress={() => Linking.openURL(relatorio.ficheiro_url!)}
              >
                <Ionicons
                  name="document-text-outline"
                  size={28}
                  color="#160909"
                />

                <View style={{ flex: 1 }}>
                  <Text style={styles.documentoTitulo}>Relatório final</Text>

                  <Text style={styles.documentoTexto}>Abrir documento</Text>
                </View>
              </Pressable>
            ) : null}

            {podeSubmeter() ? (
              <Pressable
                style={styles.botaoDocumento}
                onPress={escolherDocumento}
              >
                <Ionicons
                  name="document-attach-outline"
                  size={24}
                  color="#160909"
                />

                <Text style={styles.textoDocumento}>
                  {documento ? documento.name : "Anexar PDF"}
                </Text>
              </Pressable>
            ) : null}

          <Text style={styles.label}>Observações do professor</Text>

          <View style={styles.observacoesCard}>
            <Text style={styles.observacoesTexto}>
              {relatorio?.observacoes ||
                "Ainda não existem observações registadas pelo professor."}
            </Text>
          </View>

            {podeSubmeter() ? (
              <Pressable
                style={[
                  styles.botaoSubmeter,
                  aGuardar && {
                    opacity: 0.55,
                  },
                ]}
                onPress={submeterRelatorio}
                disabled={aGuardar}
              >
                <Text style={styles.textoBotaoSubmeter}>
                  {aGuardar ? "A submeter..." : "Submeter Relatório"}
                </Text>
              </Pressable>
            ) : (
              <Text style={styles.infoBloqueado}>
                Este relatório já não pode ser alterado.
              </Text>
            )}
          </>
        )}
      </ScrollView>

      <Modal visible={popupVisivel} transparent animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>{popupTitulo}</Text>

            <Text style={styles.popupMessage}>{popupMensagem}</Text>

            <Pressable
              style={styles.popupOkButton}
              onPress={() => setPopupVisivel(false)}
            >
              <Text style={styles.popupOkText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}