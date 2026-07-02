import { StyleSheet } from "react-native";
import globalStyles from "../../../styles/globalStyles";

const local = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 50,
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

  subtitulo: {
    fontSize: 16,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    marginTop: 6,
    marginBottom: 24,
  },

  textoVazio: {
    marginTop: 28,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
  },

  lista: { gap: 14 },

  cardAluno: {
    backgroundColor: "#E9E9E9",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderLeftWidth: 6,
    borderLeftColor: "#FDB515",
  },

  cardIcone: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#FDB515",
    alignItems: "center",
    justifyContent: "center",
  },

  estagioCard: {
    backgroundColor: "#E9E9E9",
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    marginBottom: 20,
    borderLeftWidth: 6,
    borderLeftColor: "#FDB515",
  },

  cardPresenca: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#D6D6D6",
    borderLeftWidth: 6,
    borderLeftColor: "#FDB515",
  },

  cardTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },

  cardTitulo: {
    fontSize: 19,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  cardTexto: {
    fontSize: 15,
    fontWeight: "700",
    color: "#555",
    fontFamily: "serif",
    marginTop: 4,
  },

  dataTexto: {
    fontSize: 18,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  badgeEstado: {
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  badgeTexto: {
    fontSize: 12,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  observacoesTexto: {
    fontSize: 14,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    marginTop: 8,
  },

  botoesLinha: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },

  botaoValidar: {
    flex: 1,
    height: 46,
    backgroundColor: "#FDB515",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },

  botaoRejeitar: {
    flex: 1,
    height: 46,
    backgroundColor: "#160909",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },

  textoBotaoEscuro: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  textoBotaoClaro: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "serif",
  },

  loadingContainer: {
  flex: 1,
  backgroundColor: "#FFFFFF",
  alignItems: "center",
  justifyContent: "center",
},

    alunosLista: {
    marginTop: 14,
    gap: 10,
    },

    alunoNome: {
    fontSize: 17,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    },

    alunoNumero: {
    fontSize: 13,
    fontWeight: "700",
    color: "#666",
    fontFamily: "serif",
    marginTop: 3,
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