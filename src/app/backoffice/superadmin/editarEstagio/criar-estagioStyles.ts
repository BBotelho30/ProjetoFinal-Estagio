import { StyleSheet } from "react-native";
import backofficeStyles from "../../../../styles/backofficeStyles";

const local = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F4F6F8",
  },

  sidebar: {
    width: 270,
    backgroundColor: "#225943",
    paddingTop: 20,
    paddingHorizontal: 14,
    paddingBottom: 16,
  },

  sidebarFechada: {
    width: 82,
    paddingHorizontal: 10,
  },

  sidebarTop: {
    marginBottom: 18,
  },

  menuButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    backgroundColor: "rgba(255,255,255,0.10)",
    marginBottom: 20,
  },

  sidebarHeader: {
    alignItems: "center",
  },

  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(253,181,21,0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(253,181,21,0.45)",
    overflow: "hidden",
  },

  logoSidebar: {
    width: 66,
    height: 66,
    borderRadius: 33,
  },

  sidebarTitle: {
    fontSize: 27,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "serif",
    textAlign: "center",
  },

  sidebarSubtitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FDB515",
    fontFamily: "serif",
    marginTop: 2,
    textAlign: "center",
  },

  menuScroll: {
    flex: 1,
  },

  menu: {
    gap: 7,
    paddingBottom: 14,
  },

  menuItem: {
    height: 48,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 12,
  },

  menuItemActive: {
    backgroundColor: "#FDB515",
  },

  menuText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: "serif",
  },

  menuTextActive: {
    color: "#160909",
  },

  sidebarFooter: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.14)",
    paddingTop: 12,
    gap: 8,
  },

  footerButton: {
    height: 46,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  footerText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: "serif",
  },

  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },

  content: {
    paddingHorizontal: 34,
    paddingTop: 32,
    paddingBottom: 44,
  },

  header: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 26,
    paddingVertical: 22,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E4E7EC",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  botaoVoltarHome: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FFF7E0",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FDB515",
  },

  titulo: {
    fontSize: 36,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  subtitulo: {
    fontSize: 17,
    fontWeight: "700",
    color: "#667085",
    fontFamily: "serif",
    marginTop: 6,
  },

  filtrosCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 22,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E4E7EC",

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },

  modalTitulo: {
    fontSize: 25,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 18,
    textAlign: "center",
  },

  label: {
    fontSize: 15,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 6,
    marginTop: 6,
  },

  modalInput: {
    width: "100%",
    height: 50,
    backgroundColor: "#F2F4F7",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: "700",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D0D5DD",
  },

  selectToggle: {
    width: "100%",
    minHeight: 50,
    backgroundColor: "#F2F4F7",
    borderRadius: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  selectToggleText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
    marginRight: 8,
  },

  instituicoesBox: {
    maxHeight: 210,
    marginBottom: 14,
  },

  opcao: {
    backgroundColor: "#F2F4F7",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#D0D5DD",
  },

  opcaoSelecionada: {
    backgroundColor: "#FDB515",
    borderColor: "#160909",
  },

  opcaoTexto: {
    fontSize: 15,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  opcaoSubtexto: {
    fontSize: 13,
    fontWeight: "700",
    color: "#667085",
    fontFamily: "serif",
    marginTop: 3,
  },

  textoVazio: {
    fontSize: 15,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    marginBottom: 12,
    lineHeight: 21,
  },

  dropdownModal: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E4E7EC",
    padding: 6,
    marginBottom: 12,
  },

  popupBotoesLinha: {
    ...backofficeStyles.popupBotoesLinha,
    marginTop: 10,
  },

  popupBotaoCancelar: {
    ...backofficeStyles.popupBotaoCancelar,
  },

  popupBotaoSair: {
    ...backofficeStyles.popupBotaoPerigo,
  },

  popupTextoCancelar: {
    ...backofficeStyles.popupTextoCancelar,
  },

  popupTextoSair: {
    ...backofficeStyles.popupTextoPerigo,
  },

  popupBotaoConfirmar: {
    ...backofficeStyles.popupOkButton,
    flex: 1,
    height: 42,
  },

  popupTextoConfirmar: {
    ...backofficeStyles.popupOkText,
    fontSize: 15,
  },

  dateInput: {
  width: "100%",
  height: 50,
  backgroundColor: "#F2F4F7",
  borderRadius: 10,
  paddingHorizontal: 14,
  borderWidth: 1,
  borderColor: "#D0D5DD",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 12,
},

  dateInputText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
  },

  dateInputPlaceholder: {
    color: "#8c8787",
  },

  calendarioContainer: {
    width: "100%",
    maxWidth: 430,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 5,
  },

  calendarioHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  calendarioSeta: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FFF7E0",
    borderWidth: 1,
    borderColor: "#FDB515",
    alignItems: "center",
    justifyContent: "center",
  },

  calendarioTitulo: {
    fontSize: 22,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    textTransform: "capitalize",
  },

  calendarioSemana: {
    flexDirection: "row",
    marginBottom: 8,
  },

  calendarioSemanaTexto: {
    flex: 1,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "900",
    color: "#667085",
    fontFamily: "serif",
  },

  calendarioDias: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  calendarioDiaVazio: {
    width: `${100 / 7}%`,
    height: 44,
  },

  calendarioDia: {
    width: `${100 / 7}%`,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  calendarioDiaTexto: {
    width: 34,
    height: 34,
    borderRadius: 17,
    textAlign: "center",
    lineHeight: 34,
    fontSize: 15,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    backgroundColor: "#F2F4F7",
    overflow: "hidden",
  },

  calendarioCancelar: {
    height: 44,
    borderRadius: 10,
    backgroundColor: "#160909",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },

  calendarioCancelarTexto: {
    fontSize: 15,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "serif",
  },


  servicosBox: {
    maxHeight: 360,
    marginBottom: 14,
  },

  grupoServicoBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E4E7EC",
    padding: 12,
    marginBottom: 12,
  },


  opcaoLinha: {
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
},

