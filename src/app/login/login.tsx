import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Modal, Pressable, Text, TextInput, View } from "react-native";
import { supabase } from "../../lib/supabase";
import styles from "./loginStyles";

export default function LoginScreen() {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  function abrirPopup(titulo: string, mensagem: string) {
    setPopupTitle(titulo);
    setPopupMessage(mensagem);
    setPopupVisible(true);
  }

  function traduzirErroLogin(mensagem: string) {
    const msg = mensagem.toLowerCase();

    if (
      msg.includes("invalid login credentials") ||
      msg.includes("invalid credentials")
    ) {
      return "Email ou palavra-passe incorretos.";
    }

    if (msg.includes("email not confirmed")) {
      return "O email ainda não foi confirmado.";
    }

    if (msg.includes("invalid email")) {
      return "O email inserido não é válido.";
    }

    return mensagem;
  }

  async function fazerLogin() {
    if (loading) return;

    const emailFormatado = email.trim().toLowerCase();

    if (!emailFormatado || !password.trim()) {
      abrirPopup("Erro", "Preenche o email e a palavra-passe.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailFormatado,
        password: password,
      });

      if (error) {
        console.log("ERRO LOGIN:", error);
        abrirPopup("Erro", traduzirErroLogin(error.message));
        return;
      }

      const user = data.user;

      if (!user) {
        abrirPopup("Erro", "Não foi possível iniciar sessão.");
        await supabase.auth.signOut();
        return;
      }

      const { data: perfil, error: perfilError } = await supabase
        .from("utilizadores")
        .select("id, nome, email, tipo, estado, ativo")
        .eq("id", user.id)
        .maybeSingle();

      if (perfilError) {
        console.log("ERRO PERFIL:", perfilError);
        abrirPopup("Erro", "Não foi possível carregar o perfil.");
        await supabase.auth.signOut();
        return;
      }

      if (!perfil) {
        abrirPopup("Erro", "Perfil não encontrado.");
        await supabase.auth.signOut();
        return;
      }

      if (perfil.estado === "pendente") {
        abrirPopup(
          "Conta pendente",
          "A tua conta ainda está a aguardar aprovação do Administrador."
        );
        await supabase.auth.signOut();
        return;
      }

      if (perfil.estado === "rejeitado") {
        abrirPopup(
          "Conta rejeitada",
          "A tua conta foi rejeitada pelo Administrador."
        );
        await supabase.auth.signOut();
        return;
      }

      if (perfil.ativo === false) {
        abrirPopup(
          "Conta inativa",
          "A tua conta encontra-se inativa. Contacta o Administrador."
        );
        await supabase.auth.signOut();
        return;
      }

      if (perfil.tipo === "aluno") {
        router.replace({ pathname: "/aluno/home" } as any);
        return;
      }

      if (perfil.tipo === "professor") {
        router.replace({ pathname: "/professor/home" } as any);
        return;
      }

      if (perfil.tipo === "orientador") {
        router.replace({ pathname: "/orientador/home" } as any);
        return;
      }

      if (perfil.tipo === "superadmin") {
        router.replace({ pathname: "/backoffice/superadmin/home" } as any);
        return;
      }

      abrirPopup("Erro", "Tipo de utilizador desconhecido.");
      await supabase.auth.signOut();
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/enf.jpg")}
        style={styles.logo}
        resizeMode="cover"
      />

      <Text style={styles.titulo}>Passaporte</Text>
      <Text style={styles.tituloAmarelo}>de Enfermagem</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={32} color="#1f1f1f" />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#8c8787"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={34} color="#1f1f1f" />
        <TextInput
          placeholder="Palavra-passe"
          placeholderTextColor="#8c8787"
          style={styles.input}
          secureTextEntry={!mostrarPassword}
          value={password}
          onChangeText={setPassword}
        />

        <Pressable onPress={() => setMostrarPassword(!mostrarPassword)}>
          <Ionicons
            name={mostrarPassword ? "eye-outline" : "eye-off-outline"}
            size={30}
            color="#1f1f1f"
          />
        </Pressable>
      </View>

      <Pressable>
        <Text style={styles.esqueci}>Esqueci-me da palavra-passe</Text>
      </Pressable>

      <Pressable style={styles.botao} onPress={fazerLogin} disabled={loading}>
        <Text style={styles.textoBotao}>
          {loading ? "A entrar..." : "Entrar"}
        </Text>
      </Pressable>

      <View style={styles.criarContaContainer}>
        <Text style={styles.textoConta}>Não tem conta? </Text>

        <Pressable onPress={() => router.push("/createaccount/account")}>
          <Text style={styles.criarConta}>Criar Conta</Text>
        </Pressable>
      </View>

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

            <Pressable
              style={styles.popupOkButton}
              onPress={() => setPopupVisible(false)}
            >
              <Text style={styles.popupOkText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}