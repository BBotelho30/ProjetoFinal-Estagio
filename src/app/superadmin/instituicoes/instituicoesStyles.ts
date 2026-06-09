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
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  modalContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 22,
  },

  modalTitulo: {
    fontSize: 28,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 18,
    textAlign: "center",
  },

  label: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 8,
  },

  modalInput: {
    width: "100%",
    height: 58,
    backgroundColor: "#E9E9E9",
    borderRadius: 9,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: "700",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 18,
  },

  modalBotoes: {
    flexDirection: "row",
    gap: 12,
  },

  modalBotaoCancelar: {
    flex: 1,
    height: 52,
    backgroundColor: "#160909",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },

  modalBotaoCriar: {
    flex: 1,
    height: 52,
    backgroundColor: "#FDB515",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },

  modalBotaoTexto: {
    fontSize: 18,
    fontWeight: "900",
    color: "#ffffffff",
    fontFamily: "serif",
  },

  modalBotaoTexto1: {
    fontSize: 18,
    fontWeight: "900",
    color: "#000000ff",
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

  cardActions: {
    marginTop: 12,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },

  actionEdit: {
    backgroundColor: "#ffffffff",
    borderWidth: 1,
    borderColor: "#160909",
  },

  actionDelete: {
    backgroundColor: "#e74c3c",
  },

  actionText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#160909",
    marginLeft: 8,
    fontFamily: "serif",
  },
});

export default styles;
