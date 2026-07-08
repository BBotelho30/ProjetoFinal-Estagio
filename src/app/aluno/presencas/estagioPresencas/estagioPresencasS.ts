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
    paddingHorizontal: 18,
    paddingTop: 60,
    paddingBottom: 40,
  },

  voltar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 22,
  },

  voltarTexto: {
    fontSize: 18,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  titulo: {
    fontSize: 38,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  subtitulo: {
    fontSize: 15,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 21,
  },

  lista: {
    gap: 14,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderLeftWidth: 5,
    paddingHorizontal: 16,
    paddingVertical: 16,
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

  botaoDetalhes: {
    marginTop: 16,
    backgroundColor: "#FDB515",
    borderRadius: 8,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },

  textoDetalhes: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  vazioCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
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
});

export default styles;