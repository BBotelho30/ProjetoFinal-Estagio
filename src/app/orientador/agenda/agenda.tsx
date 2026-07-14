import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { supabase } from "../../../lib/supabase";
import styles from "./agendaStyles";

type Edicao = {
  id: number;
  ensino_clinico_id: number | null;
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

type Reuniao = {
  id: number;
  aluno_id: string | null;
  professor_id: string | null;
  orientador_id: string | null;
  ensino_id: number | null;
  edicao_estagio_id: number | null;
  assunto: string | null;
  local: string | null;
  data_hora: string | null;
  estado: string | null;
};

type Utilizador = {
  id: string;
  nome: string;
  email: string;
  tipo: string;
};

type EventoCalendario = {
  id: string;
  tipo: "inicio" | "fim" | "reuniao";
  data: string;
  titulo: string;
  subtitulo: string;
  hora?: string;
  local?: string | null;
  assunto?: string | null;
  estagioNome?: string | null;
  alunoNome?: string | null;
  professorNome?: string | null;
  edicaoId?: number | null;
  reuniaoId?: number | null;
  alunoId?: string | null;
  professorId?: string | null;
};

export default function AgendaOrientador() {
  const [loading, setLoading] = useState(true);

  const [mesAtual, setMesAtual] = useState(new Date());
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  const [edicoes, setEdicoes] = useState<Edicao[]>([]);
  const [reunioes, setReunioes] = useState<Reuniao[]>([]);
  const [utilizadores, setUtilizadores] = useState<Utilizador[]>([]);

  const params = useLocalSearchParams();

  const origem = params.origem ? String(params.origem) : "home";
  const inscricaoIdParam = params.inscricaoId ? String(params.inscricaoId) : "";
  const alunoIdParam = params.alunoId ? String(params.alunoId) : "";
  const edicaoIdParam = params.edicaoId ? String(params.edicaoId) : "";

  useEffect(() => {
    carregarDados();
  }, []);

  const eventos = useMemo(() => {
    const lista: EventoCalendario[] = [];

    edicoes.forEach((edicao) => {
      const nomeEnsino = edicao.ensinos_clinicos?.nome || "Ensino Clínico";
      const instituicao = edicao.instituicoes?.nome || "Instituição";
      const servico = edicao.servicos?.nome || "Serviço";

      if (edicao.data_inicio) {
        lista.push({
          id: `inicio-${edicao.id}`,
          tipo: "inicio",
          data: edicao.data_inicio,
          titulo: `Início de ${nomeEnsino}`,
          subtitulo: `${instituicao} · ${servico}`,
          estagioNome: nomeEnsino,
          edicaoId: edicao.id,
        });
      }

      if (edicao.data_fim) {
        lista.push({
          id: `fim-${edicao.id}`,
          tipo: "fim",
          data: edicao.data_fim,
          titulo: `Fim de ${nomeEnsino}`,
          subtitulo: `${instituicao} · ${servico}`,
          estagioNome: nomeEnsino,
          edicaoId: edicao.id,
        });
      }
    });

    reunioes.forEach((reuniao) => {
      if (!reuniao.data_hora) return;

      const data = extrairData(reuniao.data_hora);
      const hora = extrairHora(reuniao.data_hora);

      const aluno = reuniao.aluno_id ? nomeUtilizador(reuniao.aluno_id) : null;

      const professor = reuniao.professor_id
        ? nomeUtilizador(reuniao.professor_id)
        : null;

      const edicao = edicoes.find(
        (item) => item.id === reuniao.edicao_estagio_id
      );

      const estagioNome = edicao?.ensinos_clinicos?.nome || "Ensino Clínico";

      lista.push({
        id: `reuniao-${reuniao.id}`,
        tipo: "reuniao",
        data,
        hora,
        titulo: reuniao.assunto || "Reunião",
        assunto: reuniao.assunto || "Reunião",
        local: reuniao.local || "Sem local definido",
        estagioNome,
        alunoNome: aluno || "Não indicado",
        professorNome: professor || "Não indicado",
        subtitulo: `${aluno || "Aluno não indicado"}${
          reuniao.local ? ` · ${reuniao.local}` : ""
        }`,
        edicaoId: reuniao.edicao_estagio_id,
        reuniaoId: reuniao.id,
        alunoId: reuniao.aluno_id,
        professorId: reuniao.professor_id,
      });
    });

    return lista.sort((a, b) => {
      if (a.data === b.data) {
        return (a.hora || "00:00").localeCompare(b.hora || "00:00");
      }

      return a.data.localeCompare(b.data);
    });
  }, [edicoes, reunioes, utilizadores]);

  const eventosDoDia = useMemo(() => {
    const data = dataToISO(dataSelecionada);

    return eventos.filter((evento) => evento.data === data);
  }, [eventos, dataSelecionada]);

  function dataToISO(data: Date) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
  }

  function extrairData(dataHora: string) {
    return dataHora.slice(0, 10);
  }

  function extrairHora(dataHora: string) {
    const date = new Date(dataHora);

    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleTimeString("pt-PT", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return dataHora.slice(11, 16);
  }

  function nomeUtilizador(id: string) {
    return utilizadores.find((utilizador) => utilizador.id === id)?.nome || "";
  }

  function formatarDataTitulo(data: Date) {
    return data.toLocaleDateString("pt-PT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function nomeMes() {
    const texto = mesAtual.toLocaleDateString("pt-PT", {
      month: "long",
      year: "numeric",
    });

    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  function mudarMes(valor: number) {
    const novoMes = new Date(
      mesAtual.getFullYear(),
      mesAtual.getMonth() + valor,
      1
    );

    setMesAtual(novoMes);
    setDataSelecionada(novoMes);
  }

  function diasDoMes() {
    const ano = mesAtual.getFullYear();
    const mes = mesAtual.getMonth();

    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);

    const dias: Array<Date | null> = [];

    let diaSemanaInicio = primeiroDia.getDay();

    diaSemanaInicio = diaSemanaInicio === 0 ? 6 : diaSemanaInicio - 1;

    for (let i = 0; i < diaSemanaInicio; i++) {
      dias.push(null);
    }

    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      dias.push(new Date(ano, mes, dia));
    }

    return dias;
  }

  function eventosDaData(data: Date) {
    const iso = dataToISO(data);

    return eventos.filter((evento) => evento.data === iso);
  }

  function dataEstaSelecionada(data: Date) {
    return dataToISO(data) === dataToISO(dataSelecionada);
  }

  function dataTemEventos(data: Date) {
    return eventosDaData(data).length > 0;
  }

  function coresDots(data: Date) {
    const eventosDia = eventosDaData(data);

    const cores: string[] = [];

    if (eventosDia.some((evento) => evento.tipo === "inicio")) {
      cores.push("#225943");
    }

    if (eventosDia.some((evento) => evento.tipo === "fim")) {
      cores.push("#FDB515");
    }

    if (eventosDia.some((evento) => evento.tipo === "reuniao")) {
      cores.push("#8ED6FF");
    }

    return cores.slice(0, 3);
  }

  function corEvento(tipo: EventoCalendario["tipo"]) {
    if (tipo === "inicio") return "#225943";
    if (tipo === "fim") return "#FDB515";
    return "#8ED6FF";
  }

  function textoTipoEvento(tipo: EventoCalendario["tipo"]) {
    if (tipo === "inicio") return "Início";
    if (tipo === "fim") return "Fim";
    return "Reunião";
  }

  function iconeEvento(tipo: EventoCalendario["tipo"]) {
    if (tipo === "inicio") return "flag-outline";
    if (tipo === "fim") return "checkmark-done-outline";
    return "people-outline";
  }

  function textoLinhaEvento(evento: EventoCalendario) {
    if (evento.tipo === "inicio") {
      return "Início do ensino clínico";
    }

    if (evento.tipo === "fim") {
      return "Fim do ensino clínico";
    }

    return "Reunião";
  }

  function voltarPaginaAnterior() {
    if (origem === "home") {
      router.replace("/orientador/home" as any);
      return;
    }

    if (origem === "detalhesAluno" && edicaoIdParam) {
      router.replace({
        pathname: "/orientador/estagios/detalhesAluno/detalhesAluno" as any,
        params: {
          inscricaoId: inscricaoIdParam,
          alunoId: alunoIdParam,
          edicaoId: edicaoIdParam,
        },
      });

      return;
    }

    if (origem === "criarReuniao") {
      router.replace({
        pathname: "/orientador/estagios/agenda/criarReuniao" as any,
        params: {
          origem: "agenda",
          inscricaoId: inscricaoIdParam,
          alunoId: alunoIdParam,
          edicaoId: edicaoIdParam,
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

    const orientadorId = authData.user.id;

    const { data: inscricoesData, error: inscricoesError } = await supabase
      .from("inscricoes_estagio")
      .select("edicao_estagio_id, estado, estado_estagio")
      .eq("orientador_id", orientadorId);

    if (inscricoesError) {
      console.log("ERRO INSCRIÇÕES AGENDA ORIENTADOR:", inscricoesError);
      setLoading(false);
      return;
    }

    const edicoesIds: number[] = Array.from(
      new Set(
        ((inscricoesData as any) || [])
          .filter(
            (item: any) =>
              item.estado !== "rejeitado" &&
              item.estado_estagio !== "inativo" &&
              item.estado_estagio !== "por_distribuir"
          )
          .map((item: any) => Number(item.edicao_estagio_id))
          .filter((id: number) => !Number.isNaN(id))
      )
    );

    if (edicoesIds.length === 0) {
      setEdicoes([]);
      setReunioes([]);
      setUtilizadores([]);
      setLoading(false);
      return;
    }

    const { data: edicoesData, error: edicoesError } = await supabase
      .from("edicoes_estagio")
      .select(
        `
        id,
        ensino_clinico_id,
        data_inicio,
        data_fim,
        ano_letivo,
        ensinos_clinicos(nome, ano_curricular),
        instituicoes(nome),
        servicos(nome)
      `
      )
      .in("id", edicoesIds)
      .order("data_inicio", { ascending: true });

    if (edicoesError) {
      console.log("ERRO EDIÇÕES AGENDA ORIENTADOR:", edicoesError);
      setEdicoes([]);
    } else {
      setEdicoes((edicoesData as any) || []);
    }

    const { data: reunioesData, error: reunioesError } = await supabase
      .from("reunioes")
      .select(
        `
        id,
        aluno_id,
        professor_id,
        orientador_id,
        ensino_id,
        edicao_estagio_id,
        assunto,
        local,
        data_hora,
        estado
      `
      )
      .eq("orientador_id", orientadorId)
      .in("edicao_estagio_id", edicoesIds)
      .order("data_hora", { ascending: true });

    if (reunioesError) {
      console.log("ERRO REUNIÕES AGENDA ORIENTADOR:", reunioesError);
      setReunioes([]);
    } else {
      setReunioes((reunioesData as any) || []);
    }

    const idsUtilizadores = Array.from(
      new Set(
        ((reunioesData as any) || [])
          .flatMap((reuniao: any) => [
            reuniao.aluno_id,
            reuniao.professor_id,
          ])
          .filter(Boolean)
      )
    );

    if (idsUtilizadores.length > 0) {
      const { data: utilizadoresData, error: utilizadoresError } =
        await supabase
          .from("utilizadores")
          .select("id, nome, email, tipo")
          .in("id", idsUtilizadores);

      if (utilizadoresError) {
        console.log("ERRO UTILIZADORES AGENDA ORIENTADOR:", utilizadoresError);
        setUtilizadores([]);
      } else {
        setUtilizadores((utilizadoresData as any) || []);
      }
    } else {
      setUtilizadores([]);
    }

    setLoading(false);
  }

  return (
    <View style={styles.page}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Pressable style={styles.voltar} onPress={voltarPaginaAnterior}>
          <Ionicons name="arrow-back-outline" size={24} color="#160909" />
          <Text style={styles.voltarTexto}>Voltar</Text>
        </Pressable>

        <Text style={styles.titulo}>Agenda</Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FDB515"
            style={{ marginTop: 40 }}
          />
        ) : (
          <>
            <View style={styles.mesHeader}>
              <Pressable style={styles.setaMes} onPress={() => mudarMes(-1)}>
                <Ionicons
                  name="chevron-back-outline"
                  size={30}
                  color="#160909"
                />
              </Pressable>

              <Text style={styles.mesTitulo}>{nomeMes()}</Text>

              <Pressable style={styles.setaMes} onPress={() => mudarMes(1)}>
                <Ionicons
                  name="chevron-forward-outline"
                  size={30}
                  color="#160909"
                />
              </Pressable>
            </View>

            <View style={styles.semanaLinha}>
              {["S", "T", "Q", "Q", "S", "S", "D"].map((dia, index) => (
                <Text key={index} style={styles.semanaTexto}>
                  {dia}
                </Text>
              ))}
            </View>

            <View style={styles.calendarioGrid}>
              {diasDoMes().map((dia, index) => {
                if (!dia) {
                  return <View key={index} style={styles.diaVazio} />;
                }

                const selecionado = dataEstaSelecionada(dia);
                const temEventos = dataTemEventos(dia);
                const dots = coresDots(dia);

                return (
                  <Pressable
                    key={index}
                    style={[
                      styles.diaBotao,
                      selecionado && styles.diaBotaoSelecionado,
                    ]}
                    onPress={() => setDataSelecionada(dia)}
                  >
                    <Text
                      style={[
                        styles.diaNumero,
                        selecionado && styles.diaNumeroSelecionado,
                      ]}
                    >
                      {dia.getDate()}
                    </Text>

                    {temEventos ? (
                      <View style={styles.dotsLinha}>
                        {dots.map((cor, dotIndex) => (
                          <View
                            key={dotIndex}
                            style={[styles.dot, { backgroundColor: cor }]}
                          />
                        ))}
                      </View>
                    ) : (
                      <View style={styles.dotPlaceholder} />
                    )}
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.legendaLinha}>
              <View style={styles.legendaItem}>
                <View
                  style={[styles.legendaDot, { backgroundColor: "#225943" }]}
                />
                <Text style={styles.legendaTexto}>Início</Text>
              </View>

              <View style={styles.legendaItem}>
                <View
                  style={[styles.legendaDot, { backgroundColor: "#FDB515" }]}
                />
                <Text style={styles.legendaTexto}>Fim</Text>
              </View>

              <View style={styles.legendaItem}>
                <View
                  style={[styles.legendaDot, { backgroundColor: "#8ED6FF" }]}
                />
                <Text style={styles.legendaTexto}>Reunião</Text>
              </View>
            </View>

            <Text style={styles.dataTitulo}>
              {formatarDataTitulo(dataSelecionada)}
            </Text>

            {eventosDoDia.length === 0 ? (
              <View style={styles.vazioCard}>
                <Ionicons name="calendar-outline" size={34} color="#FDB515" />

                <Text style={styles.vazioTitulo}>Sem eventos</Text>

                <Text style={styles.vazioTexto}>
                  Não existem reuniões nem datas de estágio neste dia.
                </Text>
              </View>
            ) : (
              <View style={styles.listaEventos}>
                {eventosDoDia.map((evento) => (
                  <Pressable
                    key={evento.id}
                    style={[
                      styles.eventoCard,
                      {
                        borderLeftColor: corEvento(evento.tipo),
                      },
                    ]}
                    onPress={() => {
                      if (evento.tipo === "reuniao") {
                        router.push({
                          pathname:
                            "/orientador/estagios/agenda/criarReuniao" as any,
                          params: {
                            reuniaoId: String(evento.reuniaoId || ""),
                            inscricaoId: inscricaoIdParam,
                            alunoId: String(evento.alunoId || alunoIdParam),
                            edicaoId: String(evento.edicaoId || edicaoIdParam),
                            origem: "agenda",
                          },
                        });

                        return;
                      }

                      if (evento.edicaoId) {
                        router.push({
                          pathname:
                            "/orientador/ensinosClinicos/alunosEstagio/alunosEstagio" as any,
                          params: {
                            edicaoId: String(evento.edicaoId),
                          },
                        });
                      }
                    }}
                  >
                    <View style={styles.eventoHeaderNovo}>
                      <View
                        style={[
                          styles.eventoIconeNovo,
                          {
                            backgroundColor: corEvento(evento.tipo),
                          },
                        ]}
                      >
                        <Ionicons
                          name={iconeEvento(evento.tipo) as any}
                          size={22}
                          color="#160909"
                        />
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.eventoTipoNovo}>
                          {textoTipoEvento(evento.tipo)}
                        </Text>

                        <Text style={styles.eventoTituloNovo}>
                          {evento.titulo}
                        </Text>
                      </View>
                    </View>

                    {evento.tipo === "reuniao" ? (
                      <>
                        <View style={styles.infoLinhaEvento}>
                          <Ionicons
                            name="time-outline"
                            size={18}
                            color="#777"
                          />
                          <Text style={styles.infoTextoEvento}>
                            Hora: {evento.hora || "Sem hora"}
                          </Text>
                        </View>

                        <View style={styles.infoLinhaEvento}>
                          <Ionicons
                            name="location-outline"
                            size={18}
                            color="#777"
                          />
                          <Text style={styles.infoTextoEvento}>
                            Local: {evento.local || "Sem local definido"}
                          </Text>
                        </View>

                        <View style={styles.infoLinhaEvento}>
                          <Ionicons
                            name="document-text-outline"
                            size={18}
                            color="#777"
                          />
                          <Text style={styles.infoTextoEvento}>
                            Assunto: {evento.assunto || "Reunião"}
                          </Text>
                        </View>

                        <View style={styles.infoLinhaEvento}>
                          <Ionicons
                            name="school-outline"
                            size={18}
                            color="#777"
                          />
                          <Text style={styles.infoTextoEvento}>
                            Estágio: {evento.estagioNome || "Não indicado"}
                          </Text>
                        </View>

                        <View style={styles.infoLinhaEvento}>
                          <Ionicons
                            name="person-outline"
                            size={18}
                            color="#777"
                          />
                          <Text style={styles.infoTextoEvento}>
                            Aluno: {evento.alunoNome || "Não indicado"}
                          </Text>
                        </View>

                        <View style={styles.infoLinhaEvento}>
                          <Ionicons
                            name="people-outline"
                            size={18}
                            color="#777"
                          />
                          <Text style={styles.infoTextoEvento}>
                            Professor: {evento.professorNome || "Não indicado"}
                          </Text>
                        </View>
                      </>
                    ) : (
                      <>
                        <View style={styles.infoLinhaEvento}>
                          <Ionicons
                            name="calendar-outline"
                            size={18}
                            color="#777"
                          />
                          <Text style={styles.infoTextoEvento}>
                            {textoLinhaEvento(evento)}
                          </Text>
                        </View>

                        <View style={styles.infoLinhaEvento}>
                          <Ionicons
                            name="school-outline"
                            size={18}
                            color="#777"
                          />
                          <Text style={styles.infoTextoEvento}>
                            {evento.estagioNome || evento.titulo}
                          </Text>
                        </View>

                        <View style={styles.infoLinhaEvento}>
                          <Ionicons
                            name="location-outline"
                            size={18}
                            color="#777"
                          />
                          <Text style={styles.infoTextoEvento}>
                            {evento.subtitulo}
                          </Text>
                        </View>
                      </>
                    )}
                  </Pressable>
                ))}
              </View>
            )}

            <Pressable
              style={styles.botaoAgendar}
              onPress={() =>
                router.push({
                  pathname: "/orientador/estagios/agenda/criarReuniao" as any,
                  params: {
                    origem: "agenda",
                    inscricaoId: inscricaoIdParam,
                    alunoId: alunoIdParam,
                    edicaoId: edicaoIdParam,
                  },
                })
              }
            >
              <Ionicons name="add-outline" size={24} color="#160909" />
              <Text style={styles.botaoAgendarTexto}>Agendar reunião</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}