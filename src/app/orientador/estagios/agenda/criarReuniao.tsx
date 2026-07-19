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
import styles from "./criarReuniaoStyles";

type TipoReuniao = "aluno" | "professor" | "ambos" | "variosAlunos";

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

type Professor = {
  id: string;
  nome: string;
  email: string;
};

type Inscricao = {
  id: number;
  aluno_id: string;
  edicao_estagio_id: number;
  professor_id: string | null;
  orientador_id: string | null;
  estado: string | null;
  estado_estagio: string | null;
  distribuido_por: string | null;
};

type NovaReuniao = {
  aluno_id: string | null;
  professor_id: string | null;
  orientador_id: string;
  ensino_id: number | null;
  edicao_estagio_id: number;
  assunto: string;
  local: string;
  data_hora: string;
  estado: string;
};

export default function CriarReuniaoOrientador() {
  const params = useLocalSearchParams();

  const origemParam = params.origem ? String(params.origem) : "home";

  const inscricaoIdParam = params.inscricaoId
    ? Number(params.inscricaoId)
    : null;

  const alunoIdParam = params.alunoId ? String(params.alunoId) : null;

  const edicaoIdParam = params.edicaoId ? Number(params.edicaoId) : null;

  const [loading, setLoading] = useState(true);
  const [aGuardar, setAGuardar] = useState(false);

  const [orientadorId, setOrientadorId] = useState<string | null>(null);

  const [edicoes, setEdicoes] = useState<Edicao[]>([]);
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [professores, setProfessores] = useState<Professor[]>([]);

  const [edicaoSelecionada, setEdicaoSelecionada] = useState<number | null>(
    edicaoIdParam || null
  );

  const [tipoReuniao, setTipoReuniao] = useState<TipoReuniao>("aluno");

  const [alunosSelecionados, setAlunosSelecionados] = useState<string[]>(
    alunoIdParam ? [alunoIdParam] : []
  );

  const [professorSelecionado, setProfessorSelecionado] = useState("");

  const [dataReuniao, setDataReuniao] = useState("");
  const [horaReuniao, setHoraReuniao] = useState("");
  const [local, setLocal] = useState("");
  const [assunto, setAssunto] = useState("");

  const [mostrarEdicoes, setMostrarEdicoes] = useState(false);
  const [mostrarAlunos, setMostrarAlunos] = useState(false);
  const [mostrarProfessores, setMostrarProfessores] = useState(false);

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
            inscricao.estado_estagio === "aguarda_relatorio" ||
            inscricao.estado_estagio === "aguarda_avaliacao" ||
            inscricao.estado_estagio === "concluido" ||
            Boolean(inscricao.distribuido_por))
      )
      .map((inscricao) => inscricao.aluno_id);

    return alunos.filter((aluno) => alunosIds.includes(aluno.id));
  }, [alunos, inscricoes, edicaoSelecionada]);


    const professoresDaEdicao = useMemo(() => {
      if (!edicaoSelecionada) return professores;

      const professoresIds = inscricoes
        .filter(
          (inscricao) =>
            inscricao.edicao_estagio_id === edicaoSelecionada &&
            Boolean(inscricao.professor_id)
        )
        .map((inscricao) => inscricao.professor_id as string);

      const idsUnicos = Array.from(new Set(professoresIds));

      const professoresFiltrados = professores.filter((professor) =>
        idsUnicos.includes(professor.id)
      );

      if (professoresFiltrados.length > 0) {
        return professoresFiltrados;
      }

      return professores;
    }, [professores, inscricoes, edicaoSelecionada]);

    
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

  function nomeProfessor(professorId: string | null | undefined) {
    if (!professorId) return "Sem professor";

    return (
      professores.find((professor) => professor.id === professorId)?.nome ||
      "Professor"
    );
  }

  function textoAlunosSelecionados() {
    if (alunosSelecionados.length === 0) return "Selecionar aluno(s)";

    if (alunosSelecionados.length === 1) {
      return nomeAluno(alunosSelecionados[0]);
    }

    return `${alunosSelecionados.length} alunos selecionados`;
  }

  function textoProfessorSelecionado() {
    if (!professorSelecionado) return "Selecionar professor";

    return nomeProfessor(professorSelecionado);
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

    if (tipo === "professor") {
      setAlunosSelecionados([]);
    }

    if (tipo === "aluno") {
      setProfessorSelecionado("");

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
      setProfessorSelecionado("");
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
      (tipoReuniao === "professor" || tipoReuniao === "ambos") &&
      !professorSelecionado
    ) {
      abrirPopup("Erro", "Seleciona o professor.");
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

  function voltarPaginaAnterior() {
    if (origemParam === "detalhesAluno") {
      router.replace({
        pathname:
          "/orientador/estagios/detalhesAluno/detalhesAluno" as any,
        params: {
          inscricaoId: String(inscricaoIdParam || ""),
          alunoId: String(alunoIdParam || ""),
          edicaoId: String(edicaoIdParam || ""),
        },
      });

      return;
    }

    if (origemParam === "agenda") {
      router.replace({
        pathname: "/orientador/agenda/agenda" as any,
        params: {
          origem: "home",
          inscricaoId: String(inscricaoIdParam || ""),
          alunoId: String(alunoIdParam || ""),
          edicaoId: String(edicaoIdParam || ""),
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

    const { data: associacoesData, error: associacoesError } = await supabase
      .from("orientadores_estagio")
      .select("edicao_estagio_id")
      .eq("orientador_id", userId);

    if (associacoesError) {
      console.log("ERRO ASSOCIAÇÕES REUNIÃO ORIENTADOR:", associacoesError);
      abrirPopup("Erro", "Não foi possível carregar os estágios.");
      setLoading(false);
      return;
    }

    let edicoesIds: number[] = Array.from(
      new Set(
        ((associacoesData as any) || [])
          .map((item: any) => Number(item.edicao_estagio_id))
          .filter((id: number) => !Number.isNaN(id))
      )
    );

    if (edicaoIdParam && !edicoesIds.includes(edicaoIdParam)) {
      edicoesIds.push(edicaoIdParam);
    }

    if (edicoesIds.length === 0) {
      setEdicoes([]);
      setInscricoes([]);
      setAlunos([]);
      setProfessores([]);
      setLoading(false);
      return;
    }

    const { data: inscricoesData, error: inscricoesError } = await supabase
      .from("inscricoes_estagio")
      .select(
        `
        id,
        aluno_id,
        edicao_estagio_id,
        professor_id,
        orientador_id,
        estado,
        estado_estagio,
        distribuido_por
      `
      )
      .in("edicao_estagio_id", edicoesIds);

    if (inscricoesError) {
      console.log("ERRO INSCRIÇÕES REUNIÃO ORIENTADOR:", inscricoesError);
      abrirPopup("Erro", "Não foi possível carregar os alunos do estágio.");
      setLoading(false);
      return;
    }

    const inscricoesLista = ((inscricoesData as any) || []).filter(
      (inscricao: Inscricao) =>
        inscricao.estado !== "rejeitado" &&
        inscricao.estado_estagio !== "inativo" &&
        inscricao.estado_estagio !== "por_distribuir" &&
        (inscricao.estado === "aprovado" ||
          inscricao.estado_estagio === "em_curso" ||
          inscricao.estado_estagio === "aguarda_relatorio" ||
          inscricao.estado_estagio === "aguarda_avaliacao" ||
          inscricao.estado_estagio === "concluido" ||
          Boolean(inscricao.distribuido_por) ||
          Boolean(inscricao.professor_id) ||
          Boolean(inscricao.orientador_id))
    );

    setInscricoes(inscricoesLista);

    const edicoesIdsComAlunos: number[] = Array.from(
      new Set(
        inscricoesLista
          .map((item: Inscricao) => Number(item.edicao_estagio_id))
          .filter((id: number) => !Number.isNaN(id))
      )
    );

    const edicoesParaBuscar =
      edicoesIdsComAlunos.length > 0 ? edicoesIdsComAlunos : edicoesIds;

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
      .in("id", edicoesParaBuscar)
      .order("id", { ascending: false });

    if (edicoesError) {
      console.log("ERRO EDIÇÕES REUNIÃO ORIENTADOR:", edicoesError);
      abrirPopup("Erro", "Não foi possível carregar as edições.");
      setLoading(false);
      return;
    }

    setEdicoes((edicoesData as any) || []);

    const alunosIds: string[] = Array.from(
      new Set(
        inscricoesLista
          .map((inscricao: Inscricao) => inscricao.aluno_id)
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
        console.log("ERRO ALUNOS REUNIÃO ORIENTADOR:", alunosError);
        setAlunos([]);
      } else {
        setAlunos((alunosData as any) || []);
      }
    } else {
      setAlunos([]);
    }

    let professoresIds: string[] = Array.from(
      new Set(
        inscricoesLista
          .map((inscricao: Inscricao) => inscricao.professor_id)
          .filter(Boolean) as string[]
      )
    );

    const { data: professoresEdicaoData, error: professoresEdicaoError } =
      await supabase
        .from("professores_estagio")
        .select("professor_id")
        .in("edicao_estagio_id", edicoesParaBuscar);

    if (professoresEdicaoError) {
      console.log(
        "ERRO PROFESSORES DA EDIÇÃO REUNIÃO:",
        professoresEdicaoError
      );
    } else {
      const professoresDaEquipa = ((professoresEdicaoData as any) || [])
        .map((item: any) => item.professor_id)
        .filter(Boolean);

      professoresIds = Array.from(
        new Set([...professoresIds, ...professoresDaEquipa])
      );
    }

    if (professoresIds.length > 0) {
      const { data: professoresData, error: professoresError } = await supabase
        .from("utilizadores")
        .select("id, nome, email")
        .in("id", professoresIds)
        .order("nome", { ascending: true });

      if (professoresError) {
        console.log("ERRO PROFESSORES REUNIÃO ORIENTADOR:", professoresError);
        setProfessores([]);
      } else {
        setProfessores((professoresData as any) || []);
      }
    } else {
      setProfessores([]);
    }

    if (edicaoIdParam) {
      setEdicaoSelecionada(edicaoIdParam);
    } else if (!edicaoSelecionada && edicoesParaBuscar.length > 0) {
      setEdicaoSelecionada(edicoesParaBuscar[0]);
    }

    if (alunoIdParam) {
      setAlunosSelecionados([alunoIdParam]);
    }

    const inscricaoDoAluno = inscricoesLista.find(
      (inscricao: Inscricao) =>
        inscricao.aluno_id === alunoIdParam &&
        inscricao.edicao_estagio_id === edicaoIdParam
    );

    if (inscricaoDoAluno?.professor_id) {
      setProfessorSelecionado(inscricaoDoAluno.professor_id);
    } else if (professoresIds.length > 0) {
      setProfessorSelecionado(professoresIds[0]);
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
    if (!orientadorId || !edicaoAtual) return;

    setAGuardar(true);

    const dataISO = textoParaDataISO(dataReuniao.trim());

    if (!dataISO) {
      abrirPopup("Erro", "A data está inválida.");
      setAGuardar(false);
      return;
    }

    const dataHora = `${dataISO}T${horaReuniao.trim()}:00`;

    const base = {
      professor_id:
        tipoReuniao === "professor" || tipoReuniao === "ambos"
          ? professorSelecionado
          : null,
      orientador_id: orientadorId,
      ensino_id: edicaoAtual.ensino_clinico_id,
      edicao_estagio_id: edicaoAtual.id,
      assunto: assunto.trim(),
      local: local.trim(),
      data_hora: dataHora,
      estado: "agendada",
    };

    const linhas: NovaReuniao[] =
      tipoReuniao === "professor"
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
      console.log("ERRO AO AGENDAR REUNIÃO ORIENTADOR:", error);
      abrirPopup("Erro", "Não foi possível agendar a reunião.");
      return;
    }

    setPopupVisible(false);

    setDataReuniao("");
    setHoraReuniao("");
    setLocal("");
    setAssunto("");
    setAlunosSelecionados(alunoIdParam ? [alunoIdParam] : []);
    setProfessorSelecionado("");

    abrirPopup("Sucesso", "Reunião agendada com sucesso.");

    await carregarDados();
  }

  return (
    <View style={styles.page}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Pressable style={styles.voltar} onPress={voltarPaginaAnterior}>
          <Ionicons name="arrow-back-outline" size={24} color="#160909" />
          <Text style={styles.voltarTexto}>Voltar</Text>
        </Pressable>

        <Text style={styles.titulo}>Agenda</Text>

        <Text style={styles.subtitulo}>
          Agenda reuniões com alunos, professores ou ambos.
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
                      setProfessorSelecionado("");
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
                  tipoReuniao === "professor" && styles.tipoCardAtivo,
                ]}
                onPress={() => escolherTipo("professor")}
              >
                <Ionicons name="school-outline" size={24} color="#160909" />
                <Text style={styles.tipoTexto}>Professor</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.tipoCard,
                  tipoReuniao === "ambos" && styles.tipoCardAtivo,
                ]}
                onPress={() => escolherTipo("ambos")}
              >
                <Ionicons name="people-outline" size={24} color="#160909" />
                <Text style={styles.tipoTexto}>Aluno + professor</Text>
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

            {tipoReuniao !== "professor" ? (
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

            {tipoReuniao === "professor" || tipoReuniao === "ambos" ? (
              <>
                <Text style={styles.label}>Professor</Text>

                <Pressable
                  style={styles.selectToggle}
                  onPress={() => setMostrarProfessores(!mostrarProfessores)}
                >
                  <Text style={styles.selectToggleText}>
                    {textoProfessorSelecionado()}
                  </Text>

                  <Ionicons
                    name={
                      mostrarProfessores
                        ? "chevron-up-outline"
                        : "chevron-down-outline"
                    }
                    size={22}
                    color="#160909"
                  />
                </Pressable>

                {mostrarProfessores ? (
                  <View style={styles.pickerLista}>
                    {professoresDaEdicao.length === 0 ? (
                      <Text style={styles.mensagemVazia}>
                        Não existem professores associados a este estágio.
                      </Text>
                    ) : (
                      professoresDaEdicao.map((professor) => (
                        <Pressable
                          key={professor.id}
                          style={[
                            styles.opcao,
                            professorSelecionado === professor.id &&
                              styles.opcaoSelecionada,
                          ]}
                          onPress={() => {
                            setProfessorSelecionado(professor.id);
                            setMostrarProfessores(false);
                          }}
                        >
                          <Text style={styles.opcaoTitulo}>
                            {professor.nome}
                          </Text>

                          <Text style={styles.opcaoTexto}>
                            {professor.email}
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
                  pathname: "/orientador/agenda/agenda" as any,
                  params: {
                    origem: "criarReuniao",
                    inscricaoId: String(inscricaoIdParam || ""),
                    alunoId: String(alunoIdParam || ""),
                    edicaoId: String(edicaoSelecionada || edicaoIdParam || ""),
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