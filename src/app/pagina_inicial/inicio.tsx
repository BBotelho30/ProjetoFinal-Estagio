import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Pressable, Text, TextInput, View, ImageBackground } from "react-native";
import styles from "./inicioStyles";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const router = useRouter();

return (
  <ImageBackground
    source={require("../../../assets/images/fundo.jpg")}
    style={styles.container}
    resizeMode="cover"
  >
    <View style={styles.overlay}>
      <Image
        source={require("../../../assets/images/enf.jpg")}
        style={styles.logo}
        resizeMode="cover"
      />

      <Text style={styles.titulo1}>Passaporte</Text>
      <Text style={styles.tituloAmarelo}>de Enfermagem</Text>

      <Text style={styles.texto}>Bem-vindo ao Passaporte de Enfermagem, a plataforma que acompanha e organiza o teu percurso nos ensinos clínicos.</Text>

      <Pressable
        style={styles.botao}
        onPress={() => router.push("/login/login")}
      >
        <Text style={styles.textoBotao}>Começar</Text>
      </Pressable>
    </View>
  </ImageBackground>
);
}
