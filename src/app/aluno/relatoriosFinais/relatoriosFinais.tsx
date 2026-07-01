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
  estado_estagio: string | null;
  edicoes_estagio?: {
    data_inicio: string | null;
    data_fim: string | null;
    ensinos_clinicos?: {
      id: number;
      nome: string;
      ano_curricular: number;
      semestre: number;
    };
    instituicoes?: { nome: string };
    servicos?: { nome: string };
  };
};

type Relatorio = {
  id: number;
  ficheiro_url: string | null;
  nome_ficheiro: string | null;
  observacoes: string | null;
  estado: string | null;
  criado_em: string | null;
};

export default function RelatorioFinal() {
  const { inscricaoId } = useLocalSearchParams();

  const [estagio, setEstagio] = useState<Estagio | null>(null);
  const [relatorio, setRelatorio] = useState<Relatorio | null>(null);
  const [loading, setLoading] = useState(true);

  const [documento, setDocumento] = useState<any>(null);
  const [observacoes, setObservacoes] = useState("");
  const [aGuardar, setAGuardar] = useState(false);

  const [popupVisivel, setPopupVisivel] = useState(false);
  const [popupTitulo, setPopupTitulo] = useState("");
  const [popupMensagem, setPopupMensagem] = useState("");

  function mostrarPopup(titulo: string, mensagem: string) {
    setPopupTitulo(titulo);
    setPopupMensagem(mensagem);
    setPopupVisivel(true);
  }

  async function carregarDados() {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace("/login/login" as any);
      return;
    }

    let query = supabase
      .from("inscricoes_estagio")
      .select(`
        id,
        estado_estagio,
        edicoes_estagio(
          data_inicio,
          data_fim,
          ensinos_clinicos(id, nome, ano_curricular, semestre),
          instituicoes(nome),
          servicos(nome)
        )
      `);

    if (inscricaoId) {
      query = query.eq("id", Number(inscricaoId));
    } else {
      query = query
        .eq("aluno_id", authData.user.id)
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

    setEstagio((estagioData as any) || null);

    if (estagioData) {
      const { data: relatorioData, error: relatorioError } = await supabase
        .from("relatorios_finais")
        .select("id, ficheiro_url, nome_ficheiro, observacoes, estado, criado_em")
        .eq("inscricao_id", (estagioData as any).id)
        .maybeSingle();

      if (relatorioError) {
        console.log("ERRO RELATÓRIO:", relatorioError);
      }

      setRelatorio((relatorioData as any) || null);
      setObservacoes((relatorioData as any)?.observacoes || "");
    }

    setLoading(false);
  }

  useEffect(() => {
    carregarDados();
  }, []);

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
    return new Date(data).toLocaleDateString("pt-PT");
  }

  async function escolherDocumento() {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    setDocumento(result.assets[0]);
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
    let nomeFicheiro = relatorio?.nome_ficheiro || null;

    if (documento) {
      const ext = documento.name?.split(".").pop() || "pdf";
      const path = `${estagio.id}/${Date.now()}.${ext}`;

      const response = await fetch(documento.uri);
      const blob = await response.blob();

      const { error: uploadError } = await supabase.storage
        .from("relatorios-finais")
        .upload(path, blob, {
          upsert: true,
          contentType: documento.mimeType || "application/pdf",
        });

      if (uploadError) {
        setAGuardar(false);
        mostrarPopup("Erro", uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from("relatorios-finais")
        .getPublicUrl(path);

      ficheiroUrl = data.publicUrl;
      nomeFicheiro = documento.name || "relatorio_final.pdf";
    }

    const payload = {
      inscricao_id: estagio.id,
      ficheiro_url: ficheiroUrl,
      nome_ficheiro: nomeFicheiro,
      observacoes: observacoes.trim() || null,
      estado: "submetido",
    };

    const { error } = relatorio
      ? await supabase
          .from("relatorios_finais")
          .update(payload)
          .eq("id", relatorio.id)
      : await supabase.from("relatorios_finais").insert([payload]);

    setAGuardar(false);

    if (error) {
      mostrarPopup("Erro", error.message);
      return;
    }

    setDocumento(null);
    mostrarPopup("Sucesso", "Relatório final submetido com sucesso.");
    carregarDados();
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
        <Pressable style={styles.voltar} onPress={() =>inscricaoId ? router.push( `/aluno/estagios/detalheEstagio/detalheEstagio?id=${inscricaoId}` as any) : router.push("/aluno/home" as any)}>
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
                { backgroundColor: corEstado(relatorio?.estado) },
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
                <Ionicons name="document-text-outline" size={28} color="#160909" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.documentoTitulo}>
                    {relatorio.nome_ficheiro || "Relatório final"}
                  </Text>
                  <Text style={styles.documentoTexto}>Abrir documento</Text>
                </View>
              </Pressable>
            ) : null}

            {podeSubmeter() ? (
              <Pressable style={styles.botaoDocumento} onPress={escolherDocumento}>
                <Ionicons name="document-attach-outline" size={24} color="#160909" />
                <Text style={styles.textoDocumento}>
                  {documento ? documento.name : "Anexar PDF"}
                </Text>
              </Pressable>
            ) : null}

            <Text style={styles.label}>Observações</Text>

            <TextInput
              placeholder="Escreve observações, se necessário..."
              placeholderTextColor="#8c8787"
              style={styles.inputObservacoes}
              value={observacoes}
              onChangeText={setObservacoes}
              multiline
              editable={podeSubmeter()}
            />

            {podeSubmeter() ? (
              <Pressable style={styles.botaoSubmeter} onPress={submeterRelatorio}>
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