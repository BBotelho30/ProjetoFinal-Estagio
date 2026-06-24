import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../../../lib/supabase";
import styles from "./perfilStyles";

export default function PerfilAdmin() {
  const [editar, setEditar] = useState(false);
  const [loading, setLoading] = useState(false);

  const [userId, setUserId] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [novaPassword, setNovaPassword] = useState("");

  async function carregarPerfil() {
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      Alert.alert("Erro", "Não foi possível carregar o utilizador.");
      return;
    }

    const id = authData.user.id;
    setUserId(id);
    setEmail(authData.user.email || "");

    const { data, error } = await supabase
      .from("utilizadores")
      .select("nome, email")
      .eq("id", id)
      .single();

    if (error) {
      console.log("ERRO PERFIL:", error);
      Alert.alert("Erro", "Não foi possível carregar o perfil.");
      return;
    }

    setNome(data.nome);
    setEmail(data.email);
  }

  async function guardarAlteracoes() {
    if (!nome.trim() || !email.trim()) {
      Alert.alert("Erro", "O nome e email são obrigatórios.");
      return;
    }

    if (novaPassword && novaPassword.length < 6) {
      Alert.alert("Erro", "A nova password deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    const { error: authError } = await supabase.auth.updateUser({
      email: email.trim(),
      ...(novaPassword ? { password: novaPassword } : {}),
    });

    if (authError) {
      console.log("ERRO AUTH:", authError);
      Alert.alert("Erro", authError.message);
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
      Alert.alert("Erro", perfilError.message);
      return;
    }

    Alert.alert("Sucesso", "Perfil atualizado com sucesso.");
    setEditar(false);
    setNovaPassword("");
  }

  useEffect(() => {
    carregarPerfil();
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

      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={95} color="#FDB515" />
        <Text style={styles.titulo}>Perfil Admin</Text>
        <Text style={styles.subtitulo}>Gerir informações da conta</Text>
      </View>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={[styles.input, !editar && styles.inputBloqueado]}
        value={nome}
        onChangeText={setNome}
        editable={editar}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[styles.input, !editar && styles.inputBloqueado]}
        value={email}
        onChangeText={setEmail}
        editable={editar}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Nova password</Text>
      <TextInput
        style={[styles.input, !editar && styles.inputBloqueado]}
        value={novaPassword}
        onChangeText={setNovaPassword}
        editable={editar}
        secureTextEntry
        placeholder={editar ? "Deixa vazio para não alterar" : "********"}
        placeholderTextColor="#8c8787"
      />

      {!editar ? (
        <Pressable style={styles.botaoEditar} onPress={() => setEditar(true)}>
          <Text style={styles.textoBotao}>Editar Perfil</Text>
        </Pressable>
        
      ) : (
        <View style={styles.botoesLinha}>
          <Pressable
            style={styles.botaoCancelar}
            onPress={() => {
              setEditar(false);
              setNovaPassword("");
              carregarPerfil();
            }}
          > 
          <Pressable style={styles.botaoEditar} onPress={() => setEditar(true)}>
          <Text style={styles.textoBotao}>Editar Perfil</Text>
        </Pressable>v

            <Text style={styles.textoCancelar}>Cancelar</Text>
          </Pressable>

          <Pressable
            style={styles.botaoGuardar}
            onPress={guardarAlteracoes}
            disabled={loading}
          >
            <Text style={styles.textoBotao}>
              {loading ? "A guardar..." : "Guardar"}
            </Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}