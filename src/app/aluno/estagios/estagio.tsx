import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { supabase } from "../../../lib/supabase";
import styles from "./estagioStyles";

type Estagio = {
  id: number;
  estado_estagio: string | null;
  edicoes_estagio?: {
    ano_letivo: string;
    data_inicio: string | null;
    data_fim: string | null;
    ensinos_clinicos?: {
      nome: string;
      ano_curricular: number;
    };
    instituicoes?: {
      nome: string;
    };
    servicos?: {
      nome: string;
    };
  };
  professor?: {
    nome: string;
  } | null;
  orientador?: {
    nome: string;
  } | null;
};

export default function EstagiosAluno() {
  const [estagios, setEstagios] = useState<Estagio[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"ativos" | "historico">("ativos");
  const { from } = useLocalSearchParams();
  const mostrarBottomBar = from === "bottom";

  async function carregarEstagios() {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace("/login/login" as any);
      return;
    }

    const { data, error } = await supabase
      .from("inscricoes_estagio")
      .select(`
        id,
        estado_estagio,
        edicoes_estagio(
          ano_letivo,
          data_inicio,
          data_fim,
          ensinos_clinicos(nome, ano_curricular),
          instituicoes(nome),
          servicos(nome)
        ),
        professor:utilizadores!inscricoes_estagio_professor_id_fkey(nome),
        orientador:utilizadores!inscricoes_estagio_orientador_id_fkey(nome)
      `)
      .eq("aluno_id", authData.user.id)
      .order("id", { ascending: false });

    if (error) {
      console.log("ERRO ESTÁGIOS:", error);
      setEstagios([]);
    } else {
      setEstagios((data as any) || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    carregarEstagios();
  }, []);

  function formatarData(data: string | null) {
    if (!data) return "Sem data";
    const date = new Date(data);
    if (Number.isNaN(date.getTime())) return data;

    return date.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function textoEstado(estado: string | null) {
    if (estado === "aguarda_relatorio") return "A aguardar relatório";
    if (estado === "aguarda_avaliacao") return "A aguardar avaliação";
    if (estado === "concluido") return "Concluído";
    return "Em curso";
  }

  function corEstado(estado: string | null) {
    if (estado === "aguarda_relatorio") return "#FDE8B4";
    if (estado === "aguarda_avaliacao") return "#DDEBFF";
    if (estado === "concluido") return "#CDEFD6";
    return "#CDEFD6";
  }

    function corBarra(nomeEstagio?: string) {
    switch (nomeEstagio) {
        case "Ensino Clínico 1":
        return "#FDB515";

        case "Ensino Clínico 2":
        return "#8EC5FC";

        case "Ensino Clínico 3":
        return "#CDB4DB";

        case "Ensino Clínico 4":
        return "#B8E0D2";

        case "Ensino Clínico 5":
        return "#FFADAD";

        case "Ensino Clínico 6":
        return "#F4A261";

        default:
        return "#FDB515";
    }
    }

  const estagiosFiltrados = estagios.filter((estagio) => {
    if (tab === "historico") {
      return estagio.estado_estagio === "concluido";
    }

    return estagio.estado_estagio !== "concluido";
  });

return (
  <View style={styles.page}>
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Pressable
          style={styles.voltar}
          onPress={() => router.push("/aluno/home" as any)}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#160909" />
          <Text style={styles.voltarTexto}>Voltar</Text>
        </Pressable>

        <Text style={styles.titulo}>Estágios</Text>

        <View style={styles.tabs}>
          <Pressable
            style={[styles.tabButton, tab === "ativos" && styles.tabAtiva]}
            onPress={() => setTab("ativos")}
          >
            <Text
              style={[
                styles.tabTexto,
                tab === "ativos" && styles.tabTextoAtivo,
              ]}
            >
              Ativos
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabButton, tab === "historico" && styles.tabAtiva]}
            onPress={() => setTab("historico")}
          >
            <Text
              style={[
                styles.tabTexto,
                tab === "historico" && styles.tabTextoAtivo,
              ]}
            >
              Histórico
            </Text>
          </Pressable>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FDB515"
            style={{ marginTop: 30 }}
          />
        ) : estagiosFiltrados.length === 0 ? (
          <Text style={styles.textoVazio}>
            {tab === "ativos"
              ? "Ainda não tens estágios ativos."
              : "Ainda não tens estágios concluídos."}
          </Text>
        ) : (
          <View style={styles.lista}>
            {estagiosFiltrados.map((estagio, index) => (
              <View
                key={estagio.id}
                style={[
                  styles.card,
                  { borderLeftColor: corBarra( estagio.edicoes_estagio?.ensinos_clinicos?.nome) },
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitulo}>
                      {estagio.edicoes_estagio?.ensinos_clinicos?.nome ||
                        "Ensino Clínico"}
                    </Text>

                    <Text style={styles.cardSubtitulo}>
                      {estagio.edicoes_estagio?.instituicoes?.nome ||
                        "Instituição"}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.badgeEstado,
                      { backgroundColor: corEstado(estagio.estado_estagio) },
                    ]}
                  >
                    <Text style={styles.badgeTexto}>
                      {textoEstado(estagio.estado_estagio)}
                    </Text>
                  </View>
                </View>

                <View style={styles.linhaInfo}>
                  <Ionicons name="calendar-outline" size={20} color="#777" />
                  <Text style={styles.infoTexto}>
                    {formatarData(estagio.edicoes_estagio?.data_inicio || null)} -{" "}
                    {formatarData(estagio.edicoes_estagio?.data_fim || null)}
                  </Text>
                </View>

                <Text style={styles.infoTexto}>
                  Serviço: {estagio.edicoes_estagio?.servicos?.nome || "Não indicado"}
                </Text>

                <Text style={styles.infoTexto}>
                  Docente: {estagio.professor?.nome || "Não indicado"}
                </Text>

                <Text style={styles.infoTexto}>
                  Orientador: {estagio.orientador?.nome || "Não indicado"}
                </Text>

                <Pressable style={styles.botaoDetalhes} onPress={() =>router.push(`/aluno/estagios/detalheEstagio/detalheEstagio?id=${estagio.id}` as any)}>
                  <Text style={styles.textoDetalhes}>Ver detalhes</Text>
                  <Ionicons name="chevron-forward-outline" size={18} color="#160909" />
                </Pressable>
              </View>
            ))}
          </View>
        )}
         </ScrollView>

    {mostrarBottomBar && (
      <View style={styles.bottomBar}>
        <Pressable style={styles.bottomItem} onPress={() => router.push("/aluno/home" as any)}>
          <Ionicons name="home-outline" size={24} color="#160909" />
          <Text style={styles.bottomTexto}>Home</Text>
        </Pressable>

        <Pressable style={styles.bottomItem} onPress={() => router.push("/aluno/presencas?from=bottom" as any)}>
          <Ionicons name="calendar-outline" size={24} color="#160909" />
          <Text style={styles.bottomTexto}>Presenças</Text>
        </Pressable>

        <Pressable style={styles.bottomItem} onPress={() => router.push("/aluno/avaliacoes?from=bottom" as any)}>
          <Ionicons name="star-outline" size={24} color="#160909" />
          <Text style={styles.bottomTexto}>Avaliações</Text>
        </Pressable>

        <Pressable style={styles.bottomItem} onPress={() => router.push("/aluno/agenda/agenda?from=bottom" as any)}>
          <Ionicons name="people-outline" size={24} color="#160909" />
          <Text style={styles.bottomTexto}>Agenda</Text>
        </Pressable>

        <Pressable style={styles.bottomItem} >
          <Ionicons name="briefcase-outline" size={24} color="#FDB515" />
          <Text style={styles.bottomTextoAtivo}>Ensinos Clínicos</Text>
        </Pressable>

        <Pressable style={styles.bottomItem} onPress={() => router.push("/aluno/preencherPerfil/perfil?from=bottom" as any)}>
          <Ionicons name="person-outline" size={24} color="#160909" />
          <Text style={styles.bottomTexto}>Perfil</Text>
        </Pressable>
      </View>
    )}
  </View>
);
}