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
    marginBottom: 24,
  },

  botao: {
    width: "100%",
    height: 60,
    backgroundColor: "#FDB515",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  textoBotaoCriar: {
    fontSize: 24,
    fontWeight: "900",
    color: "#160909",
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
    gap: 14,
  },

  card: {
    backgroundColor: "#E9E9E9",
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 6,
    borderLeftColor: "#FDB515",
  },

  cardTopo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  cardIcone: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FDB515",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  cardInfo: {
    flex: 1,
  },

  cardTitulo: {
    fontSize: 19,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  cardSubtitulo: {
    fontSize: 15,
    fontWeight: "800",
    color: "#666",
    fontFamily: "serif",
    marginTop: 3,
  },

  cardTexto: {
    fontSize: 15,
    fontWeight: "700",
    color: "#555",
    fontFamily: "serif",
    marginBottom: 5,
  },

  estado: {
    fontSize: 15,
    fontWeight: "900",
    color: "#B77900",
    fontFamily: "serif",
    marginTop: 6,
    textTransform: "capitalize",
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

  // Modal styles (reused)
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
    height: 52,
    backgroundColor: "#E9E9E9",
    borderRadius: 9,
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: "700",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 14,
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
    marginBottom: 16,
    marginTop: 5,
  },

  selectToggleText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#160909",
    fontFamily: "serif",
  },

  instituicoesBox: {
    maxHeight: 180,
    marginBottom: 16,
  },

  opcaoInstituicao: {
    backgroundColor: "#E9E9E9",
    borderRadius: 9,
    paddingVertical: 13,
    paddingHorizontal: 14,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },

  opcaoInstituicaoSelecionada: {
    backgroundColor: "#FDB515",
    borderColor: "#160909",
  },

  opcaoInstituicaoTexto: {
    fontSize: 16,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
  },

  textoVazioModal: {
    fontSize: 15,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    textAlign: "center",
    marginVertical: 15,
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
});

export default styles;
