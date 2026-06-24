import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
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
import styles from "./criarEquipaEstagioStyles";

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
};

export default function CriarEquipaEstagio() {
  const params = useLocalSearchParams();
  const edicaoIdParam = params.edicaoId ? Number(params.edicaoId) : null;

  const [edicoes, setEdicoes] = useState<Edicao[]>([]);
  const [professores, setProfessores] = useState<Utilizador[]>([]);
  const [orientadores, setOrientadores] = useState<Utilizador[]>([]);

  const [edicaoSelecionada, setEdicaoSelecionada] = useState<number | null>(
    edicaoIdParam
  );

  const [professorSelecionado, setProfessorSelecionado] = useState("");
  const [orientadorSelecionado, setOrientadorSelecionado] = useState("");

  const [maxProfessor, setMaxProfessor] = useState("8");
  const [maxOrientador, setMaxOrientador] = useState("8");

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

    const { data: professoresData } = await supabase
      .from("utilizadores")
      .select("id, nome, email, numero_identificacao")
      .eq("tipo", "professor")
      .eq("estado", "aprovado")
      .order("nome", { ascending: true });

    const { data: orientadoresData } = await supabase
      .from("utilizadores")
      .select("id, nome, email, numero_identificacao")
      .eq("tipo", "orientador")
      .eq("estado", "aprovado")
      .order("nome", { ascending: true });

    setEdicoes((edicoesData as any) || []);
    setProfessores(professoresData || []);
    setOrientadores(orientadoresData || []);

    setLoading(false);
  }

  useEffect(() => {
    carregarDados();
  }, []);

  function nomeEdicaoSelecionada() {
    const edicao = edicoes.find((e) => e.id === edicaoSelecionada);

    if (!edicao) return "Selecionar estágio";

    return `${edicao.ensinos_clinicos?.nome || "Ensino Clínico"} - ${
      edicao.instituicoes?.nome || "Instituição"
    }`;
  }

  function nomeProfessorSelecionado() {
    const professor = professores.find((p) => p.id === professorSelecionado);
    return professor ? professor.nome : "Selecionar professor";
  }

  function nomeOrientadorSelecionado() {
    const orientador = orientadores.find((o) => o.id === orientadorSelecionado);
    return orientador ? orientador.nome : "Selecionar orientador";
  }

  async function guardarEquipa() {
    if (aGuardar) return;

    if (!edicaoSelecionada) {
      mostrarPopup("Erro", "Seleciona uma edição de estágio.");
      return;
    }

    if (!professorSelecionado && !orientadorSelecionado) {
      mostrarPopup(
        "Erro",
        "Seleciona pelo menos um professor ou um orientador."
      );
      return;
    }

    setAGuardar(true);

    if (professorSelecionado) {
      const { error: profError } = await supabase
        .from("professores_estagio")
        .insert([
          {
            edicao_estagio_id: edicaoSelecionada,
            professor_id: professorSelecionado,
            max_alunos: Number(maxProfessor) || 8,
          },
        ]);

      if (profError) {
        setAGuardar(false);

        if (profError.code === "23505") {
          mostrarPopup("Erro", "Este professor já está associado a este estágio.");
        } else {
          mostrarPopup("Erro", profError.message);
        }

        return;
      }
    }

    if (orientadorSelecionado) {
      const { error: orientError } = await supabase
        .from("orientadores_estagio")
        .insert([
          {
            edicao_estagio_id: edicaoSelecionada,
            orientador_id: orientadorSelecionado,
            max_alunos: Number(maxOrientador) || 8,
          },
        ]);

      if (orientError) {
        setAGuardar(false);

        if (orientError.code === "23505") {
          mostrarPopup(
            "Erro",
            "Este orientador já está associado a este estágio."
          );
        } else {
          mostrarPopup("Erro", orientError.message);
        }

        return;
      }
    }

    setAGuardar(false);

    mostrarPopup("Sucesso", "Equipa guardada com sucesso.");

    setTimeout(() => {
      router.push("/superadmin/equipas-estagio" as any);
    }, 900);
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
        onPress={() => router.push("/superadmin/criar_equipas/equipasEstagio" as any)}
      >
        <Ionicons name="arrow-back-outline" size={24} color="#160909" />
        <Text style={styles.voltarTexto}>Voltar</Text>
      </Pressable>

      <Text style={styles.titulo}>Criar Equipa</Text>
      <Text style={styles.subtitulo}>
        Seleciona a edição de estágio, professor e orientador.
      </Text>

      <Text style={styles.label}>Edição de Estágio</Text>

      <Pressable
        style={styles.selectToggle}
        onPress={() => setMostrarEdicoes(!mostrarEdicoes)}
      >
        <Text style={styles.selectToggleText}>{nomeEdicaoSelecionada()}</Text>
        <Ionicons
          name={mostrarEdicoes ? "chevron-up" : "chevron-down"}
          size={22}
          color="#160909"
        />
      </Pressable>

      {mostrarEdicoes ? (
        <ScrollView style={styles.pickerLista}>
          {edicoes.map((edicao) => (
            <Pressable
              key={edicao.id}
              style={[
                styles.opcao,
                edicaoSelecionada === edicao.id && styles.opcaoSelecionada,
              ]}
              onPress={() => {
                setEdicaoSelecionada(edicao.id);
                setMostrarEdicoes(false);
              }}
            >
              <Text style={styles.opcaoTitulo}>
                {edicao.ensinos_clinicos?.nome}
              </Text>
              <Text style={styles.opcaoTexto}>
                {`${edicao.instituicoes?.nome} · ${
                  edicao.servicos?.nome
                } · ${edicao.vagas} vagas`}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : null}

      <Text style={styles.label}>Professor</Text>

      <Pressable
        style={styles.selectToggle}
        onPress={() => setMostrarProfessores(!mostrarProfessores)}
      >
        <Text style={styles.selectToggleText}>{nomeProfessorSelecionado()}</Text>
        <Ionicons
          name={mostrarProfessores ? "chevron-up" : "chevron-down"}
          size={22}
          color="#160909"
        />
      </Pressable>

      {mostrarProfessores ? (
        <ScrollView style={styles.pickerLista}>
          {professores.map((professor) => (
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
              <Text style={styles.opcaoTitulo}>{professor.nome}</Text>
              <Text style={styles.opcaoTexto}>
                {professor.email}
                {professor.numero_identificacao
                  ? ` · Nº ${professor.numero_identificacao}`
                  : ""}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : null}

      <TextInput
        placeholder="Limite de alunos do professor"
        placeholderTextColor="#8c8787"
        style={styles.input}
        value={maxProfessor}
        onChangeText={setMaxProfessor}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Orientador</Text>

      <Pressable
        style={styles.selectToggle}
        onPress={() => setMostrarOrientadores(!mostrarOrientadores)}
      >
        <Text style={styles.selectToggleText}>
          {nomeOrientadorSelecionado()}
        </Text>
        <Ionicons
          name={mostrarOrientadores ? "chevron-up" : "chevron-down"}
          size={22}
          color="#160909"
        />
      </Pressable>

      {mostrarOrientadores ? (
        <ScrollView style={styles.pickerLista}>
          {orientadores.map((orientador) => (
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
              <Text style={styles.opcaoTitulo}>{orientador.nome}</Text>
              <Text style={styles.opcaoTexto}>
                {orientador.email}
                {orientador.numero_identificacao
                  ? ` · Nº ${orientador.numero_identificacao}`
                  : ""}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : null}

      <TextInput
        placeholder="Limite de alunos do orientador"
        placeholderTextColor="#8c8787"
        style={styles.input}
        value={maxOrientador}
        onChangeText={setMaxOrientador}
        keyboardType="numeric"
      />

      <Pressable
        style={styles.botaoGuardar}
        onPress={guardarEquipa}
        disabled={aGuardar}
      >
        <Text style={styles.textoBotao}>
          {aGuardar ? "A guardar..." : "Guardar equipa"}
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