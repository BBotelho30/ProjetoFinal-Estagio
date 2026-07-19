import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { supabase } from "../../../../lib/supabase";
import styles from "./detalhesAlunoStyles";

type Pessoa = {
  nome: string;
  email: string | null;
  foto_url: string | null;
};

type Aluno = {
  id: string;
  nome: string;
  email: string;
  foto_url: string | null;
  numero_identificacao: string | null;
  ano_curricular: number | null;
};

type Inscricao = {
  id: number;
  aluno_id: string;
  edicao_estagio_id: number;
  estado: string | null;
  estado_estagio: string | null;
  data_distribuicao: string | null;
  professor_id: string | null;
  orientador_id: string | null;
  professor?: Pessoa | null;
  orientador?: Pessoa | null;
};

type Edicao = {
  id: number;
  data_inicio: string | null;
  data_fim: string | null;
  ano_letivo: string | null;
  ensinos_clinicos?: {
    nome: string;
    ano_curricular: number;
    tipo: string | null;
    horas_estimadas: number | null;
  } | null;
  instituicoes?: {
    nome: string;
  } | null;
  servicos?: {
    nome: string;
  } | null;
};

type Avaliacao = {
  nota_orientador: number | null;
  nota_final: number | null;
  observacao_orientador: string | null;
  estado: string | null;
};

