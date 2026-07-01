import { StyleSheet } from "react-native";
import globalStyles from "../../../styles/globalStyles";

const local = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 50,
  },

  voltar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  voltarTexto: {
    fontSize: 18,
    fontWeight: "800",
    color: "#160909",
    marginLeft: 8,
    fontFamily: "serif",
  },

  textoVazio: {
    marginTop: 26,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
  },

  estagioCard: {
    backgroundColor: "#E9E9E9",
    borderRadius: 16,
    padding: 16,
    marginTop: 22,
    marginBottom: 22,
    borderLeftWidth: 6,
    borderLeftColor: "#FDB515",
  },

  estagioTitulo: {
    fontSize: 22,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 6,
  },

  estagioTexto: {
    fontSize: 15,
    fontWeight: "700",
    color: "#666",
    fontFamily: "serif",
  },

  lista: {
    gap: 14,
  },

  cardComentario: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#D6D6D6",
    borderLeftWidth: 6,
    borderLeftColor: "#FDB515",
  },

  cardTopo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  semanaBadge: {
    backgroundColor: "#FDB515",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  semanaTexto: {
    fontSize: 14,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  dataTexto: {
    fontSize: 14,
    fontWeight: "800",
    color: "#777",
    fontFamily: "serif",
  },

  comentarioTexto: {
    fontSize: 16,
    fontWeight: "700",
    color: "#160909",
    fontFamily: "serif",
    lineHeight: 23,
  },
});

const styles = {
  ...local,
  titulo: globalStyles.titulo,
};

export default styles;