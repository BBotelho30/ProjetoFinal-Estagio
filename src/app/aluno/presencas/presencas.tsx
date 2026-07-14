import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
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
import { supabase } from "../../../lib/supabase";
import styles from "./presencasStyles";

type EstagioAtual = {
  id: number;
  edicao_estagio_id: number;
  edicoes_estagio?: {
    permite_reposicao_horas: boolean;
    limite_faltas_percentagem: number;
    max_horas_dia: number;
    data_inicio: string | null;
    data_fim: string | null;
    ensinos_clinicos?: {
      nome: string;
      horas_estimadas: number;
    };
    instituicoes?: { nome: string };
    servicos?: { nome: string };
  };
};

type Presenca = {
  id: number;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  duracao: number;
  horas_reposicao: number;
  tipo: string;
  estado: string;
  observacoes: string | null;
};

type Falta = {
  id: number;
  data: string;
  horas_falta: number;
  justificacao_texto: string | null;
  justificacao_url: string | null;
  estado: string;
};

type TipoSeletorData = "presenca" | "falta";
type TipoSeletorHora = "inicio" | "fim";

export default function PresencasAluno() {
  const params = useLocalSearchParams();

  const from = params.from ? String(params.from) : "";
  const origem = params.origem ? String(params.origem) : "";
  const inscricaoIdParam = params.inscricaoId ? Number(params.inscricaoId) : null;

  const mostrarBottomBar = from === "bottom";

  const [estagio, setEstagio] = useState<EstagioAtual | null>(null);
  const [presencas, setPresencas] = useState<Presenca[]>([]);
  const [faltas, setFaltas] = useState<Falta[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisivel, setModalVisivel] = useState(false);
  const [modalFaltaVisivel, setModalFaltaVisivel] = useState(false);

  const [data, setData] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const [tipo, setTipo] = useState<"contacto" | "tutorial">("contacto");
  const [observacoes, setObservacoes] = useState("");
  const [aGuardar, setAGuardar] = useState(false);

  const [dataFalta, setDataFalta] = useState("");
  const [horasFalta, setHorasFalta] = useState("");
  const [justificacaoTexto, setJustificacaoTexto] = useState("");
  const [documento, setDocumento] = useState<any>(null);
  const [aGuardarFalta, setAGuardarFalta] = useState(false);

  const [popupVisivel, setPopupVisivel] = useState(false);
  const [popupTitulo, setPopupTitulo] = useState("");
  const [popupMensagem, setPopupMensagem] = useState("");

  const [mesCalendario, setMesCalendario] = useState(new Date());
  const [diaSelecionado, setDiaSelecionado] = useState("");
  const [seletorDataVisivel, setSeletorDataVisivel] = useState(false);
  const [tipoSeletorData, setTipoSeletorData] =
    useState<TipoSeletorData>("presenca");

  const [seletorHoraVisivel, setSeletorHoraVisivel] = useState(false);
  const [tipoSeletorHora, setTipoSeletorHora] =
    useState<TipoSeletorHora>("inicio");
  const [horaTemp, setHoraTemp] = useState(8);
  const [minutoTemp, setMinutoTemp] = useState(0);

  useEffect(() => {
    carregarDados();
  }, []);

  const diasCalendario = useMemo(() => {
    const ano = mesCalendario.getFullYear();
    const mes = mesCalendario.getMonth();

    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);

    const inicioSemana = primeiroDia.getDay();
    const totalDias = ultimoDia.getDate();

    const vazios = inicioSemana === 0 ? 6 : inicioSemana - 1;

    const lista: (Date | null)[] = [];

    for (let i = 0; i < vazios; i++) {
      lista.push(null);
    }

    for (let dia = 1; dia <= totalDias; dia++) {
      lista.push(new Date(ano, mes, dia));
    }

    return lista;
  }, [mesCalendario]);

  const presencasDiaSelecionado = useMemo(() => {
    if (!diaSelecionado) return [];

    return presencas.filter((presenca) => presenca.data === diaSelecionado);
  }, [diaSelecionado, presencas]);

  const faltasDiaSelecionado = useMemo(() => {
    if (!diaSelecionado) return [];

    return faltas.filter((falta) => falta.data === diaSelecionado);
  }, [diaSelecionado, faltas]);

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
        edicao_estagio_id,
        estado_estagio,
        edicoes_estagio(
          permite_reposicao_horas,
          limite_faltas_percentagem,
          max_horas_dia,
          data_inicio,
          data_fim,
          ensinos_clinicos(nome, horas_estimadas),
          instituicoes(nome),
          servicos(nome)
        )
      `)
      .eq("aluno_id", authData.user.id);

    if (inscricaoIdParam) {
      query = query.eq("id", inscricaoIdParam);
    } else {
      query = query
        .neq("estado_estagio", "concluido")
        .order("id", { ascending: false })
        .limit(1);
    }

    const { data: estagioData, error: estagioError } = await query.maybeSingle();

    if (estagioError) {
      console.log("ERRO ESTÁGIO PRESENÇAS:", estagioError);
      setEstagio(null);
      setPresencas([]);
      setFaltas([]);
      setLoading(false);
      return;
    }

    if (!estagioData) {
      setEstagio(null);
      setPresencas([]);
      setFaltas([]);
      setLoading(false);
      return;
    }

    setEstagio((estagioData as any) || null);

    const inscricaoId = (estagioData as any).id;

    const { data: presencasData, error: presencasError } = await supabase
      .from("presencas")
      .select(
        "id, data, hora_inicio, hora_fim, duracao, horas_reposicao, tipo, estado, observacoes"
      )
      .eq("inscricao_id", inscricaoId)
      .order("data", { ascending: false });

    if (presencasError) {
      console.log("ERRO PRESENÇAS:", presencasError);
      setPresencas([]);
    } else {
      setPresencas((presencasData as any) || []);
    }

    const { data: faltasData, error: faltasError } = await supabase
      .from("faltas")
      .select(
        "id, data, horas_falta, justificacao_texto, justificacao_url, estado"
      )
      .eq("inscricao_id", inscricaoId)
      .order("data", { ascending: false });

    if (faltasError) {
      console.log("ERRO FALTAS:", faltasError);
      setFaltas([]);
    } else {
      setFaltas((faltasData as any) || []);
    }

    const hojeISO = dataParaISO(new Date());

    if (!diaSelecionado) {
      setDiaSelecionado(hojeISO);
    }

    setLoading(false);
  }

  function dataParaISO(date: Date) {
    const ano = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const dia = String(date.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
  }

  function dataParaTexto(dataISO: string | null | undefined) {
    if (!dataISO) return "Sem data";

    const partes = dataISO.split("-");

    if (partes.length !== 3) return "Sem data";

    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  }

  function nomeMes(date: Date) {
    return date.toLocaleDateString("pt-PT", {
      month: "long",
      year: "numeric",
    });
  }

  function alterarMes(valor: number) {
    setMesCalendario((atual) => {
      const novo = new Date(atual);
      novo.setMonth(novo.getMonth() + valor);
      return novo;
    });
  }

  function dataInicioEstagio() {
    return estagio?.edicoes_estagio?.data_inicio || null;
  }

  function dataFimEstagio() {
    return estagio?.edicoes_estagio?.data_fim || null;
  }

  function dataDentroDoEstagio(dataISO: string) {
    const inicio = dataInicioEstagio();
    const fim = dataFimEstagio();

    if (inicio && dataISO < inicio) return false;
    if (fim && dataISO > fim) return false;

    return true;
  }

  function validarDataDentroEstagio(dataISO: string) {
    const inicio = dataInicioEstagio();
    const fim = dataFimEstagio();

    if (inicio && dataISO < inicio) {
      mostrarPopup(
        "Data inválida",
        `O estágio só começa em ${dataParaTexto(inicio)}.`
      );
      return false;
    }

    if (fim && dataISO > fim) {
      mostrarPopup(
        "Data inválida",
        `O estágio termina em ${dataParaTexto(fim)}.`
      );
      return false;
    }

    return true;
  }

  function estadoDoDia(dataISO: string) {
    const presencasDoDia = presencas.filter(
      (presenca) => presenca.data === dataISO
    );

    const faltasDoDia = faltas.filter((falta) => falta.data === dataISO);

    if (faltasDoDia.length > 0) {
      return "falta";
    }

    if (
      presencasDoDia.some(
        (presenca) =>
          presenca.estado === "validada" || presenca.estado === "validado"
      )
    ) {
      return "validada";
    }

    if (presencasDoDia.length > 0) {
      return "pendente";
    }

    return "vazio";
  }

  function corDoDia(dataISO: string) {
    const estado = estadoDoDia(dataISO);

    if (estado === "falta") return "#e74c3c";
    if (estado === "validada") return "#2ECC71";
    if (estado === "pendente") return "#FDB515";

    return "transparent";
  }

  function selecionarDiaCalendario(date: Date) {
    const dataISO = dataParaISO(date);

    setDiaSelecionado(dataISO);
  }

  function abrirSeletorData(tipoSeletor: TipoSeletorData) {
    setTipoSeletorData(tipoSeletor);

    const dataAtual = tipoSeletor === "presenca" ? data : dataFalta;

    if (dataAtual) {
      const partes = dataAtual.split("-");
      const ano = Number(partes[0]);
      const mes = Number(partes[1]) - 1;
      const dia = Number(partes[2]);

      if (!Number.isNaN(ano) && !Number.isNaN(mes) && !Number.isNaN(dia)) {
        setMesCalendario(new Date(ano, mes, dia));
      }
    }

    setSeletorDataVisivel(true);
  }

  function escolherDiaModal(date: Date) {
    const dataISO = dataParaISO(date);

    if (!validarDataDentroEstagio(dataISO)) return;

    if (tipoSeletorData === "presenca") {
      setData(dataISO);
    } else {
      setDataFalta(dataISO);
    }

    setDiaSelecionado(dataISO);
    setSeletorDataVisivel(false);
  }

  function abrirSeletorHora(tipoHora: TipoSeletorHora) {
    setTipoSeletorHora(tipoHora);

    const valor = tipoHora === "inicio" ? horaInicio : horaFim;
    const [h, m] = valor ? valor.split(":").map(Number) : [8, 0];

    setHoraTemp(Number.isNaN(h) ? 8 : h);
    setMinutoTemp(Number.isNaN(m) ? 0 : m);

    setSeletorHoraVisivel(true);
  }

  function confirmarHora() {
    const horaTexto = String(horaTemp).padStart(2, "0");
    const minutoTexto = String(minutoTemp).padStart(2, "0");
    const valor = `${horaTexto}:${minutoTexto}`;

    if (tipoSeletorHora === "inicio") {
      setHoraInicio(valor);
    } else {
      setHoraFim(valor);
    }

    setSeletorHoraVisivel(false);
  }

  function alterarHora(valor: number) {
    setHoraTemp((atual) => {
      const novo = atual + valor;

      if (novo < 0) return 23;
      if (novo > 23) return 0;

      return novo;
    });
  }

  function alterarMinuto(valor: number) {
    setMinutoTemp((atual) => {
      const novo = atual + valor;

      if (novo < 0) return 55;
      if (novo > 55) return 0;

      return novo;
    });
  }

  function abrirModalPresenca() {
    const hoje = dataParaISO(new Date());

    if (!data && dataDentroDoEstagio(hoje)) {
      setData(hoje);
    }

    if (!horaInicio) setHoraInicio("08:00");
    if (!horaFim) setHoraFim("15:00");

    setModalVisivel(true);
  }

  function abrirModalFalta() {
    const hoje = dataParaISO(new Date());

    if (!dataFalta && dataDentroDoEstagio(hoje)) {
      setDataFalta(hoje);
    }

    setModalFaltaVisivel(true);
  }

  function calcularDuracao(inicio: string, fim: string) {
    const [hi, mi] = inicio.split(":").map(Number);
    const [hf, mf] = fim.split(":").map(Number);

    if (
      Number.isNaN(hi) ||
      Number.isNaN(mi) ||
      Number.isNaN(hf) ||
      Number.isNaN(mf)
    ) {
      return 0;
    }

    const minutosInicio = hi * 60 + mi;
    const minutosFim = hf * 60 + mf;
    const diferenca = minutosFim - minutosInicio;

    if (diferenca <= 0) return 0;

    return Number((diferenca / 60).toFixed(2));
  }

  function totalHoras() {
    return Number(
      presencas
        .reduce((total, p) => total + Number(p.duracao || 0), 0)
        .toFixed(2)
    );
  }

  function totalHorasReposicao() {
    return Number(
      presencas
        .reduce((total, p) => total + Number(p.horas_reposicao || 0), 0)
        .toFixed(2)
    );
  }

  function totalHorasFalta() {
    return Number(
      faltas
        .reduce((total, f) => total + Number(f.horas_falta || 0), 0)
        .toFixed(2)
    );
  }

  function horasPrevistas() {
    return estagio?.edicoes_estagio?.ensinos_clinicos?.horas_estimadas || 0;
  }

  function horasEmFalta() {
    const falta = horasPrevistas() - totalHoras();
    return falta > 0 ? Number(falta.toFixed(2)) : 0;
  }

  function percentagemPresencas() {
    if (!horasPrevistas()) return 0;
    return Math.min((totalHoras() / horasPrevistas()) * 100, 100);
  }

  function limiteFaltas() {
    const percentagem =
      estagio?.edicoes_estagio?.limite_faltas_percentagem || 15;

    return Number((horasPrevistas() * (percentagem / 100)).toFixed(2));
  }

  function percentagemFaltas() {
    if (!horasPrevistas()) return 0;
    return Math.min((totalHorasFalta() / horasPrevistas()) * 100, 100);
  }

  function diasParaFimEstagio() {
    const dataFim = estagio?.edicoes_estagio?.data_fim;

    if (!dataFim) return null;

    const hoje = new Date();
    const fim = new Date(dataFim);

    hoje.setHours(0, 0, 0, 0);
    fim.setHours(0, 0, 0, 0);

    const diferenca = fim.getTime() - hoje.getTime();

    return Math.ceil(diferenca / (1000 * 60 * 60 * 24));
  }

  function deveMostrarAvisoReprovacao() {
    const dias = diasParaFimEstagio();

    if (dias === null) return false;

    const estaNoFim = dias <= 3;
    const ultrapassouFaltas = totalHorasFalta() > limiteFaltas();
    const temHorasEmFalta = horasEmFalta() > 0;

    return estaNoFim && (ultrapassouFaltas || temHorasEmFalta);
  }

  function textoTipo(valor: string) {
    return valor === "tutorial" ? "Tutorial" : "Contacto";
  }

  function textoEstado(valor: string) {
    if (valor === "validada" || valor === "validado") return "Validada";
    if (valor === "rejeitada" || valor === "rejeitado") return "Rejeitada";
    return "Pendente";
  }

  function corEstado(valor: string) {
    if (valor === "validada" || valor === "validado") return "#CDEFD6";
    if (valor === "rejeitada" || valor === "rejeitado") return "#F8C8C8";
    return "#FDE8B4";
  }

  async function guardarPresenca() {
    if (aGuardar) return;

    if (!estagio) {
      mostrarPopup("Erro", "Não existe estágio ativo.");
      return;
    }

    if (!data || !horaInicio || !horaFim) {
      mostrarPopup("Erro", "Preenche data, hora de início e hora de fim.");
      return;
    }

    if (!validarDataDentroEstagio(data)) return;

    const duracao = calcularDuracao(horaInicio, horaFim);

    if (duracao <= 0) {
      mostrarPopup("Erro", "A hora de fim tem de ser superior à hora de início.");
      return;
    }

    const maxHorasDia = estagio.edicoes_estagio?.max_horas_dia || 7;
    const minHorasDia = 7;
    const permiteReposicao =
      estagio.edicoes_estagio?.permite_reposicao_horas || false;

    let horasReposicao = 0;
    const horasEmFaltaDia = Number((minHorasDia - duracao).toFixed(2));

    if (duracao < minHorasDia) {
      const faltaDoDia = faltas.find(
        (f) => f.data === data && Number(f.horas_falta) >= horasEmFaltaDia
      );

      if (!faltaDoDia) {
        mostrarPopup(
          "Presença não registada",
          `Registaste apenas ${duracao}h. Faltam ${horasEmFaltaDia}h. Primeiro tens de registar uma falta justificada para este dia.`
        );
        return;
      }
    }

    if (!permiteReposicao && duracao > maxHorasDia) {
      mostrarPopup(
        "Erro",
        `Este estágio permite no máximo ${maxHorasDia} horas por dia.`
      );
      return;
    }

    if (permiteReposicao && duracao > maxHorasDia) {
      horasReposicao = Number((duracao - maxHorasDia).toFixed(2));
    }

    setAGuardar(true);

    const { error } = await supabase.from("presencas").insert([
      {
        inscricao_id: estagio.id,
        data,
        hora_inicio: horaInicio,
        hora_fim: horaFim,
        duracao,
        horas_reposicao: horasReposicao,
        tipo,
        estado: "pendente",
        observacoes: observacoes.trim() || null,
      },
    ]);

    setAGuardar(false);

    if (error) {
      mostrarPopup("Erro", error.message);
      return;
    }

    setModalVisivel(false);
    setData("");
    setHoraInicio("");
    setHoraFim("");
    setTipo("contacto");
    setObservacoes("");

    await carregarDados();

    if (duracao < minHorasDia) {
      mostrarPopup(
        "Presença registada",
        `Presença registada com ${duracao}h. A falta de ${horasEmFaltaDia}h já está associada a este dia.`
      );
      return;
    }

    if (horasReposicao > 0) {
      mostrarPopup(
        "Presença registada",
        `Presença registada com sucesso. Foram contabilizadas ${horasReposicao}h como reposição.`
      );
      return;
    }

    mostrarPopup("Sucesso", "Presença registada com sucesso.");
  }

  async function escolherDocumento() {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/*"],
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    setDocumento(result.assets[0]);
  }

  async function guardarFalta() {
    if (aGuardarFalta) return;

    if (!estagio) {
      mostrarPopup("Erro", "Não existe estágio ativo.");
      return;
    }

    if (!dataFalta || !horasFalta) {
      mostrarPopup("Erro", "Preenche a data e as horas de falta.");
      return;
    }

    if (!validarDataDentroEstagio(dataFalta)) return;

    if (!justificacaoTexto.trim() && !documento) {
      mostrarPopup(
        "Erro",
        "Tens de escrever uma justificação ou anexar um documento."
      );
      return;
    }

    const novasHorasFalta = Number(horasFalta.replace(",", "."));

    if (!novasHorasFalta || novasHorasFalta <= 0) {
      mostrarPopup("Erro", "As horas de falta têm de ser superiores a 0.");
      return;
    }

    const totalComNova = totalHorasFalta() + novasHorasFalta;

    if (totalComNova > limiteFaltas()) {
      mostrarPopup(
        "Atenção",
        `Esta falta ultrapassa o limite permitido. Limite: ${limiteFaltas()}h.`
      );
    }

    setAGuardarFalta(true);

    let justificacaoUrl = null;

    if (documento) {
      const ext = documento.name?.split(".").pop() || "pdf";
      const path = `${estagio.id}/${Date.now()}.${ext}`;

      const response = await fetch(documento.uri);
      const blob = await response.blob();

      const { error: uploadError } = await supabase.storage
        .from("justificacoes-faltas")
        .upload(path, blob, {
          upsert: true,
          contentType: documento.mimeType || "application/pdf",
        });

      if (uploadError) {
        setAGuardarFalta(false);
        mostrarPopup("Erro", uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from("justificacoes-faltas")
        .getPublicUrl(path);

      justificacaoUrl = data.publicUrl;
    }

    const { error } = await supabase.from("faltas").insert([
      {
        inscricao_id: estagio.id,
        data: dataFalta,
        horas_falta: novasHorasFalta,
        justificacao_texto: justificacaoTexto.trim() || null,
        justificacao_url: justificacaoUrl,
        estado: "pendente",
      },
    ]);

    setAGuardarFalta(false);

    if (error) {
      mostrarPopup("Erro", error.message);
      return;
    }

    setModalFaltaVisivel(false);
    setDataFalta("");
    setHorasFalta("");
    setJustificacaoTexto("");
    setDocumento(null);

    mostrarPopup("Sucesso", "Falta registada com sucesso.");
    carregarDados();
  }

  function voltarPaginaAnterior() {
    if (origem === "estagioPresencas") {
      router.replace(
        "/aluno/presencas/estagioPresencas/estagioPresencas" as any
      );
      return;
    }

    if (origem === "detalheEstagio" && estagio) {
      router.replace({
        pathname: "/aluno/estagios/detalheEstagio/detalheEstagio" as any,
        params: {
          inscricaoId: String(estagio.id),
          edicaoId: String(estagio.edicao_estagio_id),
        },
      });
      return;
    }

    if (mostrarBottomBar) {
      router.replace("/aluno/home" as any);
      return;
    }

    router.replace("/aluno/estagios/estagio" as any);
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

        <Text style={styles.titulo}>Presenças</Text>

        {!estagio ? (
          <Text style={styles.textoVazio}>
            Ainda não tens nenhum estágio ativo para registar presenças.
          </Text>
        ) : (
          <>
            <View style={styles.resumoCard}>
              <Text style={styles.resumoTitulo}>
                {estagio.edicoes_estagio?.ensinos_clinicos?.nome ||
                  "Ensino Clínico"}
              </Text>

              <Text style={styles.resumoTexto}>
                {estagio.edicoes_estagio?.instituicoes?.nome || "Instituição"} ·{" "}
                {estagio.edicoes_estagio?.servicos?.nome || "Serviço"}
              </Text>

              <View style={styles.horasLinha}>
                <Text style={styles.horasTexto}>
                  {totalHoras()}h / {horasPrevistas()}h
                </Text>

                <Text style={styles.horasTexto}>
                  {Math.round(percentagemPresencas())}%
                </Text>
              </View>

              <View style={styles.progressoFundo}>
                <View
                  style={[
                    styles.progressoBarra,
                    { width: `${percentagemPresencas()}%` },
                  ]}
                />
              </View>

              <View style={styles.faltasResumo}>
                <Text style={styles.faltasTexto}>
                  Reposição de horas:{" "}
                  {estagio.edicoes_estagio?.permite_reposicao_horas
                    ? "Permitida"
                    : "Não permitida"}
                </Text>

                <Text style={styles.faltasTexto}>
                  Máximo por dia: {estagio.edicoes_estagio?.max_horas_dia || 7}h
                </Text>

                <Text style={styles.faltasTexto}>
                  Horas em falta: {horasEmFalta()}h
                </Text>

                <Text style={styles.faltasTexto}>
                  Horas repostas: {totalHorasReposicao()}h
                </Text>

                <Text style={styles.faltasTexto}>
                  Faltas: {totalHorasFalta()}h / {limiteFaltas()}h permitidas
                </Text>

                <Text style={styles.faltasTexto}>
                  {Math.round(percentagemFaltas())}% de faltas
                </Text>
              </View>
            </View>

            {deveMostrarAvisoReprovacao() ? (
              <View style={styles.avisoReprovacao}>
                <Ionicons name="warning-outline" size={24} color="#e74c3c" />

                <Text style={styles.avisoReprovacaoTexto}>
                  Atenção: o estágio está a terminar e ainda tens horas/faltas
                  por regularizar. Poderás ficar sujeito a reprovação.
                </Text>
              </View>
            ) : null}

            <View style={styles.botoesRegistoLinha}>
              <Pressable style={styles.botaoCriar} onPress={abrirModalPresenca}>
                <Text style={styles.textoBotaoCriar}>+ Presença</Text>
              </Pressable>

              <Pressable style={styles.botaoFalta} onPress={abrirModalFalta}>
                <Text style={styles.textoBotaoFalta}>+ Falta</Text>
              </Pressable>
            </View>

            <Text style={styles.secaoTitulo}>Calendário de Presenças</Text>

            <View style={styles.calendarioCard}>
              <View style={styles.calendarioHeader}>
                <Pressable
                  style={styles.calendarioSeta}
                  onPress={() => alterarMes(-1)}
                >
                  <Ionicons name="chevron-back-outline" size={22} color="#160909" />
                </Pressable>

                <Text style={styles.calendarioTitulo}>
                  {nomeMes(mesCalendario)}
                </Text>

                <Pressable
                  style={styles.calendarioSeta}
                  onPress={() => alterarMes(1)}
                >
                  <Ionicons
                    name="chevron-forward-outline"
                    size={22}
                    color="#160909"
                  />
                </Pressable>
              </View>

              <View style={styles.diasSemanaLinha}>
                {["S", "T", "Q", "Q", "S", "S", "D"].map((dia, index) => (
                  <Text key={`${dia}-${index}`} style={styles.diaSemanaTexto}>
                    {dia}
                  </Text>
                ))}
              </View>

              <View style={styles.calendarioGrid}>
                {diasCalendario.map((dia, index) => {
                  if (!dia) {
                    return <View key={`vazio-${index}`} style={styles.diaVazio} />;
                  }

                  const dataISO = dataParaISO(dia);
                  const selecionado = diaSelecionado === dataISO;
                  const dentroEstagio = dataDentroDoEstagio(dataISO);
                  const cor = corDoDia(dataISO);

                  return (
                    <Pressable
                      key={dataISO}
                      style={[
                        styles.diaBotao,
                        selecionado && styles.diaSelecionado,
                        !dentroEstagio && styles.diaForaEstagio,
                      ]}
                      onPress={() => selecionarDiaCalendario(dia)}
                    >
                      <Text
                        style={[
                          styles.diaTexto,
                          selecionado && styles.diaTextoSelecionado,
                          !dentroEstagio && styles.diaTextoForaEstagio,
                        ]}
                      >
                        {dia.getDate()}
                      </Text>

                      <View
                        style={[
                          styles.diaDot,
                          {
                            backgroundColor: cor,
                          },
                        ]}
                      />
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.legendaLinha}>
                <View style={styles.legendaItem}>
                  <View style={[styles.legendaDot, { backgroundColor: "#FDB515" }]} />
                  <Text style={styles.legendaTexto}>Pendente</Text>
                </View>

                <View style={styles.legendaItem}>
                  <View style={[styles.legendaDot, { backgroundColor: "#2ECC71" }]} />
                  <Text style={styles.legendaTexto}>Validada</Text>
                </View>

                <View style={styles.legendaItem}>
                  <View style={[styles.legendaDot, { backgroundColor: "#e74c3c" }]} />
                  <Text style={styles.legendaTexto}>Falta</Text>
                </View>
              </View>
            </View>

            <View style={styles.detalhesDiaCard}>
              <Text style={styles.detalhesDiaTitulo}>
                {diaSelecionado
                  ? dataParaTexto(diaSelecionado)
                  : "Seleciona um dia"}
              </Text>

              {presencasDiaSelecionado.length === 0 &&
              faltasDiaSelecionado.length === 0 ? (
                <Text style={styles.detalhesDiaTexto}>
                  Não existe presença nem falta registada neste dia.
                </Text>
              ) : (
                <>
                  {presencasDiaSelecionado.map((presenca) => (
                    <View key={`p-${presenca.id}`} style={styles.registoDiaBox}>
                      <Text style={styles.registoDiaTitulo}>Presença</Text>

                      <Text style={styles.registoDiaTexto}>
                        {presenca.hora_inicio.slice(0, 5)} -{" "}
                        {presenca.hora_fim.slice(0, 5)} · {presenca.duracao}h
                      </Text>

                      <Text style={styles.registoDiaTexto}>
                        Tipo: {textoTipo(presenca.tipo)}
                      </Text>

                      <Text style={styles.registoDiaTexto}>
                        Estado: {textoEstado(presenca.estado)}
                      </Text>
                    </View>
                  ))}

                  {faltasDiaSelecionado.map((falta) => (
                    <View key={`f-${falta.id}`} style={styles.registoDiaBox}>
                      <Text style={styles.registoDiaTitulo}>Falta</Text>

                      <Text style={styles.registoDiaTexto}>
                        {falta.horas_falta}h de falta
                      </Text>

                      <Text style={styles.registoDiaTexto}>
                        Estado: {textoEstado(falta.estado)}
                      </Text>
                    </View>
                  ))}
                </>
              )}
            </View>

            <Text style={styles.secaoTitulo}>Histórico de Presenças</Text>

            {presencas.length === 0 ? (
              <Text style={styles.textoVazio}>
                Ainda não existem presenças registadas.
              </Text>
            ) : (
              <View style={styles.lista}>
                {presencas.map((presenca) => (
                  <View key={presenca.id} style={styles.cardPresenca}>
                    <View style={styles.cardTopo}>
                      <View>
                        <Text style={styles.dataTexto}>
                          Data: {dataParaTexto(presenca.data)}
                        </Text>
                        <Text style={styles.horarioTexto}>
                          Horas: {presenca.hora_inicio.slice(0, 5)} -{" "}
                          {presenca.hora_fim.slice(0, 5)}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.badgeEstado,
                          { backgroundColor: corEstado(presenca.estado) },
                        ]}
                      >
                        <Text style={styles.badgeTexto}>
                          {textoEstado(presenca.estado)}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.infoTexto}>
                      Tipo: {textoTipo(presenca.tipo)}
                    </Text>

                    <Text style={styles.infoTexto}>
                      Duração: {presenca.duracao}h
                    </Text>

                    {presenca.horas_reposicao > 0 ? (
                      <Text style={styles.validacaoTexto}>
                        Reposição de horas: {presenca.horas_reposicao}h
                      </Text>
                    ) : null}

                    <Text style={styles.validacaoTexto}>
                      Validação:{" "}
                      {presenca.tipo === "tutorial"
                        ? "Professor Orientador"
                        : "Orientador de Estágio"}
                    </Text>

                    {presenca.observacoes ? (
                      <Text style={styles.observacoesTexto}>
                        Obs.: {presenca.observacoes}
                      </Text>
                    ) : null}
                  </View>
                ))}
              </View>
            )}

            <Text style={styles.secaoTitulo}>Faltas</Text>

            {faltas.length === 0 ? (
              <Text style={styles.textoVazio}>
                Ainda não existem faltas registadas.
              </Text>
            ) : (
              <View style={styles.lista}>
                {faltas.map((falta) => (
                  <View key={falta.id} style={styles.cardFalta}>
                    <View style={styles.cardTopo}>
                      <View>
                        <Text style={styles.dataTexto}>
                          Data: {dataParaTexto(falta.data)}
                        </Text>

                        <Text style={styles.horarioTexto}>
                          Horas: {falta.horas_falta}h de falta
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.badgeEstado,
                          { backgroundColor: corEstado(falta.estado) },
                        ]}
                      >
                        <Text style={styles.badgeTexto}>
                          {textoEstado(falta.estado)}
                        </Text>
                      </View>
                    </View>

                    {falta.justificacao_texto ? (
                      <Text style={styles.infoTexto}>
                        Justificação: {falta.justificacao_texto}
                      </Text>
                    ) : null}

                    {falta.justificacao_url ? (
                      <Text style={styles.validacaoTexto}>Documento anexado</Text>
                    ) : null}
                  </View>
                ))}
              </View>
            )}
          </>
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

          <Pressable style={styles.bottomItem}>
            <Ionicons name="calendar-outline" size={24} color="#FDB515" />
            <Text style={styles.bottomTextoAtivo}>Presenças</Text>
          </Pressable>

          <Pressable
            style={styles.bottomItem}
            onPress={() => router.push("/aluno/avaliacoes?from=bottom" as any)}
          >
            <Ionicons name="star-outline" size={24} color="#160909" />
            <Text style={styles.bottomTexto}>Avaliações</Text>
          </Pressable>

          <Pressable
            style={styles.bottomItem}
            onPress={() => router.push("/aluno/agenda/agenda?from=bottom" as any)}
          >
            <Ionicons name="people-outline" size={24} color="#160909" />
            <Text style={styles.bottomTexto}>Agenda</Text>
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

      <Modal visible={modalVisivel} transparent animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Registar Presença</Text>

            <Text style={styles.label}>Data</Text>

            <Pressable
              style={styles.inputBotao}
              onPress={() => abrirSeletorData("presenca")}
            >
              <Text
                style={[
                  styles.inputBotaoTexto,
                  !data && styles.inputBotaoPlaceholder,
                ]}
              >
                {data ? dataParaTexto(data) : "Selecionar data"}
              </Text>

              <Ionicons name="calendar-outline" size={22} color="#160909" />
            </Pressable>

            <Text style={styles.label}>Hora início</Text>

            <Pressable
              style={styles.inputBotao}
              onPress={() => abrirSeletorHora("inicio")}
            >
              <Text
                style={[
                  styles.inputBotaoTexto,
                  !horaInicio && styles.inputBotaoPlaceholder,
                ]}
              >
                {horaInicio || "Selecionar hora"}
              </Text>

              <Ionicons name="time-outline" size={22} color="#160909" />
            </Pressable>

            <Text style={styles.label}>Hora fim</Text>

            <Pressable
              style={styles.inputBotao}
              onPress={() => abrirSeletorHora("fim")}
            >
              <Text
                style={[
                  styles.inputBotaoTexto,
                  !horaFim && styles.inputBotaoPlaceholder,
                ]}
              >
                {horaFim || "Selecionar hora"}
              </Text>

              <Ionicons name="time-outline" size={22} color="#160909" />
            </Pressable>

            <Text style={styles.label}>Tipo</Text>

            <View style={styles.tipoLinha}>
              <Pressable
                style={[
                  styles.tipoBotao,
                  tipo === "contacto" && styles.tipoSelecionado,
                ]}
                onPress={() => setTipo("contacto")}
              >
                <Text style={styles.tipoTexto}>Contacto</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.tipoBotao,
                  tipo === "tutorial" && styles.tipoSelecionado,
                ]}
                onPress={() => setTipo("tutorial")}
              >
                <Text style={styles.tipoTexto}>Tutorial</Text>
              </Pressable>
            </View>

            <TextInput
              placeholder="Observações (opcional)"
              placeholderTextColor="#8c8787"
              style={styles.input}
              value={observacoes}
              onChangeText={setObservacoes}
            />

            <View style={styles.modalBotoes}>
              <Pressable
                style={styles.botaoCancelar}
                onPress={() => setModalVisivel(false)}
              >
                <Text style={styles.textoCancelar}>Cancelar</Text>
              </Pressable>

              <Pressable style={styles.botaoGuardar} onPress={guardarPresenca}>
                <Text style={styles.textoGuardar}>
                  {aGuardar ? "A guardar..." : "Guardar"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={modalFaltaVisivel} transparent animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Registar Falta</Text>

            <Text style={styles.label}>Data</Text>

            <Pressable
              style={styles.inputBotao}
              onPress={() => abrirSeletorData("falta")}
            >
              <Text
                style={[
                  styles.inputBotaoTexto,
                  !dataFalta && styles.inputBotaoPlaceholder,
                ]}
              >
                {dataFalta ? dataParaTexto(dataFalta) : "Selecionar data"}
              </Text>

              <Ionicons name="calendar-outline" size={22} color="#160909" />
            </Pressable>

            <TextInput
              placeholder="Horas de falta"
              placeholderTextColor="#8c8787"
              style={styles.input}
              value={horasFalta}
              onChangeText={setHorasFalta}
              keyboardType="numeric"
            />

            <TextInput
              placeholder="Justificação por escrito"
              placeholderTextColor="#8c8787"
              style={[styles.input, { height: 80 }]}
              value={justificacaoTexto}
              onChangeText={setJustificacaoTexto}
              multiline
            />

            <Pressable style={styles.botaoDocumento} onPress={escolherDocumento}>
              <Ionicons name="document-attach-outline" size={22} color="#160909" />
              <Text style={styles.textoDocumento}>
                {documento ? documento.name : "Anexar documento"}
              </Text>
            </Pressable>

            <View style={styles.modalBotoes}>
              <Pressable
                style={styles.botaoCancelar}
                onPress={() => setModalFaltaVisivel(false)}
              >
                <Text style={styles.textoCancelar}>Cancelar</Text>
              </Pressable>

              <Pressable style={styles.botaoGuardar} onPress={guardarFalta}>
                <Text style={styles.textoGuardar}>
                  {aGuardarFalta ? "A guardar..." : "Guardar"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={seletorDataVisivel} transparent animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={styles.calendarioModalContainer}>
            <View style={styles.calendarioHeader}>
              <Pressable
                style={styles.calendarioSeta}
                onPress={() => alterarMes(-1)}
              >
                <Ionicons name="chevron-back-outline" size={22} color="#160909" />
              </Pressable>

              <Text style={styles.calendarioTitulo}>
                {nomeMes(mesCalendario)}
              </Text>

              <Pressable
                style={styles.calendarioSeta}
                onPress={() => alterarMes(1)}
              >
                <Ionicons
                  name="chevron-forward-outline"
                  size={22}
                  color="#160909"
                />
              </Pressable>
            </View>

            <View style={styles.diasSemanaLinha}>
              {["S", "T", "Q", "Q", "S", "S", "D"].map((dia, index) => (
                <Text key={`${dia}-modal-${index}`} style={styles.diaSemanaTexto}>
                  {dia}
                </Text>
              ))}
            </View>

            <View style={styles.calendarioGrid}>
              {diasCalendario.map((dia, index) => {
                if (!dia) {
                  return <View key={`modal-vazio-${index}`} style={styles.diaVazio} />;
                }

                const dataISO = dataParaISO(dia);
                const selecionado =
                  tipoSeletorData === "presenca"
                    ? data === dataISO
                    : dataFalta === dataISO;

                const dentroEstagio = dataDentroDoEstagio(dataISO);

                return (
                  <Pressable
                    key={`modal-${dataISO}`}
                    style={[
                      styles.diaBotao,
                      selecionado && styles.diaSelecionado,
                      !dentroEstagio && styles.diaForaEstagio,
                    ]}
                    onPress={() => escolherDiaModal(dia)}
                  >
                    <Text
                      style={[
                        styles.diaTexto,
                        selecionado && styles.diaTextoSelecionado,
                        !dentroEstagio && styles.diaTextoForaEstagio,
                      ]}
                    >
                      {dia.getDate()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={styles.popupOkButton}
              onPress={() => setSeletorDataVisivel(false)}
            >
              <Text style={styles.popupOkText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={seletorHoraVisivel} transparent animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={styles.relogioContainer}>
            <Text style={styles.relogioTitulo}>
              {tipoSeletorHora === "inicio" ? "Hora início" : "Hora fim"}
            </Text>

            <View style={styles.relogioDisplay}>
              <View style={styles.relogioColuna}>
                <Pressable
                  style={styles.relogioBotao}
                  onPress={() => alterarHora(1)}
                >
                  <Ionicons name="chevron-up-outline" size={24} color="#160909" />
                </Pressable>

                <Text style={styles.relogioNumero}>
                  {String(horaTemp).padStart(2, "0")}
                </Text>

                <Pressable
                  style={styles.relogioBotao}
                  onPress={() => alterarHora(-1)}
                >
                  <Ionicons name="chevron-down-outline" size={24} color="#160909" />
                </Pressable>
              </View>

              <Text style={styles.relogioSeparador}>:</Text>

              <View style={styles.relogioColuna}>
                <Pressable
                  style={styles.relogioBotao}
                  onPress={() => alterarMinuto(5)}
                >
                  <Ionicons name="chevron-up-outline" size={24} color="#160909" />
                </Pressable>

                <Text style={styles.relogioNumero}>
                  {String(minutoTemp).padStart(2, "0")}
                </Text>

                <Pressable
                  style={styles.relogioBotao}
                  onPress={() => alterarMinuto(-5)}
                >
                  <Ionicons name="chevron-down-outline" size={24} color="#160909" />
                </Pressable>
              </View>
            </View>

            <View style={styles.modalBotoes}>
              <Pressable
                style={styles.botaoCancelar}
                onPress={() => setSeletorHoraVisivel(false)}
              >
                <Text style={styles.textoCancelar}>Cancelar</Text>
              </Pressable>

              <Pressable style={styles.botaoGuardar} onPress={confirmarHora}>
                <Text style={styles.textoGuardar}>Confirmar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

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