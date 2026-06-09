import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  Text,
  TextInput,
  View
} from "react-native";
import { supabase } from "../../lib/supabase";
import styles from "./accountStyles";

export default function CreateAccountScreen() {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupOnClose, setPopupOnClose] = useState<(() => void) | null>(null);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [numeroIdentificacao, setNumeroIdentificacao] = useState("");

  //aluno por defeito.
  const [tipo, setTipo] = useState("aluno");

  // Função para criar conta
  function showPopup(
    title: string,
    message: string,
    onClose: (() => void) | null = null,
  ) {
    setPopupTitle(title);
    setPopupMessage(message);
    setPopupOnClose(() => onClose);
    setPopupVisible(true);
  }

  // Funçãode fechar popup
  function handlePopupClose() {
    setPopupVisible(false);
    const cb = popupOnClose;
    setPopupOnClose(null);
    if (cb) cb();
  }

  async function criarConta() {
    if (loading) return;

    if (!nome || !email || !password) {
      showPopup("Erro", "Preenche todos os campos.");
      return;
    }

    if (
      (tipo === "aluno" || tipo === "professor") &&
      !numeroIdentificacao.trim()
    ) {
      showPopup(
        "Erro",
        tipo === "aluno"
          ? "Preenche o número de aluno."
          : "Preenche o número de professor.",
      );
      return;
    }

    if (password.length < 6) {
      showPopup("Erro", "A palavra-passe deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    // Criar conta no Supabase Auth
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
      });

      if (error) {
        console.log("ERRO SIGNUP:", error);
        showPopup("Erro", error.message);
        return;
      }

      // Inserir perfil na tabela "utilizadores"
      const user = data.user;

      if (!user) {
        showPopup("Erro", "Não foi possível criar o utilizador.");
        return;
      }

      const { error: insertError } = await supabase
        .from("utilizadores")
        .insert([
          {
            id: user.id,
            nome: nome,
            email: email.trim(), // Guardar email em minúsculas
            tipo: tipo,
            estado: "pendente",
            numero_identificacao: numeroIdentificacao.trim() || null,
          },
        ]);

      if (insertError) {
        console.log("ERRO PERFIL:", insertError);
        showPopup("Erro ao guardar perfil", insertError.message);
        return;
      }

      showPopup(
        "Conta criada",
        "A tua conta foi criada e está a aguardar aprovação do Administrador.",
        () => router.push("/login/login"),
      );
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
        <Ionicons name="person-outline" size={32} color="#1f1f1f" />
        <TextInput
          placeholder="Nome"
          placeholderTextColor="#8c8787"
          style={styles.input}
          value={nome}
          onChangeText={setNome}
        />
      </View>

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

      {(tipo === "aluno" || tipo === "professor" || tipo === "orientador") && (
        <View style={styles.inputContainer}>
          <Ionicons name="card-outline" size={32} color="#1f1f1f" />
          <TextInput
            placeholder={
              tipo === "aluno"
                ? "Número de aluno"
                : tipo === "professor"
                  ? "Número de professor"
                  : "Número profissional (opcional)"
            }
            placeholderTextColor="#8c8787"
            style={styles.input}
            value={numeroIdentificacao}
            onChangeText={setNumeroIdentificacao}
            keyboardType="default"
          />
        </View>
      )}

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

      <Text style={styles.tipoTitulo}>Tipo de utilizador</Text>

      <View style={styles.tipoContainer}>
        <Pressable
          style={[
            styles.tipoOpcao,
            tipo === "aluno" && styles.tipoOpcaoSelecionada,
          ]}
          onPress={() => setTipo("aluno")}
        >
          <Text style={styles.tipoTexto}>Aluno</Text>
        </Pressable>

        <Pressable
          style={[
            styles.tipoOpcao,
            tipo === "professor" && styles.tipoOpcaoSelecionada,
          ]}
          onPress={() => setTipo("professor")}
        >
          <Text style={styles.tipoTexto}>Professor</Text>
        </Pressable>

        <Pressable
          style={[
            styles.tipoOpcao,
            tipo === "orientador" && styles.tipoOpcaoSelecionada,
          ]}
          onPress={() => setTipo("orientador")}
        >
          <Text style={styles.tipoTexto}>Orientador</Text>
        </Pressable>
      </View>

      <Pressable style={styles.botao} onPress={criarConta} disabled={loading}>
        <Text style={styles.textoBotao}>
          {loading ? "A criar..." : "Criar Conta"}
        </Text>
      </Pressable>

      <View style={styles.criarContaContainer}>
        <Text style={styles.textoConta}>Já tem conta? </Text>

        <Pressable onPress={() => router.push("/login/login")}>
          <Text style={styles.criarConta}>Iniciar Sessão</Text>
        </Pressable>
      </View>

      <Modal
        visible={popupVisible}
        transparent
        animationType="fade"
        onRequestClose={handlePopupClose}
      >
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>{popupTitle}</Text>
            <Text style={styles.popupMessage}>{popupMessage}</Text>

            <Pressable style={styles.popupOkButton} onPress={handlePopupClose}>
              <Text style={styles.popupOkText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
