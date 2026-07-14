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

  estadoCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 22,
  },

  estadoTitulo: {
    fontSize: 15,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  estadoTexto: {
    fontSize: 20,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginTop: 4,
  },

  label: {
    fontSize: 17,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 8,
    marginTop: 10,
  },

  documentoCard: {
    backgroundColor: "#E9E9E9",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },

  documentoTitulo: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  documentoTexto: {
    fontSize: 14,
    fontWeight: "700",
    color: "#666",
    fontFamily: "serif",
    marginTop: 2,
  },

  botaoDocumento: {
    minHeight: 56,
    backgroundColor: "#E9E9E9",
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },

  textoDocumento: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
  },

  inputObservacoes: {
    width: "100%",
    minHeight: 110,
    backgroundColor: "#E9E9E9",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: "700",
    color: "#160909",
    fontFamily: "serif",
    textAlignVertical: "top",
    marginBottom: 20,
  },

  botaoSubmeter: {
    width: "100%",
    height: 58,
    backgroundColor: "#FDB515",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  textoBotaoSubmeter: {
    fontSize: 20,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  infoBloqueado: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "800",
    color: "#777",
    fontFamily: "serif",
    textAlign: "center",
  },
  observacoesCard: {
  backgroundColor: "#E9E9E9",
  borderRadius: 14,
  paddingHorizontal: 14,
  paddingVertical: 16,
  marginBottom: 22,
  minHeight: 90,
},

observacoesTexto: {
  fontSize: 15,
  fontWeight: "700",
  color: "#777",
  fontFamily: "serif",
  lineHeight: 22,
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