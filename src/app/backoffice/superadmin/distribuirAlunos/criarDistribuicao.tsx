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
import { useContasPendentes } from "../contasPendentes";
import styles from "./criarDistribuicaoStyles";

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

type Utilizador = {
  id: string;
  nome: string;
  email: string;
  numero_identificacao: string | null;
  ano_curricular: number | null;
};

type InscricaoExistente = {
  id: number;
  aluno_id: string;
  edicao_estagio_id: number;
  professor_id: string | null;
  orientador_id: string | null;
  professor_responsavel_id: string | null;
  distribuido_por: string | null;
  data_distribuicao: string | null;
  estado: string | null;
  estado_estagio: string | null;
};

type ProfessorEstagio = {
  id: number;
  professor_id: string;
  edicao_estagio_id: number;
  utilizadores?: {
    nome: string;
  } | null;
};

type OrientadorEstagio = {
  id: number;
  orientador_id: string;
  edicao_estagio_id: number;
  utilizadores?: {
    nome: string;
  } | null;
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

export default function CriarDistribuicao() {
  const params = useLocalSearchParams();
  const inscricaoId = params.inscricaoId ? Number(params.inscricaoId) : null;

  const [sidebarAberta, setSidebarAberta] = useState(true);
  const contasPendentes = useContasPendentes();

  const [edicoes, setEdicoes] = useState<Edicao[]>([]);
  const [alunos, setAlunos] = useState<Utilizador[]>([]);
  const [inscricoesExistentes, setInscricoesExistentes] = useState<
    InscricaoExistente[]
  >([]);
  const [inscricoesAlunosTodas, setInscricoesAlunosTodas] = useState<
    InscricaoAlunoCompleta[]
  >([]);

  const [professoresEstagio, setProfessoresEstagio] = useState<
    ProfessorEstagio[]
  >([]);
  const [orientadoresEstagio, setOrientadoresEstagio] = useState<
    OrientadorEstagio[]
  >([]);

  const [edicaoSelecionada, setEdicaoSelecionada] = useState<number | null>(
    null,
  );
  const [alunosSelecionados, setAlunosSelecionados] = useState<string[]>([]);

  const [mostrarEdicoes, setMostrarEdicoes] = useState(false);

  const [pesquisaAluno, setPesquisaAluno] = useState("");
  const [filtroAnoAluno, setFiltroAnoAluno] = useState("estagio");
  const [filtroAnoAberto, setFiltroAnoAberto] = useState(false);

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
    tipo: "normal" | "sair" = "normal",
  ) {
    setPopupTitle(titulo);
    setPopupMessage(mensagem);
    setPopupTipo(tipo);
    setPopupVisible(true);
  }

  async function carregarDados() {
    setLoading(true);

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
      `,
      )
      .neq("estado", "inativo")
      .order("id", { ascending: false });

    const { data: alunosData, error: alunosError } = await supabase
      .from("utilizadores")
      .select("id, nome, email, numero_identificacao, ano_curricular")
      .eq("tipo", "aluno")
      .eq("estado", "aprovado")
      .neq("ativo", false)
      .order("nome", { ascending: true });

    const { data: inscricoesData, error: inscricoesError } = await supabase
      .from("inscricoes_estagio")
      .select(
        `
        id,
        aluno_id,
        edicao_estagio_id,
        professor_id,
        orientador_id,
        professor_responsavel_id,
        distribuido_por,
        data_distribuicao,
        estado,
        estado_estagio
      `,
      );

    if (edicoesError || alunosError || inscricoesError) {
      console.log("ERRO:", edicoesError || alunosError || inscricoesError);
      abrirPopup("Erro", "Não foi possível carregar os dados.");
      setLoading(false);
      return;
    }

    const listaAlunos = ((alunosData as any) || []) as Utilizador[];
    const listaInscricoes = ((inscricoesData as any) ||
      []) as InscricaoExistente[];

    setEdicoes((edicoesData as any) || []);
    setAlunos(listaAlunos);
    setInscricoesExistentes(listaInscricoes);

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
          `,
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

    if (inscricaoId) {
      const inscricao = listaInscricoes.find((i) => i.id === inscricaoId);

      if (inscricao) {
        setEdicaoSelecionada(inscricao.edicao_estagio_id);
        setAlunosSelecionados([inscricao.aluno_id]);
        await carregarEquipa(inscricao.edicao_estagio_id);
      }
    }

    setLoading(false);
  }

  async function carregarEquipa(edicaoId: number) {
    const { data: profs, error: profError } = await supabase
      .from("professores_estagio")
      .select(
        `
        id,
        professor_id,
        edicao_estagio_id,
        utilizadores(nome)
      `,
      )
      .eq("edicao_estagio_id", edicaoId);

    const { data: orients, error: orientError } = await supabase
      .from("orientadores_estagio")
      .select(
        `
        id,
        orientador_id,
        edicao_estagio_id,
        utilizadores(nome)
      `,
      )
      .eq("edicao_estagio_id", edicaoId);

    if (profError || orientError) {
      console.log("ERRO AO CARREGAR EQUIPA:", profError || orientError);
      abrirPopup("Erro", "Não foi possível carregar a equipa deste estágio.");
      return;
    }

    setProfessoresEstagio((profs as any) || []);
    setOrientadoresEstagio((orients as any) || []);
  }

  async function selecionarEdicao(id: number) {
    setEdicaoSelecionada(id);
    setAlunosSelecionados([]);
    setMostrarEdicoes(false);
    setFiltroAnoAluno("estagio");
    setPesquisaAluno("");

    await carregarEquipa(id);
  }

  function edicaoAtual() {
    return edicoes.find((e) => e.id === edicaoSelecionada) || null;
  }

  function nomeEdicao() {
    const e = edicaoAtual();

    if (!e) return "Selecionar estágio";

    return `${e.ensinos_clinicos?.nome || "Ensino Clínico"} - ${
      e.instituicoes?.nome || "Instituição"
    }`;
  }

  const anosAlunosDisponiveis = useMemo(() => {
    const anos = alunos
      .map((aluno) => aluno.ano_curricular)
      .filter((ano): ano is number => Boolean(ano));

    return Array.from(new Set(anos)).sort((a, b) => a - b);
  }, [alunos]);

  function textoFiltroAnoAluno() {
    const e = edicaoAtual();

    if (filtroAnoAluno === "estagio") {
      if (e?.ensinos_clinicos?.ano_curricular) {
        return `${e.ensinos_clinicos.ano_curricular}.º ano`;
      }

      return "Ano curricular";
    }

    if (filtroAnoAluno === "todos") {
      return "Todos";
    }

    return `${filtroAnoAluno}.º ano`;
  }

  function inscricaoDoAluno(alunoId: string) {
    if (!edicaoSelecionada) return null;

    return (
      inscricoesExistentes.find((inscricao) =>
        inscriçãoValidaParaMesmoAluno(inscricao, alunoId, edicaoSelecionada),
      ) || null
    );
  }

  function inscriçãoValidaParaMesmoAluno(
    inscricao: InscricaoExistente,
    alunoId: string,
    edicaoId: number,
  ) {
    return (
      inscricao.aluno_id === alunoId && inscricao.edicao_estagio_id === edicaoId
    );
  }

  function alunoJaDistribuido(alunoId: string) {
    const inscricao = inscricaoDoAluno(alunoId);

    if (!inscricao) return false;

    if (inscricaoId && inscricao.id === inscricaoId) return false;

    return (
      inscricao.estado === "aprovado" || inscricao.estado_estagio === "em_curso"
    );
  }

  function textoDistribuicaoAluno(alunoId: string) {
    const inscricao = inscricaoDoAluno(alunoId);

    if (!inscricao) return "Ainda não associado a este estágio";

    if (inscricao.distribuido_por === "admin") {
      return "Já distribuído pelo SuperAdmin";
    }

    if (inscricao.distribuido_por === "professor_responsavel") {
      return "Já distribuído pelo Professor Responsável";
    }

    if (
      inscricao.estado === "aprovado" ||
      inscricao.estado_estagio === "em_curso"
    ) {
      return "Já distribuído neste estágio";
    }

    return "Inscrito, mas ainda sem distribuição";
  }

  function textoEstagiosAluno(alunoId: string) {
    const lista = inscricoesAlunosTodas.filter(
      (inscricao) =>
        inscricao.aluno_id === alunoId &&
        inscricao.estado === "aprovado" &&
        inscricao.estado_estagio !== "inativo",
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

  function toggleAluno(id: string) {
    if (alunoJaDistribuido(id)) {
      abrirPopup(
        "Aluno já distribuído",
        "Este aluno já está associado a este estágio.",
      );
      return;
    }

    if (inscricaoId) {
      setAlunosSelecionados([id]);
      return;
    }

    if (alunosSelecionados.includes(id)) {
      setAlunosSelecionados(alunosSelecionados.filter((a) => a !== id));
    } else {
      setAlunosSelecionados([...alunosSelecionados, id]);
    }
  }

  const alunosFiltrados = useMemo(() => {
    const termo = pesquisaAluno.toLowerCase().trim();
    const e = edicaoAtual();

    return alunos.filter((aluno) => {
      const texto = `
        ${aluno.nome || ""}
        ${aluno.email || ""}
        ${aluno.numero_identificacao || ""}
        ${aluno.ano_curricular || ""}
        ${textoDistribuicaoAluno(aluno.id)}
        ${textoEstagiosAluno(aluno.id)}
      `.toLowerCase();

      const passaPesquisa = !termo || texto.includes(termo);

      let passaAno = true;

      if (filtroAnoAluno === "estagio") {
        passaAno =
          Boolean(e) &&
          Number(aluno.ano_curricular) ===
            Number(e?.ensinos_clinicos?.ano_curricular);
      } else if (filtroAnoAluno !== "todos") {
        passaAno = Number(aluno.ano_curricular) === Number(filtroAnoAluno);
      }

      return passaPesquisa && passaAno;
    });
  }, [
    alunos,
    pesquisaAluno,
    filtroAnoAluno,
    edicaoSelecionada,
    edicoes,
    inscricoesExistentes,
    inscricoesAlunosTodas,
  ]);

  async function contarAlunosNoEstagio() {
    if (!edicaoSelecionada) return 0;

    const { data, error } = await supabase
      .from("inscricoes_estagio")
      .select("id, estado, estado_estagio")
      .eq("edicao_estagio_id", edicaoSelecionada);

    if (error) {
      console.log("ERRO AO CONTAR ALUNOS:", error);
      return 0;
    }

    return (data || []).filter(
      (i: any) =>
        i.estado !== "rejeitado" &&
        i.estado_estagio !== "inativo" &&
        (i.estado === "aprovado" || i.estado_estagio === "em_curso"),
    ).length;
  }

  async function guardarDistribuicao() {
    if (aGuardar) return;

    if (!edicaoSelecionada) {
      abrirPopup("Erro", "Seleciona o estágio.");
      return;
    }

    if (alunosSelecionados.length === 0) {
      abrirPopup("Erro", "Seleciona pelo menos um aluno.");
      return;
    }

    const e = edicaoAtual();

    if (!e) {
      abrirPopup("Erro", "Não foi possível encontrar o estágio selecionado.");
      return;
    }

    if (professoresEstagio.length === 0 || orientadoresEstagio.length === 0) {
      abrirPopup(
        "Equipa em falta",
        "Este estágio ainda não tem professor e orientador associados. Cria primeiro a equipa do estágio.",
      );
      return;
    }

    setAGuardar(true);

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    if (!userId) {
      setAGuardar(false);
      abrirPopup("Erro", "Não foi possível identificar o utilizador.");
      return;
    }

    const jaDistribuidos = await contarAlunosNoEstagio();
    const vagasDisponiveis = e.vagas - jaDistribuidos;

    if (!inscricaoId && alunosSelecionados.length > vagasDisponiveis) {
      setAGuardar(false);
      abrirPopup(
        "Erro",
        `Só existem ${vagasDisponiveis} vaga(s) disponíveis neste estágio.`,
      );
      return;
    }

    for (const alunoId of alunosSelecionados) {
      const existente = inscricaoDoAluno(alunoId);

      if (
        existente &&
        (existente.estado === "aprovado" ||
          existente.estado_estagio === "em_curso") &&
        (!inscricaoId || existente.id !== inscricaoId)
      ) {
        setAGuardar(false);
        abrirPopup(
          "Aluno já distribuído",
          "Um dos alunos selecionados já está associado a este estágio.",
        );
        return;
      }

      if (inscricaoId || existente) {
        const idAtualizar = inscricaoId || existente?.id;

        const { error } = await supabase
          .from("inscricoes_estagio")
          .update({
            aluno_id: alunoId,
            edicao_estagio_id: edicaoSelecionada,
            professor_id: null,
            orientador_id: null,
            professor_responsavel_id: null,
            estado: "aprovado",
            estado_estagio: "em_curso",
            distribuido_por: "admin",
            data_distribuicao: new Date().toISOString(),
            utilizador_distribuicao_id: userId,
          })
          .eq("id", idAtualizar);

        if (error) {
          setAGuardar(false);
          console.log("ERRO AO ATUALIZAR DISTRIBUIÇÃO:", error);
          abrirPopup("Erro", error.message);
          return;
        }
      } else {
        const { error } = await supabase.from("inscricoes_estagio").insert({
          aluno_id: alunoId,
          edicao_estagio_id: edicaoSelecionada,
          professor_id: null,
          orientador_id: null,
          professor_responsavel_id: null,
          estado: "aprovado",
          estado_estagio: "em_curso",
          distribuido_por: "admin",
          data_distribuicao: new Date().toISOString(),
          utilizador_distribuicao_id: userId,
        });

        if (error) {
          setAGuardar(false);
          console.log("ERRO AO INSERIR DISTRIBUIÇÃO:", error);

          if (error.code === "23505") {
            abrirPopup(
              "Erro",
              "Um destes alunos já está associado a este estágio.",
            );
          } else {
            abrirPopup("Erro", error.message);
          }

          return;
        }
      }
    }

    setAGuardar(false);

    abrirPopup(
      "Sucesso",
      inscricaoId
        ? "Distribuição editada com sucesso."
        : "Alunos distribuídos com sucesso.",
    );

    setTimeout(() => {
      router.push(
        "/backoffice/superadmin/distribuirAlunos/distribuirAlunos" as any,
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
            onPress={() => router.push("/backoffice/superadmin/home" as any)}
          >
            <Ionicons name="home-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && <Text style={styles.menuText}>Dashboard</Text>}
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/aprovarConta/aprovarConta" as any,
              )
            }
          >
            <Ionicons name="person-add-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && (
              <Text style={styles.menuText}>Aprovar Contas</Text>
            )}
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/utilizadores/utilizadores" as any,
              )
            }
          >
            <Ionicons name="people-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && <Text style={styles.menuText}>Utilizadores</Text>}
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/instituicoes/instituicoes" as any,
              )
            }
          >
            <Ionicons name="business-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && <Text style={styles.menuText}>Instituições</Text>}
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() =>
              router.push("/backoffice/superadmin/servicos/servicos" as any)
            }
          >
            <Ionicons name="medkit-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && <Text style={styles.menuText}>Serviços</Text>}
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/ensinos-clinicos/ensinos-clinicos" as any,
              )
            }
          >
            <Ionicons name="school-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && (
              <Text style={styles.menuText}>Ensinos Clínicos</Text>
            )}
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/editarEstagio/editarEstagio" as any,
              )
            }
          >
            <Ionicons name="calendar-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && (
              <Text style={styles.menuText}>Edições de Estágio</Text>
            )}
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/professoresResponsaveis/professoresResponsaveis" as any,
              )
            }
          >
            <Ionicons name="ribbon-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && (
              <Text style={styles.menuText}>Professores Responsáveis</Text>
            )}
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/criar_equipas/equipasEstagio" as any,
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
                "/backoffice/superadmin/distribuirAlunos/distribuirAlunos" as any,
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
              router.push("/backoffice/superadmin/perfil/perfil" as any)
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
                "sair",
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
      >
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Pressable
              style={styles.botaoVoltarHome}
              onPress={() =>
                router.push(
                  "/backoffice/superadmin/distribuirAlunos/distribuirAlunos" as any,
                )
              }
            >
              <Ionicons name="arrow-back-outline" size={22} color="#160909" />
            </Pressable>

            <View>
              <Text style={styles.titulo}>
                {inscricaoId ? "Editar Distribuição" : "Nova Distribuição"}
              </Text>
              <Text style={styles.subtitulo}>
                Associar alunos a um estágio com equipa previamente criada.
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
              onPress={() => setMostrarEdicoes(!mostrarEdicoes)}
            >
              <Text style={styles.selectToggleText}>{nomeEdicao()}</Text>

              <Ionicons
                name={
                  mostrarEdicoes ? "chevron-up-outline" : "chevron-down-outline"
                }
                size={22}
                color="#160909"
              />
            </Pressable>

            {mostrarEdicoes && (
              <ScrollView style={styles.pickerListaGrande} nestedScrollEnabled>
                {edicoes.map((edicao) => (
                  <Pressable
                    key={edicao.id}
                    style={[
                      styles.opcao,
                      edicaoSelecionada === edicao.id &&
                        styles.opcaoSelecionada,
                    ]}
                    onPress={() => selecionarEdicao(edicao.id)}
                  >
                    <View style={styles.opcaoLinha}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.opcaoTitulo}>
                          {edicao.ensinos_clinicos?.nome || "Ensino Clínico"}
                        </Text>

                        <Text style={styles.opcaoTexto}>
                          {edicao.instituicoes?.nome || "Instituição"} /{" "}
                          {edicao.servicos?.nome || "Serviço"} ·{" "}
                          {edicao.ensinos_clinicos?.ano_curricular || "N/A"}.º
                          ano · {edicao.vagas} vagas
                        </Text>
                      </View>

                      <Ionicons
                        name={
                          edicaoSelecionada === edicao.id
                            ? "radio-button-on-outline"
                            : "radio-button-off-outline"
                        }
                        size={24}
                        color="#160909"
                      />
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            )}

            {edicaoSelecionada && (
              <View style={styles.infoBox}>
                <Ionicons
                  name="information-circle-outline"
                  size={24}
                  color="#B77900"
                />

                <View style={{ flex: 1 }}>
                  <Text style={styles.infoTitulo}>Equipa deste estágio</Text>
                  <Text style={styles.infoTexto}>
                    Professores:{" "}
                    {professoresEstagio.length > 0
                      ? professoresEstagio
                          .map((p) => p.utilizadores?.nome || "Professor")
                          .join(", ")
                      : "Sem professor"}
                  </Text>
                  <Text style={styles.infoTexto}>
                    Orientadores:{" "}
                    {orientadoresEstagio.length > 0
                      ? orientadoresEstagio
                          .map((o) => o.utilizadores?.nome || "Orientador")
                          .join(", ")
                      : "Sem orientador"}
                  </Text>
                </View>
              </View>
            )}

            <Text style={styles.label}>Alunos</Text>

            <View style={styles.alunosBox}>
              <View style={styles.searchFiltroLinha}>
                <View style={styles.searchContainerComFiltro}>
                  <Ionicons name="search-outline" size={21} color="#667085" />

                  <TextInput
                    style={styles.searchInput}
                    placeholder="Pesquisar aluno por nome, email, número ou estágio..."
                    placeholderTextColor="#8c8787"
                    value={pesquisaAluno}
                    onChangeText={setPesquisaAluno}
                    autoCapitalize="none"
                  />

                  {pesquisaAluno.length > 0 && (
                    <Pressable onPress={() => setPesquisaAluno("")}>
                      <Ionicons
                        name="close-circle-outline"
                        size={20}
                        color="#667085"
                      />
                    </Pressable>
                  )}
                </View>

                <View style={styles.filtroAnoBox}>
                  <Pressable
                    style={styles.filtroAnoToggle}
                    onPress={() => setFiltroAnoAberto(!filtroAnoAberto)}
                  >
                    <Text style={styles.filtroAnoTexto}>
                      {textoFiltroAnoAluno()}
                    </Text>

                    <Ionicons
                      name={
                        filtroAnoAberto
                          ? "chevron-up-outline"
                          : "chevron-down-outline"
                      }
                      size={18}
                      color="#160909"
                    />
                  </Pressable>

                  {filtroAnoAberto && (
                    <View style={styles.filtroAnoDropdown}>
                      <Pressable
                        style={styles.filtroAnoOpcao}
                        onPress={() => {
                          setFiltroAnoAluno("todos");
                          setFiltroAnoAberto(false);
                        }}
                      >
                        <Text style={styles.filtroAnoOpcaoTexto}>Todos</Text>
                      </Pressable>

                      {anosAlunosDisponiveis.map((ano) => (
                        <Pressable
                          key={ano}
                          style={styles.filtroAnoOpcao}
                          onPress={() => {
                            setFiltroAnoAluno(String(ano));
                            setFiltroAnoAberto(false);
                          }}
                        >
                          <Text style={styles.filtroAnoOpcaoTexto}>
                            {ano}.º ano
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              <ScrollView style={styles.pickerListaAlunos} nestedScrollEnabled>
                {!edicaoSelecionada ? (
                  <Text style={styles.textoVazioModal}>
                    Seleciona primeiro um estágio.
                  </Text>
                ) : alunosFiltrados.length === 0 ? (
                  <Text style={styles.textoVazioModal}>
                    Não existem alunos para os filtros selecionados.
                  </Text>
                ) : (
                  alunosFiltrados.map((aluno) => {
                    const selecionado = alunosSelecionados.includes(aluno.id);
                    const jaDistribuido = alunoJaDistribuido(aluno.id);

                    return (
                      <Pressable
                        key={aluno.id}
                        style={[
                          styles.opcao,
                          selecionado && styles.opcaoSelecionada,
                          jaDistribuido && styles.opcaoOrientadorCombina,
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

                            <Text style={styles.localOrientadorTexto}>
                              {textoDistribuicaoAluno(aluno.id)}
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

            <View style={styles.popupBotoesLinha}>
              <Pressable
                style={styles.popupBotaoCancelar}
                onPress={() =>
                  router.push(
                    "/backoffice/superadmin/distribuirAlunos/distribuirAlunos" as any,
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

                <Pressable
                  style={styles.popupBotaoSair}
                  onPress={terminarSessao}
                >
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
