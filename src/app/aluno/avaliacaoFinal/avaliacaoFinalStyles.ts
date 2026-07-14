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

  loadingContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
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
    marginTop: 30,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
  },

  estagioCard: {
    backgroundColor: "#E9E9E9",
    borderRadius: 16,
    padding: 16,
    marginTop: 22,
    marginBottom: 16,
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
    marginTop: 4,
  },

  notaCard: {
    backgroundColor: "#FDB515",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 22,
    alignItems: "center",
  },

  notaTitulo: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 8,
  },

  notaValor: {
    fontSize: 34,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    textAlign: "center",
  },

  notaData: {
    fontSize: 14,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
    marginTop: 8,
    textAlign: "center",
  },

  label: {
    fontSize: 17,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 8,
    marginTop: 10,
  },

  observacoesCard: {
    backgroundColor: "#E9E9E9",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 16,
    marginBottom: 22,
    minHeight: 90,
  },

  observacaoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },

  observacaoHeaderTexto: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  observacoesTexto: {
    fontSize: 15,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    lineHeight: 22,
  },

  infoBloqueado: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "800",
    color: "#777",
    fontFamily: "serif",
    textAlign: "center",
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