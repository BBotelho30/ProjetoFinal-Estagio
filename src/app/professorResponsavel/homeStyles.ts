import { StyleSheet } from "react-native";
import globalStyles from "../../styles/globalStyles";

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
    paddingBottom: 60,
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

  subtitulo: {
    fontSize: 16,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    marginTop: 6,
    marginBottom: 24,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 30,
  },

  cardAtalho: {
    width: "48%",
    minHeight: 150,
    backgroundColor: "#E9E9E9",
    borderRadius: 16,
    padding: 16,
    justifyContent: "space-between",
  },

  cardTitulo: {
    fontSize: 20,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  cardTexto: {
    fontSize: 13,
    fontWeight: "700",
    color: "#666",
    fontFamily: "serif",
    marginTop: 5,
  },

  secaoTitulo: {
    fontSize: 24,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 14,
  },

  textoVazio: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
  },

  lista: {
    gap: 12,
  },

  ensinoCard: {
    backgroundColor: "#E9E9E9",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderLeftWidth: 6,
    borderLeftColor: "#FDB515",
  },

  ensinoIcone: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FDB515",
    alignItems: "center",
    justifyContent: "center",
  },

  ensinoTitulo: {
    fontSize: 18,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  ensinoTexto: {
    fontSize: 14,
    fontWeight: "700",
    color: "#666",
    fontFamily: "serif",
    marginTop: 4,
  },

    resumoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 24,
    marginBottom: 30,
},

    resumoCard: {
    width: "48%",
    minHeight: 130,
    backgroundColor: "#E9E9E9",
    borderRadius: 16,
    padding: 16,
    justifyContent: "space-between",
},

    resumoCardGrande: {
    width: "100%",
    minHeight: 120,
    backgroundColor: "#E9E9E9",
    borderRadius: 16,
    padding: 16,
    justifyContent: "space-between",
    borderLeftWidth: 6,
    borderLeftColor: "#FDB515",
    },

    resumoNumero: {
    fontSize: 34,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    },

    resumoTexto: {
    fontSize: 15,
    fontWeight: "800",
    color: "#666",
    fontFamily: "serif",
    },
});

const styles = {
  ...local,
  titulo: globalStyles.titulo,
  popupOverlay: globalStyles.popupOverlay,
  popupContainer: globalStyles.popupContainer,
  popupTitle: globalStyles.popupTitle,
  popupMessage: globalStyles.popupMessage,
  popupOkButton: globalStyles.popupOkButton,
  popupOkText: globalStyles.popupOkText,
};

export default styles;