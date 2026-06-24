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

  tabs: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
    marginBottom: 28,
  },

  tabButton: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#E9E9E9",
    alignItems: "center",
    justifyContent: "center",
  },

  tabAtiva: {
    backgroundColor: "#FDB515",
  },

  tabTexto: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  tabTextoAtivo: {
    color: "#160909",
  },

  textoVazio: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    textAlign: "center",
  },

  lista: {
    gap: 14,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#D6D6D6",
    borderLeftWidth: 6,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 10,
  },

  cardTitulo: {
    fontSize: 21,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  cardSubtitulo: {
    fontSize: 16,
    fontWeight: "800",
    color: "#777",
    fontFamily: "serif",
    marginTop: 4,
  },

  badgeEstado: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },

  badgeTexto: {
    fontSize: 12,
    fontWeight: "900",
    color: "#20753A",
    fontFamily: "serif",
  },

  linhaInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },

  infoTexto: {
    fontSize: 15,
    fontWeight: "800",
    color: "#777",
    fontFamily: "serif",
    marginBottom: 6,
  },

  botaoDetalhes: {
    height: 46,
    backgroundColor: "#FDB515",
    borderRadius: 9,
    marginTop: 10,
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