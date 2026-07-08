import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
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
import { supabase } from "../../../../lib/supabase";
import styles from "./perfilStyles";

export default function PerfilProfessorResponsavel() {
  const [sidebarAberta, setSidebarAberta] = useState(true);

  const [carregandoPerfil, setCarregandoPerfil] = useState(true);
  const [aGuardar, setAGuardar] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novaPassword, setNovaPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTipo, setPopupTipo] = useState<"normal" | "sair">("normal");

  useEffect(() => {
    carregarPerfil();
  }, []);

  function abrirPopup(
    titulo: string,
    mensagem: string,
    tipo: "normal" | "sair" = "normal"
  ) {
    setPopupTitle(titulo);
    setPopupMessage(mensagem);
    setPopupTipo(tipo);
    setPopupVisible(true);
  }

  async function carregarPerfil() {
    setCarregandoPerfil(true);

    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    if (!user) {
      setCarregandoPerfil(false);
      router.replace("/backoffice/professorResponsavel/login/login" as any);
      return;
    }

    setUserId(user.id);
    setEmail(user.email || "");
    setNovoEmail(user.email || "");

    const { data, error } = await supabase
      .from("utilizadores")
      .select("nome, email, foto_url")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.log("ERRO AO CARREGAR PERFIL:", error);
      abrirPopup("Erro", "Não foi possível carregar o perfil.");
      setCarregandoPerfil(false);
      return;
    }

    setNome(data?.nome || "");
    setFotoUrl(data?.foto_url || null);

    if (data?.email) {
      setEmail(data.email);
      setNovoEmail(data.email);
    }

    setCarregandoPerfil(false);
  }

  async function escolherImagem() {
    if (!userId) return;

    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissao.granted) {
      abrirPopup(
        "Permissão necessária",
        "Tens de permitir o acesso às fotografias para escolher uma imagem."
      );
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (resultado.canceled) return;

    const asset = resultado.assets[0];

    if (!asset?.uri) return;

    await uploadImagem(asset.uri);
  }

  async function uploadImagem(uri: string) {
    if (!userId) return;

    try {
      setAGuardar(true);

      const response = await fetch(uri);
      const blob = await response.blob();

      const extensao = uri.split(".").pop()?.toLowerCase() || "jpg";
      const filePath = `${userId}/perfil-${Date.now()}.${extensao}`;

      const { error: uploadError } = await supabase.storage
        .from("fotos-perfil")
        .upload(filePath, blob, {
          upsert: true,
          contentType: blob.type || "image/jpeg",
        });

      if (uploadError) {
        console.log("ERRO UPLOAD FOTO:", uploadError);
        abrirPopup("Erro", "Não foi possível carregar a fotografia.");
        setAGuardar(false);
        return;
      }

      const { data } = supabase.storage
        .from("fotos-perfil")
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      const { error: updateError } = await supabase
        .from("utilizadores")
        .update({ foto_url: publicUrl })
        .eq("id", userId);

      if (updateError) {
        console.log("ERRO UPDATE FOTO:", updateError);
        abrirPopup("Erro", "Não foi possível guardar a fotografia no perfil.");
        setAGuardar(false);
        return;
      }

      setFotoUrl(publicUrl);
      abrirPopup("Sucesso", "Fotografia atualizada com sucesso.");
    } catch (error) {
      console.log("ERRO GERAL FOTO:", error);
      abrirPopup("Erro", "Ocorreu um erro ao atualizar a fotografia.");
    } finally {
      setAGuardar(false);
    }
  }

  async function guardarAlteracoes() {
    if (!userId) return;

    if (!nome.trim()) {
      abrirPopup("Erro", "O nome não pode estar vazio.");
      return;
    }

    setAGuardar(true);

    const { error: perfilError } = await supabase
      .from("utilizadores")
      .update({
        nome: nome.trim(),
        email: novoEmail.trim(),
      })
      .eq("id", userId);

    if (perfilError) {
      console.log("ERRO AO ATUALIZAR PERFIL:", perfilError);
      abrirPopup("Erro", "Não foi possível atualizar o perfil.");
      setAGuardar(false);
      return;
    }

    if (novoEmail.trim() && novoEmail.trim() !== email) {
      const { error: emailError } = await supabase.auth.updateUser({
        email: novoEmail.trim(),
      });

      if (emailError) {
        console.log("ERRO AO ALTERAR EMAIL:", emailError);
        abrirPopup(
          "Perfil atualizado",
          "O perfil foi atualizado, mas não foi possível alterar o email de autenticação."
        );
        setAGuardar(false);
        return;
      }

      setEmail(novoEmail.trim());
    }

    if (novaPassword.trim()) {
      if (novaPassword.length < 6) {
        abrirPopup("Erro", "A palavra-passe deve ter pelo menos 6 caracteres.");
        setAGuardar(false);
        return;
      }

      const { error: passwordError } = await supabase.auth.updateUser({
        password: novaPassword,
      });

      if (passwordError) {
        console.log("ERRO AO ALTERAR PASSWORD:", passwordError);
        abrirPopup("Erro", "Não foi possível alterar a palavra-passe.");
        setAGuardar(false);
        return;
      }

      setNovaPassword("");
    }

    setAGuardar(false);
    abrirPopup("Sucesso", "Perfil atualizado com sucesso.");
  }

    async function apagarFotoPerfil() {
    if (!userId) return;

    setAGuardar(true);

    const { error } = await supabase
        .from("utilizadores")
        .update({ foto_url: null })
        .eq("id", userId);

    if (error) {
        console.log("ERRO AO APAGAR FOTO:", error);
        abrirPopup("Erro", "Não foi possível apagar a fotografia.");
        setAGuardar(false);
        return;
    }

    setFotoUrl(null);
    setAGuardar(false);
    abrirPopup("Sucesso", "Fotografia apagada com sucesso.");
    }

  async function terminarSessao() {
    setPopupVisible(false);
    await supabase.auth.signOut();
    router.replace("/backoffice/superadmin/login/login" as any);
  }

  return (
  <ScrollView style={styles.container} contentContainerStyle={styles.content}>
    <Pressable
      style={styles.botaoVoltar}
      onPress={() => router.push("/backoffice/professorResponsavel/home" as any)}
    >
      <Ionicons name="arrow-back-outline" size={24} color="#160909" />
      <Text style={styles.textoVoltar}>Voltar</Text>
    </Pressable>

    {carregandoPerfil ? (
      <ActivityIndicator
        size="large"
        color="#FDB515"
        style={{ marginTop: 80 }}
      />
    ) : (
      <>
        <View style={styles.cardPerfil}>
          <Pressable style={styles.fotoBotao} onPress={escolherImagem}>
            {fotoUrl ? (
              <Image
                source={{ uri: fotoUrl }}
                style={styles.fotoPerfil}
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="person-outline" size={82} color="#FDB515" />
            )}

            <View style={styles.fotoEditarIcon}>
              <Ionicons name="camera-outline" size={20} color="#160909" />
            </View>
          </Pressable>

          <Text style={styles.nomePerfil}>{nome || "Professor"}</Text>
          <Text style={styles.emailPerfil}>{email}</Text>

          <View style={styles.badge}>
            <Ionicons name="shield-checkmark-outline" size={18} color="#160909" />
            <Text style={styles.badgeTexto}>Professor Responsável</Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={22} color="#FDB515" />
            <Text style={styles.infoTexto}>
              Aqui podes alterar o nome, email, palavra-passe e fotografia de
              perfil da tua conta de professor responsável.
            </Text>
          </View>

          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Nome"
            placeholderTextColor="#8c8787"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={novoEmail}
            onChangeText={setNovoEmail}
            placeholder="Email"
            placeholderTextColor="#8c8787"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Nova palavra-passe</Text>
          <View style={styles.passwordBox}>
            <TextInput
              style={styles.inputPassword}
              value={novaPassword}
              onChangeText={setNovaPassword}
              placeholder="Não definida aqui"
              placeholderTextColor="#8c8787"
              secureTextEntry={!mostrarPassword}
            />

            <Pressable onPress={() => setMostrarPassword(!mostrarPassword)}>
              <Ionicons
                name={mostrarPassword ? "eye-outline" : "eye-off-outline"}
                size={24}
                color="#160909"
              />
            </Pressable>
          </View>

          <Text style={styles.ajudaTexto}>
            Por segurança, a palavra-passe atual não é apresentada. Só podes
            definir uma nova.
          </Text>

          <Pressable
            style={[styles.botaoEditar, aGuardar && styles.botaoDisabled]}
            onPress={guardarAlteracoes}
            disabled={aGuardar}
          >
            <Ionicons name="create-outline" size={23} color="#160909" />
            <Text style={styles.textoEditar}>
              {aGuardar ? "A guardar..." : "Editar Perfil"}
            </Text>
          </Pressable>

          {fotoUrl && (
            <Pressable
              style={[styles.botaoApagarFoto, aGuardar && styles.botaoDisabled]}
              onPress={apagarFotoPerfil}
              disabled={aGuardar}
            >
              <Ionicons name="trash-outline" size={22} color="#FFFFFF" />
              <Text style={styles.textoApagarFoto}>Apagar Foto</Text>
            </Pressable>
          )}

          <Pressable
            style={styles.botaoSair}
            onPress={() =>
              abrirPopup(
                "Terminar sessão",
                "Tens a certeza que queres terminar sessão?",
                "sair"
              )
            }
          >
            <Ionicons name="log-out-outline" size={23} color="#FFFFFF" />
            <Text style={styles.textoSair}>Terminar Sessão</Text>
          </Pressable>
        </View>
      </>
    )}

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
  </ScrollView>
);
}