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

  botaoCriar: {
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
    gap: 16,
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
    fontSize: 20,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  cardSubtitulo: {
    fontSize: 15,
    fontWeight: "700",
    color: "#666",
    fontFamily: "serif",
    marginTop: 3,
  },

  detalhes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 6,
  },

  badgeTexto: {
    fontSize: 14,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
  },

  descricao: {
    fontSize: 15,
    fontWeight: "600",
    color: "#555",
    fontFamily: "serif",
    lineHeight: 21,
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
    backgroundColor: "#ffffff",
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 22,
  },

  modalContainer: {
    width: "100%",
    maxHeight: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 22,
  },

  modalTitulo: {
    fontSize: 26,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 18,
    textAlign: "center",
  },

  modalInput: {
    width: "100%",
    height: 56,
    backgroundColor: "#E9E9E9",
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: "700",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 12,
  },

  modalInputDescricao: {
    minHeight: 90,
    textAlignVertical: "top",
    paddingTop: 14,
  },

  tipoTitulo: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 8,
  },

  tipoContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 8,
  },

  tipoOpcao: {
    flex: 1,
    height: 48,
    backgroundColor: "#E9E9E9",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },

  tipoOpcaoSelecionada: {
    backgroundColor: "#FDB515",
    borderColor: "#160909",
  },

  tipoTexto: {
    fontSize: 14,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  modalBotoes: {
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
  },

  modalBotaoCancelar: {
    flex: 1,
    height: 52,
    backgroundColor: "#160909",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  modalBotaoCriar: {
    flex: 1,
    height: 52,
    backgroundColor: "#FDB515",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  modalBotaoTexto: {
    fontSize: 18,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  modalBotaoTextoCancelar: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "serif",
  },
});

export default styles;