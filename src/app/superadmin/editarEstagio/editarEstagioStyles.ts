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
});

export default styles;