servicosHospitaisContainer: {
  gap: 14,
  marginBottom: 14,
},

hospitalServicoCard: {
  backgroundColor: "#FFFFFF",
  borderRadius: 14,
  borderWidth: 1,
  borderColor: "#E4E7EC",
  padding: 14,
},

servicosListaHospital: {
  marginTop: 4,
},

servicoComVagasBox: {
  marginBottom: 10,
},

grupoServicoTitulo: {
  fontSize: 16,
  fontWeight: "900",
  color: "#225943",
  fontFamily: "serif",
  marginBottom: 10,
},

vagasServicoLinha: {
  backgroundColor: "#F7F8FA",
  borderRadius: 10,
  padding: 12,
  marginTop: -4,
  marginBottom: 8,
  borderWidth: 1,
  borderColor: "#E4E7EC",
},

vagasServicoLabel: {
  fontSize: 14,
  fontWeight: "900",
  color: "#160909",
  fontFamily: "serif",
  marginBottom: 8,
},

vagasServicoInput: {
  width: "100%",
  height: 46,
  backgroundColor: "#FFFFFF",
  borderRadius: 9,
  paddingHorizontal: 12,
  fontSize: 15,
  fontWeight: "800",
  color: "#160909",
  fontFamily: "serif",
  borderWidth: 1,
  borderColor: "#D0D5DD",
},

avisoLocalBox: {
  width: "100%",
  backgroundColor: "#FFF7E0",
  borderWidth: 1,
  borderColor: "#FDB515",
  borderRadius: 12,
  paddingHorizontal: 14,
  paddingVertical: 12,
  marginBottom: 14,
  flexDirection: "row",
  alignItems: "flex-start",
  gap: 10,
},

avisoLocalTexto: {
  flex: 1,
  fontSize: 15,
  fontWeight: "800",
  color: "#7A4F00",
  fontFamily: "serif",
  lineHeight: 22,
},

