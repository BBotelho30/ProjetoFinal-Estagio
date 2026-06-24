import { StyleSheet } from "react-native";
import globalStyles from "../../../styles/globalStyles";

const local = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 130,
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

  cardPerfil: {
    backgroundColor: "#E9E9E9",
    borderRadius: 18,
    padding: 22,
    alignItems: "center",
    borderLeftWidth: 6,
    borderLeftColor: "#FDB515",
    marginBottom: 24,
  },

  fotoPerfil: {
    width: 118,
    height: 118,
    borderRadius: 59,
    borderWidth: 4,
    borderColor: "#FDB515",
  },

  nome: {
    fontSize: 26,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginTop: 10,
    textAlign: "center",
  },

  email: {
    fontSize: 15,
    fontWeight: "700",
    color: "#666",
    fontFamily: "serif",
    marginTop: 4,
    textAlign: "center",
  },

  numero: {
    fontSize: 15,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginTop: 6,
    textAlign: "center",
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
    height: 58,
    backgroundColor: "#E9E9E9",
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 17,
    fontWeight: "700",
    color: "#160909",
    fontFamily: "serif",
  },

  inputBloqueado: {
    opacity: 0.55,
  },

  botaoEditar: {
    width: "100%",
    height: 60,
    backgroundColor: "#FDB515",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },

  botoesLinha: {
    flexDirection: "row",
    gap: 12,
    marginTop: 30,
  },

  botaoCancelar: {
    flex: 1,
    height: 56,
    backgroundColor: "#160909",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  botaoGuardar: {
    flex: 1,
    height: 56,
    backgroundColor: "#FDB515",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  textoBotao: {
    fontSize: 22,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  textoCancelar: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "serif",
  },

  botaoSair: {
    width: "100%",
    height: 56,
    backgroundColor: "#e74c3c",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    flexDirection: "row",
    gap: 8,
  },

  textoSair: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "serif",
  },

  popupBotoesLinha: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginTop: 8,
  },

  popupBotaoCancelar: {
    flex: 1,
    height: 46,
    backgroundColor: "#160909",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  popupBotaoSair: {
    flex: 1,
    height: 46,
    backgroundColor: "#e74c3c",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  popupTextoCancelar: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "serif",
  },

  popupTextoSair: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "serif",
  },

  //styles dowpdown ano

selectToggle: {
    width: "100%",
    minHeight: 58,
    backgroundColor: "#E9E9E9",
    borderRadius: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
},

selectToggleText: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: "#160909",
    fontFamily: "serif",
},

dropdown: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginTop: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E9E9E9",
},

opcao: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
},

opcaoSelecionada: {
    backgroundColor: "#FDB515",
},

opcaoTexto: {
    fontSize: 16,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
},

//styles bootom bar 
page: {
  flex: 1,
  backgroundColor: "#FFFFFF",
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
  popupOverlay: globalStyles.popupOverlay,
  popupContainer: globalStyles.popupContainer,
  popupTitle: globalStyles.popupTitle,
  popupMessage: globalStyles.popupMessage,
  popupOkButton: globalStyles.popupOkButton,
  popupOkText: globalStyles.popupOkText,
};

export default styles;