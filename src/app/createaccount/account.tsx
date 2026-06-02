import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import styles from "./accountStyles";
import { router } from "expo-router";
import { supabase } from "../../lib/supabase";

export default function CreateAccountScreen() {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //aluno por defeito.
  const [tipo, setTipo] = useState("aluno");

  async function criarConta() {
  if (loading) return;

  if (!nome || !email || !password) {
    Alert.alert("Erro", "Preenche todos os campos.");
    return;
  }

  if (password.length < 6) {
    Alert.alert("Erro", "A palavra-passe deve ter pelo menos 6 caracteres.");
    return;
  }

  setLoading(true);

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
    });

    if (error) {
      console.log("ERRO SIGNUP:", error);
      Alert.alert("Erro", error.message);
      return;
    }

    const user = data.user;

    if (!user) {
      Alert.alert("Erro", "Não foi possível criar o utilizador.");
      return;
    }

    const { error: insertError } = await supabase
      .from("utilizadores")
      .insert([
        {
          id: user.id,
          nome: nome,
          email: email.trim(),
          tipo: tipo,
          estado: "pendente",
        },
      ]);

    if (insertError) {
      console.log("ERRO PERFIL:", insertError);
      Alert.alert("Erro ao guardar perfil", insertError.message);
      return;
    }

    Alert.alert(
      "Conta criada",
      "A tua conta foi criada e está a aguardar aprovação do SuperAdmin."
    );

    router.push("/login/login");
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
    </View>
  );
}