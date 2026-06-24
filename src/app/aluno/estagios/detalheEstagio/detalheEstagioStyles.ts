import { StyleSheet } from "react-native";
import globalStyles from "../../../../styles/globalStyles";

const local = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
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
    marginBottom: 18,
  },

  voltarTexto: {
    fontSize: 18,
    fontWeight: "800",
    color: "#160909",
    marginLeft: 8,
    fontFamily: "serif",
  },

  headerCard: {
    backgroundColor: "#FDB515",
    borderRadius: 18,
    padding: 20,
    marginTop: 18,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: "#B77900",
  },

  headerTitulo: {
    fontSize: 22,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 8,
  },

  headerTexto: {
    fontSize: 17,
    fontWeight: "800",
    color: "#7A5A00",
    fontFamily: "serif",
    marginBottom: 6,
  },

  headerDatas: {
    fontSize: 16,
    fontWeight: "900",
    color: "#7A5A00",
    fontFamily: "serif",
    marginTop: 6,
  },

  badgeEstado: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 12,
  },

  badgeTexto: {
    fontSize: 13,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  secaoTitulo: {
    fontSize: 21,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 12,
    marginTop: 8,
  },

  pessoaCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#D6D6D6",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },

  fotoPessoa: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },

  pessoaLabel: {
    fontSize: 15,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  pessoaNome: {
    fontSize: 17,
    fontWeight: "900",
    color: "#777",
    fontFamily: "serif",
    marginTop: 3,
  },

  pessoaEmail: {
    fontSize: 13,
    fontWeight: "700",
    color: "#999",
    fontFamily: "serif",
    marginTop: 2,
  },

  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },

  infoBox: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#D6D6D6",
  },

  infoLabel: {
    fontSize: 14,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 5,
  },

  infoValor: {
    fontSize: 16,
    fontWeight: "900",
    color: "#777",
    fontFamily: "serif",
  },

  avaliacaoCard: {
    backgroundColor: "#E9E9E9",
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
  },

  avaliacaoNota: {
    fontSize: 34,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 6,
  },

  avaliacaoTexto: {
    fontSize: 15,
    fontWeight: "700",
    color: "#666",
    fontFamily: "serif",
  },

  acoesLista: {
    gap: 9,
  },

  acaoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D6D6D6",
    paddingHorizontal: 14,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  acaoTexto: {
    flex: 1,
    fontSize: 17,
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