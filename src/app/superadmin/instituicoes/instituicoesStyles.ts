import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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

  titulo: {
    fontSize: 36,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  subtitulo: {
    fontSize: 16,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    marginTop: 6,
    marginBottom: 26,
  },

  botaoTexto: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  botao: {
    width: "80%",
    height: 60,
    backgroundColor: "#FDB515",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
    marginTop: 10,
    position: "relative",
    alignSelf: "center",
  },

  textoBotaoCriar: {
    fontSize: 30,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    width: "85%",
    maxWidth: 400,
  },

  modalTitulo: {
    fontSize: 20,
    fontWeight: "900",
    color: "#160909",
    marginBottom: 16,
    fontFamily: "serif",
  },

  modalInput: {
    borderWidth: 1,
    borderColor: "#E9E9E9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: "#1f1f1f",
    fontFamily: "serif",
  },

  modalBotoes: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "flex-end",
  },

  modalBotaoCancelar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: "#E9E9E9",
  },

  modalBotaoCriar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: "#FDB515",
  },

  modalBotaoTexto: {
    color: "#160909",
    fontWeight: "700",
    fontFamily: "serif",
  },

  textoVazio: {
  marginTop: 30,
  textAlign: "center",
  fontSize: 18,
  fontWeight: "700",
  color: "#777",
  fontFamily: "serif",
},

lista: {
  marginTop: 20,
  gap: 14,
},

card: {
  backgroundColor: "#E9E9E9",
  borderRadius: 14,
  padding: 16,
  flexDirection: "row",
  alignItems: "center",
  borderLeftWidth: 6,
  borderLeftColor: "#FDB515",
},

cardIcone: {
  width: 50,
  height: 50,
  borderRadius: 25,
  backgroundColor: "#FDB515",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 14,
},

cardInfo: {
  flex: 1,
},

cardTitulo: {
  fontSize: 20,
  fontWeight: "900",
  color: "#160909",
  fontFamily: "serif",
  marginBottom: 4,
},

cardTexto: {
  fontSize: 15,
  fontWeight: "600",
  color: "#666",
  fontFamily: "serif",
},
});

export default styles;
