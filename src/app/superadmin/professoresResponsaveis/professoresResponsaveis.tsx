import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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
import styles from "./professoresResponsaveisStyles";

type Professor = {
  id: string;
  nome: string;
  email: string;
  numero_identificacao: string | null;
};

type EnsinoClinico = {
  id: number;
  nome: string;
  ano_curricular: number;
};

type Associacao = {
  id: number;
  professor_id: string;
  ensino_clinico_id: number;
  utilizadores?: {
    nome: string;
    email: string;
    numero_identificacao: string | null;
  };
  ensinos_clinicos?: {
    nome: string;
    ano_curricular: number;
  };
};

export default function ProfessoresResponsaveis() {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [ensinos, setEnsinos] = useState<EnsinoClinico[]>([]);
  const [associacoes, setAssociacoes] = useState<Associacao[]>([]);

  const [professorSelecionado, setProfessorSelecionado] = useState("");
  const [ensinoSelecionado, setEnsinoSelecionado] = useState<number | null>(
    null
  );

  const [mostrarProfessores, setMostrarProfessores] = useState(false);
  const [mostrarEnsinos, setMostrarEnsinos] = useState(false);

  const [associacaoEditarId, setAssociacaoEditarId] = useState<number | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [aGuardar, setAGuardar] = useState(false);

  const [popupVisivel, setPopupVisivel] = useState(false);
  const [popupTitulo, setPopupTitulo] = useState("");
  const [popupMensagem, setPopupMensagem] = useState("");

  const [confirmarVisivel, setConfirmarVisivel] = useState(false);
  const [idParaApagar, setIdParaApagar] = useState<number | null>(null);

  function mostrarPopup(titulo: string, mensagem: string) {
    setPopupTitulo(titulo);
    setPopupMensagem(mensagem);
    setPopupVisivel(true);
  }

  function pedirConfirmacaoApagar(id: number) {
    setIdParaApagar(id);
    setConfirmarVisivel(true);
  }

  async function carregarDados() {
    setLoading(true);

    const { data: professoresData, error: professoresError } = await supabase
      .from("utilizadores")
      .select("id, nome, email, numero_identificacao")
      .eq("tipo", "professor")
      .eq("estado", "aprovado")
      .order("nome", { ascending: true });

    const { data: ensinosData, error: ensinosError } = await supabase
      .from("ensinos_clinicos")
      .select("id, nome, ano_curricular")
      .order("ano_curricular", { ascending: true });

    const { data: associacoesData, error: associacoesError } = await supabase
      .from("responsaveis_ensinos_clinicos")
      .select(
        `
        id,
        professor_id,
        ensino_clinico_id,
        utilizadores(nome, email, numero_identificacao),
        ensinos_clinicos(nome, ano_curricular)
      `
      )
      .order("id", { ascending: false });

    if (professoresError || ensinosError || associacoesError) {
      console.log(
        "ERRO:",
        professoresError || ensinosError || associacoesError
      );
      mostrarPopup("Erro", "Não foi possível carregar os dados.");
    } else {
      setProfessores(professoresData || []);
      setEnsinos(ensinosData || []);
      setAssociacoes((associacoesData as any) || []);
    }

    setLoading(false);
  }

  async function guardarAssociacao() {
    if (aGuardar) return;

    if (!professorSelecionado || !ensinoSelecionado) {
      mostrarPopup("Erro", "Seleciona um professor e um ensino clínico.");
      return;
    }

    setAGuardar(true);

    if (associacaoEditarId) {
      const { error } = await supabase
        .from("responsaveis_ensinos_clinicos")
        .update({
          professor_id: professorSelecionado,
          ensino_clinico_id: ensinoSelecionado,
        })
        .eq("id", associacaoEditarId);

      setAGuardar(false);

      if (error) {
        console.log("ERRO AO EDITAR:", error);

        if (error.code === "23505") {
          mostrarPopup(
            "Erro",
            "Este professor já está nomeado como responsável por este ensino clínico."
          );
        } else {
          mostrarPopup("Erro", error.message);
        }

        return;
      }

      mostrarPopup("Sucesso", "Associação editada com sucesso.");
    } else {
      const { error } = await supabase
        .from("responsaveis_ensinos_clinicos")
        .insert([
          {
            professor_id: professorSelecionado,
            ensino_clinico_id: ensinoSelecionado,
          },
        ]);

      setAGuardar(false);

      if (error) {
        console.log("ERRO AO ASSOCIAR:", error);

        if (error.code === "23505") {
          mostrarPopup(
            "Erro",
            "Este professor já está nomeado como responsável por este ensino clínico."
          );
        } else {
          mostrarPopup("Erro", error.message);
        }

        return;
      }

      mostrarPopup("Sucesso", "Professor responsável associado com sucesso.");
    }

    limparFormulario();
    carregarDados();
  }

  function editarAssociacao(associacao: Associacao) {
    setAssociacaoEditarId(associacao.id);
    setProfessorSelecionado(associacao.professor_id);
    setEnsinoSelecionado(associacao.ensino_clinico_id);
    setMostrarProfessores(false);
    setMostrarEnsinos(false);
  }

  async function apagarAssociacao(id: number) {
    const { error } = await supabase
      .from("responsaveis_ensinos_clinicos")
      .delete()
      .eq("id", id);

    setConfirmarVisivel(false);
    setIdParaApagar(null);

    if (error) {
      console.log("ERRO AO APAGAR:", error);
      mostrarPopup("Erro", "Não foi possível apagar.");
      return;
    }

    mostrarPopup("Sucesso", "Associação removida com sucesso.");
    carregarDados();
  }

  function limparFormulario() {
    setAssociacaoEditarId(null);
    setProfessorSelecionado("");
    setEnsinoSelecionado(null);
    setMostrarProfessores(false);
    setMostrarEnsinos(false);
  }

  function nomeProfessorSelecionado() {
    const professor = professores.find((p) => p.id === professorSelecionado);
    return professor ? professor.nome : "Selecionar professor";
  }

  function nomeEnsinoSelecionado() {
    const ensino = ensinos.find((e) => e.id === ensinoSelecionado);
    return ensino ? ensino.nome : "Selecionar ensino clínico";
  }

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable
        style={styles.voltar}
        onPress={() => router.push("/superadmin/home" as any)}
      >
        <Ionicons name="arrow-back-outline" size={24} color="#160909" />
        <Text style={styles.voltarTexto}>Voltar</Text>
      </Pressable>

      <Text style={styles.titulo}>Professores Responsáveis</Text>
      <Text style={styles.subtitulo}>
        Nomear professores responsáveis por um ou mais ensinos clínicos.
      </Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#FDB515"
          style={{ marginTop: 30 }}
        />
      ) : (
        <>
          <Text style={styles.label}>Professor</Text>

          <Pressable
            style={styles.selectToggle}
            onPress={() => setMostrarProfessores(!mostrarProfessores)}
          >
            <Text style={styles.selectToggleText}>
              {nomeProfessorSelecionado()}
            </Text>

            <Ionicons
              name={mostrarProfessores ? "chevron-up" : "chevron-down"}
              size={22}
              color="#160909"
            />
          </Pressable>

          {mostrarProfessores ? (
            <ScrollView style={styles.pickerLista}>
              {professores.length === 0 ? (
                <Text style={styles.textoVazioModal}>
                  Não existem professores aprovados.
                </Text>
              ) : (
                professores.map((professor) => (
                  <Pressable
                    key={professor.id}
                    style={[
                      styles.opcaoInstituicao,
                      professorSelecionado === professor.id &&
                        styles.opcaoInstituicaoSelecionada,
                    ]}
                    onPress={() => {
                      setProfessorSelecionado(professor.id);
                      setMostrarProfessores(false);
                    }}
                  >
                    <Text style={styles.opcaoInstituicaoTexto}>
                      {professor.nome}
                    </Text>

                    <Text style={styles.opcaoSubtexto}>
                      {professor.email}
                      {professor.numero_identificacao
                        ? ` · Nº ${professor.numero_identificacao}`
                        : ""}
                    </Text>
                  </Pressable>
                ))
              )}
            </ScrollView>
          ) : null}

          <Text style={styles.label}>Ensino Clínico</Text>

          <Pressable
            style={styles.selectToggle}
            onPress={() => setMostrarEnsinos(!mostrarEnsinos)}
          >
            <Text style={styles.selectToggleText}>
              {nomeEnsinoSelecionado()}
            </Text>

            <Ionicons
              name={mostrarEnsinos ? "chevron-up" : "chevron-down"}
              size={22}
              color="#160909"
            />
          </Pressable>

          {mostrarEnsinos ? (
            <ScrollView style={styles.pickerLista}>
              {ensinos.length === 0 ? (
                <Text style={styles.textoVazioModal}>
                  Não existem ensinos clínicos.
                </Text>
              ) : (
                ensinos.map((ensino) => (
                  <Pressable
                    key={ensino.id}
                    style={[
                      styles.opcaoInstituicao,
                      ensinoSelecionado === ensino.id &&
                        styles.opcaoInstituicaoSelecionada,
                    ]}
                    onPress={() => {
                      setEnsinoSelecionado(ensino.id);
                      setMostrarEnsinos(false);
                    }}
                  >
                    <Text style={styles.opcaoInstituicaoTexto}>
                      {ensino.nome}
                    </Text>

                    <Text style={styles.opcaoSubtexto}>
                      {ensino.ano_curricular}.º ano
                    </Text>
                  </Pressable>
                ))
              )}
            </ScrollView>
          ) : null}

          <Pressable
            style={styles.botaoGuardar}
            onPress={guardarAssociacao}
            disabled={aGuardar}
          >
            <Text style={styles.textoBotao}>
              {aGuardar
                ? "A guardar..."
                : associacaoEditarId
                ? "Guardar alteração"
                : "Nomear professor"}
            </Text>
          </Pressable>

          {associacaoEditarId ? (
            <Pressable style={styles.botaoCancelar} onPress={limparFormulario}>
              <Text style={styles.textoCancelar}>Cancelar edição</Text>
            </Pressable>
          ) : null}

          <Text style={styles.tituloSecao}>Associações existentes</Text>

          {associacoes.length === 0 ? (
            <Text style={styles.textoVazio}>
              Ainda não existem professores responsáveis nomeados.
            </Text>
          ) : (
            <View style={styles.lista}>
              {associacoes.map((assoc) => (
                <View key={assoc.id} style={styles.card}>
                  <View style={styles.cardTopo}>
                    <View style={styles.cardIcone}>
                      <Ionicons
                        name="person-outline"
                        size={26}
                        color="#160909"
                      />
                    </View>

                    <View style={styles.cardInfo}>
                      <Text style={styles.cardTitulo}>
                        {assoc.utilizadores?.nome || "Professor"}
                      </Text>
                      <Text style={styles.cardSubtitulo}>
                        {assoc.utilizadores?.email || ""}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.cardTexto}>
                    Ensino Clínico:{" "}
                    {assoc.ensinos_clinicos?.nome || "Não indicado"}
                  </Text>

                  <Text style={styles.cardTexto}>
                    Ano curricular:{" "}
                    {assoc.ensinos_clinicos?.ano_curricular
                      ? `${assoc.ensinos_clinicos.ano_curricular}.º ano`
                      : "Não indicado"}
                  </Text>

                  <View style={styles.cardActions}>
                    <Pressable
                      style={[styles.actionButton, styles.actionEdit]}
                      onPress={() => editarAssociacao(assoc)}
                    >
                      <Ionicons
                        name="pencil-outline"
                        size={18}
                        color="#160909"
                      />
                      <Text style={styles.actionText}>Editar</Text>
                    </Pressable>

                    <Pressable
                      style={[styles.actionButton, styles.actionDelete]}
                      onPress={() => pedirConfirmacaoApagar(assoc.id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#FFFFFF"
                      />
                      <Text style={[styles.actionText, { color: "#FFFFFF" }]}>
                        Apagar
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}
        </>
      )}

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

      <Modal visible={confirmarVisivel} transparent animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>Confirmar</Text>

            <Text style={styles.popupMessage}>
              Tens a certeza que queres remover esta associação?
            </Text>

            <View style={styles.popupBotoesLinha}>
              <Pressable
                style={styles.popupBotaoCancelar}
                onPress={() => {
                  setConfirmarVisivel(false);
                  setIdParaApagar(null);
                }}
              >
                <Text style={styles.popupTextoCancelar}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={styles.popupBotaoApagar}
                onPress={() => {
                  if (idParaApagar !== null) {
                    apagarAssociacao(idParaApagar);
                  }
                }}
              >
                <Text style={styles.popupTextoApagar}>Apagar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}