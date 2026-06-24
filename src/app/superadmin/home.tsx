import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import styles from "./homeStyles";



export default function SuperAdminHome() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.titulo}>Olá, Admin</Text>
      <Text style={styles.subtitulo}>Gestão do Passaporte de Enfermagem</Text>

      <Pressable onPress={() => router.push("/superadmin/perfil/perfil" as any)}>
      <Ionicons name = "person-circle-outline" size={75} color="#FDB515" style={styles.icone1} />
      </Pressable>

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

          <Pressable style={styles.card} onPress={() => router.push("/superadmin/utilizadores/utilizadores" as any)}>
          <Ionicons name="people-outline" size={36} color="#FDB515" />
            <View style={styles.cardTexto}>
            <Text style={styles.cardTitulo}>Utilizadores</Text>
            <Text style={styles.cardDescricao}>
                Consultar alunos, professores e orientadores aprovados.
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
          onPress={() => router.push({ pathname: "/superadmin/ensinos-clinicos/ensinos-clinicos" } as any)}
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
          onPress={() => router.push({ pathname: "/superadmin/editarEstagio/editarEstagio" } as any)}
        >
          <Ionicons name="calendar-outline" size={36} color="#FDB515" />
          <View style={styles.cardTexto}>
            <Text style={styles.cardTitulo}>Edições de Estágio</Text>
            <Text style={styles.cardDescricao}>
              Criar vagas por ano letivo, instituição e serviço.
            </Text>
          </View>
        </Pressable>

        <Pressable style={styles.card} onPress={() => router.push("/superadmin/professoresResponsaveis/professoresResponsaveis" as any)}>
          <Ionicons name="ribbon-outline" size={36} color="#FDB515" />
          <View style={styles.cardTexto}>
          <Text style={styles.cardTitulo}>Professores Responsáveis</Text>
          <Text style={styles.cardDescricao}>
            Nomear professores responsáveis por ensinos clínicos.
          </Text>
        </View>
      </Pressable>

      <Pressable style={styles.card} onPress={() => router.push("/superadmin/criar_equipas/equipasEstagio" as any)}>
        <Ionicons name="people-circle-outline" size={36} color="#FDB515" />
        <View style={styles.cardTexto}>
        <Text style={styles.cardTitulo}>Equipas dos Estágios</Text>
        <Text style={styles.cardDescricao}>
          Associar professores e orientadores às edições de estágio.
        </Text>
      </View>
    </Pressable>

         <Pressable style={styles.card} onPress={() => router.push("/superadmin/distribuirAlunos/distribuirAlunos" as any)}>
          <Ionicons name="ribbon-outline" size={36} color="#FDB515" />
          <View style={styles.cardTexto}>
          <Text style={styles.cardTitulo}>Distribuir Alunos</Text>
          <Text style={styles.cardDescricao}>
            Associar alunos a estágios, professores e orientadores.
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