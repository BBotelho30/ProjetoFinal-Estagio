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
    gap: 18,
  },

  cardNota: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E4E4E4",
    minHeight: 132,
    overflow: "hidden",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 4,
  },

  barraCor: {
    width: 18,
  },

  cardNotaConteudo: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  infoArea: {
    flex: 1,
    paddingRight: 12,
  },

  cardNotaTitulo: {
    fontSize: 18,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    lineHeight: 22,
    marginBottom: 6,
  },

  cardNotaTexto: {
    fontSize: 15,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
    lineHeight: 20,
  },

  notaCirculo: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  notaCirculoTexto: {
    fontSize: 16,
    fontWeight: "900",
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