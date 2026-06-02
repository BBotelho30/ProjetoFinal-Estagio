import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import styles from "./homeStyles";

export default function SuperAdminHome() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.titulo}>Olá, Admin</Text>
      <Text style={styles.subtitulo}>Gestão do Passaporte de Enfermagem</Text>

      <View style={styles.cardsContainer}>
        <Pressable
          style={styles.card}
          onPress={() => router.push({ pathname: "/superadmin/aprovarConta/aprovarConta" } as any)}
        >
          <Ionicons name="person-add-outline" size={36} color="#FDB515" />
          <View style={styles.cardTexto}>
            <Text style={styles.cardTitulo}>Aprovar Contas</Text>
            <Text style={styles.cardDescricao}>
              Validar alunos, professores e orientadores pendentes.
            </Text>
          </View>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => router.push({ pathname: "/superadmin/instituicoes/instituicoes" } as any)}
        >
          <Ionicons name="business-outline" size={36} color="#FDB515" />
          <View style={styles.cardTexto}>
            <Text style={styles.cardTitulo}>Instituições</Text>
            <Text style={styles.cardDescricao}>
              Gerir hospitais, unidades e instituições parceiras.
            </Text>
          </View>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => router.push({ pathname: "/superadmin/servicos/servicos" } as any)}
        >
          <Ionicons name="medkit-outline" size={36} color="#FDB515" />
          <View style={styles.cardTexto}>
            <Text style={styles.cardTitulo}>Serviços</Text>
            <Text style={styles.cardDescricao}>
              Criar serviços associados às instituições.
            </Text>
          </View>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => router.push({ pathname: "/superadmin/ensinos-clinicos" } as any)}
        >
          <Ionicons name="school-outline" size={36} color="#FDB515" />
          <View style={styles.cardTexto}>
            <Text style={styles.cardTitulo}>Ensinos Clínicos</Text>
            <Text style={styles.cardDescricao}>
              Gerir os ensinos clínicos, anos, semestres e horas.
            </Text>
          </View>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => router.push({ pathname: "/superadmin/estagios" } as any)}
        >
          <Ionicons name="calendar-outline" size={36} color="#FDB515" />
          <View style={styles.cardTexto}>
            <Text style={styles.cardTitulo}>Edições de Estágio</Text>
            <Text style={styles.cardDescricao}>
              Criar vagas por ano letivo, instituição e serviço.
            </Text>
          </View>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => router.push({ pathname: "/superadmin/inscricoes" } as any)}
        >
          <Ionicons name="clipboard-outline" size={36} color="#FDB515" />
          <View style={styles.cardTexto}>
            <Text style={styles.cardTitulo}>Inscrições</Text>
            <Text style={styles.cardDescricao}>
              Ver alunos inscritos e associar professor/orientador.
            </Text>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
}