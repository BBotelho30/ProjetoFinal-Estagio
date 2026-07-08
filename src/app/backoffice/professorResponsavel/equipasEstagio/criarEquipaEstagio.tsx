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

type EnsinoResponsavel = {
  ensino_clinico_id: number;
};

type Edicao = {
  id: number;
  ensino_clinico_id: number;
  instituicao_id: number;
  servico_id: number;
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

export default function CriarEquipaEstagioProfessorResponsavel() {
  const params = useLocalSearchParams();
  const edicaoIdParam = params.edicaoId ? Number(params.edicaoId) : null;

  const [sidebarAberta, setSidebarAberta] = useState(true);

  const [edicoes, setEdicoes] = useState<Edicao[]>([]);
  const [professores, setProfessores] = useState<Utilizador[]>([]);
  const [orientadores, setOrientadores] = useState<Utilizador[]>([]);

  const [edicoesSelecionadas, setEdicoesSelecionadas] = useState<number[]>([]);
  const [professorSelecionado, setProfessorSelecionado] = useState<string | null>(
    null
  );
  const [orientadorSelecionado, setOrientadorSelecionado] = useState<
    string | null
  >(null);

  const [maxProfessor, setMaxProfessor] = useState("8");
  const [maxOrientador, setMaxOrientador] = useState("8");

  const [edicoesOpen, setEdicoesOpen] = useState(false);
  const [professoresOpen, setProfessoresOpen] = useState(false);
  const [orientadoresOpen, setOrientadoresOpen] = useState(false);

  const [mostrarTodosOrientadores, setMostrarTodosOrientadores] =
    useState(false);

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
      setProfessores([]);
      setOrientadores([]);
      setLoading(false);
      return;
    }

    const { data: edicoesData, error: edicoesError } = await supabase
      .from("edicoes_estagio")
      .select(
        `
        id,
        ensino_clinico_id,
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
      .in("ensino_clinico_id", ensinosIds)
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

    const listaEdicoes = ((edicoesData as any) || []) as Edicao[];

    setEdicoes(listaEdicoes);
    setProfessores((professoresData as any) || []);
    setOrientadores((orientadoresData as any) || []);

    if (edicaoIdParam) {
      setEdicoesSelecionadas([edicaoIdParam]);
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

  function toggleEdicao(id: number) {
    if (edicaoIdParam) {
      setEdicoesSelecionadas([id]);
      return;
    }

    if (edicoesSelecionadas.includes(id)) {
      setEdicoesSelecionadas(edicoesSelecionadas.filter((item) => item !== id));
    } else {
      setEdicoesSelecionadas([...edicoesSelecionadas, id]);
    }
  }

  function edicoesSelecionadasTexto() {
    if (edicoesSelecionadas.length === 0) return "Selecionar estágio";

    if (edicoesSelecionadas.length === 1) {
      const edicao = edicoes.find((e) => e.id === edicoesSelecionadas[0]);

      if (!edicao) return "1 estágio selecionado";

      return `${edicao.ensinos_clinicos?.nome || "Ensino Clínico"} - ${
        edicao.instituicoes?.nome || "Instituição"
      } / ${edicao.servicos?.nome || "Serviço"}`;
    }

    return `${edicoesSelecionadas.length} estágios selecionados`;
  }

  function professorTexto() {
    if (!professorSelecionado) return "Selecionar professor";

    const professor = professores.find((p) => p.id === professorSelecionado);

    return professor?.nome || "Professor selecionado";
  }

  function orientadorTexto() {
    if (!orientadorSelecionado) return "Selecionar orientador";

    const orientador = orientadores.find((o) => o.id === orientadorSelecionado);

    if (!orientador) return "Orientador selecionado";

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
      abrirPopup("Erro", "Seleciona pelo menos um estágio.");
      return;
    }

    if (!professorSelecionado) {
      abrirPopup("Erro", "Seleciona um professor.");
      return;
    }

    if (!orientadorSelecionado) {
      abrirPopup("Erro", "Seleciona um orientador.");
      return;
    }

    setAGuardar(true);

    for (const edicaoId of edicoesSelecionadas) {
      const { error: professorError } = await supabase
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

      if (professorError) {
        console.log("ERRO PROFESSOR:", professorError);
        abrirPopup("Erro", professorError.message);
        setAGuardar(false);
        return;
      }

      const { error: orientadorError } = await supabase
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

      if (orientadorError) {
        console.log("ERRO ORIENTADOR:", orientadorError);
        abrirPopup("Erro", orientadorError.message);
        setAGuardar(false);
        return;
      }
    }

    setAGuardar(false);

    abrirPopup(
      "Sucesso",
      edicaoIdParam
        ? "Equipa atualizada com sucesso."
        : "Equipa criada com sucesso."
    );

    setTimeout(() => {
      router.push(
        "/backoffice/professorResponsavel/equipasEstagio/equipasEstagio" as any
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
            style={[styles.menuItem, styles.menuItemActive]}
            onPress={() =>
              router.push(
                "/backoffice/professorResponsavel/equipasEstagio/equipasEstagio" as any
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
                "/backoffice/professorResponsavel/distribuirAlunos/distribuirAlunos" as any
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
                  "/backoffice/professorResponsavel/equipasEstagio/equipasEstagio" as any
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
                Associar professor e orientador aos estágios que coordenas.
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

            <Text style={styles.label}>Estágio</Text>

            <Pressable
              style={styles.selectToggle}
              onPress={() => setEdicoesOpen(!edicoesOpen)}
            >
              <Text style={styles.selectToggleText}>
                {edicoesSelecionadasTexto()}
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
                              {edicao.ensinos_clinicos?.nome || "Ensino Clínico"}
                            </Text>

                            <Text style={styles.opcaoTexto}>
                              {edicao.instituicoes?.nome || "Instituição"} /{" "}
                              {edicao.servicos?.nome || "Serviço"} ·{" "}
                              {edicao.ensinos_clinicos?.ano_curricular || "N/A"}
                              .º ano · {edicao.vagas} vagas
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
                <Ionicons
                  name="location-outline"
                  size={22}
                  color="#B77900"
                />

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
              onPress={() => setProfessoresOpen(!professoresOpen)}
            >
              <Text style={styles.selectToggleText}>{professorTexto()}</Text>
              <Ionicons
                name={
                  professoresOpen
                    ? "chevron-up-outline"
                    : "chevron-down-outline"
                }
                size={22}
                color="#160909"
              />
            </Pressable>

            {professoresOpen && (
              <ScrollView style={styles.pickerLista} nestedScrollEnabled>
                {professores.map((professor) => (
                  <Pressable
                    key={professor.id}
                    style={[
                      styles.opcao,
                      professorSelecionado === professor.id &&
                        styles.opcaoSelecionada,
                    ]}
                    onPress={() => {
                      setProfessorSelecionado(professor.id);
                      setProfessoresOpen(false);
                    }}
                  >
                    <Text style={styles.opcaoTitulo}>{professor.nome}</Text>
                    <Text style={styles.opcaoTexto}>{professor.email}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}

            <Text style={styles.label}>Limite alunos do professor</Text>
            <TextInput
              style={styles.input}
              value={maxProfessor}
              onChangeText={setMaxProfessor}
              placeholder="ex: 8"
              placeholderTextColor="#8c8787"
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
                  name={mostrarTodosOrientadores ? "filter-outline" : "eye-outline"}
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
              onPress={() => setOrientadoresOpen(!orientadoresOpen)}
            >
              <Text style={styles.selectToggleText}>{orientadorTexto()}</Text>
              <Ionicons
                name={
                  orientadoresOpen
                    ? "chevron-up-outline"
                    : "chevron-down-outline"
                }
                size={22}
                color="#160909"
              />
            </Pressable>

            {orientadoresOpen && (
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
                      clicar em “Mostrar todos” para escolher outro.
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
                          setOrientadoresOpen(false);
                        }}
                      >
                        <View style={styles.opcaoLinha}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.opcaoTitulo}>
                              {orientador.nome}
                            </Text>

                            <Text style={styles.opcaoTexto}>
                              {orientador.email}
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

            <Text style={styles.label}>Limite alunos do orientador</Text>
            <TextInput
              style={styles.input}
              value={maxOrientador}
              onChangeText={setMaxOrientador}
              placeholder="ex: 8"
              placeholderTextColor="#8c8787"
              keyboardType="numeric"
            />

            <View style={styles.popupBotoesLinha}>
              <Pressable
                style={styles.popupBotaoCancelar}
                onPress={() =>
                  router.push(
                    "/backoffice/professorResponsavel/equipasEstagio/equipasEstagio" as any
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