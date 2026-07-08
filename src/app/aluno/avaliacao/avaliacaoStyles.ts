import { StyleSheet } from "react-native";
import globalStyles from "../../../styles/globalStyles";

const local = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 60,
    paddingBottom: 120,
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
    marginBottom: 24,
  },

  voltarTexto: {
    fontSize: 18,
    fontWeight: "800",
    color: "#160909",
    marginLeft: 8,
    fontFamily: "serif",
  },

  cardEstagio: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderLeftWidth: 5,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 20,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 6,
  },

  cardTitulo: {
    fontSize: 21,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    lineHeight: 25,
  },

  cardSubtitulo: {
    fontSize: 16,
    fontWeight: "900",
    color: "#777",
    fontFamily: "serif",
    marginTop: 3,
  },

  badgeEstado: {
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 7,
    marginTop: 1,
  },

  badgeTexto: {
    fontSize: 12,
    fontWeight: "900",
    color: "#1D7A3A",
    fontFamily: "serif",
  },

  linhaInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 10,
    marginBottom: 8,
  },

  infoTexto: {
    fontSize: 15,
    fontWeight: "900",
    color: "#777",
    fontFamily: "serif",
    marginTop: 4,
    lineHeight: 19,
  },

  notaPrincipalCard: {
    marginTop: 16,
    backgroundColor: "#FFF3C4",
    borderRadius: 18,
    paddingVertical: 28,
    paddingHorizontal: 16,
    alignItems: "center",
  },

  notaLabel: {
    fontSize: 16,
    fontWeight: "900",
    color: "#777",
    fontFamily: "serif",
  },

  notaValor: {
    fontSize: 64,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginTop: 4,
  },

  notaSubtexto: {
    fontSize: 15,
    fontWeight: "900",
    color: "#777",
    fontFamily: "serif",
    marginTop: 2,
    textAlign: "center",
  },

  detalhesCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    padding: 16,
    marginTop: 16,
  },

  secaoTitulo: {
    fontSize: 21,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 12,
  },

  linhaNota: {
    borderTopWidth: 1,
    borderTopColor: "#E9E9E9",
    paddingVertical: 12,
  },

  linhaNotaLabel: {
    fontSize: 14,
    fontWeight: "900",
    color: "#777",
    fontFamily: "serif",
  },

  linhaNotaValor: {
    fontSize: 17,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginTop: 4,
  },

  observacoesCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    padding: 16,
    marginTop: 16,
  },

  observacaoTitulo: {
    fontSize: 15,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginTop: 10,
  },

  observacaoTexto: {
    fontSize: 15,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    marginTop: 4,
    lineHeight: 20,
  },

  vazioCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },

  vazioTitulo: {
    fontSize: 22,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginTop: 10,
    textAlign: "center",
  },

  vazioTexto: {
    fontSize: 15,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 21,
  },

  bottomBar: {
    height: 82,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E9E9E9",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 8,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },

  bottomItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  bottomTexto: {
    fontSize: 11,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
  },

  bottomTextoAtivo: {
    fontSize: 11,
    fontWeight: "900",
    color: "#FDB515",
    fontFamily: "serif",
  },
});

const styles = {
  ...local,
  titulo: globalStyles.titulo,
};

export default styles;