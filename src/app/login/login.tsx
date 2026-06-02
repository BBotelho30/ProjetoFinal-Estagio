import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Image, Pressable, Text, TextInput, View} from "react-native";
import styles from "./loginStyles";
import { router } from "expo-router";
import { supabase } from "../../lib/supabase";

export default function LoginScreen() {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function fazerLogin() {
    if (loading) return;

    if (!email || !password) {
      Alert.alert("Erro", "Preenche o email e a palavra-passe.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        console.log("ERRO LOGIN:", error);
        Alert.alert("Erro", error.message);
        return;
      }

      const user = data.user;

      if (!user) {
        Alert.alert("Erro", "Não foi possível iniciar sessão.");
        return;
      }

      const { data: perfil, error: perfilError } = await supabase
        .from("utilizadores")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (perfilError) {
        console.log("ERRO PERFIL:", perfilError);
        Alert.alert("Erro", "Não foi possível carregar o perfil.");
        return;
      }

      if (perfil.estado === "pendente") {
        Alert.alert(
          "Conta pendente",
          "A tua conta ainda está a aguardar aprovação do SuperAdmin."
        );
        return;
      }

      if (perfil.estado === "rejeitado") {
        Alert.alert(
          "Conta rejeitada",
          "A tua conta foi rejeitada pelo SuperAdmin."
        );
        return;
      }

      if (perfil.tipo === "aluno") {
        router.push({ pathname: "/aluno/home" } as any);
      } else if (perfil.tipo === "professor") {
        router.push({ pathname: "/professor/home" } as any);
      } else if (perfil.tipo === "orientador") {
        router.push({ pathname: "/orientador/home" } as any);
      } else if (perfil.tipo === "superadmin") {
        router.push({ pathname: "/superadmin/home",} as any);
      } else {
        Alert.alert("Erro", "Tipo de utilizador desconhecido.");
      }
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

      <Pressable
        style={styles.botao}
        onPress={fazerLogin}
        disabled={loading}
      >
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
    </View>
  );
}