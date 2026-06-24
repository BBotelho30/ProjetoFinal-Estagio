import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../../../lib/supabase";
import styles from "./distribuirAlunosStyles";

type Utilizador = {
  id: string;
  nome: string;
  email: string;
  tipo: string;
  numero_identificacao: string | null;
  ano_curricular: number | null;
};

type Edicao = {
  id: number;
  vagas: number;
  ano_letivo: string;
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

type Inscricao = {
  id: number;
  aluno_id: string;
  professor_id: string | null;
  orientador_id: string | null;
  edicao_estagio_id: number;
  estado: string;
  data_inscricao: string | null;
  professor_responsavel_id: string | null;
};

export default function DistribuirAlunos() {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [utilizadores, setUtilizadores] = useState<Utilizador[]>([]);
  const [edicoes, setEdicoes] = useState<Edicao[]>([]);
  const [loading, setLoading] = useState(true);

  const [pesquisa, setPesquisa] = useState("");
  const [filtroAno, setFiltroAno] = useState("todos");
  const [showFilters, setShowFilters] = useState(false);

  const [popupVisivel, setPopupVisivel] = useState(false);
  const [popupTitulo, setPopupTitulo] = useState("");
  const [popupMensagem, setPopupMensagem] = useState("");

  const [confirmarVisivel, setConfirmarVisivel] = useState(false);
  const [idParaApagar, setIdParaApagar] = useState<number | null>(null);

  function mostrarPopup(titulo: string, mensagem: string) {
    setPopupTitulo(titulo);
    setPopupMensagem(mensagem);
    setPopupVisivel(true);
  }

  async function carregarDados() {
    setLoading(true);

    const { data: inscricoesData, error: inscricoesError } = await supabase
      .from("inscricoes_estagio")
      .select(
        "id, aluno_id, professor_id, orientador_id, edicao_estagio_id, estado, data_inscricao, professor_responsavel_id"
      )
      .order("id", { ascending: false });

    const { data: utilizadoresData, error: utilizadoresError } = await supabase
      .from("utilizadores")
      .select(
        "id, nome, email, tipo, numero_identificacao, ano_curricular"
      );

    const { data: edicoesData, error: edicoesError } = await supabase
      .from("edicoes_estagio")
      .select(`
        id,
        vagas,
        ano_letivo,
        ensinos_clinicos(nome, ano_curricular),
        instituicoes(nome),
        servicos(nome)
      `);

    if (inscricoesError || utilizadoresError || edicoesError) {
      console.log("ERRO:", inscricoesError || utilizadoresError || edicoesError);
      mostrarPopup("Erro", "Não foi possível carregar as distribuições.");
    } else {
      setInscricoes((inscricoesData as any) || []);
      setUtilizadores((utilizadoresData as any) || []);
      setEdicoes((edicoesData as any) || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    carregarDados();
  }, []);

  function getUser(id: string | null) {
    if (!id) return null;
    return utilizadores.find((u) => u.id === id) || null;
  }

  function getEdicao(id: number) {
    return edicoes.find((e) => e.id === id) || null;
  }

  async function apagarInscricao() {
    if (!idParaApagar) return;

    const { error } = await supabase
      .from("inscricoes_estagio")
      .delete()
      .eq("id", idParaApagar);

    setConfirmarVisivel(false);
    setIdParaApagar(null);

    if (error) {
      mostrarPopup("Erro", "Não foi possível apagar a distribuição.");
      return;
    }

    mostrarPopup("Sucesso", "Distribuição apagada com sucesso.");
    carregarDados();
  }

  const inscricoesFiltradas = inscricoes.filter((inscricao) => {
    const aluno = getUser(inscricao.aluno_id);
    const professor = getUser(inscricao.professor_id);
    const orientador = getUser(inscricao.orientador_id);
    const edicao = getEdicao(inscricao.edicao_estagio_id);

    const texto = pesquisa.toLowerCase();

    const correspondePesquisa =
      aluno?.nome?.toLowerCase().includes(texto) ||
      aluno?.email?.toLowerCase().includes(texto) ||
      aluno?.numero_identificacao?.toLowerCase().includes(texto) ||
      professor?.nome?.toLowerCase().includes(texto) ||
      orientador?.nome?.toLowerCase().includes(texto) ||
      edicao?.ensinos_clinicos?.nome?.toLowerCase().includes(texto) ||
      edicao?.instituicoes?.nome?.toLowerCase().includes(texto) ||
      edicao?.servicos?.nome?.toLowerCase().includes(texto);

    const correspondeAno =
      filtroAno === "todos"
        ? true
        : edicao?.ensinos_clinicos?.ano_curricular === Number(filtroAno);

    return correspondePesquisa && correspondeAno;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable
        style={styles.voltar}
        onPress={() => router.push("/superadmin/home" as any)}
      >
        <Ionicons name="arrow-back-outline" size={24} color="#160909" />
        <Text style={styles.voltarTexto}>Voltar</Text>
      </Pressable>

      <Text style={styles.titulo}>Distribuir Alunos</Text>

      <Text style={styles.subtitulo}>
        Associar alunos a estágios, professores e orientadores.
      </Text>

      <Pressable
        style={styles.botaoCriar}
        onPress={() => router.push("/superadmin/distribuirAlunos/criarDistribuicao" as any)}
      >
        <Text style={styles.textoBotaoCriar}>Nova distribuição</Text>
      </Pressable>

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

      {showFilters ? (
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
      ) : null}

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#FDB515"
          style={{ marginTop: 30 }}
        />
      ) : inscricoesFiltradas.length === 0 ? (
        <Text style={styles.textoVazio}>
          Ainda não existem alunos distribuídos.
        </Text>
      ) : (
        <View style={styles.lista}>
          {inscricoesFiltradas.map((inscricao) => {
            const aluno = getUser(inscricao.aluno_id);
            const professor = getUser(inscricao.professor_id);
            const orientador = getUser(inscricao.orientador_id);
            const edicao = getEdicao(inscricao.edicao_estagio_id);

            return (
              <View key={inscricao.id} style={styles.card}>
                <View style={styles.cardTopo}>
                  <View style={styles.cardIcone}>
                    <Ionicons name="school-outline" size={28} color="#160909" />
                  </View>

                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitulo}>
                      {aluno?.nome || "Aluno"}
                    </Text>

                    <Text style={styles.cardSubtitulo}>
                      {aluno?.numero_identificacao
                        ? `Nº ${aluno.numero_identificacao}`
                        : aluno?.email || ""}
                    </Text>
                  </View>
                </View>

                <Text style={styles.cardTexto}>
                  {`Estágio: ${
                    edicao?.ensinos_clinicos?.nome || "Não indicado"
                  }`}
                </Text>

                <Text style={styles.cardTexto}>
                  {`Local: ${edicao?.instituicoes?.nome || "Instituição"} · ${
                    edicao?.servicos?.nome || "Serviço"
                  }`}
                </Text>

                <Text style={styles.cardTexto}>
                  {`Professor: ${professor?.nome || "Não indicado"}`}
                </Text>

                <Text style={styles.cardTexto}>
                  {`Orientador: ${orientador?.nome || "Não indicado"}`}
                </Text>

                <Text style={styles.estado}>
                  {`Estado: ${inscricao.estado}`}
                </Text>

                <View style={styles.cardActions}>
                  <Pressable
                    style={[styles.actionButton, styles.actionEdit]}
                    onPress={() =>
                      router.push(
                        `/superadmin/distribuirAlunos/criarDistribuicao?inscricaoId=${inscricao.id}` as any
                      )
                    }
                  >
                    <Ionicons name="pencil-outline" size={18} color="#160909" />
                    <Text style={styles.actionText}>Editar</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.actionButton, styles.actionDelete]}
                    onPress={() => {
                      setIdParaApagar(inscricao.id);
                      setConfirmarVisivel(true);
                    }}
                  >
                    <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
                    <Text style={[styles.actionText, { color: "#FFFFFF" }]}>
                      Apagar
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      )}

      <Modal visible={popupVisivel} transparent animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>{popupTitulo}</Text>
            <Text style={styles.popupMessage}>{popupMensagem}</Text>

            <Pressable
              style={styles.popupOkButton}
              onPress={() => setPopupVisivel(false)}
            >
              <Text style={styles.popupOkText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={confirmarVisivel} transparent animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>Confirmar</Text>
            <Text style={styles.popupMessage}>
              Tens a certeza que queres apagar esta distribuição?
            </Text>

            <View style={styles.popupBotoesLinha}>
              <Pressable
                style={styles.popupBotaoCancelar}
                onPress={() => {
                  setConfirmarVisivel(false);
                  setIdParaApagar(null);
                }}
              >
                <Text style={styles.popupTextoCancelar}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={styles.popupBotaoApagar}
                onPress={apagarInscricao}
              >
                <Text style={styles.popupTextoApagar}>Apagar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}