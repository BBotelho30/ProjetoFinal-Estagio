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

type TipoEvento = "inicio" | "fim" | "reuniao";

type EventoAgenda = {
  id: string;
  tipo: TipoEvento;
  titulo: string;
  descricao: string;
  data: string;
  hora?: string;
  local?: string | null;
  assunto?: string | null;
  professor?: string | null;
  orientador?: string | null;
  cor: string;
};

const COR_INICIO = "#225943";
const COR_FIM = "#FDB515";
const COR_REUNIAO = "#8ED6FF";

export default function AgendaAluno() {
  const hoje = new Date();

  const params = useLocalSearchParams();

  const from = params.from ? String(params.from) : "";
  const origem = params.origem ? String(params.origem) : "";

  const mostrarBottomBar = from === "bottom";

  const [loading, setLoading] = useState(true);
  const [mesAtual, setMesAtual] = useState(hoje.getMonth());
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());
  const [diaSelecionado, setDiaSelecionado] = useState(hoje.getDate());
  const [eventos, setEventos] = useState<EventoAgenda[]>([]);

  useEffect(() => {
    carregarEventos();
  }, []);

  function voltarPagina() {
    const veioDeDetalhes =
      from === "detalhes" ||
      origem === "detalhes" ||
      origem === "detalhesAluno" ||
      origem === "detalhesEstagio";

    if (veioDeDetalhes) {
      router.back();
      return;
    }

    router.replace("/aluno/home" as any);
  }

  async function carregarEventos() {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace("/login/login" as any);
      return;
    }

    const userId = authData.user.id;
    const listaEventos: EventoAgenda[] = [];

    const { data: estagios, error: estagiosError } = await supabase
      .from("inscricoes_estagio")
      .select(`
        id,
        estado,
        estado_estagio,
        distribuido_por,
        edicoes_estagio(
          id,
          data_inicio,
          data_fim,
          ensinos_clinicos(nome),
          instituicoes(nome),
          servicos(nome)
        )
      `)
      .eq("aluno_id", userId);

    if (estagiosError) {
      console.log("ERRO ESTÁGIOS AGENDA:", estagiosError);
    }

    ((estagios as any[]) || [])
      .filter((item) => {
        return (
          item.estado !== "rejeitado" &&
          item.estado_estagio !== "inativo" &&
          item.estado_estagio !== "por_distribuir" &&
          (item.estado === "aprovado" ||
            item.estado_estagio === "em_curso" ||
            item.estado_estagio === "aguarda_relatorio" ||
            item.estado_estagio === "aguarda_avaliacao" ||
            item.estado_estagio === "concluido" ||
            Boolean(item.distribuido_por))
        );
      })
      .forEach((item) => {
        const edicao = item.edicoes_estagio;

        if (!edicao) return;

        const nomeEstagio = edicao.ensinos_clinicos?.nome || "Ensino Clínico";

        const localEstagio = [edicao.instituicoes?.nome, edicao.servicos?.nome]
          .filter(Boolean)
          .join(" · ");

        if (edicao.data_inicio) {
          listaEventos.push({
            id: `inicio-${item.id}`,
            tipo: "inicio",
            titulo: `Início de ${nomeEstagio}`,
            descricao: localEstagio || "Sem instituição/serviço definido",
            data: edicao.data_inicio,
            cor: COR_INICIO,
          });
        }

        if (edicao.data_fim) {
          listaEventos.push({
            id: `fim-${item.id}`,
            tipo: "fim",
            titulo: `Fim de ${nomeEstagio}`,
            descricao: localEstagio || "Sem instituição/serviço definido",
            data: edicao.data_fim,
            cor: COR_FIM,
          });
        }
      });

    const { data: reunioes, error: reunioesError } = await supabase
      .from("reunioes")
      .select(`
        id,
        assunto,
        local,
        data_hora,
        professor:utilizadores!reunioes_professor_id_fkey(nome),
        orientador:utilizadores!reunioes_orientador_id_fkey(nome),
        edicoes_estagio(
          ensinos_clinicos(nome)
        )
      `)
      .eq("aluno_id", userId)
      .order("data_hora", { ascending: true });

    if (reunioesError) {
      console.log("ERRO REUNIÕES AGENDA:", reunioesError);
    }

    ((reunioes as any[]) || []).forEach((reuniao) => {
      if (!reuniao.data_hora) return;

      const dataObj = new Date(reuniao.data_hora);

      const nomeEstagio =
        reuniao.edicoes_estagio?.ensinos_clinicos?.nome || "Ensino Clínico";

      listaEventos.push({
        id: `reuniao-${reuniao.id}`,
        tipo: "reuniao",
        titulo: reuniao.assunto || "Reunião",
        assunto: reuniao.assunto || "Reunião",
        descricao: nomeEstagio,
        data: reuniao.data_hora,
        hora: dataObj.toLocaleTimeString("pt-PT", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        local: reuniao.local || "Sem local definido",
        professor: reuniao.professor?.nome || null,
        orientador: reuniao.orientador?.nome || null,
        cor: COR_REUNIAO,
      });
    });

    setEventos(listaEventos);
    setLoading(false);
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

  function dataEventoComoDate(data: string) {
    const dataParte = data.includes("T") ? data.split("T")[0] : data;
    const partes = dataParte.split("-");

    if (partes.length === 3) {
      const ano = Number(partes[0]);
      const mes = Number(partes[1]);
      const dia = Number(partes[2]);

      return new Date(ano, mes - 1, dia);
    }

    return new Date(data);
  }

  function eventosDoDia(dia: number) {
    return eventos.filter((evento) => {
      const dataEvento = dataEventoComoDate(evento.data);

      return (
        dataEvento.getDate() === dia &&
        dataEvento.getMonth() === mesAtual &&
        dataEvento.getFullYear() === anoAtual
      );
    });
  }

  function corDoDia(dia: number) {
    const eventosDia = eventosDoDia(dia);

    if (eventosDia.some((evento) => evento.tipo === "reuniao")) {
      return COR_REUNIAO;
    }

    if (eventosDia.some((evento) => evento.tipo === "inicio")) {
      return COR_INICIO;
    }

    if (eventosDia.some((evento) => evento.tipo === "fim")) {
      return COR_FIM;
    }

    return "transparent";
  }

  function mudarMes(valor: number) {
    const novaData = new Date(anoAtual, mesAtual + valor, 1);

    setMesAtual(novaData.getMonth());
    setAnoAtual(novaData.getFullYear());
    setDiaSelecionado(1);
  }

  function textoTipoEvento(tipo: TipoEvento) {
    if (tipo === "inicio") return "Início";
    if (tipo === "fim") return "Fim";
    return "Reunião";
  }

  function iconeTipoEvento(tipo: TipoEvento) {
    if (tipo === "inicio") return "flag-outline";
    if (tipo === "fim") return "checkmark-done-outline";
    return "people-outline";
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
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={styles.voltar} onPress={voltarPagina}>
          <Ionicons name="arrow-back-outline" size={24} color="#160909" />
          <Text style={styles.voltarTexto}>Voltar</Text>
        </Pressable>

        <Text style={styles.titulo}>Agenda</Text>

        <View style={styles.mesHeader}>
          <Pressable onPress={() => mudarMes(-1)}>
            <Ionicons name="chevron-back-outline" size={32} color="#160909" />
          </Pressable>

          <Text style={styles.mesTitulo}>{nomeMes()}</Text>

          <Pressable onPress={() => mudarMes(1)}>
            <Ionicons
              name="chevron-forward-outline"
              size={32}
              color="#160909"
            />
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
                      {
                        backgroundColor: corDoDia(dia),
                      },
                    ]}
                  />
                ) : null}
              </Pressable>
            )
          )}
        </View>

        <View style={styles.legenda}>
          <View style={styles.legendaItem}>
            <View
              style={[styles.legendaBolinha, { backgroundColor: COR_INICIO }]}
            />
            <Text style={styles.legendaTexto}>Início</Text>
          </View>

          <View style={styles.legendaItem}>
            <View
              style={[styles.legendaBolinha, { backgroundColor: COR_FIM }]}
            />
            <Text style={styles.legendaTexto}>Fim</Text>
          </View>

          <View style={styles.legendaItem}>
            <View
              style={[styles.legendaBolinha, { backgroundColor: COR_REUNIAO }]}
            />
            <Text style={styles.legendaTexto}>Reunião</Text>
          </View>
        </View>

        <Text style={styles.dataSelecionada}>
          {diaSelecionado} de {nomeMes()}
        </Text>

        {eventosSelecionados.length === 0 ? (
          <View style={styles.semEventosCard}>
            <Ionicons name="calendar-outline" size={34} color="#FDB515" />

            <Text style={styles.semEventosTitulo}>Sem eventos</Text>

            <Text style={styles.semEventosTexto}>
              Não existem reuniões nem datas de estágio neste dia.
            </Text>
          </View>
        ) : (
          <View style={styles.eventosLista}>
            {eventosSelecionados.map((evento) => (
              <View
                key={evento.id}
                style={[
                  styles.eventoCard,
                  {
                    borderLeftColor: evento.cor,
                  },
                ]}
              >
                <View style={styles.eventoHeader}>
                  <View
                    style={[
                      styles.eventoIcone,
                      {
                        backgroundColor: evento.cor,
                      },
                    ]}
                  >
                    <Ionicons
                      name={iconeTipoEvento(evento.tipo) as any}
                      size={22}
                      color="#160909"
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.eventoTipo}>
                      {textoTipoEvento(evento.tipo)}
                    </Text>

                    <Text style={styles.eventoTitulo}>{evento.titulo}</Text>
                  </View>
                </View>

                {evento.tipo === "reuniao" ? (
                  <>
                    <View style={styles.infoLinha}>
                      <Ionicons name="time-outline" size={18} color="#777" />
                      <Text style={styles.eventoTexto}>
                        Hora: {evento.hora || "Sem hora"}
                      </Text>
                    </View>

                    <View style={styles.infoLinha}>
                      <Ionicons
                        name="location-outline"
                        size={18}
                        color="#777"
                      />
                      <Text style={styles.eventoTexto}>
                        Local: {evento.local || "Sem local definido"}
                      </Text>
                    </View>

                    <View style={styles.infoLinha}>
                      <Ionicons
                        name="document-text-outline"
                        size={18}
                        color="#777"
                      />
                      <Text style={styles.eventoTexto}>
                        Assunto: {evento.assunto || "Reunião"}
                      </Text>
                    </View>

                    <View style={styles.infoLinha}>
                      <Ionicons name="school-outline" size={18} color="#777" />
                      <Text style={styles.eventoTexto}>
                        Estágio: {evento.descricao}
                      </Text>
                    </View>

                    <View style={styles.infoLinha}>
                      <Ionicons name="person-outline" size={18} color="#777" />
                      <Text style={styles.eventoTexto}>
                        Professor: {evento.professor || "Não indicado"}
                      </Text>
                    </View>

                    <View style={styles.infoLinha}>
                      <Ionicons name="people-outline" size={18} color="#777" />
                      <Text style={styles.eventoTexto}>
                        Orientador: {evento.orientador || "Não indicado"}
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.infoLinha}>
                      <Ionicons name="school-outline" size={18} color="#777" />
                      <Text style={styles.eventoTexto}>{evento.titulo}</Text>
                    </View>

                    <View style={styles.infoLinha}>
                      <Ionicons
                        name="location-outline"
                        size={18}
                        color="#777"
                      />
                      <Text style={styles.eventoTexto}>{evento.descricao}</Text>
                    </View>
                  </>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {mostrarBottomBar && (
        <View style={styles.bottomBar}>
          <Pressable
            style={styles.bottomItem}
            onPress={() => router.push("/aluno/home" as any)}
          >
            <Ionicons name="home-outline" size={24} color="#160909" />
            <Text style={styles.bottomTexto}>Home</Text>
          </Pressable>

          <Pressable
            style={styles.bottomItem}
            onPress={() =>
              router.push(
                "/aluno/presencas/estagioPresencas/estagioPresencas?from=bottom" as any
              )
            }
          >
            <Ionicons name="calendar-outline" size={24} color="#160909" />
            <Text style={styles.bottomTexto}>Presenças</Text>
          </Pressable>

          <Pressable
            style={styles.bottomItem}
            onPress={() =>
              router.push("/aluno/avaliacao/avaliacao?from=bottom" as any)
            }
          >
            <Ionicons name="star-outline" size={24} color="#160909" />
            <Text style={styles.bottomTexto}>Avaliações</Text>
          </Pressable>

          <Pressable style={styles.bottomItem}>
            <Ionicons name="people-outline" size={24} color="#FDB515" />
            <Text style={styles.bottomTextoAtivo}>Agenda</Text>
          </Pressable>

          <Pressable
            style={styles.bottomItem}
            onPress={() =>
              router.push("/aluno/estagios/estagio?from=bottom" as any)
            }
          >
            <Ionicons name="briefcase-outline" size={24} color="#160909" />
            <Text style={styles.bottomTexto}>Ensinos Clínicos</Text>
          </Pressable>

          <Pressable
            style={styles.bottomItem}
            onPress={() =>
              router.push("/aluno/preencherPerfil/perfil?from=bottom" as any)
            }
          >
            <Ionicons name="person-outline" size={24} color="#160909" />
            <Text style={styles.bottomTexto}>Perfil</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}