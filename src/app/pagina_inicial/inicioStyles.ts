import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
    flex: 1,
    width: "100%",
    height: "100%",
    },

  texto: {
    fontSize: 30,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 1)",
    fontFamily: "serif",
    textAlign: "center",
    marginBottom: 100,
  },

  logo: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 50,
    marginTop: -100,
  },

  titulo: {
    fontSize: 39,
    fontWeight: "900",
    color: "#ffffffff",
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
    marginBottom: 5,
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


    overlay: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(5, 9, 16, 0.66)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 105,
    },

  
});

export default styles;
