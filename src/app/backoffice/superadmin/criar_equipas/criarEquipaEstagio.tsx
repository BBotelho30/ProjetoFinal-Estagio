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
import styles from "./criarEquipaEstagioStyles";

type Edicao = {
  id: number;
  instituicao_id: number;
  servico_id: number;
  vagas: number;
  ano_letivo: string;
  estado: string | null;
  ensinos_clinicos?: {
    nome: string;
    ano_curricular: number;
  };
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
  instituicao_id: number | null;
  servico_id: number | null;
  instituicoes?: {
    nome: string;
  } | null;
  servicos?: {
    nome: string;
  } | null;
};

type ProfessorEstagio = {
  id: number;
  edicao_estagio_id: number;
  professor_id: string;
  max_alunos: number;
};

type OrientadorEstagio = {
  id: number;
  edicao_estagio_id: number;
  orientador_id: string;
  max_alunos: number;
};

export default function CriarEquipaEstagio() {
  const params = useLocalSearchParams();
  const edicaoIdParam = params.edicaoId ? Number(params.edicaoId) : null;

  const [sidebarAberta, setSidebarAberta] = useState(true);

  const [edicoes, setEdicoes] = useState<Edicao[]>([]);
  const [professores, setProfessores] = useState<Utilizador[]>([]);
  const [orientadores, setOrientadores] = useState<Utilizador[]>([]);

  const [edicoesSelecionadas, setEdicoesSelecionadas] = useState<number[]>(
    edicaoIdParam ? [edicaoIdParam] : []
  );

  const [professorSelecionado, setProfessorSelecionado] = useState("");
  const [orientadorSelecionado, setOrientadorSelecionado] = useState("");

  const [maxProfessor, setMaxProfessor] = useState("8");
  const [maxOrientador, setMaxOrientador] = useState("8");

  const [mostrarEdicoes, setMostrarEdicoes] = useState(false);
  const [mostrarProfessores, setMostrarProfessores] = useState(false);
  const [mostrarOrientadores, setMostrarOrientadores] = useState(false);
  const [mostrarTodosOrientadores, setMostrarTodosOrientadores] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [aGuardar, setAGuardar] = useState(false);

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTipo, setPopupTipo] = useState<
    "normal" | "sair" | "inativarTudo" | "apagarTudo"
  >("normal");

  useEffect(() => {
    carregarDados();
  }, []);

  function abrirPopup(
    titulo: string,
    mensagem: string,
    tipo: "normal" | "sair" | "inativarTudo" | "apagarTudo" = "normal"
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
        instituicao_id,
        servico_id,
        vagas,
        ano_letivo,
        estado,
        ensinos_clinicos(nome, ano_curricular),
        instituicoes(nome),
        servicos(nome)
      `
      )
      .neq("estado", "inativo")
      .order("id", { ascending: false });

    const { data: professoresData, error: professoresError } = await supabase
      .from("utilizadores")
      .select(
        `
        id,
        nome,
        email,
        numero_identificacao,
        instituicao_id,
        servico_id,
        instituicoes(nome),
        servicos(nome)
      `
      )
      .eq("tipo", "professor")
      .eq("estado", "aprovado")
      .neq("ativo", false)
      .order("nome", { ascending: true });

    const { data: orientadoresData, error: orientadoresError } = await supabase
      .from("utilizadores")
      .select(
        `
        id,
        nome,
        email,
        numero_identificacao,
        instituicao_id,
        servico_id,
        instituicoes(nome),
        servicos(nome)
      `
      )
      .eq("tipo", "orientador")
      .eq("estado", "aprovado")
      .neq("ativo", false)
      .order("nome", { ascending: true });

    if (edicoesError || professoresError || orientadoresError) {
      console.log(
        "ERRO AO CARREGAR DADOS:",
        edicoesError || professoresError || orientadoresError
      );

      abrirPopup("Erro", "Não foi possível carregar os dados.");
      setLoading(false);
      return;
    }

    setEdicoes((edicoesData as any) || []);
    setProfessores((professoresData as any) || []);
    setOrientadores((orientadoresData as any) || []);

    if (edicaoIdParam) {
      await carregarEquipaExistente(edicaoIdParam);
    }

    setLoading(false);
  }

  async function carregarEquipaExistente(edicaoId: number) {
    const { data: professorData } = await supabase
      .from("professores_estagio")
      .select("id, edicao_estagio_id, professor_id, max_alunos")
      .eq("edicao_estagio_id", edicaoId)
      .limit(1);

    const { data: orientadorData } = await supabase
      .from("orientadores_estagio")
      .select("id, edicao_estagio_id, orientador_id, max_alunos")
      .eq("edicao_estagio_id", edicaoId)
      .limit(1);

    const professor = (professorData?.[0] || null) as ProfessorEstagio | null;
    const orientador = (orientadorData?.[0] || null) as OrientadorEstagio | null;

    if (professor) {
      setProfessorSelecionado(professor.professor_id);
      setMaxProfessor(String(professor.max_alunos || 8));
    }

    if (orientador) {
      setOrientadorSelecionado(orientador.orientador_id);
      setMaxOrientador(String(orientador.max_alunos || 8));
    }
  }

  function textoEdicoesSelecionadas() {
    if (edicoesSelecionadas.length === 0) {
      return "Selecionar um ou mais estágios";
    }

    if (edicoesSelecionadas.length === 1) {
      const edicao = edicoes.find((e) => e.id === edicoesSelecionadas[0]);

      if (!edicao) return "1 estágio selecionado";

      return `${edicao.ensinos_clinicos?.nome || "Ensino Clínico"} - ${
        edicao.instituicoes?.nome || "Instituição"
      } / ${edicao.servicos?.nome || "Serviço"}`;
    }

    return `${edicoesSelecionadas.length} estágios selecionados`;
  }

  function nomeProfessorSelecionado() {
    const professor = professores.find((p) => p.id === professorSelecionado);
    return professor ? professor.nome : "Selecionar professor";
  }

  function nomeOrientadorSelecionado() {
    const orientador = orientadores.find((o) => o.id === orientadorSelecionado);

    if (!orientador) return "Selecionar orientador";

    const hospital = orientador.instituicoes?.nome;
    const servico = orientador.servicos?.nome;

    if (hospital && servico) {
      return `${orientador.nome} - ${hospital} / ${servico}`;
    }

    if (hospital) {
      return `${orientador.nome} - ${hospital}`;
    }

    if (servico) {
      return `${orientador.nome} - ${servico}`;
    }

    return `${orientador.nome} - local não definido`;
  }

  function toggleEdicao(id: number) {
    if (edicaoIdParam) {
      setEdicoesSelecionadas([id]);
      return;
    }

    if (edicoesSelecionadas.includes(id)) {
      setEdicoesSelecionadas(edicoesSelecionadas.filter((e) => e !== id));
    } else {
      setEdicoesSelecionadas([...edicoesSelecionadas, id]);
    }
  }

  const locaisSelecionados = useMemo(() => {
    return edicoes
      .filter((edicao) => edicoesSelecionadas.includes(edicao.id))
      .map((edicao) => ({
        instituicao_id: edicao.instituicao_id,
        servico_id: edicao.servico_id,
        hospital: edicao.instituicoes?.nome || "Instituição",
        servico: edicao.servicos?.nome || "Serviço",
      }));
  }, [edicoes, edicoesSelecionadas]);

  const orientadoresFiltrados = useMemo(() => {
    if (mostrarTodosOrientadores || locaisSelecionados.length === 0) {
      return orientadores;
    }

    return orientadores.filter((orientador) =>
      locaisSelecionados.some(
        (local) =>
          orientador.instituicao_id === local.instituicao_id &&
          orientador.servico_id === local.servico_id
      )
    );
  }, [orientadores, locaisSelecionados, mostrarTodosOrientadores]);

  function textoLocalOrientador(orientador: Utilizador) {
    const hospital = orientador.instituicoes?.nome;
    const servico = orientador.servicos?.nome;

    if (hospital && servico) return `${hospital} / ${servico}`;
    if (hospital) return hospital;
    if (servico) return servico;

    return "Local ainda não definido";
  }

  function orientadorCombinaComEstagio(orientador: Utilizador) {
    if (locaisSelecionados.length === 0) return false;

    return locaisSelecionados.some(
      (local) =>
        orientador.instituicao_id === local.instituicao_id &&
        orientador.servico_id === local.servico_id
    );
  }

  async function guardarEquipa() {
    if (aGuardar) return;

    if (edicoesSelecionadas.length === 0) {
      abrirPopup("Erro", "Seleciona pelo menos uma edição de estágio.");
      return;
    }

    if (!professorSelecionado && !orientadorSelecionado) {
      abrirPopup(
        "Erro",
        "Seleciona pelo menos um professor ou um orientador."
      );
      return;
    }

    if (
      professorSelecionado &&
      (!maxProfessor.trim() || Number.isNaN(Number(maxProfessor)))
    ) {
      abrirPopup("Erro", "Preenche corretamente o limite de alunos.");
      return;
    }

    if (
      orientadorSelecionado &&
      (!maxOrientador.trim() || Number.isNaN(Number(maxOrientador)))
    ) {
      abrirPopup("Erro", "Preenche corretamente o limite de alunos.");
      return;
    }

    setAGuardar(true);

    for (const edicaoId of edicoesSelecionadas) {
      if (professorSelecionado) {
        const { error: profError } = await supabase
          .from("professores_estagio")
          .upsert(
            {
              edicao_estagio_id: edicaoId,
              professor_id: professorSelecionado,
              max_alunos: Number(maxProfessor) || 8,
            },
            {
              onConflict: "edicao_estagio_id,professor_id",
            }
          );

        if (profError) {
          setAGuardar(false);
          console.log("ERRO AO ASSOCIAR PROFESSOR:", profError);
          abrirPopup("Erro", profError.message);
          return;
        }
      }

      if (orientadorSelecionado) {
        const { error: orientError } = await supabase
          .from("orientadores_estagio")
          .upsert(
            {
              edicao_estagio_id: edicaoId,
              orientador_id: orientadorSelecionado,
              max_alunos: Number(maxOrientador) || 8,
            },
            {
              onConflict: "edicao_estagio_id,orientador_id",
            }
          );

        if (orientError) {
          setAGuardar(false);
          console.log("ERRO AO ASSOCIAR ORIENTADOR:", orientError);
          abrirPopup("Erro", orientError.message);
          return;
        }
      }
    }

    setAGuardar(false);

    abrirPopup(
      "Sucesso",
      edicoesSelecionadas.length === 1
        ? "Equipa guardada com sucesso."
        : `Equipa guardada em ${edicoesSelecionadas.length} estágios com sucesso.`
    );
  }

  function pedirInativarTudo() {
    abrirPopup(
      "Colocar selecionados inativos",
      "Tens a certeza que queres colocar as edições selecionadas como inativas?",
      "inativarTudo"
    );
  }

  async function confirmarInativarTudo() {
    setPopupVisible(false);

    if (edicoesSelecionadas.length === 0) {
      abrirPopup("Erro", "Seleciona pelo menos uma edição de estágio.");
      return;
    }

    const { error } = await supabase
      .from("edicoes_estagio")
      .update({ estado: "inativo" })
      .in("id", edicoesSelecionadas);

    if (error) {
      console.log("ERRO AO INATIVAR:", error);
      abrirPopup("Erro", "Não foi possível colocar as edições como inativas.");
      return;
    }

    abrirPopup(
      "Sucesso",
      "As edições selecionadas foram colocadas como inativas."
    );

    setEdicoesSelecionadas([]);
    carregarDados();
  }

  function pedirApagarTudo() {
    abrirPopup(
      "Apagar equipas selecionadas",
      "Tens a certeza que queres apagar os professores e orientadores das edições selecionadas?",
      "apagarTudo"
    );
  }

  async function confirmarApagarTudo() {
    setPopupVisible(false);

    if (edicoesSelecionadas.length === 0) {
      abrirPopup("Erro", "Seleciona pelo menos uma edição de estágio.");
      return;
    }

    const { error: profError } = await supabase
      .from("professores_estagio")
      .delete()
      .in("edicao_estagio_id", edicoesSelecionadas);

    const { error: orientError } = await supabase
      .from("orientadores_estagio")
      .delete()
      .in("edicao_estagio_id", edicoesSelecionadas);

    if (profError || orientError) {
      console.log("ERRO AO APAGAR EQUIPAS:", profError || orientError);
      abrirPopup("Erro", "Não foi possível apagar as equipas selecionadas.");
      return;
    }

    abrirPopup("Sucesso", "Equipas apagadas com sucesso.");
    carregarDados();
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
                "/backoffice/superadmin/aprovarConta/aprovarConta" as any
              )
            }
          >
            <Ionicons name="person-add-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && <Text style={styles.menuText}>Aprovar Contas</Text>}
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/utilizadores/utilizadores" as any
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
                "/backoffice/superadmin/instituicoes/instituicoes" as any
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
                "/backoffice/superadmin/ensinos-clinicos/ensinos-clinicos" as any
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
                "/backoffice/superadmin/editarEstagio/editarEstagio" as any
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
                "/backoffice/superadmin/professoresResponsaveis/professoresResponsaveis" as any
              )
            }
          >
            <Ionicons name="ribbon-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && (
              <Text style={styles.menuText}>Professores Responsáveis</Text>
            )}
          </Pressable>

          <Pressable
            style={[styles.menuItem, styles.menuItemActive]}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/criar_equipas/equipasEstagio" as any
              )
            }
          >
            <Ionicons name="people-circle-outline" size={23} color="#160909" />
            {sidebarAberta && (
              <Text style={[styles.menuText, styles.menuTextActive]}>
                Equipas
              </Text>
            )}
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/distribuirAlunos/distribuirAlunos" as any
              )
            }
          >
            <Ionicons name="git-branch-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && (
              <Text style={styles.menuText}>Distribuir Alunos</Text>
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
                "sair"
              )
            }
          >
            <Ionicons name="log-out-outline" size={23} color="#FFFFFF" />
            {sidebarAberta && <Text style={styles.footerText}>Sair</Text>}
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Pressable
              style={styles.botaoVoltarHome}
              onPress={() =>
                router.push(
                  "/backoffice/superadmin/criar_equipas/equipasEstagio" as any
                )
              }
            >
              <Ionicons name="arrow-back-outline" size={22} color="#160909" />
            </Pressable>

            <View>
              <Text style={styles.titulo}>
                {edicaoIdParam ? "Editar Equipa" : "Criar Equipa"}
              </Text>
              <Text style={styles.subtitulo}>
                Associar professor e orientador a um ou vários estágios.
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
            <Text style={styles.modalTitulo}>Dados da Equipa</Text>

            <Text style={styles.label}>Edições de Estágio</Text>

            <Pressable
              style={styles.selectToggle}
              onPress={() => {
                setMostrarEdicoes(!mostrarEdicoes);
                setMostrarProfessores(false);
                setMostrarOrientadores(false);
              }}
            >
              <Text style={styles.selectToggleText}>
                {textoEdicoesSelecionadas()}
              </Text>

              <Ionicons
                name={
                  mostrarEdicoes
                    ? "chevron-up-outline"
                    : "chevron-down-outline"
                }
                size={22}
                color="#160909"
              />
            </Pressable>

            {mostrarEdicoes && (
              <ScrollView style={styles.pickerListaGrande} nestedScrollEnabled>
                {edicoes.length === 0 ? (
                  <Text style={styles.textoVazioModal}>
                    Não existem edições ativas disponíveis.
                  </Text>
                ) : (
                  edicoes.map((edicao) => {
                    const selecionada = edicoesSelecionadas.includes(edicao.id);

                    return (
                      <Pressable
                        key={edicao.id}
                        style={[
                          styles.opcao,
                          selecionada && styles.opcaoSelecionada,
                        ]}
                        onPress={() => toggleEdicao(edicao.id)}
                      >
                        <View style={styles.opcaoLinha}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.opcaoTitulo}>
                              {edicao.ensinos_clinicos?.nome ||
                                "Ensino Clínico"}
                            </Text>

                            <Text style={styles.opcaoTexto}>
                              {edicao.instituicoes?.nome || "Instituição"} ·{" "}
                              {edicao.servicos?.nome || "Serviço"} ·{" "}
                              {edicao.vagas} vagas · {edicao.ano_letivo}
                            </Text>
                          </View>

                          <Ionicons
                            name={
                              selecionada
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
            )}

            {locaisSelecionados.length > 0 && (
              <View style={styles.localBox}>
                <Ionicons name="location-outline" size={22} color="#B77900" />

                <View style={{ flex: 1 }}>
                  <Text style={styles.localTitulo}>
                    Local usado para filtrar orientadores
                  </Text>

                  {locaisSelecionados.map((local, index) => (
                    <Text key={index} style={styles.localTexto}>
                      {local.hospital} / {local.servico}
                    </Text>
                  ))}
                </View>
              </View>
            )}

            <Text style={styles.label}>Professor</Text>

            <Pressable
              style={styles.selectToggle}
              onPress={() => {
                setMostrarProfessores(!mostrarProfessores);
                setMostrarEdicoes(false);
                setMostrarOrientadores(false);
              }}
            >
              <Text style={styles.selectToggleText}>
                {nomeProfessorSelecionado()}
              </Text>

              <Ionicons
                name={
                  mostrarProfessores
                    ? "chevron-up-outline"
                    : "chevron-down-outline"
                }
                size={22}
                color="#160909"
              />
            </Pressable>

            {mostrarProfessores && (
              <ScrollView style={styles.pickerLista} nestedScrollEnabled>
                {professores.length === 0 ? (
                  <Text style={styles.textoVazioModal}>
                    Não existem professores aprovados.
                  </Text>
                ) : (
                  professores.map((professor) => (
                    <Pressable
                      key={professor.id}
                      style={[
                        styles.opcao,
                        professorSelecionado === professor.id &&
                          styles.opcaoSelecionada,
                      ]}
                      onPress={() => {
                        setProfessorSelecionado(professor.id);
                        setMostrarProfessores(false);
                      }}
                    >
                      <Text style={styles.opcaoTitulo}>{professor.nome}</Text>
                      <Text style={styles.opcaoTexto}>
                        {professor.email}
                        {professor.numero_identificacao
                          ? ` · Nº ${professor.numero_identificacao}`
                          : ""}
                      </Text>
                    </Pressable>
                  ))
                )}
              </ScrollView>
            )}

            <Text style={styles.label}>Limite alunos</Text>
            <TextInput
              placeholder="ex: 8"
              placeholderTextColor="#8c8787"
              style={styles.modalInput}
              value={maxProfessor}
              onChangeText={setMaxProfessor}
              keyboardType="numeric"
            />

            <View style={styles.labelLinha}>
              <Text style={styles.label}>Orientador</Text>

              <Pressable
                style={styles.mostrarTodosBotao}
                onPress={() =>
                  setMostrarTodosOrientadores(!mostrarTodosOrientadores)
                }
              >
                <Ionicons
                  name={
                    mostrarTodosOrientadores ? "filter-outline" : "eye-outline"
                  }
                  size={17}
                  color="#160909"
                />
                <Text style={styles.mostrarTodosTexto}>
                  {mostrarTodosOrientadores
                    ? "Filtrar por local"
                    : "Mostrar todos"}
                </Text>
              </Pressable>
            </View>

            <Pressable
              style={styles.selectToggle}
              onPress={() => {
                setMostrarOrientadores(!mostrarOrientadores);
                setMostrarEdicoes(false);
                setMostrarProfessores(false);
              }}
            >
              <Text style={styles.selectToggleText}>
                {nomeOrientadorSelecionado()}
              </Text>

              <Ionicons
                name={
                  mostrarOrientadores
                    ? "chevron-up-outline"
                    : "chevron-down-outline"
                }
                size={22}
                color="#160909"
              />
            </Pressable>

            {mostrarOrientadores && (
              <ScrollView style={styles.pickerListaGrande} nestedScrollEnabled>
                {orientadoresFiltrados.length === 0 ? (
                  <View style={styles.avisoOrientadoresBox}>
                    <Ionicons
                      name="information-circle-outline"
                      size={22}
                      color="#B77900"
                    />
                    <Text style={styles.avisoOrientadoresTexto}>
                      Não existem orientadores para este hospital/serviço. Podes
                      clicar em “Mostrar todos” para escolher outro orientador.
                    </Text>
                  </View>
                ) : (
                  orientadoresFiltrados.map((orientador) => {
                    const selecionado = orientadorSelecionado === orientador.id;
                    const combina = orientadorCombinaComEstagio(orientador);

                    return (
                      <Pressable
                        key={orientador.id}
                        style={[
                          styles.opcao,
                          selecionado && styles.opcaoSelecionada,
                          combina && styles.opcaoOrientadorCombina,
                        ]}
                        onPress={() => {
                          setOrientadorSelecionado(orientador.id);
                          setMostrarOrientadores(false);
                        }}
                      >
                        <View style={styles.opcaoLinha}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.opcaoTitulo}>
                              {orientador.nome}
                            </Text>

                            <Text style={styles.opcaoTexto}>
                              {orientador.email}
                              {orientador.numero_identificacao
                                ? ` · Nº ${orientador.numero_identificacao}`
                                : ""}
                            </Text>

                            <Text
                              style={[
                                styles.localOrientadorTexto,
                                combina && styles.localOrientadorTextoCombina,
                              ]}
                            >
                              {textoLocalOrientador(orientador)}
                            </Text>
                          </View>

                          <Ionicons
                            name={
                              selecionado
                                ? "checkbox-outline"
                                : combina
                                ? "checkmark-circle-outline"
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
            )}

            <Text style={styles.label}>Limite alunos</Text>
            <TextInput
              placeholder="ex: 8"
              placeholderTextColor="#8c8787"
              style={styles.modalInput}
              value={maxOrientador}
              onChangeText={setMaxOrientador}
              keyboardType="numeric"
            />

            <View style={styles.popupBotoesLinha}>
              <Pressable
                style={styles.popupBotaoCancelar}
                onPress={() =>
                  router.push(
                    "/backoffice/superadmin/criar_equipas/equipasEstagio" as any
                  )
                }
              >
                <Text style={styles.popupTextoCancelar}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={styles.popupBotaoConfirmar}
                onPress={guardarEquipa}
                disabled={aGuardar}
              >
                <Text style={styles.popupTextoConfirmar}>
                  {aGuardar ? "A guardar..." : "Guardar equipa"}
                </Text>
              </Pressable>
            </View>

            <View style={styles.botoesFinaisLinha}>
              <Pressable
                style={styles.botaoTudoInativo}
                onPress={pedirInativarTudo}
              >
                <Ionicons name="ban-outline" size={20} color="#FFFFFF" />
                <Text style={styles.textoBotaoFinal}>
                  Colocar selecionados inativos
                </Text>
              </Pressable>

              <Pressable
                style={styles.botaoApagarTudo}
                onPress={pedirApagarTudo}
              >
                <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
                <Text style={styles.textoBotaoFinal}>
                  Apagar equipas selecionadas
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
            ) : popupTipo === "inativarTudo" ? (
              <View style={styles.popupBotoesLinha}>
                <Pressable
                  style={styles.popupBotaoCancelar}
                  onPress={() => setPopupVisible(false)}
                >
                  <Text style={styles.popupTextoCancelar}>Cancelar</Text>
                </Pressable>

                <Pressable
                  style={styles.popupBotaoSair}
                  onPress={confirmarInativarTudo}
                >
                  <Text style={styles.popupTextoSair}>Inativar</Text>
                </Pressable>
              </View>
            ) : popupTipo === "apagarTudo" ? (
              <View style={styles.popupBotoesLinha}>
                <Pressable
                  style={styles.popupBotaoCancelar}
                  onPress={() => setPopupVisible(false)}
                >
                  <Text style={styles.popupTextoCancelar}>Cancelar</Text>
                </Pressable>

                <Pressable
                  style={styles.popupBotaoSair}
                  onPress={confirmarApagarTudo}
                >
                  <Text style={styles.popupTextoSair}>Apagar</Text>
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