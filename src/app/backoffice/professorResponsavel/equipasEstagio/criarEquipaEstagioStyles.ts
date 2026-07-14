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
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E4E7EC",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  modalTitulo: {
    fontSize: 24,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 18,
  },

  formGridDuasColunas: {
    flexDirection: "row",
    gap: 18,
    alignItems: "flex-start",
  },

  formColuna: {
    flex: 1,
    minWidth: 0,
  },

  label: {
    fontSize: 15,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 7,
    marginTop: 12,
  },

  selectToggle: {
    minHeight: 52,
    backgroundColor: "#F2F4F7",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectToggleText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
    marginRight: 10,
  },

  pickerListaGrande: {
    maxHeight: 260,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E4E7EC",
    marginTop: 8,
    marginBottom: 10,
    padding: 8,
  },

  pickerListaPessoa: {
    maxHeight: 220,
  },

  dropdownPessoaBox: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E7EC",
    borderRadius: 12,
    padding: 10,
    marginTop: 8,
    marginBottom: 10,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },

  searchPessoaContainer: {
    height: 44,
    backgroundColor: "#F2F4F7",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  searchComFiltroLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },

  searchPessoaContainerComFiltro: {
    flex: 1,
    height: 44,
    backgroundColor: "#F2F4F7",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  searchPessoaInput: {
    flex: 1,
    height: 44,
    fontSize: 14,
    fontWeight: "700",
    color: "#160909",
    fontFamily: "serif",
    marginLeft: 8,
    outlineStyle: "none" as any,
  },

  mostrarTodosBotaoPesquisa: {
    width: 96,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#FFF7E0",
    borderWidth: 1,
    borderColor: "#FDB515",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  mostrarTodosTexto: {
    fontSize: 13,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  opcao: {
    borderRadius: 12,
    padding: 13,
    marginBottom: 7,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E4E7EC",
  },

  opcaoPessoaCompacta: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginBottom: 7,
    borderWidth: 1,
    borderColor: "#E4E7EC",
  },

  opcaoSelecionada: {
    backgroundColor: "#FFF7E0",
    borderColor: "#FDB515",
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

  localOrientadorTexto: {
    fontSize: 12,
    fontWeight: "900",
    color: "#B77900",
    fontFamily: "serif",
    marginTop: 5,
  },

  localOrientadorTextoCombina: {
    color: "#225943",
  },

  localBoxCompacto: {
    backgroundColor: "#FFF7E0",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FDB515",
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginTop: 12,
    marginBottom: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  localTextoCompacto: {
    flex: 1,
    fontSize: 13,
    fontWeight: "800",
    color: "#7A4F00",
    fontFamily: "serif",
    lineHeight: 18,
  },

  avisoOrientadoresBox: {
    backgroundColor: "#FFF7E0",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FDB515",
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  avisoOrientadoresTexto: {
    flex: 1,
    fontSize: 14,
    fontWeight: "800",
    color: "#7A4F00",
    fontFamily: "serif",
    lineHeight: 20,
  },

  textoVazio: {
    fontSize: 14,
    fontWeight: "800",
    color: "#667085",
    fontFamily: "serif",
    padding: 12,
  },

  input: {
    height: 52,
    backgroundColor: "#F2F4F7",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
    outlineStyle: "none" as any,
  },

  popupBotoesLinha: {
    ...backofficeStyles.popupBotoesLinha,
    marginTop: 24,
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