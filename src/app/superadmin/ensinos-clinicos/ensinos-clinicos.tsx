import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../../../lib/supabase";
import styles from "./clinicosStyle";

type EnsinoClinico = {
  id: number;
  nome: string;
  ano_curricular: number;
  semestre: number;
  tipo: string;
  horas_estimadas: number;
  descricao: string | null;
};

export default function EnsinosClinicos() {
  const [ensinos, setEnsinos] = useState<EnsinoClinico[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisivel, setModalVisivel] = useState(false);
  const [aCriar, setACriar] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const [novoNome, setNovoNome] = useState("");
  const [novoAno, setNovoAno] = useState("");
  const [novoSemestre, setNovoSemestre] = useState("");
  const [novoTipo, setNovoTipo] = useState("ambos");
  const [novasHoras, setNovasHoras] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");

  async function carregarEnsinosClinicos() {
    setLoading(true);

    const { data, error } = await supabase
      .from("ensinos_clinicos")
      .select(
        "id, nome, ano_curricular, semestre, tipo, horas_estimadas, descricao",
      )
      .order("id", { ascending: true });

    if (error) {
      console.log("ERRO AO CARREGAR ENSINOS CLÍNICOS:", error);
      Alert.alert("Erro", "Não foi possível carregar os ensinos clínicos.");
    } else {
      setEnsinos(data || []);
    }

    setLoading(false);
  }

  function mostrarTipo(tipo: string) {
    if (tipo === "ambos") return "Contacto ou tutorial";
    if (tipo === "contacto") return "Contacto";
    if (tipo === "tutorial") return "Tutorial";
    return tipo;
  }

  function limparFormulario() {
    setNovoNome("");
    setNovoAno("");
    setNovoSemestre("");
    setNovoTipo("ambos");
    setNovasHoras("");
    setNovaDescricao("");
  }

  async function criarEnsinoClinico() {
    if (aCriar) return;

    if (
      !novoNome.trim() ||
      !novoAno.trim() ||
      !novoSemestre.trim() ||
      !novasHoras.trim()
    ) {
      Alert.alert("Erro", "Preenche nome, ano, semestre e horas.");
      return;
    }

    setACriar(true);

    let error: any = null;

    if (editingId) {
      const res = await supabase
        .from("ensinos_clinicos")
        .update({
          nome: novoNome.trim(),
          ano_curricular: Number(novoAno),
          semestre: Number(novoSemestre),
          tipo: novoTipo,
          horas_estimadas: Number(novasHoras),
          descricao: novaDescricao.trim() || null,
        })
        .eq("id", editingId);
      error = res.error;
    } else {
      const res = await supabase.from("ensinos_clinicos").insert([
        {
          nome: novoNome.trim(),
          ano_curricular: Number(novoAno),
          semestre: Number(novoSemestre),
          tipo: novoTipo,
          horas_estimadas: Number(novasHoras),
          descricao: novaDescricao.trim() || null,
        },
      ]);
      error = res.error;
    }

    setACriar(false);

    if (error) {
      console.log("ERRO AO CRIAR/ATUALIZAR ENSINO CLÍNICO:", error);
      Alert.alert("Erro", error.message || "Ocorreu um erro.");
      return;
    }

    Alert.alert(
      "Sucesso",
      editingId
        ? "Ensino clínico atualizado com sucesso!"
        : "Ensino clínico criado com sucesso!",
    );
    setModalVisivel(false);
    limparFormulario();
    setEditingId(null);
    carregarEnsinosClinicos();
  }

  // open confirmation modal for delete
  function apagarEnsino(id: number) {
    setConfirmDeleteId(id);
  }

  // perform deletion after confirmation
  async function confirmarApagar() {
    if (!confirmDeleteId) return;
    const id = confirmDeleteId;
    setConfirmDeleteId(null);

    const { error } = await supabase
      .from("ensinos_clinicos")
      .delete()
      .eq("id", id);

    if (error) {
      console.log("ERRO AO APAGAR ENSINO CLÍNICO:", error);
      Alert.alert("Erro", "Não foi possível apagar o ensino clínico.");
      return;
    }

    Alert.alert("Sucesso", "Ensino clínico apagado.");
    carregarEnsinosClinicos();
  }

  useEffect(() => {
    carregarEnsinosClinicos();
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

      <Text style={styles.titulo}>Ensinos Clínicos</Text>

      <Text style={styles.subtitulo}>
        Consultar os ensinos clínicos da Licenciatura em Enfermagem.
      </Text>

      <Pressable
        style={styles.botaoCriar}
        onPress={() => {
          setEditingId(null);
          limparFormulario();
          setModalVisivel(true);
        }}
      >
        <Text style={styles.textoBotaoCriar}>Criar ensino clínico</Text>
      </Pressable>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#FDB515"
          style={{ marginTop: 30 }}
        />
      ) : ensinos.length === 0 ? (
        <Text style={styles.textoVazio}>
          Ainda não existem ensinos clínicos registados.
        </Text>
      ) : (
        <View style={styles.lista}>
          {ensinos.map((ensino) => (
            <View key={ensino.id} style={styles.card}>
              <View style={styles.cardTopo}>
                <View style={styles.cardIcone}>
                  <Ionicons name="school-outline" size={28} color="#160909" />
                </View>

                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitulo}>{ensino.nome}</Text>
                  <Text style={styles.cardSubtitulo}>
                    {ensino.ano_curricular}.º ano · {ensino.semestre}.º semestre
                  </Text>
                </View>
              </View>

              <View style={styles.detalhes}>
                <View style={styles.badge}>
                  <Ionicons name="time-outline" size={18} color="#160909" />
                  <Text style={styles.badgeTexto}>
                    {ensino.horas_estimadas} horas
                  </Text>
                </View>

                <View style={styles.badge}>
                  <Ionicons
                    name="document-text-outline"
                    size={18}
                    color="#160909"
                  />
                  <Text style={styles.badgeTexto}>
                    {mostrarTipo(ensino.tipo)}
                  </Text>
                </View>
              </View>

              {ensino.descricao ? (
                <Text style={styles.descricao}>{ensino.descricao}</Text>
              ) : null}

              <View style={styles.cardActions}>
                <Pressable
                  style={[styles.actionButton, styles.actionEdit]}
                  onPress={() => {
                    // abrir o modal em modo edição com os dados preenchidos
                    setEditingId(ensino.id);
                    setNovoNome(ensino.nome || "");
                    setNovoAno(String(ensino.ano_curricular || ""));
                    setNovoSemestre(String(ensino.semestre || ""));
                    setNovoTipo(ensino.tipo || "ambos");
                    setNovasHoras(String(ensino.horas_estimadas || ""));
                    setNovaDescricao(ensino.descricao || "");
                    setModalVisivel(true);
                  }}
                >
                  <Ionicons name="pencil-outline" size={18} color="#160909" />
                  <Text style={styles.actionText}>Editar</Text>
                </Pressable>

                <Pressable
                  style={[styles.actionButton, styles.actionDelete]}
                  onPress={() => apagarEnsino(ensino.id)}
                >
                  <Ionicons name="trash-outline" size={18} color="#fff" />
                  <Text style={[styles.actionText, { color: "#fff" }]}>
                    Apagar
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}

      <Modal visible={modalVisivel} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitulo}>
                {editingId ? "Editar Ensino Clínico" : "Criar Ensino Clínico"}
              </Text>

              <Text style={styles.tipoTitulo}>Ensino Clinico</Text>
              <TextInput
                placeholder="Ex: Ensino Clinico 1"
                placeholderTextColor="#8c8787"
                style={styles.modalInput}
                value={novoNome}
                onChangeText={setNovoNome}
              />

              <Text style={styles.tipoTitulo}>Ano Curricular</Text>
              <TextInput
                placeholder="Ex: 1ºano"
                placeholderTextColor="#8c8787"
                style={styles.modalInput}
                value={novoAno}
                onChangeText={setNovoAno}
                keyboardType="numeric"
              />

              <Text style={styles.tipoTitulo}>Semestre</Text>
              <TextInput
                placeholder="Ex: 1ºsemestre"
                placeholderTextColor="#8c8787"
                style={styles.modalInput}
                value={novoSemestre}
                onChangeText={setNovoSemestre}
                keyboardType="numeric"
              />

              <Text style={styles.tipoTitulo}>Tipo</Text>

              <View style={styles.tipoContainer}>
                <Pressable
                  style={[
                    styles.tipoOpcao,
                    novoTipo === "contacto" && styles.tipoOpcaoSelecionada,
                  ]}
                  onPress={() => setNovoTipo("contacto")}
                >
                  <Text style={styles.tipoTexto}>Contacto</Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.tipoOpcao,
                    novoTipo === "tutorial" && styles.tipoOpcaoSelecionada,
                  ]}
                  onPress={() => setNovoTipo("tutorial")}
                >
                  <Text style={styles.tipoTexto}>Tutorial</Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.tipoOpcao,
                    novoTipo === "ambos" && styles.tipoOpcaoSelecionada,
                  ]}
                  onPress={() => setNovoTipo("ambos")}
                >
                  <Text style={styles.tipoTexto}>Ambos</Text>
                </Pressable>
              </View>

              <Text style={styles.tipoTitulo}>Horas estimadas</Text>
              <TextInput
                placeholder="Ex: 100"
                placeholderTextColor="#8c8787"
                style={styles.modalInput}
                value={novasHoras}
                onChangeText={setNovasHoras}
                keyboardType="numeric"
              />

              <Text style={styles.tipoTitulo}>Descrição</Text>
              <TextInput
                placeholder="Ex: O ensino clínico.."
                placeholderTextColor="#8c8787"
                style={[styles.modalInput, styles.modalInputDescricao]}
                value={novaDescricao}
                onChangeText={setNovaDescricao}
                multiline
              />

              <View style={styles.modalBotoes}>
                <Pressable
                  style={styles.modalBotaoCancelar}
                  onPress={() => {
                    setModalVisivel(false);
                    limparFormulario();
                    setEditingId(null);
                  }}
                >
                  <Text style={styles.modalBotaoTextoCancelar}>Cancelar</Text>
                </Pressable>

                <Pressable
                  style={styles.modalBotaoCriar}
                  onPress={criarEnsinoClinico}
                  disabled={aCriar}
                >
                  <Text style={styles.modalBotaoTexto}>
                    {aCriar
                      ? editingId
                        ? "A gravar..."
                        : "A criar..."
                      : editingId
                        ? "Salvar"
                        : "Criar"}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de confirmação para apagar */}
      <Modal
        visible={confirmDeleteId !== null}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Confirmar eliminação</Text>
            <Text
              style={{ textAlign: "center", marginBottom: 18, color: "#333" }}
            >
              Tens a certeza que queres apagar este ensino clínico? Esta ação
              não pode ser desfeita.
            </Text>

            <View style={styles.modalBotoes}>
              <Pressable
                style={styles.modalBotaoCancelar}
                onPress={() => setConfirmDeleteId(null)}
              >
                <Text style={styles.modalBotaoTextoCancelar}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={styles.modalBotaoCriar}
                onPress={confirmarApagar}
              >
                <Text style={styles.modalBotaoTexto}>Apagar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
