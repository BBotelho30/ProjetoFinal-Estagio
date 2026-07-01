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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 120,
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

  mediaCard: {
    backgroundColor: "#E9E9E9",
    borderRadius: 16,
    padding: 24,
    marginTop: 22,
    marginBottom: 30,
    minHeight: 150,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 5,
    elevation: 4,
  },

  mediaTitulo: {
    fontSize: 26,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  mediaCirculo: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 9,
    borderColor: "#FDB515",
    alignItems: "center",
    justifyContent: "center",
  },

  mediaValor: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FDB515",
    fontFamily: "serif",
  },

  textoVazio: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
  },

  lista: {
    gap: 22,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    minHeight: 130,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 5,
    elevation: 4,
  },

  barraCard: {
    width: 38,
    height: "100%",
  },

  cardInfo: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 18,
  },

  cardTitulo: {
    fontSize: 22,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 4,
  },

  cardTexto: {
    fontSize: 17,
    fontWeight: "700",
    color: "#160909",
    fontFamily: "serif",
  },

  notaCirculo: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
  },

  notaValor: {
    fontSize: 18,
    fontWeight: "900",
    fontFamily: "serif",
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