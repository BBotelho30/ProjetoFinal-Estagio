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
import styles from "./equipasEstagioStyles";

type Edicao = {
  id: number;
  vagas: number;
  ano_letivo: string;
  ensinos_clinicos?: { nome: string; ano_curricular: number };
  instituicoes?: { nome: string };
  servicos?: { nome: string };
};

type ProfessorEstagio = {
  id: number;
  edicao_estagio_id: number;
  max_alunos: number;
  utilizadores?: { nome: string };
};

type OrientadorEstagio = {
  id: number;
  edicao_estagio_id: number;
  max_alunos: number;
  utilizadores?: { nome: string };
};

export default function EquipasEstagio() {
  const [edicoes, setEdicoes] = useState<Edicao[]>([]);
  const [professores, setProfessores] = useState<ProfessorEstagio[]>([]);
  const [orientadores, setOrientadores] = useState<OrientadorEstagio[]>([]);
  const [loading, setLoading] = useState(true);

  const [pesquisa, setPesquisa] = useState("");
  const [filtroAno, setFiltroAno] = useState("todos");
  const [showFilters, setShowFilters] = useState(false);

  const [popupVisivel, setPopupVisivel] = useState(false);
  const [popupTitulo, setPopupTitulo] = useState("");
  const [popupMensagem, setPopupMensagem] = useState("");

  const [confirmarVisivel, setConfirmarVisivel] = useState(false);
  const [edicaoParaApagar, setEdicaoParaApagar] = useState<number | null>(null);

  function mostrarPopup(titulo: string, mensagem: string) {
    setPopupTitulo(titulo);
    setPopupMensagem(mensagem);
    setPopupVisivel(true);
  }

  async function carregarDados() {
    setLoading(true);

    const { data: edicoesData, error: edicoesError } = await supabase
      .from("edicoes_estagio")
      .select(`
        id,
        vagas,
        ano_letivo,
        ensinos_clinicos(nome, ano_curricular),
        instituicoes(nome),
        servicos(nome)
      `)
      .order("id", { ascending: false });


    const { data: professoresData, error: professoresError } = await supabase
      .from("professores_estagio")
      .select(`
        id,
        edicao_estagio_id,
        max_alunos,
        utilizadores(nome)
      `); 

      // Verificar erros e mostrar popup se necessário
    const { data: orientadoresData, error: orientadoresError } = await supabase 
      .from("orientadores_estagio")
      .select(`
        id,
        edicao_estagio_id,
        max_alunos,
        utilizadores(nome)
      `);

      // Verificar erros e mostrar popup se necessário
    if (edicoesError || professoresError || orientadoresError) {
      console.log("ERRO:", edicoesError || professoresError || orientadoresError);
      mostrarPopup("Erro", "Não foi possível carregar os dados.");
    } else {
      setEdicoes((edicoesData as any) || []); 
      setProfessores((professoresData as any) || []);
      setOrientadores((orientadoresData as any) || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    carregarDados();
  }, []);

  function contarAtribuidos(edicaoId: number) {
    return 0;
  }

  async function apagarEquipa() {
    if (!edicaoParaApagar) return;

    const { error: profError } = await supabase
      .from("professores_estagio")
      .delete()
      .eq("edicao_estagio_id", edicaoParaApagar);

    const { error: orientError } = await supabase
      .from("orientadores_estagio")
      .delete()
      .eq("edicao_estagio_id", edicaoParaApagar);

    setConfirmarVisivel(false);
    setEdicaoParaApagar(null);

    if (profError || orientError) {
      mostrarPopup("Erro", "Não foi possível apagar a equipa.");
      return;
    }

    mostrarPopup("Sucesso", "Equipa apagada com sucesso.");
    carregarDados();
  }

  const edicoesFiltradas = edicoes.filter((edicao) => {
    const texto = pesquisa.toLowerCase();

    const profs = professores.filter((p) => p.edicao_estagio_id === edicao.id);
    const orients = orientadores.filter((o) => o.edicao_estagio_id === edicao.id);

    const temEquipa = profs.length > 0 || orients.length > 0;

    const correspondePesquisa =
      edicao.ensinos_clinicos?.nome?.toLowerCase().includes(texto) ||
      edicao.instituicoes?.nome?.toLowerCase().includes(texto) ||
      edicao.servicos?.nome?.toLowerCase().includes(texto) ||
      edicao.ano_letivo?.toLowerCase().includes(texto);

    const correspondeAno =
      filtroAno === "todos"
        ? true
        : edicao.ensinos_clinicos?.ano_curricular === Number(filtroAno);

    return temEquipa && correspondePesquisa && correspondeAno;
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

      <Text style={styles.titulo}>Equipas dos Estágios</Text>
      <Text style={styles.subtitulo}>
        Associar professores e orientadores às edições de estágio.
      </Text>

      <Pressable
        style={styles.botaoCriar}
        onPress={() => router.push("/superadmin/criar_equipas/criarEquipaEstagio" as any)}
      >
        <Text style={styles.textoBotaoCriar}>Criar equipa</Text>
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
        <ActivityIndicator size="large" color="#FDB515" style={{ marginTop: 30 }} />
      ) : edicoesFiltradas.length === 0 ? (
        <Text style={styles.textoVazio}>Ainda não existem equipas criadas.</Text>
      ) : (
        <View style={styles.lista}>
          {edicoesFiltradas.map((edicao) => {
            const profs = professores.filter((p) => p.edicao_estagio_id === edicao.id);
            const orients = orientadores.filter((o) => o.edicao_estagio_id === edicao.id);

            const atribuidos = contarAtribuidos(edicao.id);
            const disponiveis = edicao.vagas - atribuidos;

            return (
              <View key={edicao.id} style={styles.card}>
                <View style={styles.cardTopo}>
                  <View style={styles.cardIcone}>
                    <Ionicons name="people-outline" size={28} color="#160909" />
                  </View>

                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitulo}>
                      {edicao.ensinos_clinicos?.nome || "Ensino Clínico"}
                    </Text>
                    <Text style={styles.cardSubtitulo}>
                      {`${edicao.instituicoes?.nome || "Instituição"} · ${
                        edicao.servicos?.nome || "Serviço"
                      }`}
                    </Text>
                  </View>
                </View>

                <View style={styles.resumoLinha}>
                  <Text style={styles.resumoTexto}>Vagas: {edicao.vagas}</Text>
                  <Text style={styles.resumoTexto}>Atribuídos: {atribuidos}</Text>
                  <Text style={styles.resumoTexto}>Disponíveis: {disponiveis}</Text>
                </View>

                <Text style={styles.secaoCard}>Professores</Text>
                {profs.map((prof) => (
                  <Text key={prof.id} style={styles.cardTexto}>
                    {`• ${prof.utilizadores?.nome || "Professor"} — limite ${prof.max_alunos}`}
                  </Text>
                ))}

                <Text style={styles.secaoCard}>Orientadores</Text>
                {orients.map((orient) => (
                  <Text key={orient.id} style={styles.cardTexto}>
                    {`• ${orient.utilizadores?.nome || "Orientador"} — limite ${orient.max_alunos}`}
                  </Text>
                ))}

                <View style={styles.cardActions}>
                  <Pressable
                    style={[styles.actionButton, styles.actionEdit]}
                    onPress={() =>
                      router.push(
                        `/superadmin/criar_equipas/criarEquipaEstagio?edicaoId=${edicao.id}` as any
                      )
                    }
                  >
                    <Ionicons name="pencil-outline" size={18} color="#160909" />
                    <Text style={styles.actionText}>Editar</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.actionButton, styles.actionDelete]}
                    onPress={() => {
                      setEdicaoParaApagar(edicao.id);
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
              Tens a certeza que queres apagar esta equipa?
            </Text>

            <View style={styles.popupBotoesLinha}>
              <Pressable
                style={styles.popupBotaoCancelar}
                onPress={() => {
                  setConfirmarVisivel(false);
                  setEdicaoParaApagar(null);
                }}
              >
                <Text style={styles.popupTextoCancelar}>Cancelar</Text>
              </Pressable>

              <Pressable style={styles.popupBotaoApagar} onPress={apagarEquipa}>
                <Text style={styles.popupTextoApagar}>Apagar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}