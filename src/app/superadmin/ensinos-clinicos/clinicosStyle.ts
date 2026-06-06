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
});

export default styles;