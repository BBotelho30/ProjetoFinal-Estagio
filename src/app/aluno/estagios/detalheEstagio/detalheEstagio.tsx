import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { supabase } from "../../../../lib/supabase";
import styles from "./detalheEstagioStyles";

type Utilizador = {
  nome: string;
  email: string | null;
  foto_url: string | null;
};

type DetalheEstagio = {
  id: number;
  estado_estagio: string | null;
  professor?: Utilizador | null;
  orientador?: Utilizador | null;
  edicoes_estagio?: {
    ano_letivo: string;
    data_inicio: string | null;
    data_fim: string | null;
    ensinos_clinicos?: {
      nome: string;
      ano_curricular: number;
      tipo: string;
      horas_estimadas: number;
    };
    instituicoes?: {
      nome: string;
    };
    servicos?: {
      nome: string;
    };
  };
};

type Avaliacao = {
  nota_final: number | null;
  observacao_final: string | null;
  estado: string | null;
};

export default function DetalheEstagio() {
  const params = useLocalSearchParams();
  const id = params.id ? Number(params.id) : null;
  const [estagio, setEstagio] = useState<DetalheEstagio | null>(null);
  const [avaliacao, setAvaliacao] = useState<Avaliacao | null>(null);
  const [loading, setLoading] = useState(true);

  const [popupVisivel, setPopupVisivel] = useState(false);
  const [popupTitulo, setPopupTitulo] = useState("");
  const [popupMensagem, setPopupMensagem] = useState("");

  const [professor, setProfessor] = useState<Utilizador | null>(null);
  const [orientador, setOrientador] = useState<Utilizador | null>(null);

  function mostrarPopup(titulo: string, mensagem: string) {
    setPopupTitulo(titulo);
    setPopupMensagem(mensagem);
    setPopupVisivel(true);
  }

  async function carregarDetalhes() {
    setLoading(true);

    if (!id) {
    console.log("ID recebido:", params);
    mostrarPopup("Erro", "Estágio não encontrado.");
    setLoading(false);
    return;
    }

    const { data, error } = await supabase
    .from("inscricoes_estagio")
    .select(`
    id,
    edicao_estagio_id,
    professor_id,
    orientador_id,
    estado_estagio,
    edicoes_estagio(
        ano_letivo,
        data_inicio,
        data_fim,
        ensinos_clinicos(nome, ano_curricular, tipo, horas_estimadas),
        instituicoes(nome),
        servicos(nome)
    )
    `)
    .eq("id", id)
    .single();

    console.log("ID DETALHE:", id);
    console.log("DATA DETALHE:", data);
    console.log("ERRO DETALHE:", error);

    if (error || !data) {
      console.log("ERRO DETALHE ESTÁGIO:", error);
      mostrarPopup("Erro", "Não foi possível carregar os detalhes.");
      setLoading(false);
      return;
    }

    setEstagio(data as any);

    // Fetch professor and orientador details if available 
    if ((data as any).professor_id) {
    const { data: profData } = await supabase
        .from("utilizadores")
        .select("nome, email, foto_url")
        .eq("id", (data as any).professor_id)
        .single();

    setProfessor((profData as any) || null);
    }

    if ((data as any).orientador_id) {
    const { data: orientData } = await supabase
        .from("utilizadores")
        .select("nome, email, foto_url")
        .eq("id", (data as any).orientador_id)
        .single();

    setOrientador((orientData as any) || null);
    }

    const { data: avaliacaoData, error: avaliacaoError } = await supabase
      .from("avaliacoes")
      .select("nota_final, observacao_final, estado")
      .eq("edicao_estagio_id", (data as any).edicao_estagio_id)
      .maybeSingle();

    if (avaliacaoError) {
      console.log("ERRO AVALIAÇÃO:", avaliacaoError);
    } else {
      setAvaliacao((avaliacaoData as any) || null);
    }

    setLoading(false);
  }

  useEffect(() => {
    carregarDetalhes();
  }, []);

  function formatarData(data: string | null | undefined) {
    if (!data) return "Sem data";

    const date = new Date(data);
    if (Number.isNaN(date.getTime())) return data;

    return date.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function textoEstado(estado: string | null | undefined) {
    if (estado === "aguarda_relatorio") return "A aguardar relatório";
    if (estado === "aguarda_avaliacao") return "A aguardar avaliação";
    if (estado === "concluido") return "Concluído";
    return "Em curso";
  }

  function abrirIndisponivel(nome: string) {
    mostrarPopup(
      "Em desenvolvimento",
      `A página de ${nome} ainda vai ser implementada.`
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FDB515" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable
        style={styles.voltar}
        onPress={() => router.push("/aluno/estagios/estagio" as any)}
      >
        <Ionicons name="arrow-back-outline" size={24} color="#160909" />
        <Text style={styles.voltarTexto}>Voltar</Text>
      </Pressable>

      <Text style={styles.titulo}>Detalhes do Estágio</Text>

      <View style={styles.headerCard}>
        <Text style={styles.headerTitulo}>
          {estagio?.edicoes_estagio?.ensinos_clinicos?.nome || "Ensino Clínico"}
        </Text>

        <Text style={styles.headerTexto}>
          {estagio?.edicoes_estagio?.instituicoes?.nome || "Instituição"}
        </Text>

        <Text style={styles.headerTexto}>
          {estagio?.edicoes_estagio?.servicos?.nome || "Serviço"}
        </Text>

        <Text style={styles.headerDatas}>
          {formatarData(estagio?.edicoes_estagio?.data_inicio)} -{" "}
          {formatarData(estagio?.edicoes_estagio?.data_fim)}
        </Text>

        <View style={styles.badgeEstado}>
          <Text style={styles.badgeTexto}>{textoEstado(estagio?.estado_estagio)}</Text>
        </View>
      </View>

      <Text style={styles.secaoTitulo}>Equipa</Text>

      <View style={styles.pessoaCard}>
        {estagio?.professor?.foto_url ? (
          <Image
            source={{ uri: estagio.professor.foto_url }}
            style={styles.fotoPessoa}
          />
        ) : (
          <Ionicons name="person-circle-outline" size={58} color="#FDB515" />
        )}

        <View style={{ flex: 1 }}>
          <Text style={styles.pessoaLabel}>Professor Orientador</Text>
          <Text style={styles.pessoaNome}>
            {professor?.nome || "Não indicado"}
          </Text>
          <Text style={styles.pessoaEmail}>
            {professor?.email || ""}
          </Text>
        </View>
      </View>

      <View style={styles.pessoaCard}>
        {estagio?.orientador?.foto_url ? (
          <Image
            source={{ uri: estagio.orientador.foto_url }}
            style={styles.fotoPessoa}
          />
        ) : (
          <Ionicons name="person-circle-outline" size={58} color="#FDB515" />
        )}

        <View style={{ flex: 1 }}>
          <Text style={styles.pessoaLabel}>Orientador de Estágio</Text>
          <Text style={styles.pessoaNome}>
            {orientador?.nome || "Não indicado"}
          </Text>
          <Text style={styles.pessoaEmail}>
            {orientador?.email || ""}
          </Text>
        </View>
      </View>

      <Text style={styles.secaoTitulo}>Informações</Text>

      <View style={styles.infoGrid}>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Ano curricular</Text>
          <Text style={styles.infoValor}>
            {estagio?.edicoes_estagio?.ensinos_clinicos?.ano_curricular}.º ano
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Tipo</Text>
          <Text style={styles.infoValor}>
            {estagio?.edicoes_estagio?.ensinos_clinicos?.tipo || "Não indicado"}
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Horas</Text>
          <Text style={styles.infoValor}>
            {estagio?.edicoes_estagio?.ensinos_clinicos?.horas_estimadas || 0}h
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Ano letivo</Text>
          <Text style={styles.infoValor}>
            {estagio?.edicoes_estagio?.ano_letivo || "Não indicado"}
          </Text>
        </View>
      </View>

      <Text style={styles.secaoTitulo}>Avaliação Final</Text>

      <View style={styles.avaliacaoCard}>
        {avaliacao?.nota_final ? (
          <>
            <Text style={styles.avaliacaoNota}>{avaliacao.nota_final}</Text>
            <Text style={styles.avaliacaoTexto}>
              {avaliacao.observacao_final || "Sem observações."}
            </Text>
          </>
        ) : (
          <Text style={styles.avaliacaoTexto}>
            A avaliação final ainda não está disponível.
          </Text>
        )}
      </View>

      <Text style={styles.secaoTitulo}>Ações rápidas</Text>

      <View style={styles.acoesLista}>
        <Pressable
          style={styles.acaoCard}
          onPress={() => router.push("/aluno/presencas/presencas" as any)}
        >
          <Ionicons name="calendar-outline" size={24} color="#160909" />
          <Text style={styles.acaoTexto}>Presenças</Text>
          <Ionicons name="chevron-forward-outline" size={22} color="#160909" />
        </Pressable>

        <Pressable
          style={styles.acaoCard}
          onPress={() => router.push("/aluno/agenda/agenda" as any)}
        >
          <Ionicons name="time-outline" size={24} color="#160909" />
          <Text style={styles.acaoTexto}>Agenda</Text>
          <Ionicons name="chevron-forward-outline" size={22} color="#160909" />
        </Pressable>

        <Pressable
          style={styles.acaoCard}
          onPress={() => abrirIndisponivel("relatório final")}
        >
          <Ionicons name="document-text-outline" size={24} color="#160909" />
          <Text style={styles.acaoTexto}>Relatório Final</Text>
          <Ionicons name="chevron-forward-outline" size={22} color="#160909" />
        </Pressable>

        <Pressable
          style={styles.acaoCard}
          onPress={() => abrirIndisponivel("comentários semanais")}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="#160909" />
          <Text style={styles.acaoTexto}>Comentários Semanais</Text>
          <Ionicons name="chevron-forward-outline" size={22} color="#160909" />
        </Pressable>

        <Pressable
          style={styles.acaoCard}
          onPress={() => abrirIndisponivel("avaliação")}
        >
          <Ionicons name="star-outline" size={24} color="#160909" />
          <Text style={styles.acaoTexto}>Avaliação</Text>
          <Ionicons name="chevron-forward-outline" size={22} color="#160909" />
        </Pressable>
      </View>

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
    </ScrollView>
  );
}