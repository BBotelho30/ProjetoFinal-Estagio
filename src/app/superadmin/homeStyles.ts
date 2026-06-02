import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 40,
  },

  titulo: {
    fontSize: 38,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  subtitulo: {
    fontSize: 17,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    marginTop: 6,
    marginBottom: 28,
  },

  cardsContainer: {
    width: "100%",
    gap: 16,
  },

  card: {
    width: "100%",
    minHeight: 95,
    backgroundColor: "#E9E9E9",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderLeftWidth: 6,
    borderLeftColor: "#FDB515",
  },

  cardTexto: {
    flex: 1,
    marginLeft: 16,
  },

  cardTitulo: {
    fontSize: 22,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 4,
  },

  cardDescricao: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    fontFamily: "serif",
    lineHeight: 19,
  },
});

export default styles;