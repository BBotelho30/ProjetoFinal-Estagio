import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 50,
  },

  voltar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },

  voltarTexto: {
    fontSize: 18,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  titulo: {
    fontSize: 36,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 20,
  },

  alunoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderLeftWidth: 6,
    borderLeftColor: "#FDB515",
  },

  alunoIcone: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: "#FDB515",
    alignItems: "center",
    justifyContent: "center",
  },

  alunoNome: {
    fontSize: 23,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  alunoTexto: {
    fontSize: 14,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    marginTop: 4,
  },

  estagioCard: {
    backgroundColor: "#FDB515",
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#B77900",
  },

  estagioTitulo: {
    fontSize: 23,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    lineHeight: 29,
  },

  estagioTexto: {
    fontSize: 15,
    fontWeight: "800",
    color: "#7A4F00",
    fontFamily: "serif",
    marginTop: 7,
  },

  estadoBox: {
    backgroundColor: "#E9E9E9",
    borderRadius: 16,
    padding: 16,
    marginBottom: 22,
  },

  estadoLabel: {
    fontSize: 15,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 6,
  },

  estadoValor: {
    fontSize: 18,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  secaoTitulo: {
    fontSize: 22,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 14,
  },

  vazioBox: {
    backgroundColor: "#E9E9E9",
    borderRadius: 16,
    padding: 18,
  },

  vazioTitulo: {
    fontSize: 18,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 6,
  },

  vazioTexto: {
    fontSize: 14,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    lineHeight: 20,
  },

  lista: {
    gap: 12,
  },

  relatorioCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    padding: 16,
    borderLeftWidth: 6,
    borderLeftColor: "#FDB515",
  },

  relatorioHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },

  relatorioIcone: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#FDB515",
    alignItems: "center",
    justifyContent: "center",
  },

  relatorioNome: {
    fontSize: 17,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  relatorioData: {
    fontSize: 13,
    fontWeight: "800",
    color: "#777",
    fontFamily: "serif",
    marginTop: 6,
  },

  labelPequena: {
    fontSize: 15,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 8,
  },

  observacaoBox: {
    backgroundColor: "#E9E9E9",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    minHeight: 76,
  },

  relatorioObs: {
    fontSize: 14,
    fontWeight: "700",
    color: "#666",
    fontFamily: "serif",
    lineHeight: 20,
  },

  botaoAbrir: {
    marginTop: 14,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#E9E9E9",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  botaoAbrirTexto: {
    fontSize: 15,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 22,
  },

  popupContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 22,
  },

  popupTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 8,
  },

  popupMessage: {
    fontSize: 15,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    lineHeight: 21,
  },

  popupOkButton: {
    height: 48,
    backgroundColor: "#FDB515",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },

  popupOkText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },
});

export default styles;