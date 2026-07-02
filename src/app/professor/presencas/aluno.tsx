import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { supabase } from "../../../lib/supabase";
import styles from "./presencasStyles";

type Inscricao = {
  id: number;
  aluno?: {
    nome: string;
    numero_identificacao: string | null;
  } | null;
  edicoes_estagio?: {
    ensinos_clinicos?: { nome: string } | null;
    instituicoes?: { nome: string } | null;
    servicos?: { nome: string } | null;
  } | null;
};

type Presenca = {
  id: number;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  duracao: number;
  tipo: string;
  observacoes: string | null;
  estado_orientador: string | null;
  estado_professor: string | null;
};

export default function PresencasAlunoProfessor() {
  const { inscricaoId } = useLocalSearchParams();

  const [inscricao, setInscricao] = useState<Inscricao | null>(null);
  const [presencas, setPresencas] = useState<Presenca[]>([]);
  const [loading, setLoading] = useState(true);

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

    if (!inscricaoId) {
      router.replace("/professor/presencas/presencas" as any);
      return;
    }

    const { data: inscricaoData, error: inscricaoError } = await supabase
      .from("inscricoes_estagio")
      .select(`
        id,
        aluno:utilizadores!inscricoes_estagio_aluno_id_fkey(
          nome,
          numero_identificacao
        ),
        edicoes_estagio(
          ensinos_clinicos(nome),
          instituicoes(nome),
          servicos(nome)
        )
      `)
      .eq("id", Number(inscricaoId))
      .single();

    if (inscricaoError) {
      console.log("ERRO INSCRIÇÃO:", inscricaoError);
      setLoading(false);
      return;
    }

    setInscricao((inscricaoData as any) || null);

    const { data: presencasData, error: presencasError } = await supabase
      .from("presencas")
      .select(`
        id,
        data,
        hora_inicio,
        hora_fim,
        duracao,
        tipo,
        observacoes,
        estado_orientador,
        estado_professor
      `)
      .eq("inscricao_id", Number(inscricaoId))
      .eq("estado_orientador", "validada")
      .order("data", { ascending: false });

    if (presencasError) {
      console.log("ERRO PRESENÇAS:", presencasError);
      setPresencas([]);
    } else {
      setPresencas((presencasData as any) || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    carregarDados();
  }, []);

  function textoTipo(tipo: string) {
    return tipo === "tutorial" ? "Tutorial" : "Contacto";
  }

  function textoEstado(estado: string | null) {
    if (estado === "validada") return "Validada";
    if (estado === "rejeitada") return "Rejeitada";
    return "Pendente";
  }

  function corEstado(estado: string | null) {
    if (estado === "validada") return "#CDEFD6";
    if (estado === "rejeitada") return "#F8C8C8";
    return "#FDE8B4";
  }

  async function validarPresenca(presencaId: number) {
    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace("/login/login" as any);
      return;
    }

    const { error } = await supabase
      .from("presencas")
      .update({
        estado_professor: "validada",
        estado: "validada",
        validado_professor_por: authData.user.id,
        validado_professor_em: new Date().toISOString(),
      })
      .eq("id", presencaId);

    if (error) {
      mostrarPopup("Erro", "Não foi possível validar a presença.");
      return;
    }

    mostrarPopup("Sucesso", "Presença validada.");
    carregarDados();
  }

  async function rejeitarPresenca(presencaId: number) {
    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace("/login/login" as any);
      return;
    }

    const { error } = await supabase
      .from("presencas")
      .update({
        estado_professor: "rejeitada",
        estado: "rejeitada",
        validado_professor_por: authData.user.id,
        validado_professor_em: new Date().toISOString(),
      })
      .eq("id", presencaId);

    if (error) {
      mostrarPopup("Erro", "Não foi possível rejeitar a presença.");
      return;
    }

    mostrarPopup("Sucesso", "Presença rejeitada.");
    carregarDados();
  }

  if (loading) {
    return (
      <View style={styles.page}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FDB515" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Pressable
          style={styles.voltar}
          onPress={() => router.push("/professor/presencas/presencas" as any)}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#160909" />
          <Text style={styles.voltarTexto}>Voltar</Text>
        </Pressable>

        <Text style={styles.titulo}>Presenças</Text>

        <View style={styles.estagioCard}>
          <Text style={styles.cardTitulo}>
            {inscricao?.aluno?.nome || "Aluno"}
          </Text>

          <Text style={styles.cardTexto}>
            Nº Aluno: {inscricao?.aluno?.numero_identificacao || "-"}
          </Text>

          <Text style={styles.cardTexto}>
            {inscricao?.edicoes_estagio?.ensinos_clinicos?.nome ||
              "Ensino Clínico"}
          </Text>

          <Text style={styles.cardTexto}>
            {inscricao?.edicoes_estagio?.instituicoes?.nome || "Instituição"} ·{" "}
            {inscricao?.edicoes_estagio?.servicos?.nome || "Serviço"}
          </Text>
        </View>

        {presencas.length === 0 ? (
          <Text style={styles.textoVazio}>
            Não existem presenças aprovadas pelo orientador para validar.
          </Text>
        ) : (
          <View style={styles.lista}>
            {presencas.map((presenca) => (
              <View key={presenca.id} style={styles.cardPresenca}>
                <View style={styles.cardTopo}>
                  <View>
                    <Text style={styles.dataTexto}>Data: {presenca.data}</Text>
                    <Text style={styles.cardTexto}>
                      {presenca.hora_inicio.slice(0, 5)} -{" "}
                      {presenca.hora_fim.slice(0, 5)}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.badgeEstado,
                      { backgroundColor: corEstado(presenca.estado_professor) },
                    ]}
                  >
                    <Text style={styles.badgeTexto}>
                      {textoEstado(presenca.estado_professor)}
                    </Text>
                  </View>
                </View>

                <Text style={styles.cardTexto}>
                  Tipo: {textoTipo(presenca.tipo)}
                </Text>

                <Text style={styles.cardTexto}>
                  Duração: {presenca.duracao}h
                </Text>

                <Text style={styles.cardTexto}>
                  Validação do orientador:{" "}
                  {textoEstado(presenca.estado_orientador)}
                </Text>

                {presenca.observacoes ? (
                  <Text style={styles.observacoesTexto}>
                    Obs.: {presenca.observacoes}
                  </Text>
                ) : null}

                {!presenca.estado_professor ||
                presenca.estado_professor === "pendente" ? (
                  <View style={styles.botoesLinha}>
                    <Pressable
                      style={styles.botaoValidar}
                      onPress={() => validarPresenca(presenca.id)}
                    >
                      <Ionicons name="checkmark-outline" size={20} color="#160909" />
                      <Text style={styles.textoBotaoEscuro}>Validar</Text>
                    </Pressable>

                    <Pressable
                      style={styles.botaoRejeitar}
                      onPress={() => rejeitarPresenca(presenca.id)}
                    >
                      <Ionicons name="close-outline" size={20} color="#FFFFFF" />
                      <Text style={styles.textoBotaoClaro}>Rejeitar</Text>
                    </Pressable>
                  </View>
                ) : null}
              </View>
            ))}
          </View>
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