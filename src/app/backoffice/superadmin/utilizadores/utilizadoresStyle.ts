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

  headerIcon: {
    width: 62,
    height: 62,
    borderRadius: 18,
    backgroundColor: "#FFF7E0",
    alignItems: "center",
    justifyContent: "center",
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
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E4E7EC",
    zIndex: 1000,
    overflow: "visible",

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 20,
  },

  searchRow: {
    width: "100%",
    marginBottom: 14,
  },

  searchContainer: {
    width: "100%",
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

  filtrosLinha: {
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
    zIndex: 1000,
    overflow: "visible",
  },

  filtroBox: {
    flex: 1,
    position: "relative",
    zIndex: 1000,
  },

  filtroLabel: {
    fontSize: 14,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 6,
  },

  selectToggle: {
    height: 46,
    backgroundColor: "#F2F4F7",
    borderRadius: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#D0D5DD",
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
  },

    dropdown: {
      position: "absolute",
      top: 76,
      left: 0,
      right: 0,
      backgroundColor: "#FFFFFF",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#E4E7EC",
      padding: 6,
      zIndex: 2000,

      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 30,
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
    minHeight: 64,
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

  td: {
    fontSize: 16,
    fontWeight: "700",
    color: "#555",
    fontFamily: "serif",
  },

  colNome: {
    flex: 2,
  },

  colTipo: {
    flex: 1,
  },

  colNumero: {
    flex: 1.3,
  },

  colEstado: {
    flex: 1,
  },

  colAcoes: {
    flex: 1.2,
  },

  estadoBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#e0f9dcff",
    color: "#4bcf37ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 13,
    fontWeight: "900",
    fontFamily: "serif",
    overflow: "hidden",
  },

  estadoBadgeInativo: {
    backgroundColor: "#FEE4E2",
    color: "#B42318",
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
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },

  detalheItem: {
    minWidth: 220,
    flex: 1,
  },

  detalheLabel: {
    fontSize: 14,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 4,
  },

  detalheValor: {
    fontSize: 15,
    fontWeight: "700",
    color: "#667085",
    fontFamily: "serif",
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

  paginacaoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#E4E7EC",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  paginacaoInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 22,
  },

  paginacaoTexto: {
    fontSize: 15,
    fontWeight: "800",
    color: "#667085",
    fontFamily: "serif",
  },

  porPaginaContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    position: "relative",
  },

  porPaginaLabel: {
    fontSize: 15,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  porPaginaBotao: {
    height: 38,
    minWidth: 72,
    borderRadius: 9,
    backgroundColor: "#F2F4F7",
    borderWidth: 1,
    borderColor: "#D0D5DD",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  porPaginaTexto: {
    fontSize: 15,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  porPaginaDropdown: {
    position: "absolute",
    top: 42,
    right: 0,
    width: 72,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E4E7EC",
    padding: 6,
    zIndex: 60,
  },

  porPaginaOpcao: {
    height: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  porPaginaOpcaoTexto: {
    fontSize: 15,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  paginacaoBotoes: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  paginaBotao: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#FDB515",
    alignItems: "center",
    justifyContent: "center",
  },

  paginaBotaoDisabled: {
    opacity: 0.4,
  },

  paginaAtualTexto: {
    fontSize: 15,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  popupBotoesLinha: {
    ...backofficeStyles.popupBotoesLinha,
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