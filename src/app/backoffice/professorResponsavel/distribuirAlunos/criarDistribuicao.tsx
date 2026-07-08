import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../../../../lib/supabase";
import styles from "./criarDistribuicaoStyles";

type EnsinoResponsavel = {
  ensino_clinico_id: number;
};

type Edicao = {
  id: number;
  ensino_clinico_id: number;
  vagas: number;
  ano_letivo: string | null;
  estado: string | null;
  ensinos_clinicos?: {
    nome: string;
    ano_curricular: number;
  } | null;
  instituicoes?: {
    nome: string;
  } | null;
  servicos?: {
    nome: string;
  } | null;
};

type Aluno = {
  id: string;
  nome: string;
  email: string;
  numero_identificacao: string | null;
  ano_curricular: number | null;
};

type Inscricao = {
  id: number;
  aluno_id: string;
  edicao_estagio_id: number;
  estado: string | null;
  estado_estagio: string | null;
  distribuido_por: string | null;
  data_distribuicao: string | null;
};

type InscricaoAlunoCompleta = {
  id: number;
  aluno_id: string;
  edicao_estagio_id: number;
  estado: string | null;
  estado_estagio: string | null;
  edicoes_estagio?: {
    id: number;
    ensinos_clinicos?: {
      nome: string;
      ano_curricular: number;
    } | null;
  } | null;
};

