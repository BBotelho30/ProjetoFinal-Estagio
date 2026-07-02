import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { supabase } from "../../lib/supabase";
import styles from "./homeStyles";

export default function ProfessorResponsavelHome() {
  const [loading, setLoading] = useState(true);

  const [totalEnsinos, setTotalEnsinos] = useState(0);
  const [alunosPorDistribuir, setAlunosPorDistribuir] = useState(0);
  const [distribuicoesEfetuadas, setDistribuicoesEfetuadas] = useState(0);

  const [popupVisivel, setPopupVisivel] = useState(false);
  const [popupTitulo, setPopupTitulo] = useState("");
  const [popupMensagem, setPopupMensagem] = useState("");

  function mostrarPopup(titulo: string, mensagem: string) {
    setPopupTitulo(titulo);
    setPopupMensagem(mensagem);
    setPopupVisivel(true);
  }

  async function carregarDados() {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace("/login/login" as any);
      return;
    }

    const userId = authData.user.id;

    const { data: responsaveis, error: erroResponsaveis } = await supabase
      .from("responsaveis_ensinos_clinicos")
      .select("ensino_clinico_id")
      .eq("professor_id", userId);

    if (erroResponsaveis || !responsaveis || responsaveis.length === 0) {
      setTotalEnsinos(0);
      setAlunosPorDistribuir(0);
      setDistribuicoesEfetuadas(0);
      setLoading(false);
      return;
    }

    const idsEnsinos = responsaveis.map((item: any) => item.ensino_clinico_id);
    setTotalEnsinos(idsEnsinos.length);

    const { data: edicoes, error: erroEdicoes } = await supabase
      .from("edicoes_estagio")
      .select("id")
      .in("ensino_clinico_id", idsEnsinos);

    if (erroEdicoes || !edicoes || edicoes.length === 0) {
      setAlunosPorDistribuir(0);
      setDistribuicoesEfetuadas(0);
      setLoading(false);
      return;
    }

    const idsEdicoes = edicoes.map((item: any) => item.id);

    const { data: inscricoes, error: erroInscricoes } = await supabase
      .from("inscricoes_estagio")
      .select("id, professor_id, orientador_id")
      .in("edicao_estagio_id", idsEdicoes);

    if (erroInscricoes || !inscricoes) {
      setAlunosPorDistribuir(0);
      setDistribuicoesEfetuadas(0);
      setLoading(false);
      return;
    }

    const porDistribuir = inscricoes.filter(
      (item: any) => !item.professor_id || !item.orientador_id
    ).length;

    const distribuidas = inscricoes.filter(
      (item: any) => item.professor_id && item.orientador_id
    ).length;

    setAlunosPorDistribuir(porDistribuir);
    setDistribuicoesEfetuadas(distribuidas);

    setLoading(false);
  }

  useEffect(() => {
    carregarDados();
  }, []);

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

        <Text style={styles.titulo}>Área Responsável</Text>
        <Text style={styles.subtitulo}>
          Gestão dos ensinos clínicos atribuídos pelo administrador.
        </Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FDB515"
            style={{ marginTop: 30 }}
          />
        ) : (
          <>
            <View style={styles.resumoGrid}>
              <View style={styles.resumoCard}>
                <Ionicons name="briefcase-outline" size={30} color="#FDB515" />
                <Text style={styles.resumoNumero}>{totalEnsinos}</Text>
                <Text style={styles.resumoTexto}>Ensinos atribuídos</Text>
              </View>

              <View style={styles.resumoCard}>
                <Ionicons name="alert-circle-outline" size={30} color="#FDB515" />
                <Text style={styles.resumoNumero}>{alunosPorDistribuir}</Text>
                <Text style={styles.resumoTexto}>Por distribuir</Text>
              </View>

              <View style={styles.resumoCardGrande}>
                <Ionicons
                  name="checkmark-done-outline"
                  size={30}
                  color="#FDB515"
                />
                <Text style={styles.resumoNumero}>{distribuicoesEfetuadas}</Text>
                <Text style={styles.resumoTexto}>Distribuições efetuadas</Text>
              </View>
            </View>

            <Text style={styles.secaoTitulo}>Ações rápidas</Text>

            <View style={styles.grid}>
              <Pressable
                style={styles.cardAtalho}
                onPress={() =>
                  router.push(
                    "/professorResponsavel/distribuirAlunos/distribuirAlunos" as any
                  )
                }
              >
                <Ionicons name="people-outline" size={34} color="#FDB515" />
                <Text style={styles.cardTitulo}>Distribuir alunos</Text>
                <Text style={styles.cardTexto}>
                  Atribuir professor e orientador a vários alunos.
                </Text>
              </Pressable>

              <Pressable
                style={styles.cardAtalho}
                onPress={() =>
                  router.push("/professorResponsavel/equipas/equipas" as any)
                }
              >
                <Ionicons name="git-branch-outline" size={34} color="#FDB515" />
                <Text style={styles.cardTitulo}>Criar equipa</Text>
                <Text style={styles.cardTexto}>
                  Definir professores, orientadores e limites.
                </Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>

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
    </View>
  );
}