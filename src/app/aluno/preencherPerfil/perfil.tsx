import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, Text, TextInput, View,} from "react-native";
import { supabase } from "../../../lib/supabase";
import styles from "./perfilStyles";

export default function PerfilAluno() {
  const [loading, setLoading] = useState(true);
  const [editar, setEditar] = useState(false);
  const [aGuardar, setAGuardar] = useState(false);

  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [numero, setNumero] = useState("");
  const [anoCurricular, setAnoCurricular] = useState("");
  const [telefone, setTelefone] = useState("");
  const [morada, setMorada] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [grau, setGrau] = useState("Licenciatura");
  const [curso, setCurso] = useState("Enfermagem");
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);

  const [popupVisivel, setPopupVisivel] = useState(false);
  const [popupTitulo, setPopupTitulo] = useState("");
  const [popupMensagem, setPopupMensagem] = useState("");
  const [confirmarSair, setConfirmarSair] = useState(false);
  const [mostrarAnos, setMostrarAnos] = useState(false);
  const [calendarioVisivel, setCalendarioVisivel] = useState(false);
  const [mesCalendario, setMesCalendario] = useState(() => {
  const hoje = new Date(); return new Date(hoje.getFullYear() - 22, hoje.getMonth(), 1);});


  const { from } = useLocalSearchParams();
  const mostrarBottomBar = from === "bottom";


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

  function dataParaISO(date: Date) {
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const dia = String(date.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function dataParaTexto(dataISO: string | null | undefined) {
  if (!dataISO) return "";

  const partes = dataISO.split("-");

  if (partes.length !== 3) return dataISO;

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

  async function carregarPerfil() {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace("/login/login" as any);
      return;
    }

    const { data, error } = await supabase
      .from("utilizadores")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (error || !data) {
      mostrarPopup("Erro", "Não foi possível carregar o perfil.");
      setLoading(false);
      return;
    }

    setId(data.id);
    setNome(data.nome || "");
    setEmail(data.email || "");
    setNumero(data.numero_identificacao || "");
    setAnoCurricular(data.ano_curricular ? String(data.ano_curricular) : "");
    setTelefone(data.telefone || "");
    setMorada(data.morada || "");
    setDataNascimento(data.data_nascimento || "");

    if (data.data_nascimento) {
      const partes = data.data_nascimento.split("-");
      const ano = Number(partes[0]);
      const mes = Number(partes[1]) - 1;

    if (!Number.isNaN(ano) && !Number.isNaN(mes)) {
      setMesCalendario(new Date(ano, mes, 1));
    }
  }
    setGrau(data.grau || "Licenciatura");
    setCurso(data.curso || "Enfermagem");
    setFotoUrl(data.foto_url || null);

    setLoading(false);
  }

  useEffect(() => {
    carregarPerfil();
  }, []);

  async function escolherFoto() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissao.granted) {
      mostrarPopup("Erro", "É necessário permitir acesso às fotografias.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled) return;

    const uri = result.assets[0].uri;
    const ext = uri.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${id}.${ext}`;

    const response = await fetch(uri);
    const blob = await response.blob();

    const { error: uploadError } = await supabase.storage
      .from("fotos-perfil")
      .upload(path, blob, {
        upsert: true,
        contentType: `image/${ext}`,
      });

    if (uploadError) {
      mostrarPopup("Erro", uploadError.message);
      return;
    }

    const { data } = supabase.storage.from("fotos-perfil").getPublicUrl(path);
    const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase
      .from("utilizadores")
      .update({ foto_url: publicUrl })
      .eq("id", id);

    if (updateError) {
      mostrarPopup("Erro", updateError.message);
      return;
    }

    setFotoUrl(publicUrl);
    mostrarPopup("Sucesso", "Foto atualizada com sucesso.");
  }

  async function guardarPerfil() {
    if (aGuardar) return;

    if (
      !anoCurricular.trim() ||
      !telefone.trim() ||
      !morada.trim() ||
      !dataNascimento.trim()
    ) {
      mostrarPopup("Erro", "Preenche todos os campos obrigatórios.");
      return;
    }

    setAGuardar(true);

    const { error } = await supabase
      .from("utilizadores")
      .update({
        ano_curricular: Number(anoCurricular),
        telefone: telefone.trim(),
        morada: morada.trim(),
        data_nascimento: dataNascimento.trim(),
        grau: "Licenciatura",
        curso: "Enfermagem",
      })
      .eq("id", id);

    setAGuardar(false);

    if (error) {
      mostrarPopup("Erro", error.message);
      return;
    }

    mostrarPopup("Sucesso", "Perfil atualizado com sucesso.");
    setEditar(false);
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
          onPress={() => router.push("/aluno/home" as any)}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#160909" />
          <Text style={styles.voltarTexto}>Voltar</Text>
        </Pressable>

        <Text style={styles.titulo}>Perfil</Text>

        <View style={styles.cardPerfil}>
          <Pressable style={styles.fotoContainer} onPress={escolherFoto}>
            {fotoUrl ? (
              <Image source={{ uri: fotoUrl }} style={styles.fotoPerfil} />
            ) : (
              <Ionicons
                name="person-circle-outline"
                size={110}
                color="#FDB515"
              />
            )}

            <View style={styles.cameraIcon}>
              <Ionicons name="camera-outline" size={20} color="#160909" />
            </View>
          </Pressable>

          <Text style={styles.nome}>{nome}</Text>
          <Text style={styles.email}>{email}</Text>
          <Text style={styles.numero}>
            Nº Identificação: {numero || "-"}
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Ano curricular</Text>

          <Pressable
            style={[styles.selectToggle, !editar && styles.inputBloqueado]}
            onPress={() => {
              if (editar) setMostrarAnos(!mostrarAnos);
            }}
          >
            <Text style={styles.selectToggleText}>
              {anoCurricular
                ? `${anoCurricular}.º ano`
                : "Selecionar ano curricular"}
            </Text>

            {editar && (
              <Ionicons
                name={mostrarAnos ? "chevron-up" : "chevron-down"}
                size={22}
                color="#160909"
              />
            )}
          </Pressable>

          {editar && mostrarAnos && (
            <View style={styles.dropdown}>
              {["1", "2", "3", "4"].map((ano) => (
                <Pressable
                  key={ano}
                  style={[
                    styles.opcao,
                    anoCurricular === ano && styles.opcaoSelecionada,
                  ]}
                  onPress={() => {
                    setAnoCurricular(ano);
                    setMostrarAnos(false);
                  }}
                >
                  <Text style={styles.opcaoTexto}>{ano}.º ano</Text>
                </Pressable>
              ))}
            </View>
          )}

          <Text style={styles.label}>Grau</Text>
          <TextInput
            style={[styles.input, styles.inputBloqueado]}
            value={grau}
            editable={false}
          />

          <Text style={styles.label}>Curso</Text>
          <TextInput
            style={[styles.input, styles.inputBloqueado]}
            value={curso}
            editable={false}
          />

          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={[styles.input, !editar && styles.inputBloqueado]}
            value={telefone}
            onChangeText={setTelefone}
            editable={editar}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Morada</Text>
          <TextInput
            style={[styles.input, !editar && styles.inputBloqueado]}
            value={morada}
            onChangeText={setMorada}
            editable={editar}
          />

        <Text style={styles.label}>Data de nascimento</Text>

        <Pressable
          style={[styles.inputBotao, !editar && styles.inputBloqueado]}
          disabled={!editar}
          onPress={() => setCalendarioVisivel(true)}
        >
          <Text
            style={[
              styles.inputBotaoTexto,
              !dataNascimento && styles.inputBotaoPlaceholder,
            ]}
          >
            {dataNascimento ? dataParaTexto(dataNascimento) : "Selecionar data"}
          </Text>

          <Ionicons name="calendar-outline" size={22} color="#160909" />
        </Pressable>

          {!editar ? (
            <Pressable
              style={styles.botaoEditar}
              onPress={() => setEditar(true)}
            >
              <Text style={styles.textoBotao}>Editar Perfil</Text>
            </Pressable>
          ) : (
            <View style={styles.botoesLinha}>
              <Pressable
                style={styles.botaoCancelar}
                onPress={() => {
                  setEditar(false);
                  carregarPerfil();
                }}
              >
                <Text style={styles.textoCancelar}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={styles.botaoGuardar}
                onPress={guardarPerfil}
                disabled={aGuardar}
              >
                <Text style={styles.textoGuardar}>
                  {aGuardar ? "A guardar..." : "Guardar"}
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        <Pressable
          style={styles.botaoSair}
          onPress={() => setConfirmarSair(true)}
        >
          <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
          <Text style={styles.textoSair}>Terminar sessão</Text>
        </Pressable>
      </ScrollView>

      {mostrarBottomBar && (
         <View style={styles.bottomBar}>
           <Pressable style={styles.bottomItem}>
             <Ionicons name="home-outline" size={24} color="#000000" />
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
 
           <Pressable
             style={styles.bottomItem}
             onPress={() =>
               router.push("/aluno/preencherPerfil/perfil?from=bottom" as any)
             }
           >
             <Ionicons name="person-outline" size={24} color="#FDB515" />
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

      <Modal visible={confirmarSair} transparent animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>Terminar sessão</Text>
            <Text style={styles.popupMessage}>
              Tens a certeza que queres sair da tua conta?
            </Text>

            <View style={styles.popupBotoesLinha}>
              <Pressable
                style={styles.popupBotaoCancelar}
                onPress={() => setConfirmarSair(false)}
              >
                <Text style={styles.popupTextoCancelar}>Cancelar</Text>
              </Pressable>

              <Pressable style={styles.popupBotaoSair} onPress={terminarSessao}>
                <Text style={styles.popupTextoSair}>Sair</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}