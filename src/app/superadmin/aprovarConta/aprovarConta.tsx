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
import styles from "./aprovarContaStyles";

type Utilizador = {
  id: string;
  nome: string;
  email: string;
  tipo: string;
  estado: string;
};

export default function AprovarContas() {
  const [utilizadores, setUtilizadores] = useState<Utilizador[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTipo, setFilterTipo] = useState<
    "all" | "aluno" | "professor" | "orientador"
  >("all");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  async function carregarUtilizadoresPendentes() {
    // Iniciar o carregamento
    setLoading(true);

    // Vai buscar utilizadores com estado "pendente"
    const { data, error } = await supabase
      .from("utilizadores")
      .select("id, nome, email, tipo, estado")
      .eq("estado", "pendente")
      .order("criado_em", { ascending: false }); // Ordenar por data de criação, do mais recente para o mais antigo

    if (error) {
      console.log("ERRO AO CARREGAR:", error);
      Alert.alert("Erro", "Não foi possível carregar as contas pendentes.");
    } else {
      setUtilizadores(data || []);
    }

    setLoading(false);
  }

  async function atualizarEstado(
    id: string,
    novoEstado: "aprovado" | "rejeitado",
  ) {
    const { error } = await supabase
      .from("utilizadores")
      .update({ estado: novoEstado })
      .eq("id", id);

    if (error) {
      console.log("ERRO AO ATUALIZAR:", error);
      Alert.alert("Erro", "Não foi possível atualizar o estado da conta.");
      return;
    }

    Alert.alert(
      "Sucesso",
      novoEstado === "aprovado"
        ? "Conta aprovada com sucesso."
        : "Conta rejeitada com sucesso.",
    );

    carregarUtilizadoresPendentes();
  }

  useEffect(() => {
    carregarUtilizadoresPendentes();
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

      <Text style={styles.titulo}>Aprovar Contas</Text>
      <Text style={styles.subtitulo}>
        Validar registos de alunos, professores e orientadores.
      </Text>

     {/* Barra de pesquisa */}
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Pesquisar nome ou email..."
          placeholderTextColor="#8c8787"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />


        <Pressable
          style={styles.filterToggle}
          onPress={() => setShowFilters((s) => !s)}
        >
          <Text style={styles.filterToggleText}>Filtrar</Text>
          <Ionicons
            name={showFilters ? "chevron-up-outline" : "chevron-down-outline"}
            size={18}
            color="#160909"
          />
        </Pressable>
      </View>

{/* Filtrar por utilizador */}

      {showFilters && (
        <>
          <View style={styles.filterDropdown}>
            <Pressable
              style={[
                styles.filterOption,
                filterTipo === "all" && styles.filterOptionActive,
              ]}
              onPress={() => {
                setFilterTipo("all");
                setShowFilters(false);
              }}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  filterTipo === "all" && styles.filterOptionTextActive,
                ]}
              >
                Todos
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.filterOption,
                filterTipo === "aluno" && styles.filterOptionActive,
              ]}
              onPress={() => {
                setFilterTipo("aluno");
                setShowFilters(false);
              }}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  filterTipo === "aluno" && styles.filterOptionTextActive,
                ]}
              >
                Alunos
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.filterOption,
                filterTipo === "professor" && styles.filterOptionActive,
              ]}
              onPress={() => {
                setFilterTipo("professor");
                setShowFilters(false);
              }}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  filterTipo === "professor" && styles.filterOptionTextActive,
                ]}
              >
                Professores
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.filterOption,
                filterTipo === "orientador" && styles.filterOptionActive,
              ]}
              onPress={() => {
                setFilterTipo("orientador");
                setShowFilters(false);
              }}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  filterTipo === "orientador" && styles.filterOptionTextActive,
                ]}
              >
                Orientadores
              </Text>
            </Pressable>
          </View>
        </>
      )}

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#FDB515"
          style={{ marginTop: 40 }}
        />
      ) : utilizadores.length === 0 ? (
        <View style={styles.vazioContainer}>
          <Ionicons name="checkmark-circle-outline" size={48} color="#FDB515" />
          <Text style={styles.vazioTexto}>Não existem contas pendentes.</Text>
        </View>
      ) : (
        <View style={styles.lista}>
          {utilizadores
            .filter((u) => {
              // filter by tipo
              if (filterTipo !== "all" && u.tipo !== filterTipo) return false;

              // filter by search query (name or email)
              if (searchQuery && searchQuery.trim() !== "") {
                const q = searchQuery.toLowerCase();
                const nome = (u.nome || "").toLowerCase();
                const email = (u.email || "").toLowerCase();
                return nome.includes(q) || email.includes(q);
              }

              return true;
            })
            .map((user) => (
              <View key={user.id} style={styles.card}>
                <View style={styles.cardTopo}>
                  <View style={styles.avatar}>
                    <Ionicons name="person-outline" size={26} color="#160909" />
                  </View>

                  <View style={styles.info}>
                    <Text style={styles.nome}>{user.nome}</Text>
                    <Text style={styles.email}>{user.email}</Text>
                  </View>
                </View>

                <View style={styles.linhaInfo}>
                  <Text style={styles.label}>Tipo:</Text>
                  <Text style={styles.valor}>{user.tipo}</Text>
                </View>

                <View style={styles.linhaInfo}>
                  <Text style={styles.label}>Estado:</Text>
                  <Text style={styles.estadoPendente}>Pendente</Text>
                </View>

                <View style={styles.botoes}>
                  <Pressable
                    style={[styles.botao, styles.botaoAprovar]}
                    onPress={() => atualizarEstado(user.id, "aprovado")}
                  >
                    <Ionicons
                      name="checkmark-outline"
                      size={20}
                      color="#369602ff"
                    />
                    <Text style={styles.botaoTexto}>Aprovar</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.botao, styles.botaoRejeitar]}
                    onPress={() => atualizarEstado(user.id, "rejeitado")}
                  >
                    <Ionicons name="close-outline" size={20} color="#e41414ff" />
                    <Text style={styles.botaoTextoRejeitar}>Rejeitar</Text>
                  </Pressable>
                </View>
              </View>
            ))}
        </View>
      )}
    </ScrollView>
  );
}
