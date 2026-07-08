import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  ImageBackground,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../../../../lib/supabase";
import styles from "./loginStyles";

export default function LoginBackoffice() {
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

async function fazerLogin() {
  if (loading) return;

  if (!email.trim() || !password.trim()) {
    abrirPopup("Erro", "Preenche o email e a palavra-passe.");
    return;
  }

  setLoading(true);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      console.log("ERRO LOGIN BACKOFFICE:", error);
      abrirPopup("Erro", "Email ou palavra-passe incorretos.");
      return;
    }

    const user = data.user;

    if (!user) {
      abrirPopup("Erro", "Não foi possível iniciar sessão.");
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
        "Esta conta está inativa. Contacta o Administrador."
      );
      await supabase.auth.signOut();
      return;
    }

    if (perfil.tipo === "superadmin") {
      router.replace("/backoffice/superadmin/home" as any);
      return;
    }

    if (perfil.tipo === "professor") {
      const { data: responsavelData, error: responsavelError } = await supabase
        .from("responsaveis_ensinos_clinicos")
        .select("id, professor_id, ensino_clinico_id")
        .eq("professor_id", user.id)
        .limit(1);

      if (responsavelError) {
        console.log("ERRO PROFESSOR RESPONSÁVEL:", responsavelError);
        abrirPopup(
          "Erro",
          "Não foi possível verificar as permissões de professor responsável."
        );
        await supabase.auth.signOut();
        return;
      }

      if (responsavelData && responsavelData.length > 0) {
        router.replace("/backoffice/professorResponsavel/home" as any);
        return;
      }

      abrirPopup(
        "Acesso negado",
        "Esta conta é de professor, mas ainda não está associada como professor responsável."
      );
      await supabase.auth.signOut();
      return;
    }

    abrirPopup(
      "Acesso negado",
      "Esta conta não tem permissões para aceder ao backoffice. Usa a aplicação móvel."
    );

    await supabase.auth.signOut();
  } finally {
    setLoading(false);
  }
}

  return (
    <ImageBackground
      source={require("../../../../../assets/images/fundo.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.leftSide}>
            <Image
              source={require("../../../../../assets/images/enf.jpg")}
              style={styles.logo}
              resizeMode="cover"
            />


            <Text style={styles.titulo}>
              Área Administrativa{"\n"}
              <Text style={styles.tituloAmarelo}>Passaporte de Enfermagem</Text>
            </Text>

            <Text style={styles.texto}>
              Acesso reservado ao Addministrador e ao Professor Responsável para
              gestão dos ensinos clínicos, utilizadores, equipas e distribuição
              de alunos.
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitulo}>Iniciar sessão</Text>
            <Text style={styles.formSubtitulo}>Entra com a tua conta administrativa.</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={26} color="#1f1f1f" />
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
              <Ionicons name="lock-closed-outline" size={28} color="#1f1f1f" />
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
                  size={26}
                  color="#1f1f1f"
                />
              </Pressable>
            </View>

            <Pressable>
              <Text style={styles.esqueci}>Esqueci-me da palavra-passe</Text>
            </Pressable>

            <Pressable
              style={[styles.botao, loading && styles.botaoDisabled]}
              onPress={fazerLogin}
              disabled={loading}
            >
              <Text style={styles.textoBotao}>
                {loading ? "A entrar..." : "Entrar no Backoffice"}
              </Text>
            </Pressable>

            <Pressable onPress={() => router.push("/" as any)}>
              <Text style={styles.voltarApp}>Voltar à página inicial</Text>
            </Pressable>
          </View>
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
    </ImageBackground>
  );
}