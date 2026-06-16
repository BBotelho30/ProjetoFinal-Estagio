import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../../../lib/supabase";
import styles from "./utilizadoresStyle";

type Utilizador = {
  id: string;
  nome: string;
  email: string;
  tipo: string;
  estado: string;
  numero_identificacao: string | null;
  ano_curricular: number | null;
};

// function para obter o texto do tipo de utilizador
export default function Utilizadores() {
  const [utilizadores, setUtilizadores] = useState<Utilizador[]>([]);
  const [loading, setLoading] = useState(true);
  const [pesquisa, setPesquisa] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");

  async function carregarUtilizadores() {
    setLoading(true);

    const { data, error } = await supabase
      .from("utilizadores")
      .select(
        "id, nome, email, tipo, estado, numero_identificacao, ano_curricular"
      )
      .eq("estado", "aprovado")
      .order("nome", { ascending: true });

    if (error) {
      console.log("ERRO AO CARREGAR UTILIZADORES:", error);
      Alert.alert("Erro", "Não foi possível carregar os utilizadores.");
    } else {
      setUtilizadores(data || []);
    }

    setLoading(false);
  }

  // useEffect onde carregamos os utilizadores 
  useEffect(() => {
    carregarUtilizadores();
  }, []);

  const utilizadoresFiltrados = utilizadores.filter((user) => {
    const textoPesquisa = pesquisa.toLowerCase();

    const correspondePesquisa =
      user.nome?.toLowerCase().includes(textoPesquisa) ||
      user.email?.toLowerCase().includes(textoPesquisa) ||
      user.numero_identificacao?.toLowerCase().includes(textoPesquisa);

    const correspondeTipo =
      filtroTipo === "todos" ? true : user.tipo === filtroTipo;

    return correspondePesquisa && correspondeTipo;
  });

  // Função para obter o texto do tipo de utilizador
  function textoTipo(tipo: string) {
    if (tipo === "aluno") return "Aluno";
    if (tipo === "professor") return "Professor";
    if (tipo === "orientador") return "Orientador";
    if (tipo === "superadmin") return "SuperAdmin";
    return tipo;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable
        style={styles.voltar}
        onPress={() => router.push("/superadmin/home" as any)}
      >
        <Ionicons name="arrow-back-outline" size={24} color="#160909" />
        <Text style={styles.voltarTexto}>Voltar</Text>
      </Pressable>

      <Text style={styles.titulo}>Utilizadores</Text>
      <Text style={styles.subtitulo}>
        Consultar alunos, professores e orientadores aprovados.
      </Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={24} color="#777" />
        <TextInput
          placeholder="Pesquisar por nome, email ou número"
          placeholderTextColor="#8c8787"
          style={styles.searchInput}
          value={pesquisa}
          onChangeText={setPesquisa}
        />
      </View>

      <View style={styles.filtrosContainer}>
        <Pressable
          style={[
            styles.filtroBotao,
            filtroTipo === "todos" && styles.filtroSelecionado,
          ]}
          onPress={() => setFiltroTipo("todos")}
        >
          <Text style={styles.filtroTexto}>Todos</Text>
        </Pressable>

        <Pressable
          style={[
            styles.filtroBotao,
            filtroTipo === "aluno" && styles.filtroSelecionado,
          ]}
          onPress={() => setFiltroTipo("aluno")}
        >
          <Text style={styles.filtroTexto}>Alunos</Text>
        </Pressable>

        <Pressable
          style={[
            styles.filtroBotao,
            filtroTipo === "professor" && styles.filtroSelecionado,
          ]}
          onPress={() => setFiltroTipo("professor")}
        >
          <Text style={styles.filtroTexto}>Professores</Text>
        </Pressable>

        <Pressable
          style={[
            styles.filtroBotao,
            filtroTipo === "orientador" && styles.filtroSelecionado,
          ]}
          onPress={() => setFiltroTipo("orientador")}
        >
          <Text style={styles.filtroTexto}>Orientadores</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#FDB515"
          style={{ marginTop: 30 }}
        />
      ) : utilizadoresFiltrados.length === 0 ? (
        <Text style={styles.textoVazio}>Não existem utilizadores para mostrar.</Text>
      ) : (
        <View style={styles.lista}>
          {utilizadoresFiltrados.map((user) => (
            <View key={user.id} style={styles.card}>
              <View style={styles.cardTopo}>
                <View style={styles.cardIcone}>
                  <Ionicons
                    name={
                      user.tipo === "aluno"
                        ? "school-outline"
                        : user.tipo === "professor"
                        ? "briefcase-outline"
                        : "medkit-outline"
                    }
                    size={26}
                    color="#160909"
                  />
                </View>

                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitulo}>{user.nome}</Text>
                  <Text style={styles.cardSubtitulo}>{user.email}</Text>
                </View>
              </View>

              <View style={styles.linhaInfo}>
                <Text style={styles.label}>Tipo:</Text>
                <Text style={styles.valor}>{textoTipo(user.tipo)}</Text>
              </View>

              <View style={styles.linhaInfo}>
                <Text style={styles.label}>Número:</Text>
                <Text style={styles.valor}>
                  {user.numero_identificacao || "Não indicado"}
                </Text>
              </View>

              {user.tipo === "aluno" ? (
                <View style={styles.linhaInfo}>
                  <Text style={styles.label}>Ano curricular:</Text>
                  <Text style={styles.valor}>
                    {user.ano_curricular ? `${user.ano_curricular}.º ano` : "Não indicado"}
                  </Text>
                </View>
              ) : null}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}