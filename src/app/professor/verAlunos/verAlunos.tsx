import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../../../lib/supabase";
import styles from "./verAlunosStyles";

type Inscricao = {
  id: number;
  estado_estagio: string | null;
  aluno?: {
    id: string;
    nome: string;
    email: string;
    numero_identificacao: string | null;
    foto_url: string | null;
  } | null;
  edicoes_estagio?: {
    ano_letivo: string;
    ensinos_clinicos?: {
      id: number;
      nome: string;
      ano_curricular: number;
      semestre: number;
    } | null;
    instituicoes?: { nome: string } | null;
    servicos?: { nome: string } | null;
  } | null;
};

export default function MeusAlunos() {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [loading, setLoading] = useState(true);

  const [pesquisa, setPesquisa] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filtroAno, setFiltroAno] = useState("todos");

  async function carregarAlunos() {
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
        aluno:utilizadores!inscricoes_estagio_aluno_id_fkey(
          id,
          nome,
          email,
          numero_identificacao,
          foto_url
        ),
        edicoes_estagio(
          ano_letivo,
          ensinos_clinicos(id, nome, ano_curricular, semestre),
          instituicoes(nome),
          servicos(nome)
        )
      `)
      .eq("professor_id", authData.user.id)
      .order("id", { ascending: false });

    if (error) {
      console.log("ERRO MEUS ALUNOS:", error);
      setInscricoes([]);
    } else {
      setInscricoes((data as any) || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    carregarAlunos();
  }, []);

  function corBarra(id?: number) {
    const cores = [
      "#FDB515",
      "#8EC5FC",
      "#CDB4DB",
      "#B8E0D2",
      "#FFADAD",
      "#F4A261",
      "#A8DADC",
      "#E5989B",
      "#DDBEA9",
    ];

    if (!id) return cores[0];

    return cores[(id - 1) % cores.length];
  }

  function textoEstado(estado: string | null) {
    if (estado === "aguarda_relatorio") return "A aguardar relatório";
    if (estado === "aguarda_avaliacao") return "A aguardar avaliação";
    if (estado === "concluido") return "Concluído";
    return "Em curso";
  }

  const inscricoesFiltradas = inscricoes.filter((inscricao) => {
    const texto = pesquisa.toLowerCase();

    const nomeAluno = inscricao.aluno?.nome?.toLowerCase() || "";
    const emailAluno = inscricao.aluno?.email?.toLowerCase() || "";
    const numeroAluno =
      inscricao.aluno?.numero_identificacao?.toLowerCase() || "";
    const ensino =
      inscricao.edicoes_estagio?.ensinos_clinicos?.nome?.toLowerCase() || "";
    const instituicao =
      inscricao.edicoes_estagio?.instituicoes?.nome?.toLowerCase() || "";
    const servico =
      inscricao.edicoes_estagio?.servicos?.nome?.toLowerCase() || "";

    const correspondePesquisa =
      nomeAluno.includes(texto) ||
      emailAluno.includes(texto) ||
      numeroAluno.includes(texto) ||
      ensino.includes(texto) ||
      instituicao.includes(texto) ||
      servico.includes(texto);

    const ano =
      inscricao.edicoes_estagio?.ensinos_clinicos?.ano_curricular;

    const correspondeAno =
      filtroAno === "todos" ? true : ano === Number(filtroAno);

    return correspondePesquisa && correspondeAno;
  });

  return (
    <View style={styles.page}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Pressable
          style={styles.voltar}
          onPress={() => router.push("/professor/home" as any)}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#160909" />
          <Text style={styles.voltarTexto}>Voltar</Text>
        </Pressable>

        <Text style={styles.titulo}>Os meus alunos</Text>
        <Text style={styles.subtitulo}>
          Consulta os alunos associados aos teus ensinos clínicos.
        </Text>

        <View style={styles.topRow}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={24} color="#777" />
            <TextInput
              placeholder="Pesquisar"
              placeholderTextColor="#8c8787"
              style={styles.searchInput}
              value={pesquisa}
              onChangeText={setPesquisa}
            />
          </View>

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

        {showFilters && (
          <View style={styles.filterDropdown}>
            {["todos", "1", "2", "3", "4"].map((ano) => (
              <Pressable
                key={ano}
                style={[
                  styles.filterOption,
                  filtroAno === ano && styles.filterOptionActive,
                ]}
                onPress={() => {
                  setFiltroAno(ano);
                  setShowFilters(false);
                }}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    filtroAno === ano && styles.filterOptionTextActive,
                  ]}
                >
                  {ano === "todos" ? "Todos" : `${ano}.º Ano`}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FDB515"
            style={{ marginTop: 30 }}
          />
        ) : inscricoesFiltradas.length === 0 ? (
          <Text style={styles.textoVazio}>
            Não existem alunos para mostrar.
          </Text>
        ) : (
          <View style={styles.lista}>
            {inscricoesFiltradas.map((inscricao) => {
              const ensino = inscricao.edicoes_estagio?.ensinos_clinicos;
              const cor = corBarra(ensino?.id);

              return (
                <View
                  key={inscricao.id}
                  style={[styles.card, { borderLeftColor: cor }]}
                >
                  <View style={styles.cardTopo}>
                    <View style={styles.avatarBox}>
                      {inscricao.aluno?.foto_url ? (
                        <Image
                          source={{ uri: inscricao.aluno.foto_url }}
                          style={styles.avatar}
                        />
                      ) : (
                        <Ionicons
                          name="person-outline"
                          size={30}
                          color="#160909"
                        />
                      )}
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardTitulo}>
                        {inscricao.aluno?.nome || "Aluno"}
                      </Text>

                      <Text style={styles.cardSubtitulo}>
                        {inscricao.aluno?.email || "Sem email"}
                      </Text>
                    </View>

                    <View style={styles.badgeEstado}>
                      <Text style={styles.badgeTexto}>
                        {textoEstado(inscricao.estado_estagio)}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.cardTexto}>
                    Nº: {inscricao.aluno?.numero_identificacao || "Não indicado"}
                  </Text>

                  <Text style={styles.cardTexto}>
                    Estágio: {ensino?.nome || "Ensino Clínico"}
                  </Text>

                  <Text style={styles.cardTexto}>
                    Ano: {ensino?.ano_curricular || "—"}.º · Semestre:{" "}
                    {ensino?.semestre || "—"}
                  </Text>

                  <Text style={styles.cardTexto}>
                    Local:{" "}
                    {inscricao.edicoes_estagio?.instituicoes?.nome ||
                      "Instituição"}{" "}
                    · {inscricao.edicoes_estagio?.servicos?.nome || "Serviço"}
                  </Text>

                  <Pressable
                    style={styles.botaoDetalhes}
                    onPress={() =>
                      router.push(
                        `/professor/alunos/detalheAluno?id=${inscricao.id}` as any
                      )
                    }
                  >
                    <Text style={styles.textoDetalhes}>Ver detalhes</Text>
                    <Ionicons
                      name="chevron-forward-outline"
                      size={18}
                      color="#160909"
                    />
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}