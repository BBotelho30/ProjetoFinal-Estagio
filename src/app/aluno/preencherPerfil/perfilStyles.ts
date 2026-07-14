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
    marginBottom: 24,
  },

  voltarTexto: {
    fontSize: 18,
    fontWeight: "800",
    color: "#160909",
    marginLeft: 8,
    fontFamily: "serif",
  },

  cardPerfil: {
    alignItems: "center",
    backgroundColor: "#E9E9E9",
    borderRadius: 18,
    padding: 22,
    marginTop: 22,
    marginBottom: 20,
  },

  fotoContainer: {
    width: 116,
    height: 116,
    borderRadius: 58,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  fotoPerfil: {
    width: 116,
    height: 116,
    borderRadius: 58,
    borderWidth: 4,
    borderColor: "#FDB515",
  },

  cameraIcon: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FDB515",
    alignItems: "center",
    justifyContent: "center",
  },

  nome: {
    fontSize: 26,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
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

  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E9E9E9",
  },

  label: {
    fontSize: 17,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 7,
    marginTop: 12,
  },

  input: {
    width: "100%",
    height: 56,
    backgroundColor: "#E9E9E9",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: "700",
    color: "#160909",
    fontFamily: "serif",
  },

  inputBloqueado: {
    opacity: 0.75,
  },

  botaoEditar: {
    height: 56,
    backgroundColor: "#FDB515",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },

  textoBotao: {
    fontSize: 19,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  botoesLinha: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },

  botaoCancelar: {
    flex: 1,
    height: 54,
    backgroundColor: "#160909",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  botaoGuardar: {
    flex: 1,
    height: 54,
    backgroundColor: "#FDB515",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  textoCancelar: {
    fontSize: 17,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "serif",
  },

  textoGuardar: {
    fontSize: 17,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  botaoSair: {
    height: 56,
    backgroundColor: "#160909",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 22,
  },

  textoSair: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "serif",
  },

  selectToggle: {
    width: "100%",
    minHeight: 56,
    backgroundColor: "#E9E9E9",
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectToggleText: {
    flex: 1,
    fontSize: 16,
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

  inputBotao: {
  width: "100%",
  height: 56,
  backgroundColor: "#E9E9E9",
  borderRadius: 10,
  paddingHorizontal: 14,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
},

inputBotaoTexto: {
  fontSize: 16,
  fontWeight: "700",
  color: "#160909",
  fontFamily: "serif",
},

inputBotaoPlaceholder: {
  color: "#8c8787",
},

calendarioContainer: {
  width: "100%",
  backgroundColor: "#FFFFFF",
  borderRadius: 18,
  padding: 18,
},

calendarioTitulo: {
  fontSize: 24,
  fontWeight: "900",
  color: "#160909",
  fontFamily: "serif",
  textAlign: "center",
  marginBottom: 14,
},

calendarioAnoLinha: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 16,
},

calendarioAnoBotao: {
  width: 38,
  height: 38,
  borderRadius: 19,
  backgroundColor: "#FFF3C4",
  alignItems: "center",
  justifyContent: "center",
},

calendarioSeta: {
  width: 38,
  height: 38,
  borderRadius: 19,
  backgroundColor: "#FFF3C4",
  alignItems: "center",
  justifyContent: "center",
},

calendarioMesTexto: {
  flex: 1,
  textAlign: "center",
  fontSize: 18,
  fontWeight: "900",
  color: "#160909",
  fontFamily: "serif",
  textTransform: "capitalize",
},

diasSemanaLinha: {
  flexDirection: "row",
  marginBottom: 8,
},

diaSemanaTexto: {
  width: "14.28%",
  textAlign: "center",
  fontSize: 13,
  fontWeight: "900",
  color: "#777",
  fontFamily: "serif",
},

calendarioGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
},

diaVazio: {
  width: "14.28%",
  aspectRatio: 1,
},

diaBotao: {
  width: "14.28%",
  aspectRatio: 1,
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 12,
  marginBottom: 4,
},

diaSelecionado: {
  backgroundColor: "#FDB515",
},

diaTexto: {
  fontSize: 15,
  fontWeight: "900",
  color: "#160909",
  fontFamily: "serif",
},

diaTextoSelecionado: {
  color: "#160909",
},

botaoCancelarCalendario: {
  height: 48,
  backgroundColor: "#160909",
  borderRadius: 10,
  alignItems: "center",
  justifyContent: "center",
  marginTop: 14,
},

textoCancelarCalendario: {
  fontSize: 16,
  fontWeight: "900",
  color: "#FFFFFF",
  fontFamily: "serif",
},
});

const styles = {
  ...local,
  titulo: globalStyles.titulo,
  popupOverlay: globalStyles.popupOverlay,
  popupContainer: globalStyles.popupContainer,
  popupTitle: globalStyles.popupTitle,
  popupMessage: globalStyles.popupMessage,
  popupOkButton: globalStyles.popupOkButton,
  popupOkText: globalStyles.popupOkText,
};

export default styles;