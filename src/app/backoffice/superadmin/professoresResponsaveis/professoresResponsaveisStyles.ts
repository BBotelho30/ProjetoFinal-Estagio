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

  headerIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#FFF7E0",
    borderWidth: 1,
    borderColor: "#FDB515",
    alignItems: "center",
    justifyContent: "center",
  },

  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E4E7EC",
    zIndex: 30,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },

  formTitulo: {
    fontSize: 24,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 14,
  },

  label: {
    fontSize: 15,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 8,
    marginTop: 8,
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

  pickerLista: {
    maxHeight: 210,
    marginBottom: 14,
  },

  opcaoInstituicao: {
    backgroundColor: "#F2F4F7",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#D0D5DD",
  },

  opcaoInstituicaoSelecionada: {
    backgroundColor: "#FDB515",
    borderColor: "#160909",
  },

  opcaoLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  opcaoInstituicaoTexto: {
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

  textoVazioModal: {
    fontSize: 15,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    textAlign: "center",
    marginVertical: 15,
  },

  formBotoes: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 10,
  },

  botaoGuardar: {
    flex: 1,
    height: 50,
    backgroundColor: "#FDB515",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  textoBotao: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  botaoCancelar: {
    flex: 1,
    height: 50,
    backgroundColor: "#160909",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  textoCancelar: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "serif",
  },

  filtrosCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E4E7EC",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 14,
    zIndex: 20,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },

  searchContainer: {
    flex: 1,
    height: 50,
    backgroundColor: "#F2F4F7",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#D0D5DD",
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#160909",
    fontFamily: "serif",
    marginLeft: 10,
  },

  filtroBox: {
    width: 220,
    position: "relative",
  },

  filtroLabel: {
    fontSize: 14,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 6,
  },

  selectFiltro: {
    height: 50,
    backgroundColor: "#F2F4F7",
    borderRadius: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dropdown: {
    position: "absolute",
    top: 78,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E4E7EC",
    padding: 6,
    zIndex: 50,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },

  dropdownOption: {
    minHeight: 40,
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 10,
  },

  dropdownOptionText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
  },

  tituloSecao: {
    fontSize: 26,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 16,
  },

  tabelaCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E4E7EC",
    overflow: "hidden",

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },

  tabelaHeader: {
    minHeight: 54,
    backgroundColor: "#225943",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  th: {
    fontSize: 15,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "serif",
  },

  linhaContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#E4E7EC",
  },

  tabelaLinha: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },

  tdNome: {
    fontSize: 17,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  tdSub: {
    fontSize: 13,
    fontWeight: "700",
    color: "#667085",
    fontFamily: "serif",
    marginTop: 3,
  },

  td: {
    fontSize: 16,
    fontWeight: "700",
    color: "#555",
    fontFamily: "serif",
  },

  colProfessor: {
    flex: 1.6,
  },

  colNumero: {
    flex: 0.65,
  },

  colEnsinos: {
    flex: 0.7,
  },

  colEstado: {
    flex: 0.7,
  },

  colData: {
    flex: 0.85,
  },

  colAcoes: {
    flex: 1.1,
  },

  acoes: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  acaoBotao: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: "#FDB515",
    alignItems: "center",
    justifyContent: "center",
  },

  acaoBotaoPerigo: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: "#e74c3c",
    alignItems: "center",
    justifyContent: "center",
  },

  detalhesLinha: {
    backgroundColor: "#F7F8FA",
    paddingHorizontal: 18,
    paddingVertical: 16,
  },

  detalheLabel: {
    fontSize: 15,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 10,
  },

  ensinoDetalhe: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E4E7EC",
  },

  detalheValor: {
    fontSize: 15,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  detalheSubvalor: {
    fontSize: 13,
    fontWeight: "700",
    color: "#667085",
    fontFamily: "serif",
    marginTop: 3,
  },

  vazioContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 70,
    borderWidth: 1,
    borderColor: "#E4E7EC",
  },

  textoVazio: {
    fontSize: 20,
    fontWeight: "800",
    color: "#160909",
    marginTop: 14,
    fontFamily: "serif",
    textAlign: "center",
  },

  botaoCriarHeader: {
  height: 48,
  backgroundColor: "#FDB515",
  borderRadius: 12,
  paddingHorizontal: 18,
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "row",
  gap: 8,
},

textoBotaoCriar: {
  fontSize: 16,
  fontWeight: "900",
  color: "#160909",
  fontFamily: "serif",
},

  modalContainer: {
    width: "100%",
    maxWidth: 560,
    maxHeight: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: "stretch",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 5,
  },

  modalTitulo: {
    fontSize: 25,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 18,
    textAlign: "center",
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

  popupBotoesLinha: {
    ...backofficeStyles.popupBotoesLinha,
    marginTop: 8,
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

  estadoBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#e0f9dcff",
    color: "#4bcf37ff",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    overflow: "hidden",
    fontSize: 13,
    fontWeight: "900",
    fontFamily: "serif",
    textAlign: "center",
  },

  estadoBadgeInativo: {
    backgroundColor: "#F8C8C8",
    color: "#B42318",
  },

infoExtraLinha: {
  backgroundColor: "#FFFFFF",
  borderRadius: 12,
  paddingHorizontal: 14,
  paddingVertical: 12,
  marginBottom: 10,
  borderWidth: 1,
  borderColor: "#E4E7EC",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
},

infoExtraLabel: {
  fontSize: 14,
  fontWeight: "900",
  color: "#667085",
  fontFamily: "serif",
},

infoExtraValor: {
  fontSize: 14,
  fontWeight: "900",
  color: "#160909",
  fontFamily: "serif",
},

pickerBox: {
  marginBottom: 14,
},

modalSearchContainer: {
  width: "100%",
  height: 48,
  backgroundColor: "#F2F4F7",
  borderRadius: 10,
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 12,
  borderWidth: 1,
  borderColor: "#D0D5DD",
  marginBottom: 10,
},

modalSearchInput: {
  flex: 1,
  height: 48,
  fontSize: 15,
  fontWeight: "700",
  color: "#160909",
  fontFamily: "serif",
  marginLeft: 8,
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