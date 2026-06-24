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
    paddingBottom: 120,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 26,
  },

  ola: {
    fontSize: 22,
    fontWeight: "800",
    color: "#777",
    fontFamily: "serif",
  },

  nome: {
    fontSize: 34,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  fotoPerfil: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: "#FDB515",
  },

  avisoPerfil: {
    backgroundColor: "#FDB515",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 26,
  },

  avisoTitulo: {
    fontSize: 18,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  avisoTexto: {
    fontSize: 14,
    fontWeight: "700",
    color: "#160909",
    fontFamily: "serif",
    marginTop: 2,
  },

  secaoTitulo: {
    fontSize: 24,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 14,
    marginTop: 8,
  },

  mensagemVazia: {
    fontSize: 15,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    marginBottom: 26,
  },

  estagioAtualCard: {
    backgroundColor: "#E9E9E9",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 28,
  },

  estagioIcone: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#FDB515",
    alignItems: "center",
    justifyContent: "center",
  },

  estagioTitulo: {
    fontSize: 18,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  estagioTexto: {
    fontSize: 14,
    fontWeight: "700",
    color: "#666",
    fontFamily: "serif",
    marginTop: 4,
  },

  eventosLista: {
    gap: 12,
  },

  eventoCard: {
    backgroundColor: "#E9E9E9",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  eventoTitulo: {
    fontSize: 17,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  eventoTexto: {
    fontSize: 14,
    fontWeight: "700",
    color: "#666",
    fontFamily: "serif",
    marginTop: 4,
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

    grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 28,
    },

    cardAtalho: {
    width: "48%",
    minHeight: 110,
    backgroundColor: "#E9E9E9",
    borderRadius: 16,
    padding: 16,
    justifyContent: "space-between",
    },

    cardTitulo: {
    fontSize: 21,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    },
});

export default styles;