import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, ImageBackground, Pressable, Text, View } from "react-native";
import styles from "./inicioStyles";

export default function InicioBackoffice() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../../../../../assets/images/fundo.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Image
          source={require("../../../../../assets/images/enf.jpg")}
          style={styles.logo}
          resizeMode="cover"
        />

        <Text style={styles.badge}>Área Administrativa</Text>

        <Text style={styles.titulo1}>Passaporte</Text>
        <Text style={styles.tituloAmarelo}>de Enfermagem</Text>

        <Text style={styles.texto}>
          Área administrativa para gerir ensinos clínicos, utilizadores,
          instituições, serviços, equipas e distribuição de alunos.
        </Text>

        <Pressable
          style={styles.botao}
          onPress={() => router.push("/backoffice/superadmin/login/login" as any)}
        >
          <Text style={styles.textoBotao}>Entrar</Text>
          <Ionicons name="arrow-forward" size={28} color="#160909" />
        </Pressable>

        <Pressable onPress={() => router.push("/pagina_inicial/inicio" as any)}>
          <Text style={styles.voltar}>Voltar à aplicação móvel</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}