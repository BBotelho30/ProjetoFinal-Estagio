import { StyleSheet } from "react-native";
import globalStyles from "../../../../styles/globalStyles";

const local = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  overlay: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(5, 9, 16, 0.70)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  

  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 34,
  },

  badge: {
    backgroundColor: "rgba(253, 181, 21, 0.95)",
    color: "#160909",
    fontSize: 18,
    fontWeight: "900",
    fontFamily: "serif",
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 24,
  },

  titulo1: {
    fontSize: 56,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "serif",
    textAlign: "center",
  },

  tituloAmarelo: {
    fontSize: 56,
    fontWeight: "900",
    color: "#FDB515",
    fontFamily: "serif",
    textAlign: "center",
    marginBottom: 30,
  },

  texto: {
    maxWidth: 850,
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "serif",
    textAlign: "center",
    lineHeight: 40,
    marginBottom: 58,
  },

  botao: {
    width: 310,
    height: 70,
    backgroundColor: "#FDB515",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 12,
    marginBottom: 22,
  },

  textoBotao: {
    fontSize: 34,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  voltar: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: "serif",
    textDecorationLine: "underline",
  },
});

const styles = {
  ...local,
  titulo: globalStyles.titulo,
};

export default styles;