import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../../../lib/supabase";
import styles from "./perfilStyles";

type Utilizador = {
  id: string;
  nome: string;
  email: string;
  numero_identificacao: string | null;
  telefone: string | null;
  morada: string | null;
  data_nascimento: string | null;
  foto_url: string | null;
};

export default function PerfilProfessor() {
  const { from } = useLocalSearchParams();
  const mostrarBottomBar = from === "bottom";

  const [utilizador, setUtilizador] = useState<Utilizador | null>(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [aGuardar, setAGuardar] = useState(false);
  const [aEnviarFoto, setAEnviarFoto] = useState(false);

  const [telefone, setTelefone] = useState("");
  const [morada, setMorada] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

  const [popupVisivel, setPopupVisivel] = useState(false);
  const [popupTitulo, setPopupTitulo] = useState("");
  const [popupMensagem, setPopupMensagem] = useState("");
  const [confirmarLogoutVisivel, setConfirmarLogoutVisivel] = useState(false);

  function mostrarPopup(titulo: string, mensagem: string) {
    setPopupTitulo(titulo);
    setPopupMensagem(mensagem);
    setPopupVisivel(true);
  }

  async function carregarPerfil() {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace("/login/login" as any);
      return;
    }

    const { data, error } = await supabase
      .from("utilizadores")
      .select("id, nome, email, numero_identificacao, telefone, morada, data_nascimento, foto_url")
      .eq("id", authData.user.id)
      .single();

    if (error || !data) {
      console.log("ERRO PERFIL PROFESSOR:", error);
      setLoading(false);
      return;
    }

    setUtilizador(data as any);
    setTelefone(data.telefone || "");
    setMorada(data.morada || "");
    setDataNascimento(data.data_nascimento || "");
    setLoading(false);
  }

  useEffect(() => {
    carregarPerfil();
  }, []);

  async function escolherFoto() {
    if (!utilizador || aEnviarFoto) return;

    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissao.granted) {
      mostrarPopup("Erro", "É necessário permitir acesso à galeria.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled) return;

    setAEnviarFoto(true);

    const image = result.assets[0];
    const ext = image.uri.split(".").pop() || "jpg";
    const path = `${utilizador.id}/${Date.now()}.${ext}`;

    const response = await fetch(image.uri);
    const blob = await response.blob();

    const { error: uploadError } = await supabase.storage
      .from("fotos-perfil")
      .upload(path, blob, {
        upsert: true,
        contentType: image.mimeType || "image/jpeg",
      });

    if (uploadError) {
      setAEnviarFoto(false);
      mostrarPopup("Erro", uploadError.message);
      return;
    }

    const { data } = supabase.storage.from("fotos-perfil").getPublicUrl(path);

    const { error } = await supabase
      .from("utilizadores")
      .update({ foto_url: data.publicUrl })
      .eq("id", utilizador.id);

    setAEnviarFoto(false);

    if (error) {
      mostrarPopup("Erro", "Não foi possível atualizar a foto.");
      return;
    }

    setUtilizador({ ...utilizador, foto_url: data.publicUrl });
    mostrarPopup("Sucesso", "Foto atualizada com sucesso.");
  }

  async function guardarDados() {
    if (!utilizador || aGuardar) return;

    setAGuardar(true);

    const { error } = await supabase
      .from("utilizadores")
      .update({
        telefone: telefone.trim() || null,
        morada: morada.trim() || null,
        data_nascimento: dataNascimento.trim() || null,
      })
      .eq("id", utilizador.id);

    setAGuardar(false);

    if (error) {
      mostrarPopup("Erro", "Não foi possível guardar os dados.");
      return;
    }

    setUtilizador({
      ...utilizador,
      telefone,
      morada,
      data_nascimento: dataNascimento,
    });

    setEditando(false);
    mostrarPopup("Sucesso", "Perfil atualizado com sucesso.");
  }

  async function terminarSessao() {
    await supabase.auth.signOut();
    router.replace("/login/login" as any);
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
        <Pressable
          style={styles.voltar}
          onPress={() => router.push("/professor/home" as any)}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#160909" />
          <Text style={styles.voltarTexto}>Voltar</Text>
        </Pressable>

        <Text style={styles.titulo}>Perfil</Text>

        <View style={styles.cardPerfil}>
          <Pressable style={styles.fotoContainer} onPress={escolherFoto}>
            {utilizador?.foto_url ? (
              <Image source={{ uri: utilizador.foto_url }} style={styles.foto} />
            ) : (
              <Ionicons name="person-circle-outline" size={110} color="#FDB515" />
            )}

            <View style={styles.cameraIcon}>
              <Ionicons name="camera-outline" size={20} color="#160909" />
            </View>
          </Pressable>

          <Text style={styles.nome}>{utilizador?.nome || "Professor"}</Text>
          <Text style={styles.email}>{utilizador?.email}</Text>
          <Text style={styles.numero}> Nº: {utilizador?.numero_identificacao || "-"}</Text>

          {aEnviarFoto ? (
            <Text style={styles.uploadTexto}>A atualizar foto...</Text>
          ) : null}
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={[styles.input, !editando && styles.inputBloqueado]}
            value={telefone}
            onChangeText={setTelefone}
            editable={editando}
            placeholder="Telefone"
            placeholderTextColor="#8c8787"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Morada</Text>
          <TextInput
            style={[styles.input, !editando && styles.inputBloqueado]}
            value={morada}
            onChangeText={setMorada}
            editable={editando}
            placeholder="Morada"
            placeholderTextColor="#8c8787"
          />

          <Text style={styles.label}>Data de nascimento</Text>
          <TextInput
            style={[styles.input, !editando && styles.inputBloqueado]}
            value={dataNascimento}
            onChangeText={setDataNascimento}
            editable={editando}
            placeholder="DD-MM-AAAA"
            placeholderTextColor="#8c8787"
          />

          {!editando ? (
            <Pressable style={styles.botaoEditar} onPress={() => setEditando(true)}>
              <Text style={styles.textoBotao}>Editar Perfil</Text>
            </Pressable>
          ) : (
            <View style={styles.botoesLinha}>
              <Pressable
                style={styles.botaoCancelar}
                onPress={() => {
                  setEditando(false);
                  setTelefone(utilizador?.telefone || "");
                  setMorada(utilizador?.morada || "");
                  setDataNascimento(utilizador?.data_nascimento || "");
                }}
              >
                <Text style={styles.textoCancelar}>Cancelar</Text>
              </Pressable>

              <Pressable style={styles.botaoGuardar} onPress={guardarDados}>
                <Text style={styles.textoGuardar}>
                  {aGuardar ? "A guardar..." : "Guardar"}
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        <Pressable
          style={styles.botaoLogout}
          onPress={() => setConfirmarLogoutVisivel(true)}
        >
          <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
          <Text style={styles.textoLogout}>Terminar Sessão</Text>
        </Pressable>
      </ScrollView>

      {mostrarBottomBar && (
        <View style={styles.bottomBar}>

          <Pressable
            style={styles.bottomItem}
            onPress={() =>
              router.push("/professor/home" as any)
            }
          >
            <Ionicons name="person-outline" size={25} color="#000000ff" />
            <Text style={styles.bottomTexto}>Home</Text>
          </Pressable>

          

          <Pressable
            style={styles.bottomItem}
            onPress={() =>
              mostrarPopup(
                "Definições",
                "Esta página encontra-se em desenvolvimento."
              )
            }
          >
            <Ionicons name="settings-outline" size={25} color="#160909" />
            <Text style={styles.bottomTexto}>Definições</Text>
          </Pressable>

          <Pressable style={styles.bottomItem}>
            <Ionicons name="person-outline" size={25} color="#FDB515" />
            <Text style={styles.bottomTextoAtivo}>Perfil</Text>
          </Pressable>
        </View>
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

      <Modal visible={confirmarLogoutVisivel} transparent animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>Terminar Sessão</Text>
            <Text style={styles.popupMessage}>
              Tens a certeza que queres terminar sessão?
            </Text>

            <View style={styles.modalBotoes}>
              <Pressable
                style={styles.modalBotaoCancelar}
                onPress={() => setConfirmarLogoutVisivel(false)}
              >
                <Text style={styles.modalBotaoTexto}>Cancelar</Text>
              </Pressable>

              <Pressable style={styles.modalBotaoCriar} onPress={terminarSessao}>
                <Text style={styles.modalBotaoTextoEscuro}>Sair</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}