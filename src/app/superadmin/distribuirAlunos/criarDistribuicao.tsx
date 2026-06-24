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
import styles from "./criarDistribuicaoStyles";

type Edicao = {
  id: number;
  vagas: number;
  ano_letivo: string;
  ensinos_clinicos?: { nome: string; ano_curricular: number };
  instituicoes?: { nome: string };
  servicos?: { nome: string };
};

type Utilizador = {
  id: string;
  nome: string;
  email: string;
  numero_identificacao: string | null;
  ano_curricular: number | null;
};

type ProfessorEstagio = {
  professor_id: string;
  max_alunos: number;
  utilizadores?: Utilizador;
};

type OrientadorEstagio = {
  orientador_id: string;
  max_alunos: number;
  utilizadores?: Utilizador;
};

export default function CriarDistribuicao() {
  const params = useLocalSearchParams();
  const inscricaoId = params.inscricaoId ? Number(params.inscricaoId) : null;

  const [edicoes, setEdicoes] = useState<Edicao[]>([]);
  const [alunos, setAlunos] = useState<Utilizador[]>([]);
  const [professoresEstagio, setProfessoresEstagio] = useState<ProfessorEstagio[]>([]);
  const [orientadoresEstagio, setOrientadoresEstagio] = useState<OrientadorEstagio[]>([]);

  const [edicaoSelecionada, setEdicaoSelecionada] = useState<number | null>(null);
  const [professorSelecionado, setProfessorSelecionado] = useState("");
  const [orientadorSelecionado, setOrientadorSelecionado] = useState("");
  const [alunosSelecionados, setAlunosSelecionados] = useState<string[]>([]);

  const [mostrarEdicoes, setMostrarEdicoes] = useState(false);
  const [mostrarProfessores, setMostrarProfessores] = useState(false);
  const [mostrarOrientadores, setMostrarOrientadores] = useState(false);

  const [loading, setLoading] = useState(true);
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

    const { data: edicoesData } = await supabase
      .from("edicoes_estagio")
      .select(`
        id,
        vagas,
        ano_letivo,
        ensinos_clinicos(nome, ano_curricular),
        instituicoes(nome),
        servicos(nome)
      `)
      .order("id", { ascending: false });

    const { data: alunosData } = await supabase
      .from("utilizadores")
      .select("id, nome, email, numero_identificacao, ano_curricular")
      .eq("tipo", "aluno")
      .eq("estado", "aprovado")
      .order("nome", { ascending: true });

    setEdicoes((edicoesData as any) || []);
    setAlunos((alunosData as any) || []);

    if (inscricaoId) {
      const { data } = await supabase
        .from("inscricoes_estagio")
        .select("aluno_id, edicao_estagio_id, professor_id, orientador_id")
        .eq("id", inscricaoId)
        .single();

      if (data) {
        setEdicaoSelecionada(data.edicao_estagio_id);
        setProfessorSelecionado(data.professor_id || "");
        setOrientadorSelecionado(data.orientador_id || "");
        setAlunosSelecionados([data.aluno_id]);
        await carregarEquipa(data.edicao_estagio_id);
      }
    }

    setLoading(false);
  }

  async function carregarEquipa(edicaoId: number) {
    const { data: profs } = await supabase
      .from("professores_estagio")
      .select(`
        professor_id,
        max_alunos,
        utilizadores(id, nome, email, numero_identificacao, ano_curricular)
      `)
      .eq("edicao_estagio_id", edicaoId);

    const { data: orients } = await supabase
      .from("orientadores_estagio")
      .select(`
        orientador_id,
        max_alunos,
        utilizadores(id, nome, email, numero_identificacao, ano_curricular)
      `)
      .eq("edicao_estagio_id", edicaoId);

    setProfessoresEstagio((profs as any) || []);
    setOrientadoresEstagio((orients as any) || []);
  }

  useEffect(() => {
    carregarDados();
  }, []);

  async function selecionarEdicao(id: number) {
    setEdicaoSelecionada(id);
    setProfessorSelecionado("");
    setOrientadorSelecionado("");
    setAlunosSelecionados([]);
    setMostrarEdicoes(false);
    await carregarEquipa(id);
  }

  function edicaoAtual() {
    return edicoes.find((e) => e.id === edicaoSelecionada) || null;
  }

  function nomeEdicao() {
    const e = edicaoAtual();
    if (!e) return "Selecionar estágio";
    return `${e.ensinos_clinicos?.nome || "Ensino Clínico"} - ${e.instituicoes?.nome || "Instituição"}`;
  }

  function nomeProfessor() {
    const p = professoresEstagio.find((p) => p.professor_id === professorSelecionado);
    return p?.utilizadores?.nome || "Selecionar professor";
  }

  function nomeOrientador() {
    const o = orientadoresEstagio.find((o) => o.orientador_id === orientadorSelecionado);
    return o?.utilizadores?.nome || "Selecionar orientador";
  }

  const alunosDoAno = alunos.filter((aluno) => {
    const e = edicaoAtual();
    if (!e) return false;
    return aluno.ano_curricular === e.ensinos_clinicos?.ano_curricular;
  });

  function toggleAluno(id: string) {
    if (inscricaoId) {
      setAlunosSelecionados([id]);
      return;
    }

    if (alunosSelecionados.includes(id)) {
      setAlunosSelecionados(alunosSelecionados.filter((a) => a !== id));
    } else {
      setAlunosSelecionados([...alunosSelecionados, id]);
    }
  }

  async function contarAtribuidos() {
    if (!edicaoSelecionada) return 0;

    const { count } = await supabase
      .from("inscricoes_estagio")
      .select("*", { count: "exact", head: true })
      .eq("edicao_estagio_id", edicaoSelecionada);

    return count || 0;
  }

  async function guardarDistribuicao() {
    if (aGuardar) return;

    if (!edicaoSelecionada || !professorSelecionado || !orientadorSelecionado) {
      mostrarPopup("Erro", "Seleciona estágio, professor e orientador.");
      return;
    }

    if (alunosSelecionados.length === 0) {
      mostrarPopup("Erro", "Seleciona pelo menos um aluno.");
      return;
    }

    const e = edicaoAtual();
    if (!e) return;

    setAGuardar(true);

    const jaAtribuidos = await contarAtribuidos();
    const disponiveis = e.vagas - jaAtribuidos;

    if (!inscricaoId && alunosSelecionados.length > disponiveis) {
      setAGuardar(false);
      mostrarPopup(
        "Erro",
        `Só existem ${disponiveis} vagas disponíveis neste estágio.`
      );
      return;
    }

    if (inscricaoId) {
      const { error } = await supabase
        .from("inscricoes_estagio")
        .update({
          aluno_id: alunosSelecionados[0],
          edicao_estagio_id: edicaoSelecionada,
          professor_id: professorSelecionado,
          orientador_id: orientadorSelecionado,
          estado: "equipa_atribuida",
        })
        .eq("id", inscricaoId);

      setAGuardar(false);

      if (error) {
        mostrarPopup("Erro", error.message);
        return;
      }

      mostrarPopup("Sucesso", "Distribuição editada com sucesso.");
      setTimeout(() => router.push("/superadmin/distribuir-alunos" as any), 900);
      return;
    }

    const inserts = alunosSelecionados.map((alunoId) => ({
      aluno_id: alunoId,
      edicao_estagio_id: edicaoSelecionada,
      professor_id: professorSelecionado,
      orientador_id: orientadorSelecionado,
      professor_responsavel_id: null,
      estado: "equipa_atribuida",
    }));

    const { error } = await supabase.from("inscricoes_estagio").insert(inserts);

    setAGuardar(false);

    if (error) {
      if (error.code === "23505") {
        mostrarPopup("Erro", "Um destes alunos já está associado a este estágio.");
      } else {
        mostrarPopup("Erro", error.message);
      }
      return;
    }

    mostrarPopup("Sucesso", "Alunos distribuídos com sucesso.");
    setTimeout(() => router.push("/superadmin/distribuir-alunos" as any), 900);
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
        onPress={() => router.push("/superadmin/distribuirAlunos/distribuirAlunos" as any)}
      >
        <Ionicons name="arrow-back-outline" size={24} color="#160909" />
        <Text style={styles.voltarTexto}>Voltar</Text>
      </Pressable>

      <Text style={styles.titulo}>
        {inscricaoId ? "Editar Distribuição" : "Nova Distribuição"}
      </Text>

      <Text style={styles.subtitulo}>
        Escolhe o estágio, professor, orientador e alunos.
      </Text>

      <Text style={styles.label}>Estágio</Text>

      <Pressable
        style={styles.selectToggle}
        onPress={() => setMostrarEdicoes(!mostrarEdicoes)}
      >
        <Text style={styles.selectToggleText}>{nomeEdicao()}</Text>
        <Ionicons
          name={mostrarEdicoes ? "chevron-up" : "chevron-down"}
          size={22}
          color="#160909"
        />
      </Pressable>

      {mostrarEdicoes && (
        <ScrollView style={styles.pickerLista}>
          {edicoes.map((e) => (
            <Pressable
              key={e.id}
              style={[
                styles.opcao,
                edicaoSelecionada === e.id && styles.opcaoSelecionada,
              ]}
              onPress={() => selecionarEdicao(e.id)}
            >
              <Text style={styles.opcaoTitulo}>{e.ensinos_clinicos?.nome}</Text>
              <Text style={styles.opcaoTexto}>
                {`${e.instituicoes?.nome} · ${e.servicos?.nome} · ${e.vagas} vagas`}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      <Text style={styles.label}>Professor</Text>

      <Pressable
        style={styles.selectToggle}
        onPress={() => setMostrarProfessores(!mostrarProfessores)}
      >
        <Text style={styles.selectToggleText}>{nomeProfessor()}</Text>
        <Ionicons
          name={mostrarProfessores ? "chevron-up" : "chevron-down"}
          size={22}
          color="#160909"
        />
      </Pressable>

      {mostrarProfessores && (
        <ScrollView style={styles.pickerLista}>
          {professoresEstagio.map((p) => (
            <Pressable
              key={p.professor_id}
              style={[
                styles.opcao,
                professorSelecionado === p.professor_id && styles.opcaoSelecionada,
              ]}
              onPress={() => {
                setProfessorSelecionado(p.professor_id);
                setMostrarProfessores(false);
              }}
            >
              <Text style={styles.opcaoTitulo}>{p.utilizadores?.nome}</Text>
              <Text style={styles.opcaoTexto}>Limite: {p.max_alunos}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      <Text style={styles.label}>Orientador</Text>

      <Pressable
        style={styles.selectToggle}
        onPress={() => setMostrarOrientadores(!mostrarOrientadores)}
      >
        <Text style={styles.selectToggleText}>{nomeOrientador()}</Text>
        <Ionicons
          name={mostrarOrientadores ? "chevron-up" : "chevron-down"}
          size={22}
          color="#160909"
        />
      </Pressable>

      {mostrarOrientadores && (
        <ScrollView style={styles.pickerLista}>
          {orientadoresEstagio.map((o) => (
            <Pressable
              key={o.orientador_id}
              style={[
                styles.opcao,
                orientadorSelecionado === o.orientador_id &&
                  styles.opcaoSelecionada,
              ]}
              onPress={() => {
                setOrientadorSelecionado(o.orientador_id);
                setMostrarOrientadores(false);
              }}
            >
              <Text style={styles.opcaoTitulo}>{o.utilizadores?.nome}</Text>
              <Text style={styles.opcaoTexto}>Limite: {o.max_alunos}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      <Text style={styles.label}>Alunos</Text>

      {edicaoSelecionada ? (
        alunosDoAno.length === 0 ? (
          <Text style={styles.textoVazio}>
            Não existem alunos aprovados para este ano curricular.
          </Text>
        ) : (
          alunosDoAno.map((aluno) => (
            <Pressable
              key={aluno.id}
              style={[
                styles.alunoCard,
                alunosSelecionados.includes(aluno.id) && styles.alunoSelecionado,
              ]}
              onPress={() => toggleAluno(aluno.id)}
            >
              <Ionicons
                name={
                  alunosSelecionados.includes(aluno.id)
                    ? "checkbox-outline"
                    : "square-outline"
                }
                size={24}
                color="#160909"
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.alunoNome}>{aluno.nome}</Text>
                <Text style={styles.alunoTexto}>
                  {aluno.numero_identificacao
                    ? `Nº ${aluno.numero_identificacao}`
                    : aluno.email}
                </Text>
              </View>
            </Pressable>
          ))
        )
      ) : (
        <Text style={styles.textoVazio}>Seleciona primeiro um estágio.</Text>
      )}

      <Pressable
        style={styles.botaoGuardar}
        onPress={guardarDistribuicao}
        disabled={aGuardar}
      >
        <Text style={styles.textoBotao}>
          {aGuardar ? "A guardar..." : "Guardar distribuição"}
        </Text>
      </Pressable>

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