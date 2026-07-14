import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
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
import { supabase } from "../../../lib/supabase";
import styles from "./perfilStyles";

type Utilizador = {
  id: string;
  nome: string;
  email: string;
  numero_identificacao: string | null;
  telefone: string | null;
  morada: string | null;
  data_nascimento: string | null;
  foto_url: string | null;
  instituicao_id: number | null;
  servico_id: number | null;
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

export default function PerfilOrientador() {
  const { from } = useLocalSearchParams();
  const mostrarBottomBar = from === "bottom";

  const [utilizador, setUtilizador] = useState<Utilizador | null>(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [aGuardar, setAGuardar] = useState(false);
  const [aEnviarFoto, setAEnviarFoto] = useState(false);

  const [telefone, setTelefone] = useState("");
  const [morada, setMorada] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

  const [instituicaoId, setInstituicaoId] = useState<number | null>(null);
  const [servicoId, setServicoId] = useState<number | null>(null);

  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);

  const [showInstituicoes, setShowInstituicoes] = useState(false);
  const [showServicos, setShowServicos] = useState(false);

  const [calendarioVisivel, setCalendarioVisivel] = useState(false);
  const [mesCalendario, setMesCalendario] = useState(() => {
    const hoje = new Date();
    return new Date(hoje.getFullYear() - 22, hoje.getMonth(), 1);
  });

  const [popupVisivel, setPopupVisivel] = useState(false);
  const [popupTitulo, setPopupTitulo] = useState("");
  const [popupMensagem, setPopupMensagem] = useState("");
  const [confirmarLogoutVisivel, setConfirmarLogoutVisivel] = useState(false);

  useEffect(() => {
    carregarPerfil();
  }, []);

  const servicosFiltrados = useMemo(() => {
    if (!instituicaoId) return [];

    return servicos.filter(
      (servico) =>
        servico.instituicao_id === instituicaoId && servico.ativo !== false
    );
  }, [servicos, instituicaoId]);

  const diasCalendario = useMemo(() => {
    const ano = mesCalendario.getFullYear();
    const mes = mesCalendario.getMonth();

    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);

    const inicioSemana = primeiroDia.getDay();
    const totalDias = ultimoDia.getDate();

    const vazios = inicioSemana === 0 ? 6 : inicioSemana - 1;

    const lista: (Date | null)[] = [];

    for (let i = 0; i < vazios; i++) {
      lista.push(null);
    }

    for (let dia = 1; dia <= totalDias; dia++) {
      lista.push(new Date(ano, mes, dia));
    }

    return lista;
  }, [mesCalendario]);

  function mostrarPopup(titulo: string, mensagem: string) {
    setPopupTitulo(titulo);
    setPopupMensagem(mensagem);
    setPopupVisivel(true);
  }

  async function carregarPerfil() {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace("/login/login" as any);
      return;
    }

    const { data, error } = await supabase
      .from("utilizadores")
      .select(
        `
        id,
        nome,
        email,
        numero_identificacao,
        telefone,
        morada,
        data_nascimento,
        foto_url,
        instituicao_id,
        servico_id
      `
      )
      .eq("id", authData.user.id)
      .single();

    const { data: instituicoesData } = await supabase
      .from("instituicoes")
      .select("id, nome, ativo")
      .neq("ativo", false)
      .order("nome", { ascending: true });

    const { data: servicosData } = await supabase
      .from("servicos")
      .select("id, nome, instituicao_id, ativo")
      .neq("ativo", false)
      .order("nome", { ascending: true });

    if (error || !data) {
      console.log("ERRO PERFIL ORIENTADOR:", error);
      setLoading(false);
      return;
    }

    setUtilizador(data as any);
    setTelefone(data.telefone || "");
    setMorada(data.morada || "");
    setDataNascimento(data.data_nascimento || "");
    setInstituicaoId(data.instituicao_id || null);
    setServicoId(data.servico_id || null);

    setInstituicoes((instituicoesData as any) || []);
    setServicos((servicosData as any) || []);

    if (data.data_nascimento) {
      const partes = data.data_nascimento.split("-");
      const ano = Number(partes[0]);
      const mes = Number(partes[1]) - 1;

      if (!Number.isNaN(ano) && !Number.isNaN(mes)) {
        setMesCalendario(new Date(ano, mes, 1));
      }
    }

    setLoading(false);
  }

  function dataParaISO(date: Date) {
    const ano = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const dia = String(date.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
  }

  function dataParaTexto(dataISO: string | null | undefined) {
    if (!dataISO) return "";

    const partes = dataISO.split("-");

    if (partes.length !== 3) return "";

    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  }

  function nomeMes(date: Date) {
    return date.toLocaleDateString("pt-PT", {
      month: "long",
      year: "numeric",
    });
  }

  function alterarMes(valor: number) {
    setMesCalendario((atual) => {
      const novo = new Date(atual);
      novo.setMonth(novo.getMonth() + valor);
      return novo;
    });
  }

  function alterarAno(valor: number) {
    setMesCalendario((atual) => {
      const novo = new Date(atual);
      novo.setFullYear(novo.getFullYear() + valor);
      return novo;
    });
  }

  function escolherData(date: Date) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const escolhida = new Date(date);
    escolhida.setHours(0, 0, 0, 0);

    if (escolhida > hoje) {
      mostrarPopup("Data inválida", "A data de nascimento não pode ser futura.");
      return;
    }

    setDataNascimento(dataParaISO(date));
    setCalendarioVisivel(false);
  }

  function nomeInstituicaoSelecionada() {
    const instituicao = instituicoes.find((item) => item.id === instituicaoId);
    return instituicao?.nome || "Selecionar hospital/instituição";
  }

  function nomeServicoSelecionado() {
    const servico = servicos.find((item) => item.id === servicoId);
    return servico?.nome || "Selecionar serviço";
  }

  async function escolherFoto() {
    if (!utilizador || aEnviarFoto) return;

    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissao.granted) {
      mostrarPopup("Erro", "É necessário permitir acesso à galeria.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled) return;

    setAEnviarFoto(true);

    const image = result.assets[0];
    const ext = image.uri.split(".").pop() || "jpg";
    const path = `${utilizador.id}/${Date.now()}.${ext}`;

    const response = await fetch(image.uri);
    const blob = await response.blob();

    const { error: uploadError } = await supabase.storage
      .from("fotos-perfil")
      .upload(path, blob, {
        upsert: true,
        contentType: image.mimeType || "image/jpeg",
      });

    if (uploadError) {
      setAEnviarFoto(false);
      mostrarPopup("Erro", uploadError.message);
      return;
    }

    const { data } = supabase.storage.from("fotos-perfil").getPublicUrl(path);

    const { error } = await supabase
      .from("utilizadores")
      .update({ foto_url: data.publicUrl })
      .eq("id", utilizador.id);

    setAEnviarFoto(false);

    if (error) {
      mostrarPopup("Erro", "Não foi possível atualizar a foto.");
      return;
    }

    setUtilizador({ ...utilizador, foto_url: data.publicUrl });
    mostrarPopup("Sucesso", "Foto atualizada com sucesso.");
  }

  async function guardarDados() {
    if (!utilizador || aGuardar) return;

    if (!instituicaoId) {
      mostrarPopup("Erro", "Seleciona o hospital/instituição.");
      return;
    }

    if (!servicoId) {
      mostrarPopup("Erro", "Seleciona o serviço.");
      return;
    }

    setAGuardar(true);

    const { error } = await supabase
      .from("utilizadores")
      .update({
        telefone: telefone.trim() || null,
        morada: morada.trim() || null,
        data_nascimento: dataNascimento || null,
        instituicao_id: instituicaoId,
        servico_id: servicoId,
      })
      .eq("id", utilizador.id);

    setAGuardar(false);

    if (error) {
      mostrarPopup("Erro", "Não foi possível guardar os dados.");
      return;
    }

    setUtilizador({
      ...utilizador,
      telefone,
      morada,
      data_nascimento: dataNascimento,
      instituicao_id: instituicaoId,
      servico_id: servicoId,
    });

    setEditando(false);
    mostrarPopup("Sucesso", "Perfil atualizado com sucesso.");
  }

  async function terminarSessao() {
    await supabase.auth.signOut();
    router.replace("/login/login" as any);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FDB515" />
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Pressable
          style={styles.voltar}
          onPress={() => router.push("/orientador/home" as any)}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#160909" />
          <Text style={styles.voltarTexto}>Voltar</Text>
        </Pressable>

        <Text style={styles.titulo}>Perfil</Text>

        <View style={styles.cardPerfil}>
          <Pressable style={styles.fotoContainer} onPress={escolherFoto}>
            {utilizador?.foto_url ? (
              <Image source={{ uri: utilizador.foto_url }} style={styles.foto} />
            ) : (
              <Ionicons name="person-circle-outline" size={110} color="#FDB515" />
            )}

            <View style={styles.cameraIcon}>
              <Ionicons name="camera-outline" size={20} color="#160909" />
            </View>
          </Pressable>

          <Text style={styles.nome}>{utilizador?.nome || "Orientador"}</Text>
          <Text style={styles.email}>{utilizador?.email}</Text>
          <Text style={styles.numero}>
            Nº: {utilizador?.numero_identificacao || "-"}
          </Text>

          {aEnviarFoto ? (
            <Text style={styles.uploadTexto}>A atualizar foto...</Text>
          ) : null}
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Hospital / Instituição</Text>

          <Pressable
            style={[styles.selectToggle, !editando && styles.inputBloqueado]}
            disabled={!editando}
            onPress={() => {
              setShowInstituicoes(!showInstituicoes);
              setShowServicos(false);
            }}
          >
            <Text style={styles.selectToggleText}>
              {nomeInstituicaoSelecionada()}
            </Text>

            <Ionicons
              name={showInstituicoes ? "chevron-up-outline" : "chevron-down-outline"}
              size={22}
              color="#160909"
            />
          </Pressable>

          {showInstituicoes && editando && (
            <ScrollView style={styles.dropdownBox} nestedScrollEnabled>
              {instituicoes.map((instituicao) => (
                <Pressable
                  key={instituicao.id}
                  style={[
                    styles.dropdownOption,
                    instituicaoId === instituicao.id &&
                      styles.dropdownOptionSelected,
                  ]}
                  onPress={() => {
                    setInstituicaoId(instituicao.id);
                    setServicoId(null);
                    setShowInstituicoes(false);
                  }}
                >
                  <Text style={styles.dropdownOptionText}>
                    {instituicao.nome}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          )}

          <Text style={styles.label}>Serviço</Text>

          <Pressable
            style={[styles.selectToggle, !editando && styles.inputBloqueado]}
            disabled={!editando}
            onPress={() => {
              if (!instituicaoId) {
                mostrarPopup(
                  "Hospital obrigatório",
                  "Seleciona primeiro o hospital/instituição."
                );
                return;
              }

              setShowServicos(!showServicos);
              setShowInstituicoes(false);
            }}
          >
            <Text style={styles.selectToggleText}>{nomeServicoSelecionado()}</Text>

            <Ionicons
              name={showServicos ? "chevron-up-outline" : "chevron-down-outline"}
              size={22}
              color="#160909"
            />
          </Pressable>

          {showServicos && editando && (
            <ScrollView style={styles.dropdownBox} nestedScrollEnabled>
              {servicosFiltrados.length === 0 ? (
                <Text style={styles.textoVazioDropdown}>
                  Não existem serviços ativos para esta instituição.
                </Text>
              ) : (
                servicosFiltrados.map((servico) => (
                  <Pressable
                    key={servico.id}
                    style={[
                      styles.dropdownOption,
                      servicoId === servico.id && styles.dropdownOptionSelected,
                    ]}
                    onPress={() => {
                      setServicoId(servico.id);
                      setShowServicos(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>{servico.nome}</Text>
                  </Pressable>
                ))
              )}
            </ScrollView>
          )}

          <Text style={styles.label}>Telefone</Text>

          <TextInput
            style={[styles.input, !editando && styles.inputBloqueado]}
            value={telefone}
            onChangeText={setTelefone}
            editable={editando}
            placeholder="Telefone"
            placeholderTextColor="#8c8787"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Morada</Text>

          <TextInput
            style={[
              styles.input,
              styles.inputMorada,
              !editando && styles.inputBloqueado,
            ]}
            value={morada}
            onChangeText={setMorada}
            editable={editando}
            placeholder="Morada"
            placeholderTextColor="#8c8787"
            multiline
          />

          <Text style={styles.label}>Data de nascimento</Text>

          <Pressable
            style={[styles.inputBotao, !editando && styles.inputBloqueado]}
            disabled={!editando}
            onPress={() => setCalendarioVisivel(true)}
          >
            <Text
              style={[
                styles.inputBotaoTexto,
                !dataNascimento && styles.inputBotaoPlaceholder,
              ]}
            >
              {dataNascimento
                ? dataParaTexto(dataNascimento)
                : "Selecionar data"}
            </Text>

            <Ionicons name="calendar-outline" size={22} color="#160909" />
          </Pressable>

          {!editando ? (
            <Pressable style={styles.botaoEditar} onPress={() => setEditando(true)}>
              <Text style={styles.textoBotao}>Editar Perfil</Text>
            </Pressable>
          ) : (
            <View style={styles.botoesLinha}>
              <Pressable
                style={styles.botaoCancelar}
                onPress={() => {
                  setEditando(false);
                  setTelefone(utilizador?.telefone || "");
                  setMorada(utilizador?.morada || "");
                  setDataNascimento(utilizador?.data_nascimento || "");
                  setInstituicaoId(utilizador?.instituicao_id || null);
                  setServicoId(utilizador?.servico_id || null);
                  setShowInstituicoes(false);
                  setShowServicos(false);
                }}
              >
                <Text style={styles.textoCancelar}>Cancelar</Text>
              </Pressable>

              <Pressable style={styles.botaoGuardar} onPress={guardarDados}>
                <Text style={styles.textoGuardar}>
                  {aGuardar ? "A guardar..." : "Guardar"}
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        <Pressable
          style={styles.botaoLogout}
          onPress={() => setConfirmarLogoutVisivel(true)}
        >
          <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
          <Text style={styles.textoLogout}>Terminar Sessão</Text>
        </Pressable>
      </ScrollView>

      {mostrarBottomBar && (
        <View style={styles.bottomBar}>
          <Pressable
            style={styles.bottomItem}
            onPress={() => router.push("/orientador/home" as any)}
          >
            <Ionicons name="home-outline" size={25} color="#160909" />
            <Text style={styles.bottomTexto}>Home</Text>
          </Pressable>

          <Pressable
            style={styles.bottomItem}
            onPress={() =>
              mostrarPopup(
                "Definições",
                "Esta página encontra-se em desenvolvimento."
              )
            }
          >
            <Ionicons name="settings-outline" size={25} color="#160909" />
            <Text style={styles.bottomTexto}>Definições</Text>
          </Pressable>

          <Pressable style={styles.bottomItem}>
            <Ionicons name="person-outline" size={25} color="#FDB515" />
            <Text style={styles.bottomTextoAtivo}>Perfil</Text>
          </Pressable>
        </View>
      )}

      <Modal visible={calendarioVisivel} transparent animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={styles.calendarioContainer}>
            <Text style={styles.calendarioTitulo}>Data de nascimento</Text>

            <View style={styles.calendarioAnoLinha}>
              <Pressable
                style={styles.calendarioAnoBotao}
                onPress={() => alterarAno(-1)}
              >
                <Ionicons name="play-back-outline" size={20} color="#160909" />
              </Pressable>

              <Pressable
                style={styles.calendarioSeta}
                onPress={() => alterarMes(-1)}
              >
                <Ionicons name="chevron-back-outline" size={22} color="#160909" />
              </Pressable>

              <Text style={styles.calendarioMesTexto}>
                {nomeMes(mesCalendario)}
              </Text>

              <Pressable
                style={styles.calendarioSeta}
                onPress={() => alterarMes(1)}
              >
                <Ionicons
                  name="chevron-forward-outline"
                  size={22}
                  color="#160909"
                />
              </Pressable>

              <Pressable
                style={styles.calendarioAnoBotao}
                onPress={() => alterarAno(1)}
              >
                <Ionicons name="play-forward-outline" size={20} color="#160909" />
              </Pressable>
            </View>

            <View style={styles.diasSemanaLinha}>
              {["S", "T", "Q", "Q", "S", "S", "D"].map((dia, index) => (
                <Text key={`${dia}-${index}`} style={styles.diaSemanaTexto}>
                  {dia}
                </Text>
              ))}
            </View>

            <View style={styles.calendarioGrid}>
              {diasCalendario.map((dia, index) => {
                if (!dia) {
                  return <View key={`vazio-${index}`} style={styles.diaVazio} />;
                }

                const dataISO = dataParaISO(dia);
                const selecionado = dataNascimento === dataISO;

                return (
                  <Pressable
                    key={dataISO}
                    style={[
                      styles.diaBotao,
                      selecionado && styles.diaSelecionado,
                    ]}
                    onPress={() => escolherData(dia)}
                  >
                    <Text
                      style={[
                        styles.diaTexto,
                        selecionado && styles.diaTextoSelecionado,
                      ]}
                    >
                      {dia.getDate()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={styles.botaoCancelarCalendario}
              onPress={() => setCalendarioVisivel(false)}
            >
              <Text style={styles.textoCancelarCalendario}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

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

      <Modal visible={confirmarLogoutVisivel} transparent animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>Terminar Sessão</Text>
            <Text style={styles.popupMessage}>
              Tens a certeza que queres terminar sessão?
            </Text>

            <View style={styles.modalBotoes}>
              <Pressable
                style={styles.modalBotaoCancelar}
                onPress={() => setConfirmarLogoutVisivel(false)}
              >
                <Text style={styles.modalBotaoTexto}>Cancelar</Text>
              </Pressable>

              <Pressable style={styles.modalBotaoCriar} onPress={terminarSessao}>
                <Text style={styles.modalBotaoTextoEscuro}>Sair</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}