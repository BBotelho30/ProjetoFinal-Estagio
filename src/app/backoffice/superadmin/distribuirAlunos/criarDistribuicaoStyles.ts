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

  pickerListaGrande: {
    maxHeight: 340,
    marginBottom: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E4E7EC",
    padding: 8,
  },

  alunosBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E4E7EC",
    padding: 10,
    marginTop: 4,
    overflow: "visible",
    zIndex: 100,
  },

  searchFiltroLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
    zIndex: 200,
    overflow: "visible",
  },

  searchContainerComFiltro: {
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
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "700",
    color: "#160909",
    fontFamily: "serif",
    outlineStyle: "none" as any,
  },

  filtroAnoBox: {
    width: 190,
    position: "relative",
    zIndex: 300,
  },

  filtroAnoToggle: {
    height: 50,
    backgroundColor: "#F2F4F7",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  filtroAnoTexto: {
    flex: 1,
    fontSize: 14,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginRight: 8,
  },

  filtroAnoDropdown: {
    position: "absolute",
    top: 56,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E4E7EC",
    padding: 6,
    zIndex: 400,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },

  filtroAnoOpcao: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
  },

  filtroAnoOpcaoTexto: {
    fontSize: 14,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
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

  opcaoOrientadorCombina: {
    borderColor: "#225943",
    backgroundColor: "#E8F7EF",
  },

  opcaoLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  opcaoTitulo: {
    fontSize: 15,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  opcaoTexto: {
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

  infoBox: {
    backgroundColor: "#FFF7E0",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FDB515",
    padding: 14,
    marginTop: 4,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  infoTitulo: {
    fontSize: 14,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 3,
  },

  infoTexto: {
    fontSize: 13,
    fontWeight: "800",
    color: "#7A4F00",
    fontFamily: "serif",
    marginTop: 2,
    lineHeight: 19,
  },

  localOrientadorTexto: {
    fontSize: 13,
    fontWeight: "900",
    color: "#B77900",
    fontFamily: "serif",
    marginTop: 6,
  },

  estagiosAlunoTexto: {
    fontSize: 12,
    fontWeight: "800",
    color: "#667085",
    fontFamily: "serif",
    marginTop: 4,
    lineHeight: 18,
  },

  popupBotoesLinha: {
    ...backofficeStyles.popupBotoesLinha,
    marginTop: 20,
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

  pickerListaAlunos: {
  maxHeight: 380,
  marginTop: 10,
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