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
    marginBottom: 15,
  },

  lista: {
    gap: 18,
  },

  card: {
    backgroundColor: "#E9E9E9",
    borderRadius: 14,
    padding: 18,
    borderLeftWidth: 6,
    borderLeftColor: "#FDB515",
  },

  cardTopo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FDB515",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  info: {
    flex: 1,
  },

  nome: {
    fontSize: 22,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  email: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555",
    marginTop: 2,
    fontFamily: "serif",
  },

  linhaInfo: {
    flexDirection: "row",
    marginBottom: 6,
  },



  label: {
    fontSize: 15,
    fontWeight: "900",
    color: "#160909",
    marginRight: 6,
    fontFamily: "serif",
  },

  valor: {
    fontSize: 15,
    fontWeight: "700",
    color: "#555",
    textTransform: "capitalize",
    fontFamily: "serif",
  },

    valor1: {
    fontSize: 15,
    fontWeight: "700",
    color: "#d77513ff",
    textTransform: "capitalize",
    fontFamily: "serif",
  },

  estadoPendente: {
    fontSize: 15,
    fontWeight: "900",
    color: "#B77900",
    fontFamily: "serif",
  },

  botoes: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },

  botao: {
    flex: 1,
    height: 48,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },

  botaoAprovar: {
    backgroundColor: "#FDB515",
  },

  botaoRejeitar: {
    backgroundColor: "#160909",
  },

  botaoTexto: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  botaoTextoRejeitar: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "serif",
  },

  vazioContainer: {
    alignItems: "center",
    marginTop: 70,
  },

  vazioTexto: {
    fontSize: 18,
    fontWeight: "800",
    color: "#160909",
    marginTop: 14,
    fontFamily: "serif",
    textAlign: "center",
  },

  //filtros

  filterRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },

  filterButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#E9E9E9",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },

  filterButtonActive: {
    backgroundColor: "#FDB515",
    borderColor: "#160909",
    borderWidth: 1,
  },

  filterButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#555",
    fontFamily: "serif",
  },

  filterButtonTextActive: {
    fontSize: 15,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  filterToggle: {
    height: 44,
    backgroundColor: "#E9E9E9",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    marginTop: 10,
  },

  filterToggleText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  filterDropdown: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E9E9E9",
  },

  filterOption: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
  },

  filterOptionActive: {
    backgroundColor: "#FDB515",
  },

  filterOptionText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
  },

  filterOptionTextActive: {
    color: "#160909",
    fontWeight: "900",
  },

  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: "#F6F6F6",
    borderRadius: 9,
    paddingHorizontal: 12,
    fontSize: 16,
    marginRight: 10,
    fontFamily: "serif",
  },

  searchRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
});

export default styles;
