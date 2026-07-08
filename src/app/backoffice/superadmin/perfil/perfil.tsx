import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../../../../lib/supabase";
import styles from "./perfilStyles";
import backofficeStyles from "../../../../styles/backofficeStyles";

export default function PerfilAdmin() {
  const [editar, setEditar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingFoto, setLoadingFoto] = useState(false);
  const [carregandoPerfil, setCarregandoPerfil] = useState(true);

  const [userId, setUserId] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [tipo, setTipo] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");

  const [novaPassword, setNovaPassword] = useState("");
  const [mostrarNovaPassword, setMostrarNovaPassword] = useState(false);

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTipo, setPopupTipo] = useState<"normal" | "sair" | "apagarFoto">( "normal");

  useEffect(() => {
    carregarPerfil();
  }, []);

  function abrirPopup(
    titulo: string,
    mensagem: string,
    tipo: "normal" | "sair" | "apagarFoto" = "normal"
  ) {
    setPopupTitle(titulo);
    setPopupMessage(mensagem);
    setPopupTipo(tipo);
    setPopupVisible(true);
  }

  async function carregarPerfil() {
  setCarregandoPerfil(true);

  try {
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError) {
      console.log("ERRO SESSÃO:", sessionError);
      abrirPopup("Erro", "Não foi possível carregar a sessão.");
      setCarregandoPerfil(false);
      return;
    }

    const user = sessionData.session?.user;

    if (!user) {
      console.log("SEM SESSÃO ATIVA");
      setCarregandoPerfil(false);
      router.replace("/backoffice/superadmin/login/login" as any);
      return;
    }

    const id = user.id;
    const emailAuth = user.email || "";

    setUserId(id);

    const { data: perfil, error: perfilError } = await supabase
      .from("utilizadores")
      .select("nome, email, tipo, foto_url")
      .eq("id", id)
      .maybeSingle();

    if (perfilError) {
      console.log("ERRO PERFIL:", perfilError);
      abrirPopup("Erro", "Não foi possível carregar o perfil.");
      setCarregandoPerfil(false);
      return;
    }

    if (!perfil) {
      console.log("PERFIL NÃO EXISTE NA TABELA UTILIZADORES");
      abrirPopup(
        "Perfil não encontrado",
        "A conta existe no Auth, mas não foi encontrado perfil na tabela de utilizadores."
      );
      setCarregandoPerfil(false);
      return;
    }

    setNome(perfil.nome || "");
    setEmail(perfil.email || emailAuth);
    setTipo(perfil.tipo || "Administrador");
    setFotoUrl(perfil.foto_url || "");
  } catch (err) {
    console.log("ERRO INESPERADO AO CARREGAR PERFIL:", err);
    abrirPopup("Erro", "Ocorreu um erro ao carregar o perfil.");
  } finally {
    setCarregandoPerfil(false);
  }
}

  async function escolherFoto() {
    if (!userId) return;

    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissao.granted) {
      abrirPopup("Permissão necessária", "Precisas de permitir acesso às fotos.");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (resultado.canceled) return;

    const imagem = resultado.assets[0];

    if (!imagem?.uri) return;

    await guardarFoto(imagem.uri);
  }

  async function guardarFoto(uri: string) {
    try {
      setLoadingFoto(true);

      const resposta = await fetch(uri);
      const blob = await resposta.blob();

      const extensao = uri.split(".").pop()?.toLowerCase() || "jpg";
      const nomeFicheiro = `${userId}-${Date.now()}.${extensao}`;
      const caminho = `perfis/${nomeFicheiro}`;

      const { error: uploadError } = await supabase.storage
        .from("fotos-perfil")
        .upload(caminho, blob, {
          contentType: blob.type || "image/jpeg",
          upsert: true,
        });

      if (uploadError) {
        console.log("ERRO UPLOAD FOTO:", uploadError);
        abrirPopup("Erro", "Não foi possível carregar a fotografia.");
        return;
      }

      const { data: publicData } = supabase.storage
        .from("fotos-perfil")
        .getPublicUrl(caminho);

      const urlPublica = publicData.publicUrl;

      const { error: updateError } = await supabase
        .from("utilizadores")
        .update({ foto_url: urlPublica })
        .eq("id", userId);

      if (updateError) {
        console.log("ERRO UPDATE FOTO:", updateError);
        abrirPopup("Erro", "Não foi possível guardar a fotografia no perfil.");
        return;
      }

      setFotoUrl(urlPublica);
      abrirPopup("Sucesso", "Foto de perfil atualizada com sucesso.");
    } finally {
      setLoadingFoto(false);
    }
  }

  async function apagarFotoPerfil() {
    if (!userId) return;

    setPopupVisible(false);
    setLoadingFoto(true);

    const { error } = await supabase
      .from("utilizadores")
      .update({ foto_url: null })
      .eq("id", userId);

    setLoadingFoto(false);

    if (error) {
      console.log("ERRO APAGAR FOTO:", error);
      abrirPopup("Erro", "Não foi possível apagar a foto de perfil.");
      return;
    }

    setFotoUrl("");
    abrirPopup("Sucesso", "Foto de perfil removida com sucesso.");
  }

  async function guardarAlteracoes() {
    if (!nome.trim() || !email.trim()) {
      abrirPopup("Erro", "O nome e o email são obrigatórios.");
      return;
    }

    if (novaPassword && novaPassword.length < 6) {
      abrirPopup("Erro", "A nova password deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    const dadosAuth: {
      email?: string;
      password?: string;
    } = {
      email: email.trim(),
    };

    if (novaPassword.trim()) {
      dadosAuth.password = novaPassword;
    }

    const { error: authError } = await supabase.auth.updateUser(dadosAuth);

    if (authError) {
      console.log("ERRO AUTH:", authError);
      abrirPopup("Erro", authError.message);
      setLoading(false);
      return;
    }

    const { error: perfilError } = await supabase
      .from("utilizadores")
      .update({
        nome: nome.trim(),
        email: email.trim(),
      })
      .eq("id", userId);

    setLoading(false);

    if (perfilError) {
      console.log("ERRO UPDATE PERFIL:", perfilError);
      abrirPopup("Erro", perfilError.message);
      return;
    }

    setEditar(false);
    setNovaPassword("");
    setMostrarNovaPassword(false);

    abrirPopup("Sucesso", "Perfil atualizado com sucesso.");
    carregarPerfil();
  }

  async function terminarSessao() {
    setPopupVisible(false);
    await supabase.auth.signOut();
    router.replace("/backoffice/superadmin/login/login" as any);
  }

  if (carregandoPerfil) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FDB515" />
        <Text style={styles.loadingTexto}>A carregar perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Pressable
          style={styles.voltar}
          onPress={() => router.push("/backoffice/superadmin/home" as any)}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#160909" />
          <Text style={styles.voltarTexto}>Voltar</Text>
        </Pressable>

        <View style={styles.cardPerfil}>
          <View style={styles.fotoContainer}>
            {fotoUrl ? (
              <Image
                source={{ uri: fotoUrl }}
                style={styles.fotoPerfil}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.fotoPlaceholder}>
                <Ionicons name="person-outline" size={64} color="#FDB515" />
              </View>
            )}

            <Pressable
              style={styles.cameraIcon}
              onPress={escolherFoto}
              disabled={loadingFoto}
            >
              {loadingFoto ? (
                <ActivityIndicator size="small" color="#160909" />
              ) : (
                <Ionicons name="camera-outline" size={21} color="#160909" />
              )}
            </Pressable>
          </View>

          <Text style={styles.nome}>{nome || "Administrador"}</Text>
          <Text style={styles.email}>{email || "Sem email definido"}</Text>

          <View style={styles.tipoBadge}>
            <Ionicons name="shield-checkmark-outline" size={17} color="#160909" />
            <Text style={styles.tipoBadgeTexto}>
              {tipo === "superadmin" ? "Administrador" : tipo}
            </Text>
          </View>

          {fotoUrl ? (
            <Pressable
              style={styles.apagarFotoBotao}
              onPress={() =>
                abrirPopup(
                  "Apagar foto",
                  "Tens a certeza que queres apagar a foto de perfil?",
                  "apagarFoto"
                )
              }
            >
              <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
              <Text style={styles.apagarFotoTexto}>Apagar foto</Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.formCard}>
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={24} color="#FDB515" />
            <Text style={styles.infoTexto}>
              Aqui podes alterar o nome, email, palavra-passe e fotografia de
              perfil da tua conta de administrador.
            </Text>
          </View>

          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={[styles.input, !editar && styles.inputBloqueado]}
            value={nome}
            onChangeText={setNome}
            editable={editar}
            placeholder="Nome"
            placeholderTextColor="#8c8787"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, !editar && styles.inputBloqueado]}
            value={email}
            onChangeText={setEmail}
            editable={editar}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Email"
            placeholderTextColor="#8c8787"
          />

          <Text style={styles.label}>Nova palavra-passe</Text>
          <View
            style={[
              styles.passwordContainer,
              !editar && styles.inputBloqueado,
            ]}
          >
            <TextInput
              style={styles.passwordInput}
              value={novaPassword}
              onChangeText={setNovaPassword}
              editable={editar}
              secureTextEntry={!mostrarNovaPassword}
              placeholder={
                editar ? "Deixa vazio para não alterar" : "Não definida aqui"
              }
              placeholderTextColor="#8c8787"
            />

            <Pressable
              onPress={() => setMostrarNovaPassword(!mostrarNovaPassword)}
              disabled={!editar}
            >
              <Ionicons
                name={mostrarNovaPassword ? "eye-outline" : "eye-off-outline"}
                size={25}
                color="#160909"
              />
            </Pressable>
          </View>

          <Text style={styles.ajudaPassword}>
            Por segurança, a palavra-passe atual não é apresentada. Só podes
            definir uma nova.
          </Text>

          {!editar ? (
            <Pressable style={styles.botaoEditar} onPress={() => setEditar(true)}>
              <Ionicons name="create-outline" size={21} color="#160909" />
              <Text style={styles.textoBotao}>Editar Perfil</Text>
            </Pressable>
          ) : (
            <View style={styles.botoesLinha}>
              <Pressable
                style={styles.botaoCancelar}
                onPress={() => {
                  setEditar(false);
                  setNovaPassword("");
                  setMostrarNovaPassword(false);
                  carregarPerfil();
                }}
              >
                <Text style={styles.textoCancelar}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={styles.botaoGuardar}
                onPress={guardarAlteracoes}
                disabled={loading}
              >
                <Text style={styles.textoGuardar}>
                  {loading ? "A guardar..." : "Guardar"}
                </Text>
              </Pressable>
            </View>
          )}

          <Pressable style={styles.botaoSair} onPress={() =>abrirPopup( "Terminar sessão",  "Tens a certeza que queres terminar sessão?", "sair")}>
            <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
            <Text style={styles.textoSair}>Terminar Sessão</Text>
          </Pressable>
        </View>
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

            {popupTipo === "sair" ? (
              <View style={styles.popupBotoesLinha}>
                <Pressable
                  style={styles.popupBotaoCancelar}
                  onPress={() => setPopupVisible(false)}
                >
                  <Text style={styles.popupTextoCancelar}>Cancelar</Text>
                </Pressable>

                <Pressable style={styles.popupBotaoSair} onPress={terminarSessao}>
                  <Text style={styles.popupTextoSair}>Sair</Text>
                </Pressable>
              </View>
            ) : popupTipo === "apagarFoto" ? (
              <View style={styles.popupBotoesLinha}>
                <Pressable
                  style={styles.popupBotaoCancelar}
                  onPress={() => setPopupVisible(false)}
                >
                  <Text style={styles.popupTextoCancelar}>Cancelar</Text>
                </Pressable>

                <Pressable
                  style={styles.popupBotaoSair}
                  onPress={apagarFotoPerfil}
                >
                  <Text style={styles.popupTextoSair}>Apagar</Text>
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
    </View>
  );
}