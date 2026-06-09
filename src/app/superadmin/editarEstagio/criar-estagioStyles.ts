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
    marginTop: 5,
    marginBottom: 26,
  },

  label: {
    fontSize: 18,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 5,
    marginTop: 14,
  },

  opcao: {
    backgroundColor: "#E9E9E9",
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 15,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },

  opcaoSelecionada: {
    backgroundColor: "#FDB515",
    borderColor: "#160909",
  },

  opcaoTexto: {
    fontSize: 15,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
  },

  selectToggle: {
    width: "100%",
    minHeight: 56,
    backgroundColor: "#E9E9E9",
    borderRadius: 9,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    marginTop: 5,
  },

  selectToggleText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#160909",
    fontFamily: "serif",
  },

  instituicoesBox: {
    maxHeight: 180,
    marginBottom: 16,
  },

  opcaoInstituicao: {
    backgroundColor: "#E9E9E9",
    borderRadius: 9,
    paddingVertical: 13,
    paddingHorizontal: 14,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },

  opcaoInstituicaoSelecionada: {
    backgroundColor: "#FDB515",
    borderColor: "#160909",
  },

  opcaoInstituicaoTexto: {
    fontSize: 16,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
  },

  textoVazioModal: {
    fontSize: 15,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    textAlign: "center",
    marginVertical: 15,
  },

  textoVazio: {
    fontSize: 15,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    marginBottom: 12,
  },

  input: {
    width: "100%",
    height: 60,
    backgroundColor: "#E9E9E9",
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 17,
    fontWeight: "700",
    color: "#160909",
    fontFamily: "serif",
    marginTop: 12,
  },

  botaoCriar: {
    width: "100%",
    height: 62,
    backgroundColor: "#FDB515",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
  },

  textoBotao: {
    fontSize: 24,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },
});

export default styles;
