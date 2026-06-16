import { StyleSheet } from "react-native";
import globalStyles from "../../../styles/globalStyles";


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
    marginBottom: 28,
  },

  voltarTexto: {
    fontSize: 18,
    fontWeight: "800",
    color: "#160909",
    marginLeft: 8,
    fontFamily: "serif",
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  titulo: {
    fontSize: 36,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginTop: 8,
  },

  subtitulo: {
    fontSize: 16,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    marginTop: 4,
  },

  label: {
    fontSize: 17,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 8,
    marginTop: 12,
  },

  input: {
    width: "100%",
    height: 60,
    backgroundColor: "#E9E9E9",
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: "700",
    color: "#160909",
    fontFamily: "serif",
  },

  inputBloqueado: {
    opacity: 0.6,
  },

  botaoEditar: {
    width: "100%",
    height: 62,
    backgroundColor: "#FDB515",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },

  textoBotao: {
    fontSize: 24,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  botoesLinha: {
    flexDirection: "row",
    gap: 12,
    marginTop: 30,
  },

  botaoCancelar: {
    flex: 1,
    height: 58,
    backgroundColor: "#160909",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  botaoGuardar: {
    flex: 1,
    height: 58,
    backgroundColor: "#FDB515",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  textoCancelar: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "serif",
  },
});

export default styles;