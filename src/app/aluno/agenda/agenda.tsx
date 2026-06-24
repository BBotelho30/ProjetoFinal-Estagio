import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { supabase } from "../../../lib/supabase";
import styles from "./agendaStyles";


type EventoAgenda = {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  hora?: string;
  cor: string;
};

export default function AgendaAluno() {
  const hoje = new Date();

  const [loading, setLoading] = useState(true);
  const [mesAtual, setMesAtual] = useState(hoje.getMonth());
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());
  const [diaSelecionado, setDiaSelecionado] = useState(hoje.getDate());
  const [eventos, setEventos] = useState<EventoAgenda[]>([]);

  const { from } = useLocalSearchParams();
  const mostrarBottomBar = from === "bottom";

  async function carregarEventos() {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace("/login/login" as any);
      return;
    }

    const userId = authData.user.id;
    const listaEventos: EventoAgenda[] = [];

    const { data: estagios } = await supabase
      .from("inscricoes_estagio")
      .select(`
        id,
        edicoes_estagio(
          data_inicio,
          data_fim,
          ensinos_clinicos(nome),
          instituicoes(nome),
          servicos(nome)
        )
      `)
      .eq("aluno_id", userId);

    (estagios as any[] | null)?.forEach((item, index) => {
      const edicao = item.edicoes_estagio;
      if (!edicao?.data_inicio || !edicao?.data_fim) return;

      const cor = coresEstagio(index);

      listaEventos.push({
        id: `inicio-${item.id}`,
        titulo: `Início de ${edicao.ensinos_clinicos?.nome || "Estágio"}`,
        descricao: `${edicao.instituicoes?.nome || ""} · ${
          edicao.servicos?.nome || ""
        }`,
        data: edicao.data_inicio,
        cor,
      });

      listaEventos.push({
        id: `fim-${item.id}`,
        titulo: `Fim de ${edicao.ensinos_clinicos?.nome || "Estágio"}`,
        descricao: `${edicao.instituicoes?.nome || ""} · ${
          edicao.servicos?.nome || ""
        }`,
        data: edicao.data_fim,
        cor,
      });
    });

    const { data: reunioes } = await supabase
      .from("reunioes")
      .select("id, assunto, data_hora, local")
      .eq("aluno_id", userId)
      .order("data_hora", { ascending: true });

    (reunioes as any[] | null)?.forEach((reuniao) => {
      if (!reuniao.data_hora) return;

      const dataObj = new Date(reuniao.data_hora);

      listaEventos.push({
        id: `reuniao-${reuniao.id}`,
        titulo: reuniao.assunto || "Reunião",
        descricao: reuniao.local || "Sem local definido",
        data: reuniao.data_hora,
        hora: dataObj.toLocaleTimeString("pt-PT", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        cor: "#4CAF50",
      });
    });

    setEventos(listaEventos);
    setLoading(false);
  }

  useEffect(() => {
    carregarEventos();
  }, []);

  function coresEstagio(index: number) {
    const cores = ["#FDB515", "#8EC5FC", "#CDB4DB", "#B8E0D2", "#FFADAD"];
    return cores[index % cores.length];
  }

  function nomeMes() {
    return new Date(anoAtual, mesAtual).toLocaleDateString("pt-PT", {
      month: "long",
      year: "numeric",
    });
  }

  function diasDoMes() {
    const primeiroDia = new Date(anoAtual, mesAtual, 1);
    const ultimoDia = new Date(anoAtual, mesAtual + 1, 0);

    const dias: (number | null)[] = [];

    let inicioSemana = primeiroDia.getDay();
    inicioSemana = inicioSemana === 0 ? 6 : inicioSemana - 1;

    for (let i = 0; i < inicioSemana; i++) {
      dias.push(null);
    }

    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      dias.push(dia);
    }

    return dias;
  }

  function eventosDoDia(dia: number) {
    return eventos.filter((evento) => {
      const dataEvento = new Date(evento.data);
      return (
        dataEvento.getDate() === dia &&
        dataEvento.getMonth() === mesAtual &&
        dataEvento.getFullYear() === anoAtual
      );
    });
  }

  function corDoDia(dia: number) {
    const eventosDia = eventosDoDia(dia);
    return eventosDia.length > 0 ? eventosDia[0].cor : "transparent";
  }

  function mudarMes(valor: number) {
    const novaData = new Date(anoAtual, mesAtual + valor, 1);
    setMesAtual(novaData.getMonth());
    setAnoAtual(novaData.getFullYear());
    setDiaSelecionado(1);
  }

  const eventosSelecionados = eventosDoDia(diaSelecionado);

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
      <Pressable
        style={styles.voltar}
        onPress={() => router.push("/aluno/home" as any)}
      >
        <Ionicons name="arrow-back-outline" size={24} color="#160909" />
        <Text style={styles.voltarTexto}>Voltar</Text>
      </Pressable>

      <Text style={styles.titulo}>Agenda</Text>

      <View style={styles.mesHeader}>
        <Pressable onPress={() => mudarMes(-1)}>
          <Ionicons name="chevron-back-outline" size={26} color="#160909" />
        </Pressable>

        <Text style={styles.mesTitulo}>{nomeMes()}</Text>

        <Pressable onPress={() => mudarMes(1)}>
          <Ionicons name="chevron-forward-outline" size={26} color="#160909" />
        </Pressable>
      </View>

      <View style={styles.semana}>
        {["S", "T", "Q", "Q", "S", "S", "D"].map((dia, index) => (
          <Text key={index} style={styles.diaSemana}>
            {dia}
          </Text>
        ))}
      </View>

      <View style={styles.calendario}>
        {diasDoMes().map((dia, index) =>
          dia === null ? (
            <View key={index} style={styles.diaVazio} />
          ) : (
            <Pressable
              key={index}
              style={[
                styles.dia,
                diaSelecionado === dia && styles.diaSelecionado,
              ]}
              onPress={() => setDiaSelecionado(dia)}
            >
              <Text style={styles.diaTexto}>{dia}</Text>

              {eventosDoDia(dia).length > 0 ? (
                <View
                  style={[
                    styles.marcador,
                    { backgroundColor: corDoDia(dia) },
                  ]}
                />
              ) : null}
            </Pressable>
          )
        )}
      </View>

      <Text style={styles.dataSelecionada}>
        {diaSelecionado} de {nomeMes()}
      </Text>

      {eventosSelecionados.length === 0 ? (
        <Text style={styles.textoVazio}>
          Não existem eventos neste dia.
        </Text>
      ) : (
        <View style={styles.eventosLista}>
          {eventosSelecionados.map((evento) => (
            <View
              key={evento.id}
              style={[styles.eventoCard, { borderLeftColor: evento.cor }]}
            >
              <Text style={styles.eventoTitulo}>{evento.titulo}</Text>

              <Text style={styles.eventoTexto}>
                {evento.hora ? `${evento.hora} · ` : ""}
                {evento.descricao}
              </Text>
            </View>
          ))}
        </View>
      )}


    </ScrollView>

    {mostrarBottomBar && (
      <View style={styles.bottomBar}>
        <Pressable style={styles.bottomItem} onPress={() => router.push("/aluno/home" as any)}>
          <Ionicons name="home-outline" size={24} color="#160909" />
          <Text style={styles.bottomTexto}>Home</Text>
        </Pressable>

        <Pressable style={styles.bottomItem} onPress={() => router.push("/aluno/presencas?from=bottom" as any)}>
          <Ionicons name="calendar-outline" size={24} color="#160909" />
          <Text style={styles.bottomTexto}>Presenças</Text>
        </Pressable>

        <Pressable style={styles.bottomItem} onPress={() => router.push("/aluno/avaliacoes?from=bottom" as any)}>
          <Ionicons name="star-outline" size={24} color="#160909" />
          <Text style={styles.bottomTexto}>Avaliações</Text>
        </Pressable>

        <Pressable style={styles.bottomItem}>
          <Ionicons name="people-outline" size={24} color="#FDB515" />
          <Text style={styles.bottomTextoAtivo}>Agenda</Text>
        </Pressable>

        <Pressable style={styles.bottomItem} onPress={() => router.push("/aluno/estagios/estagio?from=bottom" as any)}>
          <Ionicons name="briefcase-outline" size={24} color="#160909" />
          <Text style={styles.bottomTexto}>Ensinos Clínicos</Text>
        </Pressable>

        <Pressable style={styles.bottomItem} onPress={() => router.push("/aluno/preencherPerfil/perfil?from=bottom" as any)}>
          <Ionicons name="person-outline" size={24} color="#160909" />
          <Text style={styles.bottomTexto}>Perfil</Text>
        </Pressable>
      </View>
    )}
  </View>
);
}