export default function DetalhesAlunoOrientador() {
  const params = useLocalSearchParams();

  const inscricaoId = params.inscricaoId ? Number(params.inscricaoId) : null;
  const alunoId = params.alunoId ? String(params.alunoId) : "";
  const edicaoId = params.edicaoId ? Number(params.edicaoId) : null;

  const [loading, setLoading] = useState(true);

  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [inscricao, setInscricao] = useState<Inscricao | null>(null);
  const [edicao, setEdicao] = useState<Edicao | null>(null);
  const [avaliacao, setAvaliacao] = useState<Avaliacao | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  function formatarData(data: string | null | undefined) {
    if (!data) return "Sem data";

    const date = new Date(data);

    if (Number.isNaN(date.getTime())) return "Sem data";

    return date.toLocaleDateString("pt-PT");
  }

  function textoEstado(estado: string | null | undefined) {
    if (estado === "concluido") return "Concluído";
    if (estado === "aguarda_relatorio") return "A aguardar relatório";
    if (estado === "aguarda_avaliacao") return "A aguardar avaliação";
    if (estado === "por_distribuir") return "Por distribuir";
    if (estado === "inativo") return "Inativo";

    return "Em curso";
  }

  function corEstado(estado: string | null | undefined) {
    if (estado === "concluido") return "#CDEFD6";
    if (estado === "aguarda_relatorio") return "#FDE8B4";
    if (estado === "aguarda_avaliacao") return "#DDEBFF";
    if (estado === "por_distribuir") return "#E9E9E9";
    if (estado === "inativo") return "#E9E9E9";

    return "#CDEFD6";
  }

  async function buscarProfessorDaEdicao(edicaoIdAtual: number) {
    const { data, error } = await supabase
      .from("professores_estagio")
      .select(`
        professor:utilizadores!professores_estagio_professor_id_fkey(
          nome,
          email,
          foto_url
        )
      `)
      .eq("edicao_estagio_id", edicaoIdAtual)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.log("ERRO PROFESSOR DA EDIÇÃO DETALHES:", error);
      return null;
    }

    return (data as any)?.professor || null;
  }

  async function buscarOrientadorDaEdicao(
    edicaoIdAtual: number,
    orientadorId: string
  ) {
    const { data, error } = await supabase
      .from("orientadores_estagio")
      .select(`
        orientador:utilizadores!orientadores_estagio_orientador_id_fkey(
          nome,
          email,
          foto_url
        )
      `)
      .eq("edicao_estagio_id", edicaoIdAtual)
      .eq("orientador_id", orientadorId)
      .maybeSingle();

    if (error) {
      console.log("ERRO ORIENTADOR DA EDIÇÃO DETALHES:", error);
      return null;
    }

    return (data as any)?.orientador || null;
  }

  async function verificarAcessoOrientador(
    orientadorId: string,
    edicaoIdAtual: number
  ) {
    const { data, error } = await supabase
      .from("orientadores_estagio")
      .select("id")
      .eq("orientador_id", orientadorId)
      .eq("edicao_estagio_id", edicaoIdAtual)
      .maybeSingle();

    if (error) {
      console.log("ERRO AO VERIFICAR ACESSO ORIENTADOR:", error);
      return false;
    }

    return Boolean(data);
  }

  async function carregarDados() {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace("/login/login" as any);
      return;
    }

    const orientadorId = authData.user.id;

    if (!inscricaoId || !alunoId || !edicaoId) {
      console.log("PARÂMETROS INVÁLIDOS DETALHES ALUNO:", params);
      setAluno(null);
      setInscricao(null);
      setEdicao(null);
      setAvaliacao(null);
      setLoading(false);
      return;
    }

    const temAcesso = await verificarAcessoOrientador(orientadorId, edicaoId);

    if (!temAcesso) {
      console.log("ORIENTADOR SEM ACESSO A ESTA EDIÇÃO:", {
        orientadorId,
        edicaoId,
      });

      setAluno(null);
      setInscricao(null);
      setEdicao(null);
      setAvaliacao(null);
      setLoading(false);
      return;
    }

    const { data: inscricaoData, error: inscricaoError } = await supabase
      .from("inscricoes_estagio")
      .select(
        `
        id,
        aluno_id,
        edicao_estagio_id,
        estado,
        estado_estagio,
        data_distribuicao,
        professor_id,
        orientador_id,
        professor:utilizadores!inscricoes_estagio_professor_id_fkey(nome, email, foto_url),
        orientador:utilizadores!inscricoes_estagio_orientador_id_fkey(nome, email, foto_url)
      `
      )
      .eq("id", inscricaoId)
      .eq("aluno_id", alunoId)
      .eq("edicao_estagio_id", edicaoId)
      .maybeSingle();

    if (inscricaoError || !inscricaoData) {
      console.log("ERRO INSCRIÇÃO DETALHE ORIENTADOR:", inscricaoError);
      setInscricao(null);
      setLoading(false);
      return;
    }

    const inscricaoBase = inscricaoData as any;

    if (
      inscricaoBase.estado === "rejeitado" ||
      inscricaoBase.estado_estagio === "inativo" ||
      inscricaoBase.estado_estagio === "por_distribuir"
    ) {
      console.log("INSCRIÇÃO SEM ACESSO/INATIVA:", inscricaoBase);
      setInscricao(null);
      setLoading(false);
      return;
    }

    let professorFinal = inscricaoBase.professor || null;
    let orientadorFinal = inscricaoBase.orientador || null;

    if (!professorFinal) {
      professorFinal = await buscarProfessorDaEdicao(edicaoId);
    }

    if (!orientadorFinal) {
      orientadorFinal = await buscarOrientadorDaEdicao(edicaoId, orientadorId);
    }

    const inscricaoFinal: Inscricao = {
      ...inscricaoBase,
      professor: professorFinal,
      orientador: orientadorFinal,
    };

    setInscricao(inscricaoFinal);

    const { data: alunoData, error: alunoError } = await supabase
      .from("utilizadores")
      .select("id, nome, email, foto_url, numero_identificacao, ano_curricular")
      .eq("id", alunoId)
      .maybeSingle();

    if (alunoError) {
      console.log("ERRO ALUNO DETALHE ORIENTADOR:", alunoError);
      setAluno(null);
    } else {
      setAluno((alunoData as any) || null);
    }

    const { data: edicaoData, error: edicaoError } = await supabase
      .from("edicoes_estagio")
      .select(
        `
        id,
        data_inicio,
        data_fim,
        ano_letivo,
        ensinos_clinicos(nome, ano_curricular, tipo, horas_estimadas),
        instituicoes(nome),
        servicos(nome)
      `
      )
      .eq("id", edicaoId)
      .maybeSingle();

    if (edicaoError) {
      console.log("ERRO EDIÇÃO DETALHE ORIENTADOR:", edicaoError);
      setEdicao(null);
    } else {
      setEdicao((edicaoData as any) || null);
    }

    const { data: avaliacaoData, error: avaliacaoError } = await supabase
      .from("avaliacoes")
      .select("nota_orientador, nota_final, observacao_orientador, estado")
      .eq("aluno_id", alunoId)
      .eq("edicao_estagio_id", edicaoId)
      .maybeSingle();

    if (avaliacaoError) {
      console.log("ERRO AVALIAÇÃO ORIENTADOR:", avaliacaoError);
      setAvaliacao(null);
    } else {
      setAvaliacao((avaliacaoData as any) || null);
    }

    setLoading(false);
  }

  function voltarPaginaAnterior() {
    router.replace({
      pathname: "/orientador/estagios/alunosEstagio/alunoEstagio" as any,
      params: {
        edicaoId: String(edicaoId || ""),
      },
    });
  }

  function irParaPresencas() {
    router.push({
      pathname: "/orientador/estagios/presencas/presencasAluno" as any,
      params: {
        inscricaoId: String(inscricao?.id || inscricaoId || ""),
        alunoId: String(inscricao?.aluno_id || alunoId || ""),
        edicaoId: String(inscricao?.edicao_estagio_id || edicaoId || ""),
        origem: "detalhesAluno",
      },
    });
  }

  function irParaAvaliacao() {
    router.push({
      pathname: "/orientador/estagios/avaliacoes/avaliacaoAluno" as any,
      params: {
        inscricaoId: String(inscricao?.id || inscricaoId || ""),
        alunoId: String(inscricao?.aluno_id || alunoId || ""),
        edicaoId: String(inscricao?.edicao_estagio_id || edicaoId || ""),
        origem: "detalhesAluno",
      },
    });
  }

  function irParaReuniao() {
    router.push({
      pathname: "/orientador/estagios/agenda/criarReuniao" as any,
      params: {
        inscricaoId: String(inscricao?.id || inscricaoId || ""),
        alunoId: String(inscricao?.aluno_id || alunoId || ""),
        edicaoId: String(inscricao?.edicao_estagio_id || edicaoId || ""),
        origem: "detalhesAluno",
      },
    });
  }

  function irParaComentarios() {
    router.push({
      pathname:
        "/orientador/estagios/comentariosSemanais/comentariosSemanais" as any,
      params: {
        inscricaoId: String(inscricao?.id || inscricaoId || ""),
        alunoId: String(inscricao?.aluno_id || alunoId || ""),
        edicaoId: String(inscricao?.edicao_estagio_id || edicaoId || ""),
        origem: "detalhesAluno",
      },
    });
  }

  function irParaRelatorios() {
    router.push({
      pathname: "/orientador/estagios/relatorios/relatorios" as any,
      params: {
        inscricaoId: String(inscricao?.id || inscricaoId || ""),
        alunoId: String(inscricao?.aluno_id || alunoId || ""),
        edicaoId: String(inscricao?.edicao_estagio_id || edicaoId || ""),
        origem: "detalhesAluno",
      },
    });
  }

  if (loading) {
    return (
      <View style={styles.page}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FDB515" />
        </View>
      </View>
    );
  }

  if (!aluno || !inscricao || !edicao) {
    return (
      <View style={styles.page}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
        >
          <Pressable style={styles.voltar} onPress={voltarPaginaAnterior}>
            <Ionicons name="arrow-back-outline" size={24} color="#160909" />
            <Text style={styles.voltarTexto}>Voltar</Text>
          </Pressable>

          <View style={styles.alunoCard}>
            <View style={styles.alunoIcone}>
              <Ionicons name="alert-circle-outline" size={36} color="#160909" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.alunoNome}>Dados indisponíveis</Text>

              <Text style={styles.alunoTexto}>
                Não foi possível carregar as informações deste aluno.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Pressable style={styles.voltar} onPress={voltarPaginaAnterior}>
          <Ionicons name="arrow-back-outline" size={24} color="#160909" />
          <Text style={styles.voltarTexto}>Voltar</Text>
        </Pressable>

        <View style={styles.alunoCard}>
          {aluno.foto_url ? (
            <Image source={{ uri: aluno.foto_url }} style={styles.fotoAluno} />
          ) : (
            <View style={styles.alunoIcone}>
              <Ionicons name="person-outline" size={36} color="#160909" />
            </View>
          )}

          <View style={{ flex: 1 }}>
            <Text style={styles.alunoNome}>{aluno.nome || "Aluno"}</Text>

            <Text style={styles.alunoTexto}>{aluno.email || "Sem email"}</Text>

            <Text style={styles.alunoTexto}>
              Nº {aluno.numero_identificacao || "N/A"} ·{" "}
              {aluno.ano_curricular || "N/A"}.º ano
            </Text>

            <View
              style={[
                styles.alunoBadge,
                {
                  backgroundColor: corEstado(inscricao.estado_estagio),
                },
              ]}
            >
              <Text style={styles.alunoBadgeTexto}>
                {textoEstado(inscricao.estado_estagio)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.estagioHero}>
          <Text style={styles.estagioHeroTitulo}>
            {edicao.ensinos_clinicos?.nome || "Ensino Clínico"}
          </Text>

          <Text style={styles.estagioHeroTexto}>
            {edicao.instituicoes?.nome || "Instituição"}
          </Text>

          <Text style={styles.estagioHeroTexto}>
            {edicao.servicos?.nome || "Serviço"}
          </Text>

          <Text style={styles.estagioHeroTexto}>
            {formatarData(edicao.data_inicio)} - {formatarData(edicao.data_fim)}
          </Text>

          <View style={styles.estagioHeroBadge}>
            <Text style={styles.estagioHeroBadgeTexto}>
              {textoEstado(inscricao.estado_estagio)}
            </Text>
          </View>
        </View>

        <Text style={styles.secaoTitulo}>Equipa</Text>

        <View style={styles.pessoaCard}>
          {inscricao.professor?.foto_url ? (
            <Image
              source={{ uri: inscricao.professor.foto_url }}
              style={styles.pessoaFoto}
            />
          ) : (
            <View style={styles.pessoaIcone}>
              <Ionicons
                name="person-circle-outline"
                size={54}
                color="#FDB515"
              />
            </View>
          )}

          <View style={{ flex: 1 }}>
            <Text style={styles.pessoaLabel}>Professor Orientador</Text>
            <Text style={styles.pessoaNome}>
              {inscricao.professor?.nome || "Não indicado"}
            </Text>

            {inscricao.professor?.email ? (
              <Text style={styles.alunoTexto}>{inscricao.professor.email}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.pessoaCard}>
          {inscricao.orientador?.foto_url ? (
            <Image
              source={{ uri: inscricao.orientador.foto_url }}
              style={styles.pessoaFoto}
            />
          ) : (
            <View style={styles.pessoaIcone}>
              <Ionicons
                name="person-circle-outline"
                size={54}
                color="#FDB515"
              />
            </View>
          )}

          <View style={{ flex: 1 }}>
            <Text style={styles.pessoaLabel}>Orientador de Estágio</Text>
            <Text style={styles.pessoaNome}>
              {inscricao.orientador?.nome || "Não indicado"}
            </Text>

            {inscricao.orientador?.email ? (
              <Text style={styles.alunoTexto}>{inscricao.orientador.email}</Text>
            ) : null}
          </View>
        </View>

        <Text style={styles.secaoTitulo}>Informações</Text>

        <View style={styles.infoGrid}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Ano curricular</Text>
            <Text style={styles.infoValor}>
              {edicao.ensinos_clinicos?.ano_curricular || "N/A"}.º ano
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Tipo</Text>
            <Text style={styles.infoValor}>
              {edicao.ensinos_clinicos?.tipo || "Não indicado"}
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Horas</Text>
            <Text style={styles.infoValor}>
              {edicao.ensinos_clinicos?.horas_estimadas || 0}h
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Ano letivo</Text>
            <Text style={styles.infoValor}>
              {edicao.ano_letivo || "Não indicado"}
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Data distribuição</Text>
            <Text style={styles.infoValor}>
              {formatarData(inscricao.data_distribuicao)}
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Estado</Text>
            <Text style={styles.infoValor}>
              {textoEstado(inscricao.estado_estagio)}
            </Text>
          </View>
        </View>

        <Text style={styles.secaoTitulo}>Avaliação</Text>

        <View style={styles.avaliacaoCard}>
          {avaliacao?.nota_orientador || avaliacao?.nota_final ? (
            <>
              <Text style={styles.avaliacaoNota}>
                {avaliacao.nota_orientador || avaliacao.nota_final} valores
              </Text>

              <Text style={styles.avaliacaoTexto}>
                {avaliacao.observacao_orientador || "Sem observações."}
              </Text>
            </>
          ) : (
            <Text style={styles.avaliacaoTexto}>
              A avaliação ainda não está disponível.
            </Text>
          )}
        </View>

        <Text style={styles.secaoTitulo}>Ações rápidas</Text>

        <View style={styles.acoesLista}>
          <Pressable style={styles.acaoCard} onPress={irParaPresencas}>
            <Ionicons name="calendar-outline" size={24} color="#160909" />
            <Text style={styles.acaoTexto}>Validar presenças</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={24}
              color="#160909"
            />
          </Pressable>

          <Pressable style={styles.acaoCard} onPress={irParaAvaliacao}>
            <Ionicons name="star-outline" size={24} color="#160909" />
            <Text style={styles.acaoTexto}>Dar nota</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={24}
              color="#160909"
            />
          </Pressable>

          <Pressable style={styles.acaoCard} onPress={irParaReuniao}>
            <Ionicons name="time-outline" size={24} color="#160909" />
            <Text style={styles.acaoTexto}>Agendar reunião</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={24}
              color="#160909"
            />
          </Pressable>

          <Pressable style={styles.acaoCard} onPress={irParaComentarios}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color="#160909"
            />
            <Text style={styles.acaoTexto}>Comentários semanais</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={24}
              color="#160909"
            />
          </Pressable>

          <Pressable style={styles.acaoCard} onPress={irParaRelatorios}>
            <Ionicons
              name="document-text-outline"
              size={24}
              color="#160909"
            />
            <Text style={styles.acaoTexto}>Relatórios e anexos</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={24}
              color="#160909"
            />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}