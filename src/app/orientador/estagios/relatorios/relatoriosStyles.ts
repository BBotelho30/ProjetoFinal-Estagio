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

  estagioCard: {
    backgroundColor: "#E9E9E9",
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    borderLeftWidth: 6,
    borderLeftColor: "#FDB515",
  },

  estagioTitulo: {
    fontSize: 21,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    lineHeight: 28,
  },

  estagioTexto: {
    fontSize: 15,
    fontWeight: "800",
    color: "#777",
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

  label: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 10,
  },

  anexarBox: {
    backgroundColor: "#E9E9E9",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginBottom: 22,
  },

  anexarLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  anexarTexto: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    flex: 1,
  },

  textArea: {
    width: "100%",
    minHeight: 110,
    backgroundColor: "#E9E9E9",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 14,
    fontSize: 16,
    fontWeight: "700",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 22,
  },

  botaoSubmeter: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "#FDB515",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },

  botaoSubmeterTexto: {
    fontSize: 18,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  botaoDisabled: {
    opacity: 0.55,
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

  relatorioObs: {
    fontSize: 14,
    fontWeight: "700",
    color: "#666",
    fontFamily: "serif",
    marginTop: 10,
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

  popupBotoesLinha: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },

  popupBotaoCancelar: {
    flex: 1,
    height: 48,
    backgroundColor: "#160909",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  popupTextoCancelar: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "serif",
  },

  popupBotaoConfirmar: {
    flex: 1,
    height: 48,
    backgroundColor: "#FDB515",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  popupTextoConfirmar: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },
});

export default styles;