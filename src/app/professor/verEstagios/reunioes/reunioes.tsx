import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
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
import styles from "./reunioesStyles";

type TipoReuniao = "aluno" | "orientador" | "ambos" | "variosAlunos";

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

type Aluno = {
  id: string;
  nome: string;
  email: string;
  numero_identificacao: string | null;
  ano_curricular: number | null;
};

type Orientador = {
  id: string;
  nome: string;
  email: string;
};

type Inscricao = {
  id: number;
  aluno_id: string;
  edicao_estagio_id: number;
  estado: string | null;
  estado_estagio: string | null;
  distribuido_por: string | null;
};

type NovaReuniao = {
  aluno_id: string | null;
  professor_id: string;
  orientador_id: string | null;
  ensino_id: number | null;
  edicao_estagio_id: number;
  assunto: string;
  local: string;
  data_hora: string;
  estado: string;
};

export default function ReunioesProfessor() {
  const params = useLocalSearchParams();

  const inscricaoIdParam = params.inscricaoId ? Number(params.inscricaoId) : null;
  const alunoIdParam = params.alunoId ? String(params.alunoId) : null;
  const edicaoIdParam = params.edicaoId ? Number(params.edicaoId) : null;

  const [loading, setLoading] = useState(true);
  const [aGuardar, setAGuardar] = useState(false);

  const [professorId, setProfessorId] = useState<string | null>(null);

  const [edicoes, setEdicoes] = useState<Edicao[]>([]);
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [orientadores, setOrientadores] = useState<Orientador[]>([]);

  const [edicaoSelecionada, setEdicaoSelecionada] = useState<number | null>(
    edicaoIdParam || null
  );

  const [tipoReuniao, setTipoReuniao] = useState<TipoReuniao>("aluno");

  const [alunosSelecionados, setAlunosSelecionados] = useState<string[]>(
    alunoIdParam ? [alunoIdParam] : []
  );

  const [orientadorSelecionado, setOrientadorSelecionado] = useState("");

  const [dataReuniao, setDataReuniao] = useState("");
  const [horaReuniao, setHoraReuniao] = useState("");
  const [local, setLocal] = useState("");
  const [assunto, setAssunto] = useState("");

  const [mostrarEdicoes, setMostrarEdicoes] = useState(false);
  const [mostrarAlunos, setMostrarAlunos] = useState(false);
  const [mostrarOrientadores, setMostrarOrientadores] = useState(false);

  const [calendarioVisible, setCalendarioVisible] = useState(false);
  const [relogioVisible, setRelogioVisible] = useState(false);

  const [mesAtual, setMesAtual] = useState(new Date());

  const [horaSelecionada, setHoraSelecionada] = useState(9);
  const [minutoSelecionado, setMinutoSelecionado] = useState(0);

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTipo, setPopupTipo] = useState<"normal" | "confirmar">("normal");

  useEffect(() => {
    carregarDados();
  }, []);

  const edicaoAtual = useMemo(() => {
    return edicoes.find((edicao) => edicao.id === edicaoSelecionada) || null;
  }, [edicoes, edicaoSelecionada]);

  const alunosDaEdicao = useMemo(() => {
    if (!edicaoSelecionada) return [];

    const alunosIds = inscricoes
      .filter(
        (inscricao) =>
          inscricao.edicao_estagio_id === edicaoSelecionada &&
          inscricao.estado !== "rejeitado" &&
          inscricao.estado_estagio !== "inativo" &&
          inscricao.estado_estagio !== "por_distribuir" &&
          (inscricao.estado === "aprovado" ||
            inscricao.estado_estagio === "em_curso" ||
            Boolean(inscricao.distribuido_por))
      )
      .map((inscricao) => inscricao.aluno_id);

    return alunos.filter((aluno) => alunosIds.includes(aluno.id));
  }, [alunos, inscricoes, edicaoSelecionada]);

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

  function validarDataHora() {
    const dataISO = textoParaDataISO(dataReuniao);

    if (!dataISO) return false;

    const dataHora = new Date(`${dataISO}T${horaReuniao}:00`);

    return !Number.isNaN(dataHora.getTime());
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
    setDataReuniao(dataParaTexto(data));
    setCalendarioVisible(false);
  }

  function confirmarHora() {
    const horaTexto = `${formatarNumero(horaSelecionada)}:${formatarNumero(
      minutoSelecionado
    )}`;

    setHoraReuniao(horaTexto);
    setRelogioVisible(false);
  }

  function alterarHora(valor: number) {
    setHoraSelecionada((atual) => {
      const novaHora = atual + valor;

      if (novaHora < 0) return 23;
      if (novaHora > 23) return 0;

      return novaHora;
    });
  }

  function alterarMinuto(valor: number) {
    setMinutoSelecionado((atual) => {
      const novoMinuto = atual + valor;

      if (novoMinuto < 0) return 55;
      if (novoMinuto > 55) return 0;

      return novoMinuto;
    });
  }

  function nomeEdicao() {
    if (!edicaoAtual) return "Selecionar estágio";

    return `${edicaoAtual.ensinos_clinicos?.nome || "Ensino Clínico"} · ${
      edicaoAtual.instituicoes?.nome || "Instituição"
    }`;
  }

  function nomeAluno(alunoId: string | null | undefined) {
    if (!alunoId) return "Sem aluno";

    return alunos.find((aluno) => aluno.id === alunoId)?.nome || "Aluno";
  }

  function nomeOrientador(orientadorId: string | null | undefined) {
    if (!orientadorId) return "Sem orientador";

    return (
      orientadores.find((orientador) => orientador.id === orientadorId)?.nome ||
      "Orientador"
    );
  }

  function textoAlunosSelecionados() {
    if (alunosSelecionados.length === 0) return "Selecionar aluno(s)";

    if (alunosSelecionados.length === 1) {
      return nomeAluno(alunosSelecionados[0]);
    }

    return `${alunosSelecionados.length} alunos selecionados`;
  }

  function textoOrientadorSelecionado() {
    if (!orientadorSelecionado) return "Selecionar orientador";

    return nomeOrientador(orientadorSelecionado);
  }

  function toggleAluno(alunoId: string) {
    if (tipoReuniao === "aluno" || tipoReuniao === "ambos") {
      setAlunosSelecionados([alunoId]);
      setMostrarAlunos(false);
      return;
    }

    setAlunosSelecionados((atual) => {
      if (atual.includes(alunoId)) {
        return atual.filter((id) => id !== alunoId);
      }

      return [...atual, alunoId];
    });
  }

  function escolherTipo(tipo: TipoReuniao) {
    setTipoReuniao(tipo);

    if (tipo === "orientador") {
      setAlunosSelecionados([]);
    }

    if (tipo === "aluno") {
      setOrientadorSelecionado("");

      if (alunosSelecionados.length > 1) {
        setAlunosSelecionados([alunosSelecionados[0]]);
      }
    }

    if (tipo === "ambos") {
      if (alunosSelecionados.length > 1) {
        setAlunosSelecionados([alunosSelecionados[0]]);
      }
    }

    if (tipo === "variosAlunos") {
      setOrientadorSelecionado("");
    }
  }

  function validarFormulario() {
    if (!edicaoSelecionada) {
      abrirPopup("Erro", "Seleciona o estágio.");
      return false;
    }

    if (
      (tipoReuniao === "aluno" ||
        tipoReuniao === "ambos" ||
        tipoReuniao === "variosAlunos") &&
      alunosSelecionados.length === 0
    ) {
      abrirPopup("Erro", "Seleciona pelo menos um aluno.");
      return false;
    }

    if (
      (tipoReuniao === "orientador" || tipoReuniao === "ambos") &&
      !orientadorSelecionado
    ) {
      abrirPopup("Erro", "Seleciona o orientador.");
      return false;
    }

    if (!dataReuniao.trim()) {
      abrirPopup("Erro", "Indica a data da reunião.");
      return false;
    }

    if (!horaReuniao.trim()) {
      abrirPopup("Erro", "Indica a hora da reunião.");
      return false;
    }

    if (!validarDataHora()) {
      abrirPopup(
        "Erro",
        "A data e hora devem estar no formato correto: DD-MM-AAAA e HH:mm."
      );
      return false;
    }

    if (!local.trim()) {
      abrirPopup("Erro", "Indica o local da reunião.");
      return false;
    }

    if (!assunto.trim()) {
      abrirPopup("Erro", "Indica o assunto da reunião.");
      return false;
    }

    return true;
  }

  async function carregarDados() {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace("/login/login" as any);
      return;
    }

    const userId = authData.user.id;
    setProfessorId(userId);

    const { data: profEstagioData, error: profEstagioError } = await supabase
      .from("professores_estagio")
      .select("edicao_estagio_id")
      .eq("professor_id", userId);

    if (profEstagioError) {
      console.log("ERRO PROFESSORES ESTÁGIO:", profEstagioError);
      abrirPopup("Erro", "Não foi possível carregar os estágios.");
      setLoading(false);
      return;
    }

    const edicoesIds: number[] = Array.from(
      new Set(
        ((profEstagioData as any) || [])
          .map((item: any) => Number(item.edicao_estagio_id))
          .filter((id: number) => !Number.isNaN(id))
      )
    );

    if (edicoesIds.length === 0) {
      setEdicoes([]);
      setInscricoes([]);
      setAlunos([]);
      setOrientadores([]);
      setLoading(false);
      return;
    }

    const { data: edicoesData, error: edicoesError } = await supabase
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
      .in("id", edicoesIds)
      .order("id", { ascending: false });

    if (edicoesError) {
      console.log("ERRO EDIÇÕES:", edicoesError);
      abrirPopup("Erro", "Não foi possível carregar as edições.");
      setLoading(false);
      return;
    }

    setEdicoes((edicoesData as any) || []);

    const { data: inscricoesData, error: inscricoesError } = await supabase
      .from("inscricoes_estagio")
      .select(
        `
        id,
        aluno_id,
        edicao_estagio_id,
        estado,
        estado_estagio,
        distribuido_por
      `
      )
      .in("edicao_estagio_id", edicoesIds);

    if (inscricoesError) {
      console.log("ERRO INSCRIÇÕES:", inscricoesError);
      setInscricoes([]);
    } else {
      setInscricoes((inscricoesData as any) || []);
    }

    const alunosIds: string[] = Array.from(
      new Set(
        ((inscricoesData as any) || [])
          .map((inscricao: any) => inscricao.aluno_id)
          .filter(Boolean)
      )
    );

    if (alunosIds.length > 0) {
      const { data: alunosData, error: alunosError } = await supabase
        .from("utilizadores")
        .select("id, nome, email, numero_identificacao, ano_curricular")
        .in("id", alunosIds)
        .order("nome", { ascending: true });

      if (alunosError) {
        console.log("ERRO ALUNOS:", alunosError);
        setAlunos([]);
      } else {
        setAlunos((alunosData as any) || []);
      }
    } else {
      setAlunos([]);
    }

    const { data: orientadoresEstagioData, error: orientadoresEstagioError } =
      await supabase
        .from("orientadores_estagio")
        .select("orientador_id")
        .in("edicao_estagio_id", edicoesIds);

    if (orientadoresEstagioError) {
      console.log("ERRO ORIENTADORES ESTÁGIO:", orientadoresEstagioError);
      setOrientadores([]);
    } else {
      const orientadoresIds: string[] = Array.from(
        new Set(
          ((orientadoresEstagioData as any) || [])
            .map((item: any) => item.orientador_id)
            .filter(Boolean)
        )
      );

      if (orientadoresIds.length > 0) {
        const { data: orientadoresData, error: orientadoresError } =
          await supabase
            .from("utilizadores")
            .select("id, nome, email")
            .in("id", orientadoresIds)
            .order("nome", { ascending: true });

        if (orientadoresError) {
          console.log("ERRO ORIENTADORES:", orientadoresError);
          setOrientadores([]);
        } else {
          setOrientadores((orientadoresData as any) || []);
        }
      } else {
        setOrientadores([]);
      }
    }

    if (edicaoIdParam) {
      setEdicaoSelecionada(edicaoIdParam);
    } else if (!edicaoSelecionada && edicoesIds.length > 0) {
      setEdicaoSelecionada(edicoesIds[0]);
    }

    if (alunoIdParam) {
      setAlunosSelecionados([alunoIdParam]);
    }

    setLoading(false);
  }

  function pedirGuardar() {
    if (!validarFormulario()) return;

    let texto = "Tens a certeza que queres agendar esta reunião?";

    if (tipoReuniao === "variosAlunos") {
      texto = `Vais criar ${alunosSelecionados.length} reunião(ões), uma para cada aluno. Queres continuar?`;
    }

    abrirPopup("Agendar reunião", texto, "confirmar");
  }

  async function guardarReuniao() {
    if (!professorId || !edicaoAtual) return;

    setAGuardar(true);

    const dataISO = textoParaDataISO(dataReuniao.trim());

    if (!dataISO) {
      abrirPopup("Erro", "A data está inválida.");
      setAGuardar(false);
      return;
    }

    const dataHora = `${dataISO}T${horaReuniao.trim()}:00`;

    const base = {
      professor_id: professorId,
      orientador_id:
        tipoReuniao === "orientador" || tipoReuniao === "ambos"
          ? orientadorSelecionado
          : null,
      ensino_id: edicaoAtual.ensino_clinico_id,
      edicao_estagio_id: edicaoAtual.id,
      assunto: assunto.trim(),
      local: local.trim(),
      data_hora: dataHora,
      estado: "agendada",
    };

    const linhas: NovaReuniao[] =
      tipoReuniao === "orientador"
        ? [
            {
              ...base,
              aluno_id: null,
            },
          ]
        : alunosSelecionados.map((alunoId) => ({
            ...base,
            aluno_id: alunoId,
          }));

    const { error } = await supabase.from("reunioes").insert(linhas as any);

    setAGuardar(false);

    if (error) {
      console.log("ERRO AO AGENDAR REUNIÃO:", error);
      abrirPopup("Erro", "Não foi possível agendar a reunião.");
      return;
    }

    setPopupVisible(false);

    setDataReuniao("");
    setHoraReuniao("");
    setLocal("");
    setAssunto("");
    setAlunosSelecionados(alunoIdParam ? [alunoIdParam] : []);
    setOrientadorSelecionado("");

    abrirPopup("Sucesso", "Reunião agendada com sucesso.");

    await carregarDados();
  }

  return (
    <View style={styles.page}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Pressable
          style={styles.voltar}
          onPress={() =>
            inscricaoIdParam || alunoIdParam || edicaoIdParam
              ? router.replace({
                  pathname:
                    "/professor/verEstagios/detalhesAlunos/detalhesAlunos" as any,
                  params: {
                    inscricaoId: String(inscricaoIdParam || ""),
                    alunoId: String(alunoIdParam || ""),
                    edicaoId: String(edicaoIdParam || ""),
                  },
                })
              : router.replace("/professor/home" as any)
          }
        >
          <Ionicons name="arrow-back-outline" size={24} color="#160909" />
          <Text style={styles.voltarTexto}>Voltar</Text>
        </Pressable>

        <Text style={styles.titulo}>Agenda</Text>

        <Text style={styles.subtitulo}>
          Agenda reuniões com alunos, orientadores ou ambos.
        </Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FDB515"
            style={{ marginTop: 40 }}
          />
        ) : (
          <>
            <Text style={styles.label}>Estágio</Text>

            <Pressable
              style={styles.selectToggle}
              onPress={() => setMostrarEdicoes(!mostrarEdicoes)}
            >
              <Text style={styles.selectToggleText}>{nomeEdicao()}</Text>

              <Ionicons
                name={
                  mostrarEdicoes
                    ? "chevron-up-outline"
                    : "chevron-down-outline"
                }
                size={22}
                color="#160909"
              />
            </Pressable>

            {mostrarEdicoes ? (
              <View style={styles.pickerLista}>
                {edicoes.map((edicao) => (
                  <Pressable
                    key={edicao.id}
                    style={[
                      styles.opcao,
                      edicaoSelecionada === edicao.id &&
                        styles.opcaoSelecionada,
                    ]}
                    onPress={() => {
                      setEdicaoSelecionada(edicao.id);
                      setAlunosSelecionados([]);
                      setOrientadorSelecionado("");
                      setMostrarEdicoes(false);
                    }}
                  >
                    <Text style={styles.opcaoTitulo}>
                      {edicao.ensinos_clinicos?.nome || "Ensino Clínico"}
                    </Text>

                    <Text style={styles.opcaoTexto}>
                      {edicao.instituicoes?.nome || "Instituição"} ·{" "}
                      {edicao.servicos?.nome || "Serviço"}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : null}

            <Text style={styles.label}>Tipo de reunião</Text>

            <View style={styles.tipoGrid}>
              <Pressable
                style={[
                  styles.tipoCard,
                  tipoReuniao === "aluno" && styles.tipoCardAtivo,
                ]}
                onPress={() => escolherTipo("aluno")}
              >
                <Ionicons name="person-outline" size={24} color="#160909" />
                <Text style={styles.tipoTexto}>Aluno</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.tipoCard,
                  tipoReuniao === "orientador" && styles.tipoCardAtivo,
                ]}
                onPress={() => escolherTipo("orientador")}
              >
                <Ionicons name="medkit-outline" size={24} color="#160909" />
                <Text style={styles.tipoTexto}>Orientador</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.tipoCard,
                  tipoReuniao === "ambos" && styles.tipoCardAtivo,
                ]}
                onPress={() => escolherTipo("ambos")}
              >
                <Ionicons name="people-outline" size={24} color="#160909" />
                <Text style={styles.tipoTexto}>Aluno + orientador</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.tipoCard,
                  tipoReuniao === "variosAlunos" && styles.tipoCardAtivo,
                ]}
                onPress={() => escolherTipo("variosAlunos")}
              >
                <Ionicons
                  name="people-circle-outline"
                  size={24}
                  color="#160909"
                />
                <Text style={styles.tipoTexto}>Vários alunos</Text>
              </Pressable>
            </View>

            {tipoReuniao !== "orientador" ? (
              <>
                <Text style={styles.label}>
                  {tipoReuniao === "variosAlunos" ? "Alunos" : "Aluno"}
                </Text>

                <Pressable
                  style={styles.selectToggle}
                  onPress={() => setMostrarAlunos(!mostrarAlunos)}
                >
                  <Text style={styles.selectToggleText}>
                    {textoAlunosSelecionados()}
                  </Text>

                  <Ionicons
                    name={
                      mostrarAlunos
                        ? "chevron-up-outline"
                        : "chevron-down-outline"
                    }
                    size={22}
                    color="#160909"
                  />
                </Pressable>

                {mostrarAlunos ? (
                  <View style={styles.pickerLista}>
                    {alunosDaEdicao.length === 0 ? (
                      <Text style={styles.mensagemVazia}>
                        Não existem alunos distribuídos neste estágio.
                      </Text>
                    ) : (
                      alunosDaEdicao.map((aluno) => {
                        const selecionado = alunosSelecionados.includes(
                          aluno.id
                        );

                        return (
                          <Pressable
                            key={aluno.id}
                            style={[
                              styles.opcao,
                              selecionado && styles.opcaoSelecionada,
                            ]}
                            onPress={() => toggleAluno(aluno.id)}
                          >
                            <View style={styles.opcaoLinha}>
                              <View style={{ flex: 1 }}>
                                <Text style={styles.opcaoTitulo}>
                                  {aluno.nome}
                                </Text>

                                <Text style={styles.opcaoTexto}>
                                  Nº {aluno.numero_identificacao || "N/A"} ·{" "}
                                  {aluno.email}
                                </Text>
                              </View>

                              {selecionado ? (
                                <Ionicons
                                  name="checkmark-circle-outline"
                                  size={24}
                                  color="#225943"
                                />
                              ) : null}
                            </View>
                          </Pressable>
                        );
                      })
                    )}
                  </View>
                ) : null}
              </>
            ) : null}

            {tipoReuniao === "orientador" || tipoReuniao === "ambos" ? (
              <>
                <Text style={styles.label}>Orientador</Text>

                <Pressable
                  style={styles.selectToggle}
                  onPress={() =>
                    setMostrarOrientadores(!mostrarOrientadores)
                  }
                >
                  <Text style={styles.selectToggleText}>
                    {textoOrientadorSelecionado()}
                  </Text>

                  <Ionicons
                    name={
                      mostrarOrientadores
                        ? "chevron-up-outline"
                        : "chevron-down-outline"
                    }
                    size={22}
                    color="#160909"
                  />
                </Pressable>

                {mostrarOrientadores ? (
                  <View style={styles.pickerLista}>
                    {orientadores.length === 0 ? (
                      <Text style={styles.mensagemVazia}>
                        Não existem orientadores associados a este estágio.
                      </Text>
                    ) : (
                      orientadores.map((orientador) => (
                        <Pressable
                          key={orientador.id}
                          style={[
                            styles.opcao,
                            orientadorSelecionado === orientador.id &&
                              styles.opcaoSelecionada,
                          ]}
                          onPress={() => {
                            setOrientadorSelecionado(orientador.id);
                            setMostrarOrientadores(false);
                          }}
                        >
                          <Text style={styles.opcaoTitulo}>
                            {orientador.nome}
                          </Text>

                          <Text style={styles.opcaoTexto}>
                            {orientador.email}
                          </Text>
                        </Pressable>
                      ))
                    )}
                  </View>
                ) : null}
              </>
            ) : null}

            <Text style={styles.label}>Data</Text>

            <Pressable
              style={styles.inputBotao}
              onPress={() => setCalendarioVisible(true)}
            >
              <Text
                style={[
                  styles.inputBotaoTexto,
                  !dataReuniao && styles.inputBotaoPlaceholder,
                ]}
              >
                {dataReuniao || "Escolher data"}
              </Text>

              <Ionicons name="calendar-outline" size={23} color="#160909" />
            </Pressable>

            <Text style={styles.label}>Hora</Text>

            <Pressable
              style={styles.inputBotao}
              onPress={() => setRelogioVisible(true)}
            >
              <Text
                style={[
                  styles.inputBotaoTexto,
                  !horaReuniao && styles.inputBotaoPlaceholder,
                ]}
              >
                {horaReuniao || "Escolher hora"}
              </Text>

              <Ionicons name="time-outline" size={23} color="#160909" />
            </Pressable>

            <Text style={styles.label}>Local</Text>

            <TextInput
              style={styles.input}
              placeholder="Ex: Sala de reuniões / Hospital / Online"
              placeholderTextColor="#8c8787"
              value={local}
              onChangeText={setLocal}
            />

            <Text style={styles.label}>Assunto</Text>

            <TextInput
              style={styles.textArea}
              placeholder="Ex: Acompanhamento semanal do estágio"
              placeholderTextColor="#8c8787"
              value={assunto}
              onChangeText={setAssunto}
              multiline
              textAlignVertical="top"
            />

            <Pressable
              style={[styles.botaoGuardar, aGuardar && styles.botaoDisabled]}
              onPress={pedirGuardar}
              disabled={aGuardar}
            >
              <Ionicons name="calendar-outline" size={22} color="#160909" />

              <Text style={styles.botaoGuardarTexto}>
                {aGuardar ? "A agendar..." : "Agendar reunião"}
              </Text>
            </Pressable>

            <Pressable
              style={styles.botaoVerReunioes}
              onPress={() =>
                router.push({
                  pathname:
                    "/professor/agenda/agenda" as any,
                  params: {
                    edicaoId: String(edicaoSelecionada || ""),
                  },
                })
              }
            >
              <Ionicons name="list-outline" size={22} color="#160909" />

              <Text style={styles.botaoVerReunioesTexto}>
                Ver reuniões agendadas
              </Text>
            </Pressable>
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
                  onPress={guardarReuniao}
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
                const selecionado = dia && dataReuniao === dataParaTexto(dia);

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

      <Modal
        visible={relogioVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRelogioVisible(false)}
      >
        <View style={styles.popupOverlay}>
          <View style={styles.relogioContainer}>
            <Text style={styles.relogioTitulo}>Escolher hora</Text>

            <View style={styles.relogioDisplay}>
              <View style={styles.relogioColuna}>
                <Pressable
                  style={styles.relogioBotao}
                  onPress={() => alterarHora(1)}
                >
                  <Ionicons
                    name="chevron-up-outline"
                    size={30}
                    color="#160909"
                  />
                </Pressable>

                <Text style={styles.relogioNumero}>
                  {formatarNumero(horaSelecionada)}
                </Text>

                <Pressable
                  style={styles.relogioBotao}
                  onPress={() => alterarHora(-1)}
                >
                  <Ionicons
                    name="chevron-down-outline"
                    size={30}
                    color="#160909"
                  />
                </Pressable>
              </View>

              <Text style={styles.relogioSeparador}>:</Text>

              <View style={styles.relogioColuna}>
                <Pressable
                  style={styles.relogioBotao}
                  onPress={() => alterarMinuto(5)}
                >
                  <Ionicons
                    name="chevron-up-outline"
                    size={30}
                    color="#160909"
                  />
                </Pressable>

                <Text style={styles.relogioNumero}>
                  {formatarNumero(minutoSelecionado)}
                </Text>

                <Pressable
                  style={styles.relogioBotao}
                  onPress={() => alterarMinuto(-5)}
                >
                  <Ionicons
                    name="chevron-down-outline"
                    size={30}
                    color="#160909"
                  />
                </Pressable>
              </View>
            </View>

            <View style={styles.popupBotoesLinha}>
              <Pressable
                style={styles.popupBotaoCancelar}
                onPress={() => setRelogioVisible(false)}
              >
                <Text style={styles.popupTextoCancelar}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={styles.popupBotaoConfirmar}
                onPress={confirmarHora}
              >
                <Text style={styles.popupTextoConfirmar}>Confirmar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}