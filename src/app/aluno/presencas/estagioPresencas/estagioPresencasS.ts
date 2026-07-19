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

  titulo: {
    fontSize: 36,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 8,
  },

  subtitulo: {
    fontSize: 16,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    lineHeight: 22,
    marginBottom: 24,
  },

  vazioCard: {
    backgroundColor: "#E9E9E9",
    borderRadius: 16,
    padding: 22,
    alignItems: "center",
    marginTop: 20,
  },

  vazioTitulo: {
    fontSize: 20,
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
    marginTop: 6,
    textAlign: "center",
    lineHeight: 21,
  },

  lista: {
    gap: 16,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderLeftWidth: 7,
    padding: 16,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },

  cardTitulo: {
    fontSize: 21,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    lineHeight: 26,
  },

  cardSubtitulo: {
    fontSize: 15,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    marginTop: 5,
  },

  badgeEstado: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 88,
    alignItems: "center",
  },

  badgeTexto: {
    fontSize: 12,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    textAlign: "center",
  },

  linhaInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 6,
    marginBottom: 4,
  },

  infoTexto: {
    fontSize: 15,
    fontWeight: "700",
    color: "#666",
    fontFamily: "serif",
    marginTop: 5,
    lineHeight: 21,
  },

  botaoDetalhes: {
    height: 48,
    backgroundColor: "#FDB515",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
    marginTop: 16,
  },

  textoDetalhes: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },
});

export default styles;