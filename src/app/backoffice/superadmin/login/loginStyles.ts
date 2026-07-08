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
    backgroundColor: "rgba(5, 9, 16, 0.72)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 40,
  },

  card: {
    width: "100%",
    maxWidth: 1180,
    minHeight: 610,
    backgroundColor: "rgba(255, 255, 255, 0.97)",
    borderRadius: 28,
    padding: 46,
    flexDirection: "row",
    gap: 42,

    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },

  leftSide: {
    flex: 1.1,
    justifyContent: "center",
    paddingRight: 20,
  },

  formCard: {
    flex: 0.9,
    backgroundColor: "#F7F8FA",
    borderRadius: 24,
    padding: 34,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E4E7EC",
  },

  logo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 22,
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#FDB515",
    color: "#160909",
    fontSize: 15,
    fontWeight: "900",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginBottom: 20,
    fontFamily: "serif",
  },

  titulo: {
    fontSize: 48,
    fontWeight: "900",
    color: "#102033",
    fontFamily: "serif",
    lineHeight: 58,
    marginBottom: 22,
  },

  tituloAmarelo: {
    color: "#FDB515",
  },

  texto: {
    maxWidth: 610,
    fontSize: 20,
    fontWeight: "600",
    color: "#344054",
    fontFamily: "serif",
    lineHeight: 30,
    marginBottom: 30,
  },

  infoLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },

  infoTexto: {
    fontSize: 16,
    fontWeight: "700",
    color: "#344054",
    fontFamily: "serif",
  },

  formTitulo: {
    fontSize: 34,
    fontWeight: "900",
    color: "#102033",
    fontFamily: "serif",
    marginBottom: 8,
  },

  formSubtitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#667085",
    fontFamily: "serif",
    marginBottom: 28,
  },

  inputContainer: {
    width: "100%",
    height: 62,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#D0D5DD",
  },

  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 14,
    color: "#1f1f1f",
    fontFamily: "serif",
  },

  esqueci: {
    alignSelf: "flex-end",
    width: "100%",
    textAlign: "right",
    fontSize: 15,
    fontWeight: "800",
    color: "#102033",
    fontFamily: "serif",
    marginBottom: 26,
  },

  botao: {
    width: "100%",
    height: 62,
    backgroundColor: "#FDB515",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  botaoDisabled: {
    opacity: 0.65,
  },

  textoBotao: {
    fontSize: 21,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  voltarApp: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "800",
    color: "#102033",
    fontFamily: "serif",
    textDecorationLine: "underline",
  },
});

const styles = {
  ...local,
  popupOverlay: globalStyles.popupOverlay,
  popupContainer: globalStyles.popupContainer,
  popupTitle: globalStyles.popupTitle,
  popupMessage: globalStyles.popupMessage,
  popupOkButton: globalStyles.popupOkButton,
  popupOkText: globalStyles.popupOkText,
};

export default styles;