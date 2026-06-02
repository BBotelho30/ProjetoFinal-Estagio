import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingTop: 105,
  },

  logo: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 35,
  },

  titulo: {
    fontSize: 39,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  tituloAmarelo: {
    fontSize: 39,
    fontWeight: "900",
    color: "#FDB515",
    fontFamily: "serif",
    marginBottom: 58,
  },

  inputContainer: {
    width: "100%",
    height: 67,
    backgroundColor: "#E9E9E9",
    borderRadius: 9,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 18,
    color: "#1f1f1f",
    fontFamily: "serif",
  },

  esqueci: {
    alignSelf: "flex-end",
    width: "100%",
    textAlign: "right",
    fontSize: 18,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 40,
  },

  botao: {
    width: "100%",
    height: 67,
    backgroundColor: "#FDB515",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  textoBotao: {
    fontSize: 37,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  criarContaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  textoConta: {
    fontSize: 18,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
  },

  criarConta: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FDB515",
    fontFamily: "serif",
  },

  tipoTitulo: {
  width: "100%",
  fontSize: 18,
  fontWeight: "900",
  color: "#160909",
  fontFamily: "serif",
  marginBottom: 12,
},

tipoContainer: {
  width: "100%",
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 24,
},

tipoOpcao: {
  flex: 1,
  height: 55,
  backgroundColor: "#E9E9E9",
  borderRadius: 9,
  alignItems: "center",
  justifyContent: "center",
  marginHorizontal: 4,
  borderWidth: 2,
  borderColor: "transparent",
},

tipoOpcaoSelecionada: {
  backgroundColor: "#FDB515",
  borderColor: "#160909",
},

tipoTexto: {
  fontSize: 16,
  fontWeight: "900",
  color: "#160909",
  fontFamily: "serif",
},
});

export default styles;
