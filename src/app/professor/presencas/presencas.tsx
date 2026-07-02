import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { supabase } from "../../../lib/supabase";
import styles from "./presencasStyles";

type Inscricao = {
  id: number;
  aluno?: {
    nome: string;
    numero_identificacao: string | null;
  } | null;
  edicoes_estagio?: {
    id: number;
    ano_letivo: string | null;
    ensinos_clinicos?: { nome: string } | null;
    instituicoes?: { nome: string } | null;
    servicos?: { nome: string } | null;
  } | null;
};

type GrupoEstagio = {
  edicaoId: number;
  titulo: string;
  local: string;
  anoLetivo: string;
  alunos: Inscricao[];
};

export default function ValidarPresencasProfessor() {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [loading, setLoading] = useState(true);

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
        aluno:utilizadores!inscricoes_estagio_aluno_id_fkey(nome, numero_identificacao),
        edicoes_estagio(
          id,
          ano_letivo,
          ensinos_clinicos(nome),
          instituicoes(nome),
          servicos(nome)
        )
      `)
      .eq("professor_id", authData.user.id)
      .neq("estado_estagio", "concluido")
      .order("id", { ascending: false });

    if (error) {
      console.log("ERRO PRESENÇAS PROFESSOR:", error);
      setInscricoes([]);
      
    } else {
      setInscricoes((data as any) || []);
      
    }

    setLoading(false);
    
  }


  useEffect(() => {
    carregarAlunos();
  }, []);

  function agruparPorEstagio(): GrupoEstagio[] {
    const grupos: GrupoEstagio[] = [];

    inscricoes.forEach((inscricao) => {
      const edicaoId = inscricao.edicoes_estagio?.id || 0;
      const existente = grupos.find((g) => g.edicaoId === edicaoId);

      if (existente) {
        existente.alunos.push(inscricao);
      } else {
        grupos.push({
          edicaoId,
          titulo:
            inscricao.edicoes_estagio?.ensinos_clinicos?.nome ||
            "Ensino Clínico",
          local: `${
            inscricao.edicoes_estagio?.instituicoes?.nome || "Instituição"
          } · ${inscricao.edicoes_estagio?.servicos?.nome || "Serviço"}`,
          anoLetivo: inscricao.edicoes_estagio?.ano_letivo || "Ano letivo",
          alunos: [inscricao],
        });
      }
    });

    return grupos;
  }

  const grupos = agruparPorEstagio();

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

        <Text style={styles.titulo}>Validar Presenças</Text>

        <Text style={styles.subtitulo}>
          Seleciona um aluno dentro do estágio para validar as presenças.
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#FDB515" style={{ marginTop: 30 }} />
        ) : grupos.length === 0 ? (
          <Text style={styles.textoVazio}>
            Ainda não tens estágios com alunos associados.
          </Text>
        ) : (
          <View style={styles.lista}>
            {grupos.map((grupo) => (
              <View key={grupo.edicaoId} style={styles.estagioCard}>
                <Text style={styles.cardTitulo}>{grupo.titulo}</Text>
                <Text style={styles.cardTexto}>{grupo.local}</Text>
                <Text style={styles.cardTexto}>{grupo.anoLetivo}</Text>

                <View style={styles.alunosLista}>
                  {grupo.alunos.map((inscricao) => (
                    <Pressable
                      key={inscricao.id}
                      style={styles.cardAluno}
                      onPress={() =>
                        router.push(
                          `/professor/presencas/aluno?inscricaoId=${inscricao.id}` as any
                        )
                      }
                    >
                      <View style={styles.cardIcone}>
                        <Ionicons name="person-outline" size={26} color="#160909" />
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.alunoNome}>
                          {inscricao.aluno?.nome || "Aluno"}
                        </Text>
                        <Text style={styles.alunoNumero}>
                          {inscricao?.aluno?.numero_identificacao || "-"}
                        </Text>
                      </View>

                      <Ionicons
                        name="chevron-forward-outline"
                        size={22}
                        color="#160909"
                      />
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}