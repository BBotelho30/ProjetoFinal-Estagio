import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { supabase } from "../../lib/supabase";
import styles from "./homeStyles";

type Utilizador = {
  id: string;
  nome: string;
  email: string;
  numero_identificacao: string | null;
  ano_curricular: number | null;
  telefone: string | null;
  morada: string | null;
  data_nascimento: string | null;
  grau: string | null;
  curso: string | null;
  foto_url: string | null;
};

type EstagioAtual = {
  id: number;
  estado: string;
  edicoes_estagio?: {
    ano_letivo: string;
    data_inicio?: string | null;
    data_fim?: string | null;
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
  utilizadores_professor?: {
    nome: string;
  } | null;
  utilizadores_orientador?: {
    nome: string;
  } | null;
};

type Reuniao = {
  id: number;
  assunto: string | null;
  data_hora: string | null;
  local: string | null;
};

export default function AlunoHome() {
  const [utilizador, setUtilizador] = useState<Utilizador | null>(null);
  const [estagioAtual, setEstagioAtual] = useState<EstagioAtual | null>(null);
  const [reunioes, setReunioes] = useState<Reuniao[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregarAluno() {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace("/login/login" as any);
      return;
    }

    const userId = authData.user.id;

    const { data: alunoData, error: alunoError } = await supabase
      .from("utilizadores")
      .select(
        "id, nome, email, numero_identificacao, ano_curricular, telefone, morada, data_nascimento, grau, curso, foto_url"
      )
      .eq("id", userId)
      .single();

    if (alunoError || !alunoData) {
      console.log("ERRO ALUNO HOME:", alunoError);
      setLoading(false);
      return;
    }

    setUtilizador(alunoData);

    const { data: inscricaoData, error: inscricaoError } = await supabase
      .from("inscricoes_estagio")
      .select(`
        id,
        estado,
        edicoes_estagio(
          ano_letivo,
          data_inicio,
          data_fim,
          ensinos_clinicos(nome, ano_curricular),
          instituicoes(nome),
          servicos(nome)
        ),
        utilizadores_professor:utilizadores!inscricoes_estagio_professor_id_fkey(nome),
        utilizadores_orientador:utilizadores!inscricoes_estagio_orientador_id_fkey(nome)
      `)
      .eq("aluno_id", userId)
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (inscricaoError) {
      console.log("ERRO ESTÁGIO ATUAL:", inscricaoError);
    } else {
      setEstagioAtual((inscricaoData as any) || null);
    }

    const { data: reunioesData, error: reunioesError } = await supabase
      .from("reunioes")
      .select("id, assunto, data_hora, local")
      .eq("aluno_id", userId)
      .order("data_hora", { ascending: true })
      .limit(3);

    if (reunioesError) {
      console.log("ERRO REUNIÕES:", reunioesError);
      setReunioes([]);
    } else {
      setReunioes((reunioesData as any) || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    carregarAluno();
  }, []);

  function perfilIncompleto() {
    if (!utilizador) return true;

    return (
      !utilizador.ano_curricular ||
      !utilizador.telefone ||
      !utilizador.morada ||
      !utilizador.data_nascimento ||
      !utilizador.grau ||
      !utilizador.curso
    );
  }

  function formatarData(data: string | null) {
    if (!data) return "Sem data definida";

    const date = new Date(data);

    if (Number.isNaN(date.getTime())) return data;

    return date.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function formatarDataHora(data: string | null) {
    if (!data) return "Sem data marcada";

    const date = new Date(data);

    if (Number.isNaN(date.getTime())) return data;

    return date.toLocaleString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FDB515" />
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.ola}>Olá,</Text>
            <Text style={styles.nome}>{utilizador?.nome || "Aluno"} 👋</Text>
          </View>

          <Pressable
            onPress={() =>
              router.push("/aluno/preencherPerfil/perfil?from=top" as any)
            }
          >
            {utilizador?.foto_url ? (
              <Image
                source={{ uri: utilizador.foto_url }}
                style={styles.fotoPerfil}
              />
            ) : (
              <Ionicons
                name="person-circle-outline"
                size={70}
                color="#FDB515"
              />
            )}
          </Pressable>
        </View>

        {perfilIncompleto() ? (
          <Pressable
            style={styles.avisoPerfil}
            onPress={() => router.push("/aluno/completar-perfil" as any)}
          >
            <Ionicons name="alert-circle-outline" size={28} color="#160909" />
            <View style={{ flex: 1 }}>
              <Text style={styles.avisoTitulo}>Completa o teu perfil</Text>
              <Text style={styles.avisoTexto}>
                Para continuares, preenche os teus dados pessoais.
              </Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={24} color="#160909" />
          </Pressable>
        ) : null}

        <Text style={styles.secaoTitulo}>Acessos rápidos</Text>

        <View style={styles.grid}>
          <Pressable style={styles.cardAtalho} onPress={() => router.push("/aluno/estagios/estagio" as any)}>
            <Ionicons name="briefcase-outline" size={36} color="#FDB515" />
            <Text style={styles.cardTitulo}>Ensinos Clinicos</Text>
          </Pressable>

          <Pressable
            style={styles.cardAtalho}
            onPress={() => router.push("/aluno/presencas" as any)}
          >
            <Ionicons name="calendar-outline" size={32} color="#FDB515" />
            <Text style={styles.cardTitulo}>Presenças</Text>
          </Pressable>

          <Pressable
            style={styles.cardAtalho}
            onPress={() => router.push("/aluno/avaliacoes" as any)}
          >
            <Ionicons name="star-outline" size={32} color="#FDB515" />
            <Text style={styles.cardTitulo}>Avaliações</Text>
          </Pressable>

          <Pressable
            style={styles.cardAtalho}
            onPress={() => router.push("/aluno/agenda/agenda" as any)}
          >
            <Ionicons name="people-outline" size={32} color="#FDB515" />
            <Text style={styles.cardTitulo}>Agenda</Text>
          </Pressable>
        </View>

        <Text style={styles.secaoTitulo}>Estágio atual</Text>

        {!estagioAtual ? (
          <Text style={styles.mensagemVazia}>
            Ainda não tens nenhum estágio atribuído.
          </Text>
        ) : (
          <Pressable
            style={styles.estagioAtualCard}
            onPress={() => router.push("/aluno/estagio" as any)}
          >
            <View style={styles.estagioIcone}>
              <Ionicons name="briefcase-outline" size={30} color="#160909" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.estagioTitulo}>
                {estagioAtual.edicoes_estagio?.ensinos_clinicos?.nome ||
                  "Ensino clínico"}
              </Text>

              <Text style={styles.estagioTexto}>
                {estagioAtual.edicoes_estagio?.instituicoes?.nome ||
                  "Instituição"}{" "}
                · {estagioAtual.edicoes_estagio?.servicos?.nome || "Serviço"}
              </Text>

              <Text style={styles.estagioTexto}>
                {formatarData(estagioAtual.edicoes_estagio?.data_inicio || null)}{" "}
                - {formatarData(estagioAtual.edicoes_estagio?.data_fim || null)}
              </Text>

              <Text style={styles.estagioTexto}>
                Professor:{" "}
                {estagioAtual.utilizadores_professor?.nome || "Não indicado"}
              </Text>

              <Text style={styles.estagioTexto}>
                Orientador:{" "}
                {estagioAtual.utilizadores_orientador?.nome || "Não indicado"}
              </Text>
            </View>
          </Pressable>
        )}

        <Text style={styles.secaoTitulo}>Próximos eventos</Text>

        {reunioes.length === 0 ? (
          <Text style={styles.mensagemVazia}>
            Não existem eventos agendados.
          </Text>
        ) : (
          <View style={styles.eventosLista}>
            {reunioes.map((reuniao) => (
              <Pressable
                key={reuniao.id}
                style={styles.eventoCard}
                onPress={() => router.push("/aluno/reunioes" as any)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.eventoTitulo}>
                    {reuniao.assunto || "Reunião de acompanhamento"}
                  </Text>

                  <Text style={styles.eventoTexto}>
                    {formatarDataHora(reuniao.data_hora)}
                  </Text>

                  {reuniao.local ? (
                    <Text style={styles.eventoTexto}>{reuniao.local}</Text>
                  ) : null}
                </View>

                <Ionicons name="calendar-outline" size={28} color="#FDB515" />
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable style={styles.bottomItem} onPress={() => router.push("/aluno/home" as any)}>
          <Ionicons name="home-outline" size={24} color="#FDB515" />
          <Text style={styles.bottomTextoAtivo}>Home</Text>
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

        <Pressable style={styles.bottomItem} onPress={() => router.push("/aluno/estagios/estagio?from=bottom" as any)}>
          <Ionicons name="briefcase-outline" size={24} color="#160909" />
          <Text style={styles.bottomTexto}>Ensinos Clinicos</Text>
        </Pressable>

        <Pressable style={styles.bottomItem} onPress={() => router.push("/aluno/preencherPerfil/perfil?from=bottom" as any)}>
          <Ionicons name="person-outline" size={24} color="#160909" />
          <Text style={styles.bottomTexto}>Perfil</Text>
        </Pressable>
      </View>
    </View>
  );
}