formCard: {
  backgroundColor: "#FFFFFF",
  borderRadius: 18,
  padding: 22,
  marginBottom: 20,
  borderWidth: 1,
  borderColor: "#E4E7EC",

  shadowColor: "#000",
  shadowOpacity: 0.04,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 5 },
  elevation: 2,
},

formGrid: {
  flexDirection: "row",
  gap: 14,
  alignItems: "flex-start",
  marginBottom: 6,
},

formCampoGrande: {
  flex: 2,
  position: "relative",
},

formCampoPequeno: {
  flex: 1,
  position: "relative",
},

dropdownBox: {
  width: "100%",
  maxHeight: 230,
  backgroundColor: "#FFFFFF",
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#E4E7EC",
  padding: 8,
  marginBottom: 14,

  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 5 },
  elevation: 3,
},

opcaoCompacta: {
  minHeight: 44,
  backgroundColor: "#F2F4F7",
  borderRadius: 10,
  paddingVertical: 10,
  paddingHorizontal: 14,
  marginBottom: 8,
  borderWidth: 1,
  borderColor: "#D0D5DD",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
},

secaoTitulo: {
  fontSize: 20,
  fontWeight: "900",
  color: "#160909",
  fontFamily: "serif",
  marginTop: 14,
  marginBottom: 10,
},

separadorFormulario: {
  height: 1,
  backgroundColor: "#E4E7EC",
  marginVertical: 16,
},

servicosCompactContainer: {
  gap: 10,
  marginBottom: 18,
},

hospitalCompactCard: {
  backgroundColor: "#FFFFFF",
  borderRadius: 14,
  borderWidth: 1,
  borderColor: "#E4E7EC",
  overflow: "hidden",
},

hospitalCompactHeader: {
  minHeight: 58,
  backgroundColor: "#F7F8FA",
  paddingHorizontal: 14,
  paddingVertical: 10,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottomWidth: 1,
  borderBottomColor: "#E4E7EC",
},

hospitalCompactTitulo: {
  fontSize: 18,
  fontWeight: "900",
  color: "#225943",
  fontFamily: "serif",
},

hospitalCompactSubtitulo: {
  fontSize: 13,
  fontWeight: "800",
  color: "#667085",
  fontFamily: "serif",
  marginTop: 2,
},

servicosCompactLista: {
  padding: 10,
  gap: 8,
},

servicoCompactLinha: {
  minHeight: 48,
  backgroundColor: "#F2F4F7",
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "#D0D5DD",
  paddingHorizontal: 12,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
},

servicoCompactLinhaSelecionada: {
  backgroundColor: "#FFF7E0",
  borderColor: "#FDB515",
},

servicoCompactCheckArea: {
  flex: 1,
  minHeight: 46,
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
},

servicoCompactNome: {
  flex: 1,
  fontSize: 15,
  fontWeight: "900",
  color: "#160909",
  fontFamily: "serif",
},

vagasCompactInput: {
  width: 96,
  height: 38,
  backgroundColor: "#FFFFFF",
  borderRadius: 9,
  paddingHorizontal: 10,
  fontSize: 14,
  fontWeight: "900",
  color: "#160909",
  fontFamily: "serif",
  borderWidth: 1,
  borderColor: "#D0D5DD",
  textAlign: "center",

},

calendarioDiaDesativado: {
  backgroundColor: "#E9E9E9",
  opacity: 0.45,
},

calendarioDiaTextoDesativado: {
  color: "#8c8787",
},


vagasCompactInputDisabled: {
  opacity: 0.45,
},
});

const styles = {
  ...local,

  popupOverlay: backofficeStyles.popupOverlay,
  popupContainer: backofficeStyles.popupContainer,
  popupTitle: backofficeStyles.popupTitle,
  popupMessage: backofficeStyles.popupMessage,
  popupOkButton: backofficeStyles.popupOkButton,
  popupOkText: backofficeStyles.popupOkText,
};

export default styles;