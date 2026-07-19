import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
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
import { ContasPendentesBadge, useContasPendentes } from "../contasPendentes";
import styles from "./criar-estagioStyles";

type EnsinoClinico = {
  id: number;
  nome: string;
  ano_curricular: number | null;
  semestre: number | null;
  ativo: boolean | null;
};

type Instituicao = {
  id: number;
  nome: string;
  ativo: boolean | null;
};

type Servico = {
  id: number;
  nome: string;
  instituicao_id: number;
  ativo: boolean | null;
};

export default function CriarEstagio() {
  const [sidebarAberta, setSidebarAberta] = useState(true);
  const contasPendentes = useContasPendentes();

  const [loading, setLoading] = useState(true);
  const [aGuardar, setAGuardar] = useState(false);

  const [ensinos, setEnsinos] = useState<EnsinoClinico[]>([]);
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);

  const [ensinoSelecionado, setEnsinoSelecionado] = useState<number | null>(
    null,
  );

  const [instituicoesSelecionadas, setInstituicoesSelecionadas] = useState<
    number[]
  >([]);

  const [servicosSelecionados, setServicosSelecionados] = useState<number[]>(
    [],
  );

  const [servicosAbertos, setServicosAbertos] = useState<
    Record<number, boolean>
  >({});

  const [vagasPorServico, setVagasPorServico] = useState<
    Record<number, string>
  >({});

  const [anoLetivo, setAnoLetivo] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [permiteReposicao, setPermiteReposicao] = useState(false);
  const [limiteFaltas, setLimiteFaltas] = useState("15");
  const [maxHorasDia, setMaxHorasDia] = useState("7");

  const [ensinoOpen, setEnsinoOpen] = useState(false);
  const [instituicaoOpen, setInstituicaoOpen] = useState(false);
  const [reposicaoOpen, setReposicaoOpen] = useState(false);

  const [calendarioAberto, setCalendarioAberto] = useState(false);
  const [campoDataAtivo, setCampoDataAtivo] = useState<"inicio" | "fim" | null>(
    null,
  );
  const [mesCalendario, setMesCalendario] = useState(new Date());

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

    const { data: ensinosData, error: ensinosError } = await supabase
      .from("ensinos_clinicos")
      .select("id, nome, ano_curricular, semestre, ativo")
      .neq("ativo", false)
      .order("ano_curricular", { ascending: true })
      .order("semestre", { ascending: true })
      .order("nome", { ascending: true });

    const { data: instituicoesData, error: instituicoesError } = await supabase
      .from("instituicoes")
      .select("id, nome, ativo")
      .neq("ativo", false)
      .order("nome", { ascending: true });

    const { data: servicosData, error: servicosError } = await supabase
      .from("servicos")
      .select("id, nome, instituicao_id, ativo")
      .neq("ativo", false)
      .order("nome", { ascending: true });

    if (ensinosError || instituicoesError || servicosError) {
      console.log(
        "ERRO AO CARREGAR DADOS:",
        ensinosError || instituicoesError || servicosError,
      );

      abrirPopup("Erro", "Não foi possível carregar os dados.");
    } else {
      setEnsinos((ensinosData as any) || []);
      setInstituicoes((instituicoesData as any) || []);
      setServicos((servicosData as any) || []);
    }

    setLoading(false);
  }

  function nomeEnsinoSelecionado() {
    const ensino = ensinos.find((e) => e.id === ensinoSelecionado);
    return ensino ? ensino.nome : "Selecionar ensino clínico...";
  }

  function textoInstituicoesSelecionadas() {
    if (instituicoesSelecionadas.length === 0) {
      return "Selecionar um ou mais hospitais/instituições...";
    }

    if (instituicoesSelecionadas.length === 1) {
      const instituicao = instituicoes.find(
        (i) => i.id === instituicoesSelecionadas[0],
      );

      return instituicao ? instituicao.nome : "1 instituição selecionada";
    }

    return `${instituicoesSelecionadas.length} instituições selecionadas`;
  }

  function servicosPorInstituicao(instituicaoId: number) {
    return servicos.filter(
      (servico) =>
        servico.instituicao_id === instituicaoId && servico.ativo !== false,
    );
  }

  function nomeInstituicao(instituicaoId: number) {
    return (
      instituicoes.find((instituicao) => instituicao.id === instituicaoId)
        ?.nome || "Instituição"
    );
  }

  function totalServicosSelecionadosPorInstituicao(instituicaoId: number) {
    return servicos
      .filter((servico) => servico.instituicao_id === instituicaoId)
      .filter((servico) => servicosSelecionados.includes(servico.id)).length;
  }

  function selecionarEnsino(id: number) {
    setEnsinoSelecionado(id);
    setEnsinoOpen(false);
  }

  function toggleInstituicao(id: number) {
    if (instituicoesSelecionadas.includes(id)) {
      setInstituicoesSelecionadas(
        instituicoesSelecionadas.filter((i) => i !== id),
      );

      const servicosDaInstituicao = servicos
        .filter((s) => s.instituicao_id === id)
        .map((s) => s.id);

      setServicosSelecionados(
        servicosSelecionados.filter((s) => !servicosDaInstituicao.includes(s)),
      );

      const novasVagas = { ...vagasPorServico };

      servicosDaInstituicao.forEach((servicoId) => {
        delete novasVagas[servicoId];
      });

      setVagasPorServico(novasVagas);

      const novosAbertos = { ...servicosAbertos };
      delete novosAbertos[id];
      setServicosAbertos(novosAbertos);
    } else {
      setInstituicoesSelecionadas([...instituicoesSelecionadas, id]);
      setServicosAbertos({
        ...servicosAbertos,
        [id]: true,
      });
    }
  }

  function toggleServicosHospital(instituicaoId: number) {
    setServicosAbertos({
      ...servicosAbertos,
      [instituicaoId]: !servicosAbertos[instituicaoId],
    });
  }

  function toggleServico(id: number) {
    if (servicosSelecionados.includes(id)) {
      setServicosSelecionados(servicosSelecionados.filter((s) => s !== id));

      const novasVagas = { ...vagasPorServico };
      delete novasVagas[id];
      setVagasPorServico(novasVagas);
    } else {
      setServicosSelecionados([...servicosSelecionados, id]);

      setVagasPorServico({
        ...vagasPorServico,
        [id]: vagasPorServico[id] || "",
      });
    }
  }

  function atualizarVagasServico(servicoId: number, valor: string) {
    setVagasPorServico({
      ...vagasPorServico,
      [servicoId]: valor,
    });
  }

  function limparFormulario() {
    setEnsinoSelecionado(null);
    setInstituicoesSelecionadas([]);
    setServicosSelecionados([]);
    setVagasPorServico({});
    setServicosAbertos({});
    setAnoLetivo("");
    setDataInicio("");
    setDataFim("");
    setPermiteReposicao(false);
    setLimiteFaltas("15");
    setMaxHorasDia("7");
    setEnsinoOpen(false);
    setInstituicaoOpen(false);
    setReposicaoOpen(false);
  }

  function formatarDataPT(dataISO: string) {
    if (!dataISO) return "";

    const partes = dataISO.split("-");

    if (partes.length !== 3) return dataISO;

    const [ano, mes, dia] = partes;

    return `${dia}-${mes}-${ano}`;
  }

  function abrirCalendario(campo: "inicio" | "fim") {
    setCampoDataAtivo(campo);

    const dataAtual = campo === "inicio" ? dataInicio : dataFim;

    if (dataAtual) {
      const [ano, mes, dia] = dataAtual.split("-").map(Number);
      setMesCalendario(new Date(ano, mes - 1, dia));
    } else {
      setMesCalendario(new Date());
    }

    setCalendarioAberto(true);
  }

  function selecionarData(dia: number) {
    if (!campoDataAtivo) return;

    const ano = mesCalendario.getFullYear();
    const mes = mesCalendario.getMonth() + 1;

    const dataISO = `${ano}-${String(mes).padStart(2, "0")}-${String(
      dia,
    ).padStart(2, "0")}`;

    if (campoDataAtivo === "inicio") {
      setDataInicio(dataISO);
    } else {
      setDataFim(dataISO);
    }

    setCalendarioAberto(false);
    setCampoDataAtivo(null);
  }

  function mudarMes(valor: number) {
    setMesCalendario(
      new Date(
        mesCalendario.getFullYear(),
        mesCalendario.getMonth() + valor,
        1,
      ),
    );
  }

  function diasDoMes() {
    const ano = mesCalendario.getFullYear();
    const mes = mesCalendario.getMonth();

    const primeiroDia = new Date(ano, mes, 1).getDay();
    const totalDias = new Date(ano, mes + 1, 0).getDate();

    const espacosAntes = primeiroDia === 0 ? 6 : primeiroDia - 1;

    const dias: (number | null)[] = [];

    for (let i = 0; i < espacosAntes; i++) {
      dias.push(null);
    }

    for (let dia = 1; dia <= totalDias; dia++) {
      dias.push(dia);
    }

    return dias;
  }

  function nomeMes() {
    return mesCalendario.toLocaleDateString("pt-PT", {
      month: "long",
      year: "numeric",
    });
  }


  function hojeISO() {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

  function dataMenorQueHoje(dataISO: string) {
    if (!dataISO) return false;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const data = new Date(`${dataISO}T00:00:00`);
    data.setHours(0, 0, 0, 0);

    return data < hoje;
  }

  function dataFimMenorQueInicio(inicioISO: string, fimISO: string) {
    if (!inicioISO || !fimISO) return false;

    const inicio = new Date(`${inicioISO}T00:00:00`);
    const fim = new Date(`${fimISO}T00:00:00`);

    return fim < inicio;
  }

  async function criarEdicao() {
    if (aGuardar) return;

    if (!ensinoSelecionado) {
      abrirPopup("Erro", "Seleciona o ensino clínico.");
      return;
    }

    if (instituicoesSelecionadas.length === 0) {
      abrirPopup("Erro", "Seleciona pelo menos uma instituição.");
      return;
    }

    if (servicosSelecionados.length === 0) {
      abrirPopup("Erro", "Seleciona pelo menos um serviço.");
      return;
    }

    if (!anoLetivo.trim()) {
      abrirPopup("Erro", "Preenche o ano letivo.");
      return;
    }

    const servicosSemVagas = servicosSelecionados.filter((servicoId) => {
      const valor = vagasPorServico[servicoId];

      return !valor || Number.isNaN(Number(valor)) || Number(valor) <= 0;
    });

    if (servicosSemVagas.length > 0) {
      abrirPopup(
        "Erro",
        "Preenche corretamente as vagas de todos os serviços selecionados.",
      );
      return;
    }

    if (!limiteFaltas.trim() || Number.isNaN(Number(limiteFaltas))) {
      abrirPopup("Erro", "Preenche corretamente o limite de faltas.");
      return;
    }

    if (!maxHorasDia.trim() || Number.isNaN(Number(maxHorasDia))) {
      abrirPopup("Erro", "Preenche corretamente o máximo de horas por dia.");
      return;
    }

    const servicosValidos = servicos.filter((servico) =>
      servicosSelecionados.includes(servico.id),
    );

    if (servicosValidos.length === 0) {
      abrirPopup("Erro", "Os serviços selecionados não são válidos.");
      return;
    }

    //nao deixar que entre o estagio em dias antes
    if (!dataInicio) {
      abrirPopup("Erro", "Seleciona a data de início.");
      return;
    }

    if (!dataFim) {
      abrirPopup("Erro", "Seleciona a data de fim.");
      return;
    }

    if (dataMenorQueHoje(dataInicio)) {
      abrirPopup("Erro", "A data de início não pode ser anterior ao dia de hoje.");
      return;
    }

    if (dataMenorQueHoje(dataFim)) {
      abrirPopup("Erro", "A data de fim não pode ser anterior ao dia de hoje.");
      return;
    }

    if (dataFimMenorQueInicio(dataInicio, dataFim)) {
      abrirPopup("Erro", "A data de fim não pode ser anterior à data de início.");
      return;
    }

    setAGuardar(true);

    const dadosParaInserir = servicosValidos.map((servico) => ({
      ensino_clinico_id: ensinoSelecionado,
      instituicao_id: servico.instituicao_id,
      servico_id: servico.id,
      ano_letivo: anoLetivo.trim(),
      vagas: Number(vagasPorServico[servico.id]),
      data_inicio: dataInicio || null,
      data_fim: dataFim || null,
      estado: "ativo",
      permite_reposicao_horas: permiteReposicao,
      limite_faltas_percentagem: Number(limiteFaltas),
      max_horas_dia: Number(maxHorasDia),
    }));

    const { error } = await supabase
      .from("edicoes_estagio")
      .insert(dadosParaInserir);

    setAGuardar(false);

    if (error) {
      console.log("ERRO AO CRIAR EDIÇÕES:", error);
      abrirPopup("Erro", error.message || "Não foi possível criar as edições.");
      return;
    }

    limparFormulario();

    abrirPopup(
      "Sucesso",
      dadosParaInserir.length === 1
        ? "Edição de estágio criada com sucesso."
        : `${dadosParaInserir.length} edições de estágio criadas com sucesso.`,
    );
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
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {sidebarAberta && (
                <Text style={styles.menuText}>Aprovar Contas</Text>
              )}
              <ContasPendentesBadge count={contasPendentes} />
            </View>
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
            style={[styles.menuItem, styles.menuItemActive]}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/editarEstagio/editarEstagio" as any,
              )
            }
          >
            <Ionicons name="calendar-outline" size={23} color="#160909" />
            {sidebarAberta && (
              <Text style={[styles.menuText, styles.menuTextActive]}>
                Edições de Estágio
              </Text>
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
            style={styles.menuItem}
            onPress={() =>
              router.push(
                "/backoffice/superadmin/distribuirAlunos/distribuirAlunos" as any,
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
                  "/backoffice/superadmin/editarEstagio/editarEstagio" as any,
                )
              }
            >
              <Ionicons name="arrow-back-outline" size={22} color="#160909" />
            </Pressable>

            <View>
              <Text style={styles.titulo}>Criar Edição</Text>
              <Text style={styles.subtitulo}>
                Criar uma nova edição de estágio para vários hospitais e
                serviços.
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
            <Text style={styles.modalTitulo}>Dados da Edição</Text>

            <View style={styles.formGrid}>
              <View style={styles.formCampoGrande}>
                <Text style={styles.label}>Ensino Clínico</Text>

                <Pressable
                  style={styles.selectToggle}
                  onPress={() => {
                    setEnsinoOpen(!ensinoOpen);
                    setInstituicaoOpen(false);
                    setReposicaoOpen(false);
                  }}
                >
                  <Text style={styles.selectToggleText}>
                    {nomeEnsinoSelecionado()}
                  </Text>

                  <Ionicons
                    name={
                      ensinoOpen ? "chevron-up-outline" : "chevron-down-outline"
                    }
                    size={22}
                    color="#160909"
                  />
                </Pressable>

                {ensinoOpen && (
                  <ScrollView style={styles.dropdownBox} nestedScrollEnabled>
                    {ensinos.length === 0 ? (
                      <Text style={styles.textoVazio}>
                        Não existem ensinos clínicos ativos.
                      </Text>
                    ) : (
                      ensinos.map((ensino) => (
                        <Pressable
                          key={ensino.id}
                          style={[
                            styles.opcao,
                            ensinoSelecionado === ensino.id &&
                              styles.opcaoSelecionada,
                          ]}
                          onPress={() => selecionarEnsino(ensino.id)}
                        >
                          <Text style={styles.opcaoTexto}>{ensino.nome}</Text>

                          <Text style={styles.opcaoSubtexto}>
                            {ensino.ano_curricular
                              ? `${ensino.ano_curricular}.º ano`
                              : "Ano não definido"}
                            {ensino.semestre
                              ? ` · ${ensino.semestre}.º semestre`
                              : ""}
                          </Text>
                        </Pressable>
                      ))
                    )}
                  </ScrollView>
                )}
              </View>

              <View style={styles.formCampoPequeno}>
                <Text style={styles.label}>Ano Letivo</Text>

                <TextInput
                  placeholder="2025/2026"
                  placeholderTextColor="#8c8787"
                  style={styles.modalInput}
                  value={anoLetivo}
                  onChangeText={setAnoLetivo}
                />
              </View>
            </View>

            <View style={styles.formGrid}>
              <View style={styles.formCampoPequeno}>
                <Text style={styles.label}>Data Início</Text>

                <Pressable
                  style={styles.dateInput}
                  onPress={() => abrirCalendario("inicio")}
                >
                  <Text
                    style={[
                      styles.dateInputText,
                      !dataInicio && styles.dateInputPlaceholder,
                    ]}
                  >
                    {dataInicio ? formatarDataPT(dataInicio) : "Selecionar"}
                  </Text>

                  <Ionicons name="calendar-outline" size={22} color="#160909" />
                </Pressable>
              </View>

              <View style={styles.formCampoPequeno}>
                <Text style={styles.label}>Data Fim</Text>

                <Pressable
                  style={styles.dateInput}
                  onPress={() => abrirCalendario("fim")}
                >
                  <Text
                    style={[
                      styles.dateInputText,
                      !dataFim && styles.dateInputPlaceholder,
                    ]}
                  >
                    {dataFim ? formatarDataPT(dataFim) : "Selecionar"}
                  </Text>

                  <Ionicons name="calendar-outline" size={22} color="#160909" />
                </Pressable>
              </View>

              <View style={styles.formCampoPequeno}>
                <Text style={styles.label}>Reposição</Text>

                <Pressable
                  style={styles.selectToggle}
                  onPress={() => {
                    setReposicaoOpen(!reposicaoOpen);
                    setEnsinoOpen(false);
                    setInstituicaoOpen(false);
                  }}
                >
                  <Text style={styles.selectToggleText}>
                    {permiteReposicao ? "Sim" : "Não"}
                  </Text>

                  <Ionicons
                    name={
                      reposicaoOpen
                        ? "chevron-up-outline"
                        : "chevron-down-outline"
                    }
                    size={22}
                    color="#160909"
                  />
                </Pressable>

                {reposicaoOpen && (
                  <View style={styles.dropdownModal}>
                    <Pressable
                      style={[
                        styles.opcao,
                        permiteReposicao === true && styles.opcaoSelecionada,
                      ]}
                      onPress={() => {
                        setPermiteReposicao(true);
                        setReposicaoOpen(false);
                      }}
                    >
                      <Text style={styles.opcaoTexto}>Sim</Text>
                    </Pressable>

                    <Pressable
                      style={[
                        styles.opcao,
                        permiteReposicao === false && styles.opcaoSelecionada,
                      ]}
                      onPress={() => {
                        setPermiteReposicao(false);
                        setMaxHorasDia("7");
                        setReposicaoOpen(false);
                      }}
                    >
                      <Text style={styles.opcaoTexto}>Não</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.formGrid}>
              <View style={styles.formCampoPequeno}>
                <Text style={styles.label}>Limite de Faltas (%)</Text>

                <TextInput
                  placeholder="15"
                  placeholderTextColor="#8c8787"
                  style={styles.modalInput}
                  value={limiteFaltas}
                  onChangeText={setLimiteFaltas}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formCampoPequeno}>
                <Text style={styles.label}>Máximo Horas/Dia</Text>

                <TextInput
                  placeholder="7"
                  placeholderTextColor="#8c8787"
                  style={styles.modalInput}
                  value={maxHorasDia}
                  onChangeText={setMaxHorasDia}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.separadorFormulario} />

            <Text style={styles.secaoTitulo}>Hospitais / Instituições</Text>

            <Pressable
              style={styles.selectToggle}
              onPress={() => {
                setInstituicaoOpen(!instituicaoOpen);
                setEnsinoOpen(false);
                setReposicaoOpen(false);
              }}
            >
              <Text style={styles.selectToggleText}>
                {textoInstituicoesSelecionadas()}
              </Text>

              <Ionicons
                name={ instituicaoOpen ? "chevron-up-outline" : "chevron-down-outline"}
                size={22}
                color="#160909"
              />
            </Pressable>

            {instituicaoOpen && (
              <ScrollView style={styles.dropdownBox} nestedScrollEnabled>
                {instituicoes.length === 0 ? (
                  <Text style={styles.textoVazio}>
                    Não existem instituições ativas.
                  </Text>
                ) : (
                  instituicoes.map((instituicao) => {
                    const selecionada = instituicoesSelecionadas.includes(
                      instituicao.id,
                    );

                    return (
                      <Pressable
                        key={instituicao.id}
                        style={[ styles.opcaoCompacta, selecionada && styles.opcaoSelecionada, ]}
                        onPress={() => toggleInstituicao(instituicao.id)}>
                        <Text style={styles.opcaoTexto}>
                          {instituicao.nome}
                        </Text>

                        <Ionicons
                          name={selecionada ? "checkbox-outline" : "square-outline"}
                          size={24}
                          color="#160909"
                        />
                      </Pressable>
                    );
                  })
                )}
              </ScrollView>
            )}

            <Text style={styles.secaoTitulo}>Serviços e vagas</Text>

            {instituicoesSelecionadas.length === 0 ? (
              <View style={styles.avisoLocalBox}>
                <Ionicons
                  name="information-circle-outline"
                  size={22}
                  color="#B77900"
                />

                <Text style={styles.avisoLocalTexto}>
                  Seleciona primeiro um ou mais hospitais para escolher os
                  serviços.
                </Text>
              </View>
            ) : (
              <View style={styles.servicosCompactContainer}>
                {instituicoesSelecionadas.map((instituicaoId) => {
                  const aberto = servicosAbertos[instituicaoId] === true;
                  const listaServicos = servicosPorInstituicao(instituicaoId);
                  const totalSelecionados =
                    totalServicosSelecionadosPorInstituicao(instituicaoId);

                  return (
                    <View key={instituicaoId}  style={styles.hospitalCompactCard}>
                      <Pressable style={styles.hospitalCompactHeader} onPress={() => toggleServicosHospital(instituicaoId)} >
                        <View>
                          <Text style={styles.hospitalCompactTitulo}>
                            {nomeInstituicao(instituicaoId)}
                          </Text>

                          <Text style={styles.hospitalCompactSubtitulo}>
                            {totalSelecionados === 0
                              ? "Nenhum serviço selecionado"
                              : `${totalSelecionados} serviço(s) selecionado(s)`}
                          </Text>
                        </View>

                        <Ionicons
                          name={ aberto  ? "chevron-up-outline"  : "chevron-down-outline" }
                          size={23}
                          color="#160909"
                        />
                      </Pressable>

                      {aberto && (
                        <View style={styles.servicosCompactLista}>
                          {listaServicos.length === 0 ? (
                            <Text style={styles.textoVazio}>
                              Não existem serviços ativos nesta instituição.
                            </Text>
                          ) : (
                            listaServicos.map((servico) => {
                              const selecionado = servicosSelecionados.includes(
                                servico.id,
                              );

                              return (
                                <View key={servico.id}
                                  style={[ styles.servicoCompactLinha,selecionado && styles.servicoCompactLinhaSelecionada,]} >
                                  <Pressable style={styles.servicoCompactCheckArea} onPress={() => toggleServico(servico.id)}>
                                    <Ionicons
                                      name={ selecionado ? "checkbox-outline"  : "square-outline"}
                                      size={23}
                                      color="#160909"
                                    />

                                    <Text style={styles.servicoCompactNome}>
                                      {servico.nome}
                                    </Text>
                                  </Pressable>

                                  <TextInput
                                    placeholder="Vagas"
                                    placeholderTextColor="#8c8787"
                                    style={[ styles.vagasCompactInput,  !selecionado &&  styles.vagasCompactInputDisabled, ]}
                                    value={vagasPorServico[servico.id] || ""}
                                    onChangeText={(valor) =>
                                      atualizarVagasServico(servico.id, valor)
                                    }
                                    editable={selecionado}
                                    keyboardType="numeric"
                                  />
                                </View>
                              );
                            })
                          )}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}

            <View style={styles.popupBotoesLinha}>
              <Pressable
                style={styles.popupBotaoCancelar}
                onPress={() =>
                  router.push(
                    "/backoffice/superadmin/editarEstagio/editarEstagio" as any,
                  )
                }
              >
                <Text style={styles.popupTextoCancelar}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={styles.popupBotaoConfirmar}
                onPress={criarEdicao}
                disabled={aGuardar}
              >
                <Text style={styles.popupTextoConfirmar}>
                  {aGuardar ? "A criar..." : "Criar edição"}
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={calendarioAberto}
        transparent
        animationType="fade"
        onRequestClose={() => setCalendarioAberto(false)}
      >
        <View style={styles.popupOverlay}>
          <View style={styles.calendarioContainer}>
            <View style={styles.calendarioHeader}>
              <Pressable
                style={styles.calendarioSeta}
                onPress={() => mudarMes(-1)}
              >
                <Ionicons
                  name="chevron-back-outline"
                  size={22}
                  color="#160909"
                />
              </Pressable>

              <Text style={styles.calendarioTitulo}>{nomeMes()}</Text>

              <Pressable
                style={styles.calendarioSeta}
                onPress={() => mudarMes(1)}
              >
                <Ionicons
                  name="chevron-forward-outline"
                  size={22}
                  color="#160909"
                />
              </Pressable>
            </View>

            <View style={styles.calendarioSemana}>
              {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((dia) => (
                <Text key={dia} style={styles.calendarioSemanaTexto}>
                  {dia}
                </Text>
              ))}
            </View>

      <View style={styles.calendarioDias}>
        {diasDoMes().map((dia, index) => {
          if (dia === null) {
            return (
              <View key={`empty-${index}`} style={styles.calendarioDiaVazio}/>
            );
          }

        const ano = mesCalendario.getFullYear();
        const mes = mesCalendario.getMonth() + 1;

        const dataISO = `${ano}-${String(mes).padStart(2, "0")}-${String(
          dia
        ).padStart(2, "0")}`;

        const diaPassado = dataMenorQueHoje(dataISO);

        return (
          <Pressable key={`${dataISO}-${index}`} style={[ styles.calendarioDia,  diaPassado && styles.calendarioDiaDesativado, ]}
            disabled={diaPassado}
            onPress={() => selecionarData(dia)}
          >
            <Text
              style={[ styles.calendarioDiaTexto, diaPassado && styles.calendarioDiaTextoDesativado,]}>
              {dia}
            </Text>
          </Pressable>
        );
      })}
    </View>

            <Pressable style={styles.calendarioCancelar}  onPress={() => setCalendarioAberto(false)} >
              <Text style={styles.calendarioCancelarTexto}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

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
