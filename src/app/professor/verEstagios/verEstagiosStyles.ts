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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 50,
  },

  voltar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 26,
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
    marginBottom: 20,
  },

  tabs: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },

  tab: {
    flex: 1,
    height: 42,
    borderRadius: 9,
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

  mensagemVazia: {
    fontSize: 16,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    marginTop: 20,
  },

  lista: {
    gap: 16,
  },

  estagioCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderLeftWidth: 5,
    padding: 16,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },

  estagioTitulo: {
    flex: 1,
    fontSize: 21,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    lineHeight: 25,
  },

  estadoBadge: {
    backgroundColor: "#D7F5DF",
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 7,
  },

  estadoTexto: {
    fontSize: 12,
    fontWeight: "900",
    color: "#225943",
    fontFamily: "serif",
  },

  estagioHospital: {
    fontSize: 16,
    fontWeight: "900",
    color: "#777",
    fontFamily: "serif",
    marginTop: 6,
  },

  dataLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
    marginBottom: 8,
  },

  estagioTexto: {
    fontSize: 15,
    fontWeight: "800",
    color: "#777",
    fontFamily: "serif",
    marginTop: 4,
  },

  botaoDetalhes: {
    height: 46,
    backgroundColor: "#FDB515",
    borderRadius: 9,
    marginTop: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  botaoDetalhesTexto: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },
});

export default styles;