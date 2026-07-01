import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { supabase } from "../../../lib/supabase";
import styles from "./criar-estagioStyles";

type EnsinoClinico = {
  id: number;
  nome: string;
};

type Instituicao = {
  id: number;
  nome: string;
};

type Servico = {
  id: number;
  nome: string;
  instituicao_id: number;
};

// Página para criar uma nova edição de estágio, com dropdowns para selecionar ensino clínico, instituição e serviço, e campos para ano letivo, vagas, data início e data fim
export default function CriarEstagio() {
  const [ensinos, setEnsinos] = useState<EnsinoClinico[]>([]);
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);

  const [ensinoSelecionado, setEnsinoSelecionado] = useState<number | null>(null);
  const [instituicaoSelecionada, setInstituicaoSelecionada] = useState<number | null>(null);
  const [servicoSelecionado, setServicoSelecionado] = useState<number | null>(null);
  const [ensinoOpen, setEnsinoOpen] = useState(false);
  const [instituicaoOpen, setInstituicaoOpen] = useState(false);
  const [servicoOpen, setServicoOpen] = useState(false);

  const [anoLetivo, setAnoLetivo] = useState("");
  const [vagas, setVagas] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const [permiteReposicao, setPermiteReposicao] = useState(false);
  const [limiteFaltas, setLimiteFaltas] = useState("15");
  const [maxHorasDia, setMaxHorasDia] = useState("7");
  const [loading, setLoading] = useState(false);

  const [mostrarReposicao, setMostrarReposicao] = useState(false);

  const servicosFiltrados = servicos.filter(
    (servico) => servico.instituicao_id === instituicaoSelecionada,
  );

  // carregar ensinos clínicos, instituições e serviços para os dropdowns
  async function carregarDados() {
    const { data: ensinosData } = await supabase
      .from("ensinos_clinicos")
      .select("id, nome")
      .order("id", { ascending: true });

    const { data: instituicoesData } = await supabase
      .from("instituicoes")
      .select("id, nome")
      .order("nome", { ascending: true });

    const { data: servicosData } = await supabase
      .from("servicos")
      .select("id, nome, instituicao_id")
      .order("nome", { ascending: true });

    setEnsinos(ensinosData || []);
    setInstituicoes(instituicoesData || []);
    setServicos(servicosData || []);
  }

  // função para criar a edição de estágio na base de dados
  async function criarEstagio() {
    if (loading) return;

    if (!ensinoSelecionado || !instituicaoSelecionada || !servicoSelecionado) {
      Alert.alert(
        "Erro",
        "Seleciona o ensino clínico, a instituição e o serviço.",
      );
      return;
    }

    if (!anoLetivo.trim() || !vagas.trim()) {
      Alert.alert("Erro", "Preenche o ano letivo e o número de vagas.");
      return;
    }

    setLoading(true);

    //inserir estágio na base de dados
    const { error } = await supabase.from("edicoes_estagio").insert([
      {
          ensino_clinico_id: ensinoSelecionado,
          instituicao_id: instituicaoSelecionada,
          servico_id: servicoSelecionado,
          ano_letivo: anoLetivo.trim(),
          vagas: Number(vagas),
          data_inicio: dataInicio.trim() || null,
          data_fim: dataFim.trim() || null,

          permite_reposicao_horas: permiteReposicao,
          limite_faltas_percentagem: Number(limiteFaltas),
          max_horas_dia: Number(maxHorasDia),

          estado: "ativo",
      },

      
    ]);

    //se não permitir reposição, definir maxHorasDia para 7
      useEffect(() => {
        if (!permiteReposicao) {
          setMaxHorasDia("7");
        }
      }, [permiteReposicao]);

    setLoading(false);

    //se der erro mostrar alerta
    if (error) {
      console.log("ERRO AO CRIAR ESTÁGIO:", error);
      Alert.alert("Erro", error.message);
      return;
    }

    //mandar para a pagian editar o estágio criado
    Alert.alert("Sucesso", "Edição de estágio criada com sucesso!");
    router.push("/superadmin/editarEstagio/editarEstagio" as any);
  }

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable
        style={styles.voltar}
        onPress={() =>
          router.push("/superadmin/editarEstagio/editarEstagio" as any)
        }
      >
        <Ionicons name="arrow-back-outline" size={24} color="#160909" />
        <Text style={styles.voltarTexto}>Voltar</Text>
      </Pressable>

      <Text style={styles.titulo}>Criar Edição</Text>
      <Text style={styles.subtitulo}>
        Define o ensino clínico, instituição, serviço, ano letivo e vagas.
      </Text>

      <Text style={styles.label}>Ensino Clínico</Text>
      <Pressable
        style={styles.selectToggle}
        onPress={() => {
          setEnsinoOpen((s) => !s);
          setInstituicaoOpen(false);
          setServicoOpen(false);
        }}
      >
        <Text style={styles.selectToggleText}>
          {ensinoSelecionado
            ? ensinos.find((e) => e.id === ensinoSelecionado)?.nome
            : "Selecionar ensino..."}
        </Text>
        <Ionicons
          name={ensinoOpen ? "chevron-up-outline" : "chevron-down-outline"}
          size={22}
          color="#160909"
        />
      </Pressable>

      {ensinoOpen && (
        <ScrollView style={styles.instituicoesBox} nestedScrollEnabled>
          {ensinos.length === 0 ? (
            <Text style={styles.textoVazioModal}>
              Ainda não existem ensinos clínicos.
            </Text>
          ) : (
            ensinos.map((ensino) => (
              <Pressable
                key={ensino.id}
                style={[
                  styles.opcaoInstituicao,
                  ensinoSelecionado === ensino.id &&
                    styles.opcaoInstituicaoSelecionada,
                ]}
                onPress={() => {
                  setEnsinoSelecionado(ensino.id);
                  setEnsinoOpen(false);
                }}
              >
                <Text style={styles.opcaoInstituicaoTexto}>{ensino.nome}</Text>
              </Pressable>
            ))
          )}
        </ScrollView>
      )}

      <Text style={styles.label}>Instituição</Text>
      <Pressable
        style={styles.selectToggle}
        onPress={() => {
          setInstituicaoOpen((s) => !s);
          setEnsinoOpen(false);
          setServicoOpen(false);
        }}
      >
        <Text style={styles.selectToggleText}>
          {instituicaoSelecionada
            ? instituicoes.find((i) => i.id === instituicaoSelecionada)?.nome
            : "Selecionar instituição..."}
        </Text>
        <Ionicons
          name={instituicaoOpen ? "chevron-up-outline" : "chevron-down-outline"}
          size={22}
          color="#160909"
        />
      </Pressable>

      {instituicaoOpen && (
        <ScrollView style={styles.instituicoesBox} nestedScrollEnabled>
          {instituicoes.length === 0 ? (
            <Text style={styles.textoVazioModal}>
              Ainda não existem instituições.
            </Text>
          ) : (
            instituicoes.map((instituicao) => (
              <Pressable
                key={instituicao.id}
                style={[
                  styles.opcaoInstituicao,
                  instituicaoSelecionada === instituicao.id &&
                    styles.opcaoInstituicaoSelecionada,
                ]}
                onPress={() => {
                  setInstituicaoSelecionada(instituicao.id);
                  setServicoSelecionado(null);
                  setInstituicaoOpen(false);
                }}
              >
                <Text style={styles.opcaoInstituicaoTexto}>
                  {instituicao.nome}
                </Text>
              </Pressable>
            ))
          )}
        </ScrollView>
      )}

      <Text style={styles.label}>Serviço</Text>
      <Pressable
        style={styles.selectToggle}
        onPress={() => {
          setServicoOpen((s) => !s);
          setEnsinoOpen(false);
          setInstituicaoOpen(false);
        }}
      >
        <Text style={styles.selectToggleText}>
          {servicoSelecionado
            ? servicos.find((s) => s.id === servicoSelecionado)?.nome
            : "Selecionar serviço..."}
        </Text>
        <Ionicons
          name={servicoOpen ? "chevron-up-outline" : "chevron-down-outline"}
          size={22}
          color="#160909"
        />
      </Pressable>

      {servicoOpen && (
        <ScrollView style={styles.instituicoesBox} nestedScrollEnabled>
          {servicosFiltrados.length === 0 ? (
            <Text style={styles.textoVazioModal}>
              Seleciona uma instituição com serviços.
            </Text>
          ) : (
            servicosFiltrados.map((servico) => (
              <Pressable
                key={servico.id}
                style={[
                  styles.opcaoInstituicao,
                  servicoSelecionado === servico.id &&
                    styles.opcaoInstituicaoSelecionada,
                ]}
                onPress={() => {
                  setServicoSelecionado(servico.id);
                  setServicoOpen(false);
                }}
              >
                <Text style={styles.opcaoInstituicaoTexto}>{servico.nome}</Text>
              </Pressable>
            ))
          )}
        </ScrollView>
      )}

    <Text style={styles.label}>Ano Letivo</Text>
      <TextInput
        placeholder="ex: 2025/2026"
        placeholderTextColor="#8c8787"
        style={styles.input}
        value={anoLetivo}
        onChangeText={setAnoLetivo}
      />

    <Text style={styles.label}>Número de Vagas</Text>
      <TextInput
        placeholder="ex: 10"
        placeholderTextColor="#8c8787"
        style={styles.input}
        value={vagas}
        onChangeText={setVagas}
        keyboardType="numeric"
      />

    <Text style={styles.label}>Data Inicio</Text>
      <TextInput
        placeholder="ex:2026-01-15"
        placeholderTextColor="#8c8787"
        style={styles.input}
        value={dataInicio}
        onChangeText={setDataInicio}
      />

    <Text style={styles.label}>Data Fim</Text>
      <TextInput
        placeholder="ex: 2026-03-15"
        placeholderTextColor="#8c8787"
        style={styles.input}
        value={dataFim}
        onChangeText={setDataFim}
      />

    <Text style={styles.label}>Permite Reposição de Horas?</Text>

    <Pressable
      style={styles.selectToggle}
      onPress={() => setMostrarReposicao(!mostrarReposicao)}
    >
      <Text style={styles.selectToggleText}>
        {permiteReposicao ? "Sim" : "Não"}
      </Text>

      <Ionicons
        name={mostrarReposicao ? "chevron-up" : "chevron-down"}
        size={22}
        color="#160909"
      />
    </Pressable>

    {mostrarReposicao ? (
      <View style={styles.dropdown}>
        <Pressable
          style={[
            styles.opcao,
            permiteReposicao === true && styles.opcaoSelecionada,
          ]}
          onPress={() => {
            setPermiteReposicao(true);
            setMostrarReposicao(false);
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
            setMostrarReposicao(false);
          }}
        >
          <Text style={styles.opcaoTexto}>Não</Text>
        </Pressable>
      </View>
    ) : null}

      <Text style={styles.label}>Limite de Faltas (%)</Text>

      <TextInput
        placeholder="15"
        placeholderTextColor="#8c8787"
        style={styles.input}
        value={limiteFaltas}
        onChangeText={setLimiteFaltas}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Máximo de Horas por Dia</Text>

      <TextInput
        placeholder="7"
        placeholderTextColor="#8c8787"
        style={styles.input}
        value={maxHorasDia}
        onChangeText={setMaxHorasDia}
        keyboardType="numeric"
      />

      <Text style={styles.subtitulo}>
        {permiteReposicao
          ? "Os alunos podem compensar horas perdidas."
          : "Os alunos não podem compensar horas. Conta para o limite de faltas."}
      </Text>

      <Pressable
        style={styles.botaoCriar}
        onPress={criarEstagio}
        disabled={loading}
      >
        <Text style={styles.textoBotao}>
          {loading ? "A criar..." : "Criar edição"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