export default function CriarDistribuicaoProfessorResponsavel() {
  const params = useLocalSearchParams();
  const inscricaoIdParam = params.inscricaoId ? Number(params.inscricaoId) : null;

  const [sidebarAberta, setSidebarAberta] = useState(true);

  const [userId, setUserId] = useState<string | null>(null);

  const [edicoes, setEdicoes] = useState<Edicao[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [inscricoesAlunosTodas, setInscricoesAlunosTodas] = useState<
    InscricaoAlunoCompleta[]
  >([]);

  const [edicaoSelecionada, setEdicaoSelecionada] = useState<number | null>(
    null
  );
  const [alunosSelecionados, setAlunosSelecionados] = useState<string[]>([]);

  const [pesquisaAluno, setPesquisaAluno] = useState("");

  const [edicoesOpen, setEdicoesOpen] = useState(false);
  const [alunosOpen, setAlunosOpen] = useState(true);

  const [loading, setLoading] = useState(true);
  const [aGuardar, setAGuardar] = useState(false);

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTipo, setPopupTipo] = useState<"normal" | "sair">("normal");

  useEffect(() => {
    carregarDados();
  }, []);

  function abrirPopup(
    titulo: string,
    mensagem: string,
    tipo: "normal" | "sair" = "normal"
  ) {
    setPopupTitle(titulo);
    setPopupMessage(mensagem);
    setPopupTipo(tipo);
    setPopupVisible(true);
  }

  async function carregarDados() {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    if (!user) {
      setLoading(false);
      router.replace("/backoffice/superadmin/login/login" as any);
      return;
    }

    setUserId(user.id);

    const { data: responsaveisData, error: responsaveisError } = await supabase
      .from("responsaveis_ensinos_clinicos")
      .select("ensino_clinico_id")
      .eq("professor_id", user.id);

    if (responsaveisError) {
      console.log("ERRO RESPONSÁVEIS:", responsaveisError);
      abrirPopup("Erro", "Não foi possível carregar os ensinos que coordenas.");
      setLoading(false);
      return;
    }

    const ensinosIds =
      (responsaveisData as EnsinoResponsavel[] | null)?.map(
        (item) => item.ensino_clinico_id
      ) || [];

    if (ensinosIds.length === 0) {
      setEdicoes([]);
      setAlunos([]);
      setInscricoes([]);
      setInscricoesAlunosTodas([]);
      setLoading(false);
      return;
    }

    const { data: edicoesData, error: edicoesError } = await supabase
      .from("edicoes_estagio")
      .select(
        `
        id,
        ensino_clinico_id,
        vagas,
        ano_letivo,
        estado,
        ensinos_clinicos(nome, ano_curricular),
        instituicoes(nome),
        servicos(nome)
      `
      )
      .in("ensino_clinico_id", ensinosIds)
      .neq("estado", "inativo")
      .order("id", { ascending: false });

    const { data: alunosData, error: alunosError } = await supabase
      .from("utilizadores")
      .select("id, nome, email, numero_identificacao, ano_curricular")
      .eq("tipo", "aluno")
      .eq("estado", "aprovado")
      .neq("ativo", false)
      .order("nome", { ascending: true });

    if (edicoesError || alunosError) {
      console.log("ERRO AO CARREGAR DADOS:", edicoesError || alunosError);
      abrirPopup("Erro", "Não foi possível carregar os dados.");
      setLoading(false);
      return;
    }

    const listaEdicoes = ((edicoesData as any) || []) as Edicao[];
    const listaAlunos = ((alunosData as any) || []) as Aluno[];
    const edicoesIds = listaEdicoes.map((edicao) => edicao.id);

    setEdicoes(listaEdicoes);
    setAlunos(listaAlunos);

    const alunosIds = listaAlunos.map((aluno) => aluno.id);

    if (alunosIds.length > 0) {
      const { data: todasInscricoesData, error: todasInscricoesError } =
        await supabase
          .from("inscricoes_estagio")
          .select(
            `
            id,
            aluno_id,
            edicao_estagio_id,
            estado,
            estado_estagio,
            edicoes_estagio(
              id,
              ensinos_clinicos(nome, ano_curricular)
            )
          `
          )
          .in("aluno_id", alunosIds)
          .eq("estado", "aprovado")
          .neq("estado_estagio", "inativo");

      if (todasInscricoesError) {
        console.log("ERRO TODAS INSCRIÇÕES:", todasInscricoesError);
      } else {
        setInscricoesAlunosTodas((todasInscricoesData as any) || []);
      }
    }

    if (edicoesIds.length === 0) {
      setInscricoes([]);
      setLoading(false);
      return;
    }

    const { data: inscricoesData, error: inscricoesError } = await supabase
      .from("inscricoes_estagio")
      .select(
        `
        id,
        aluno_id,
        edicao_estagio_id,
        estado,
        estado_estagio,
        distribuido_por,
        data_distribuicao
      `
      )
      .in("edicao_estagio_id", edicoesIds);

    if (inscricoesError) {
      console.log("ERRO INSCRIÇÕES:", inscricoesError);
      abrirPopup("Erro", "Não foi possível carregar inscrições existentes.");
      setLoading(false);
      return;
    }

    const listaInscricoes = ((inscricoesData as any) || []) as Inscricao[];
    setInscricoes(listaInscricoes);

    if (inscricaoIdParam) {
      const inscricaoAtual = listaInscricoes.find(
        (item) => item.id === inscricaoIdParam
      );

      if (inscricaoAtual) {
        setEdicaoSelecionada(inscricaoAtual.edicao_estagio_id);
        setAlunosSelecionados([inscricaoAtual.aluno_id]);
      }
    }

    setLoading(false);
  }

  const edicaoAtual = useMemo(() => {
    if (!edicaoSelecionada) return null;
    return edicoes.find((edicao) => edicao.id === edicaoSelecionada) || null;
  }, [edicoes, edicaoSelecionada]);

  const inscricoesDaEdicao = useMemo(() => {
    if (!edicaoSelecionada) return [];
    return inscricoes.filter(
      (inscricao) => inscricao.edicao_estagio_id === edicaoSelecionada
    );
  }, [inscricoes, edicaoSelecionada]);

  function alunoJaDistribuido(alunoId: string) {
    return inscricoesDaEdicao.some(
      (inscricao) =>
        inscricao.aluno_id === alunoId &&
        inscricao.estado !== "rejeitado" &&
        inscricao.estado_estagio !== "inativo" &&
        (inscricao.estado === "aprovado" ||
          inscricao.estado_estagio === "em_curso")
    );
  }

  function alunoSelecionado(alunoId: string) {
    return alunosSelecionados.includes(alunoId);
  }

  function totalDistribuidosNaEdicao() {
    return inscricoesDaEdicao.filter(
      (inscricao) =>
        inscricao.estado !== "rejeitado" &&
        inscricao.estado_estagio !== "inativo" &&
        (inscricao.estado === "aprovado" ||
          inscricao.estado_estagio === "em_curso")
    ).length;
  }

  function vagasDisponiveis() {
    if (!edicaoAtual) return 0;

    const jaDistribuidos = totalDistribuidosNaEdicao();
    const novosSelecionados = alunosSelecionados.filter(
      (alunoId) => !alunoJaDistribuido(alunoId)
    ).length;

    return Math.max(
      0,
      Number(edicaoAtual.vagas || 0) - jaDistribuidos - novosSelecionados
    );
  }

  function textoEdicaoSelecionada() {
    if (!edicaoAtual) return "Selecionar estágio";

    return `${edicaoAtual.ensinos_clinicos?.nome || "Ensino Clínico"} - ${
      edicaoAtual.instituicoes?.nome || "Instituição"
    } / ${edicaoAtual.servicos?.nome || "Serviço"}`;
  }

  function textoAlunosSelecionados() {
    if (alunosSelecionados.length === 0) return "Nenhum aluno selecionado";

    if (alunosSelecionados.length === 1) {
      const aluno = alunos.find((item) => item.id === alunosSelecionados[0]);
      return aluno?.nome || "1 aluno selecionado";
    }

    return `${alunosSelecionados.length} alunos selecionados`;
  }

  function textoEstagiosAluno(alunoId: string) {
    const lista = inscricoesAlunosTodas.filter(
      (inscricao) =>
        inscricao.aluno_id === alunoId &&
        inscricao.estado === "aprovado" &&
        inscricao.estado_estagio !== "inativo"
    );

    if (lista.length === 0) {
      return "Ainda não distribuído noutros estágios";
    }

    const nomes = lista.map((inscricao) => {
      const ano = inscricao.edicoes_estagio?.ensinos_clinicos?.ano_curricular;
      const nome = inscricao.edicoes_estagio?.ensinos_clinicos?.nome;

      if (ano && nome) return `${ano}.º ano - ${nome}`;
      if (ano) return `${ano}.º ano`;
      if (nome) return nome;

      return "Estágio sem nome";
    });

    return `Já distribuído em: ${nomes.join(" · ")}`;
  }

  function toggleAluno(alunoId: string) {
    if (inscricaoIdParam) {
      setAlunosSelecionados([alunoId]);
      return;
    }

    if (alunosSelecionados.includes(alunoId)) {
      setAlunosSelecionados(alunosSelecionados.filter((id) => id !== alunoId));
    } else {
      setAlunosSelecionados([...alunosSelecionados, alunoId]);
    }
  }

  function limparAlunosSelecionados() {
    setAlunosSelecionados([]);
  }

  const alunosFiltrados = useMemo(() => {
    const termo = pesquisaAluno.toLowerCase().trim();

    return alunos.filter((aluno) => {
      const texto = `
        ${aluno.nome || ""}
        ${aluno.email || ""}
        ${aluno.numero_identificacao || ""}
        ${aluno.ano_curricular || ""}
        ${textoEstagiosAluno(aluno.id)}
      `.toLowerCase();

      const passaPesquisa = !termo || texto.includes(termo);

      const passaAno =
        !edicaoAtual ||
        !edicaoAtual.ensinos_clinicos?.ano_curricular ||
        !aluno.ano_curricular ||
        Number(aluno.ano_curricular) ===
          Number(edicaoAtual.ensinos_clinicos.ano_curricular);

      return passaPesquisa && passaAno;
    });
  }, [alunos, pesquisaAluno, edicaoAtual, inscricoesAlunosTodas]);

  async function guardarDistribuicao() {
    if (aGuardar) return;

    if (!userId) {
      abrirPopup("Erro", "Não foi possível identificar o utilizador.");
      return;
    }

    if (!edicaoSelecionada) {
      abrirPopup("Erro", "Seleciona um estágio.");
      return;
    }

    if (alunosSelecionados.length === 0) {
      abrirPopup("Erro", "Seleciona pelo menos um aluno.");
      return;
    }

    if (vagasDisponiveis() < 0) {
      abrirPopup("Erro", "O número de alunos selecionados ultrapassa as vagas.");
      return;
    }

    setAGuardar(true);

    for (const alunoId of alunosSelecionados) {
      const inscricaoExistente = inscricoes.find(
        (inscricao) =>
          inscricao.aluno_id === alunoId &&
          inscricao.edicao_estagio_id === edicaoSelecionada
      );

      if (inscricaoExistente) {
        const { error } = await supabase
          .from("inscricoes_estagio")
          .update({
            estado: "aprovado",
            estado_estagio: "em_curso",
            professor_responsavel_id: userId,
            distribuido_por: "professor_responsavel",
            data_distribuicao: new Date().toISOString(),
            utilizador_distribuicao_id: userId,
          })
          .eq("id", inscricaoExistente.id);

        if (error) {
          console.log("ERRO UPDATE DISTRIBUIÇÃO:", error);
          abrirPopup("Erro", error.message);
          setAGuardar(false);
          return;
        }
      } else {
        const { error } = await supabase.from("inscricoes_estagio").insert({
          aluno_id: alunoId,
          edicao_estagio_id: edicaoSelecionada,
          estado: "aprovado",
          estado_estagio: "em_curso",
          professor_responsavel_id: userId,
          distribuido_por: "professor_responsavel",
          data_distribuicao: new Date().toISOString(),
          utilizador_distribuicao_id: userId,
        });

        if (error) {
          console.log("ERRO INSERT DISTRIBUIÇÃO:", error);
          abrirPopup("Erro", error.message);
          setAGuardar(false);
          return;
        }
      }
    }

    setAGuardar(false);

    abrirPopup(
      "Sucesso",
      alunosSelecionados.length === 1
        ? "Aluno distribuído com sucesso."
        : `${alunosSelecionados.length} alunos distribuídos com sucesso.`
    );

    setTimeout(() => {
      router.push(
        "/backoffice/professorResponsavel/distribuirAlunos/distribuirAlunos" as any
      );
    }, 900);
  }

  async function terminarSessao() {
    setPopupVisible(false);
    await supabase.auth.signOut();
    router.replace("/backoffice/superadmin/login/login" as any);
  }

  return (
    <View style={styles.page}>
      <View style={[styles.sidebar, !sidebarAberta && styles.sidebarFechada]}>
        <View style={styles.sidebarTop}>
          <Pressable
            style={styles.menuButton}
            onPress={() => setSidebarAberta(!sidebarAberta)}
          >
            <Ionicons
              name={sidebarAberta ? "chevron-back-outline" : "menu-outline"}
              size={26}
              color="#FDB515"
            />
          </Pressable>

          {sidebarAberta && (
            <View style={styles.sidebarHeader}>
              <View style={styles.logoCircle}>
                <Image
                  source={require("../../../../../assets/images/enf.jpg")}
                  style={styles.logoSidebar}
                  resizeMode="cover"
                />
              </View>

              <Text style={styles.sidebarTitle}>Passaporte</Text>
              <Text style={styles.sidebarSubtitle}>Enfermagem</Text>
            </View>
          )}
        </View>

        <ScrollView
          style={styles.menuScroll}
          contentContainerStyle={styles.menu}
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            style={styles.menuItem}
            onPress={() =>
              router.push("/backoffice/professorResponsavel/home" as any)
            }
          >
            <Ionicons name="home-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && <Text style={styles.menuText}>Dashboard</Text>}
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() =>
              router.push(
                "/backoffice/professorResponsavel/equipasEstagio/equipasEstagio" as any
              )
            }
          >
            <Ionicons name="people-circle-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && <Text style={styles.menuText}>Equipas</Text>}
          </Pressable>

          <Pressable
            style={[styles.menuItem, styles.menuItemActive]}
            onPress={() =>
              router.push(
                "/backoffice/professorResponsavel/distribuirAlunos/distribuirAlunos" as any
              )
            }
          >
            <Ionicons name="git-branch-outline" size={23} color="#160909" />
            {sidebarAberta && (
              <Text style={[styles.menuText, styles.menuTextActive]}>
                Distribuir Alunos
              </Text>
            )}
          </Pressable>
        </ScrollView>

        <View style={styles.sidebarFooter}>
          <Pressable
            style={styles.footerButton}
            onPress={() =>
              router.push("/backoffice/professorResponsavel/perfil/perfil" as any)
            }
          >
            <Ionicons name="person-circle-outline" size={24} color="#FDB515" />
            {sidebarAberta && <Text style={styles.footerText}>Perfil</Text>}
          </Pressable>

          <Pressable
            style={styles.footerButton}
            onPress={() =>
              abrirPopup(
                "Terminar sessão",
                "Tens a certeza que queres terminar sessão?",
                "sair"
              )
            }
          >
            <Ionicons name="log-out-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && <Text style={styles.footerText}>Sair</Text>}
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Pressable
              style={styles.botaoVoltarHome}
              onPress={() =>
                router.push(
                  "/backoffice/professorResponsavel/distribuirAlunos/distribuirAlunos" as any
                )
              }
            >
              <Ionicons name="arrow-back-outline" size={22} color="#160909" />
            </Pressable>

            <View>
              <Text style={styles.titulo}>
                {inscricaoIdParam ? "Editar Distribuição" : "Nova Distribuição"}
              </Text>
              <Text style={styles.subtitulo}>
                Associar alunos aos estágios que coordenas.
              </Text>
            </View>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FDB515"
            style={{ marginTop: 40 }}
          />
        ) : (
          <View style={styles.formCard}>
            <Text style={styles.modalTitulo}>Dados da Distribuição</Text>

            <Text style={styles.label}>Estágio</Text>

            <Pressable
              style={styles.selectToggle}
              onPress={() => {
                setEdicoesOpen(!edicoesOpen);
                setAlunosOpen(false);
              }}
            >
              <Text style={styles.selectToggleText}>
                {textoEdicaoSelecionada()}
              </Text>
              <Ionicons
                name={edicoesOpen ? "chevron-up-outline" : "chevron-down-outline"}
                size={22}
                color="#160909"
              />
            </Pressable>

            {edicoesOpen && (
              <ScrollView style={styles.pickerListaGrande} nestedScrollEnabled>
                {edicoes.length === 0 ? (
                  <Text style={styles.textoVazio}>
                    Não existem estágios disponíveis.
                  </Text>
                ) : (
                  edicoes.map((edicao) => {
                    const selecionada = edicaoSelecionada === edicao.id;

                    return (
                      <Pressable
                        key={edicao.id}
                        style={[
                          styles.opcao,
                          selecionada && styles.opcaoSelecionada,
                        ]}
                        onPress={() => {
                          setEdicaoSelecionada(edicao.id);
                          setAlunosSelecionados([]);
                          setEdicoesOpen(false);
                          setAlunosOpen(true);
                        }}
                      >
                        <View style={styles.opcaoLinha}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.opcaoTitulo}>
                              {edicao.ensinos_clinicos?.nome || "Ensino Clínico"}
                            </Text>

                            <Text style={styles.opcaoTexto}>
                              {edicao.instituicoes?.nome || "Instituição"} /{" "}
                              {edicao.servicos?.nome || "Serviço"} ·{" "}
                              {edicao.ensinos_clinicos?.ano_curricular || "N/A"}
                              .º ano · {edicao.vagas} vagas ·{" "}
                              {edicao.ano_letivo || "Sem ano letivo"}
                            </Text>
                          </View>

                          <Ionicons
                            name={
                              selecionada
                                ? "radio-button-on-outline"
                                : "radio-button-off-outline"
                            }
                            size={24}
                            color="#160909"
                          />
                        </View>
                      </Pressable>
                    );
                  })
                )}
              </ScrollView>
            )}

            {edicaoAtual && (
              <View style={styles.infoBox}>
                <Ionicons
                  name="information-circle-outline"
                  size={24}
                  color="#B77900"
                />

                <View style={{ flex: 1 }}>
                  <Text style={styles.infoTitulo}>Resumo do estágio</Text>
                  <Text style={styles.infoTexto}>
                    {edicaoAtual.instituicoes?.nome || "Instituição"} /{" "}
                    {edicaoAtual.servicos?.nome || "Serviço"}
                  </Text>
                  <Text style={styles.infoTexto}>
                    Vagas: {edicaoAtual.vagas} · Já distribuídos:{" "}
                    {totalDistribuidosNaEdicao()} · Disponíveis após seleção:{" "}
                    {vagasDisponiveis()}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.labelLinha}>
              <Text style={styles.label}>Alunos</Text>

              <Pressable
                style={styles.limparBotao}
                onPress={limparAlunosSelecionados}
              >
                <Ionicons name="close-outline" size={17} color="#160909" />
                <Text style={styles.limparBotaoTexto}>Limpar</Text>
              </Pressable>
            </View>

            <Pressable
              style={styles.selectToggle}
              onPress={() => setAlunosOpen(!alunosOpen)}
            >
              <Text style={styles.selectToggleText}>
                {textoAlunosSelecionados()}
              </Text>
              <Ionicons
                name={alunosOpen ? "chevron-up-outline" : "chevron-down-outline"}
                size={22}
                color="#160909"
              />
            </Pressable>

            {alunosOpen && (
              <View style={styles.alunosBox}>
                <View style={styles.searchContainer}>
                  <Ionicons name="search-outline" size={21} color="#667085" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Pesquisar aluno por nome, email, número ou estágio..."
                    placeholderTextColor="#8c8787"
                    value={pesquisaAluno}
                    onChangeText={setPesquisaAluno}
                  />
                </View>

                <ScrollView style={styles.pickerListaAlunos} nestedScrollEnabled>
                  {!edicaoSelecionada ? (
                    <View style={styles.avisoBox}>
                      <Ionicons
                        name="information-circle-outline"
                        size={22}
                        color="#B77900"
                      />
                      <Text style={styles.avisoTexto}>
                        Seleciona primeiro um estágio para filtrar os alunos pelo
                        ano curricular.
                      </Text>
                    </View>
                  ) : alunosFiltrados.length === 0 ? (
                    <Text style={styles.textoVazio}>
                      Não existem alunos disponíveis para este estágio.
                    </Text>
                  ) : (
                    alunosFiltrados.map((aluno) => {
                      const selecionado = alunoSelecionado(aluno.id);
                      const jaDistribuido = alunoJaDistribuido(aluno.id);

                      return (
                        <Pressable
                          key={aluno.id}
                          style={[
                            styles.opcao,
                            selecionado && styles.opcaoSelecionada,
                            jaDistribuido && styles.opcaoJaDistribuida,
                          ]}
                          onPress={() => toggleAluno(aluno.id)}
                        >
                          <View style={styles.opcaoLinha}>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.opcaoTitulo}>{aluno.nome}</Text>

                              <Text style={styles.opcaoTexto}>
                                {aluno.email}
                                {aluno.numero_identificacao
                                  ? ` · Nº ${aluno.numero_identificacao}`
                                  : ""}
                              </Text>

                              <Text
                                style={[
                                  styles.estadoAlunoTexto,
                                  jaDistribuido &&
                                    styles.estadoAlunoTextoDistribuido,
                                ]}
                              >
                                {jaDistribuido
                                  ? "Já distribuído neste estágio"
                                  : `${aluno.ano_curricular || "N/A"}.º ano`}
                              </Text>

                              <Text style={styles.estagiosAlunoTexto}>
                                {textoEstagiosAluno(aluno.id)}
                              </Text>
                            </View>

                            <Ionicons
                              name={
                                selecionado
                                  ? "checkbox-outline"
                                  : "square-outline"
                              }
                              size={24}
                              color="#160909"
                            />
                          </View>
                        </Pressable>
                      );
                    })
                  )}
                </ScrollView>
              </View>
            )}

            <View style={styles.popupBotoesLinha}>
              <Pressable
                style={styles.popupBotaoCancelar}
                onPress={() =>
                  router.push(
                    "/backoffice/professorResponsavel/distribuirAlunos/distribuirAlunos" as any
                  )
                }
              >
                <Text style={styles.popupTextoCancelar}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={styles.popupBotaoConfirmar}
                onPress={guardarDistribuicao}
                disabled={aGuardar}
              >
                <Text style={styles.popupTextoConfirmar}>
                  {aGuardar ? "A guardar..." : "Guardar distribuição"}
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={popupVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPopupVisible(false)}
      >
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>{popupTitle}</Text>
            <Text style={styles.popupMessage}>{popupMessage}</Text>

            {popupTipo === "sair" ? (
              <View style={styles.popupBotoesLinha}>
                <Pressable
                  style={styles.popupBotaoCancelar}
                  onPress={() => setPopupVisible(false)}
                >
                  <Text style={styles.popupTextoCancelar}>Cancelar</Text>
                </Pressable>

                <Pressable style={styles.popupBotaoSair} onPress={terminarSessao}>
                  <Text style={styles.popupTextoSair}>Sair</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={styles.popupOkButton}
                onPress={() => setPopupVisible(false)}
              >
                <Text style={styles.popupOkText}>OK</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}