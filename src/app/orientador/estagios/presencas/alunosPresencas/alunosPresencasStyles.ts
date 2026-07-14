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
    paddingHorizontal: 16,
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

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },

  searchContainer: {
    flex: 1,
    height: 54,
    backgroundColor: "#E9E9E9",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "700",
    color: "#160909",
    fontFamily: "serif",
  },

  selectToggle: {
    minWidth: 120,
    height: 54,
    backgroundColor: "#E9E9E9",
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectToggleText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
    marginRight: 8,
  },

  dropdown: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: "#E9E9E9",
    marginBottom: 14,
    alignSelf: "flex-end",
    width: 160,
  },

  opcao: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
  },

  opcaoSelecionada: {
    backgroundColor: "#FDB515",
  },

  opcaoTexto: {
    fontSize: 15,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
  },

  opcaoTextoSelecionada: {
    fontWeight: "900",
  },

  lista: {
    gap: 14,
  },

  alunoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    padding: 16,
    borderLeftWidth: 6,
  },

  cardTopo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },

  alunoIcone: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#FDB515",
    alignItems: "center",
    justifyContent: "center",
  },

  alunoNome: {
    fontSize: 18,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  alunoTexto: {
    fontSize: 13,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    marginTop: 3,
  },

  estagioNome: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    lineHeight: 21,
    marginBottom: 4,
  },

  estagioTexto: {
    fontSize: 13,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    marginBottom: 2,
  },

  infoLinha: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },

  infoBox: {
    flex: 1,
    backgroundColor: "#E9E9E9",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },

  infoNumero: {
    fontSize: 24,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  infoLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#777",
    fontFamily: "serif",
    marginTop: 3,
  },

  estadoBadge: {
    alignSelf: "flex-start",
    marginTop: 12,
    backgroundColor: "#FFF3C4",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  estadoTexto: {
    fontSize: 12,
    fontWeight: "900",
    color: "#B77900",
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