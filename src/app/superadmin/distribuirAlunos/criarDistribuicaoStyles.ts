import { StyleSheet } from "react-native";
import globalStyles from "../../../styles/globalStyles";

const local = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },

  voltar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 26,
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

  label: {
    fontSize: 17,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 8,
    marginTop: 12,
  },

  selectToggle: {
    width: "100%",
    minHeight: 56,
    backgroundColor: "#E9E9E9",
    borderRadius: 9,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  selectToggleText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#160909",
    fontFamily: "serif",
    marginRight: 8,
  },

  pickerLista: {
    maxHeight: 180,
    marginBottom: 14,
  },

  opcao: {
    backgroundColor: "#E9E9E9",
    borderRadius: 9,
    paddingVertical: 13,
    paddingHorizontal: 14,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },

  opcaoSelecionada: {
    backgroundColor: "#FDB515",
    borderColor: "#160909",
  },

  opcaoTitulo: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  opcaoTexto: {
    fontSize: 13,
    fontWeight: "700",
    color: "#555",
    fontFamily: "serif",
    marginTop: 3,
  },

  alunoCard: {
    backgroundColor: "#E9E9E9",
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },

  alunoSelecionado: {
    backgroundColor: "#FDB515",
    borderColor: "#160909",
  },

  alunoNome: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  alunoTexto: {
    fontSize: 13,
    fontWeight: "700",
    color: "#555",
    fontFamily: "serif",
    marginTop: 2,
  },

  textoVazio: {
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
  },

  botaoGuardar: {
    width: "100%",
    height: 60,
    backgroundColor: "#FDB515",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
  },

  textoBotao: {
    fontSize: 22,
    fontWeight: "900",
    color: "#160909",
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