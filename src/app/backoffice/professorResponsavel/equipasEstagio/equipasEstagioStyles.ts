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
    borderRadius: 14,
    backgroundColor: "#FDB515",
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

  botaoCriar: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FDB515",
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  botaoCriarTexto: {
    fontSize: 15,
    fontWeight: "900",
    color: "#160909",
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
    zIndex: 50,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },

  searchContainer: {
    flex: 1,
    height: 52,
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

  filtroBox: {
    width: 250,
    position: "relative",
    zIndex: 80,
  },

  filtroLabel: {
    fontSize: 13,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 7,
  },

  selectToggle: {
    height: 52,
    backgroundColor: "#F2F4F7",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectToggleText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
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
    zIndex: 200,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },

  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
  },

  dropdownText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
  },

  vazioCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E4E7EC",
  },

  vazioTitulo: {
    fontSize: 22,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginTop: 12,
  },

  vazioTexto: {
    fontSize: 15,
    fontWeight: "700",
    color: "#667085",
    fontFamily: "serif",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },

  tabelaCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E4E7EC",

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
    gap: 10,
  },

  tabelaLinha: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F6",
  },

  th: {
    fontSize: 14,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "serif",
  },

  tdPrincipal: {
    fontSize: 14,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  tdSecundario: {
    fontSize: 12,
    fontWeight: "800",
    color: "#667085",
    fontFamily: "serif",
    marginTop: 3,
  },

  colEnsino: {
    flex: 2.2,
    minWidth: 260,
  },

  colLocal: {
    flex: 1.45,
    minWidth: 170,
  },

  colAno: {
    flex: 0.45,
    minWidth: 55,
  },

  colVagas: {
    flex: 0.55,
    minWidth: 65,
  },

  colEquipa: {
    flex: 1,
    minWidth: 135,
  },

  colDistribuicao: {
    flex: 1.35,
    minWidth: 170,
  },

    colEstado: {
    flex: 0.75,
    minWidth: 95,
    },

    colAcoes: {
    width: 198,
    minWidth: 198,
    maxWidth: 198,
    },

  badgeDistribuicao: {
    alignSelf: "flex-start",
    backgroundColor: "#E8F7EF",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  badgeDistribuicaoTexto: {
    fontSize: 12,
    fontWeight: "900",
    color: "#225943",
    fontFamily: "serif",
  },

  acoes: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "nowrap",
  },

  acaoBotao: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#FDB515",
    alignItems: "center",
    justifyContent: "center",
  },

  acaoBotaoPerigo: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#E74C3C",
    alignItems: "center",
    justifyContent: "center",
  },

  detalhesBox: {
    backgroundColor: "#F8FAFC",
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F6",
    padding: 18,
    flexDirection: "row",
    gap: 28,
  },

  detalheColuna: {
    flex: 1,
  },

  detalheLabel: {
    fontSize: 13,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginTop: 8,
    marginBottom: 4,
  },

  detalheValor: {
    fontSize: 14,
    fontWeight: "800",
    color: "#667085",
    fontFamily: "serif",
    lineHeight: 20,
  },

  footerTabela: {
    marginTop: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E4E7EC",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    zIndex: 30,
  },

  footerTexto: {
    fontSize: 14,
    fontWeight: "900",
    color: "#667085",
    fontFamily: "serif",
  },

  itensPorPaginaBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    position: "relative",
    zIndex: 100,
  },

  itensDropdownWrapper: {
    position: "relative",
    zIndex: 120,
  },

  itensSelect: {
    height: 40,
    minWidth: 70,
    backgroundColor: "#F2F4F7",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  itensSelectTexto: {
    fontSize: 14,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  itensDropdown: {
    position: "absolute",
    bottom: 46,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E4E7EC",
    padding: 5,
    zIndex: 200,
    elevation: 10,
  },

  itensDropdownItem: {
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 8,
  },

  itensDropdownText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
  },

  paginacao: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  paginaBotao: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#FDB515",
    alignItems: "center",
    justifyContent: "center",
  },

  paginaBotaoDisabled: {
    opacity: 0.35,
  },

  paginaTexto: {
    fontSize: 14,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

botoesFinais: {
  marginTop: 18,
  flexDirection: "row",
  justifyContent: "flex-end",
  gap: 12,
},

  botaoApagarTudo: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#E74C3C",
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  botaoApagarTudoTexto: {
    fontSize: 15,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "serif",
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



tabelaLinhaInativa: {
  opacity: 0.58,
  backgroundColor: "#F9FAFB",
},

estadoBadge: {
  alignSelf: "flex-start",
  backgroundColor: "#E8F7EF",
  borderRadius: 999,
  paddingHorizontal: 10,
  paddingVertical: 6,
},

estadoBadgeInativo: {
  backgroundColor: "#FEE2E2",
},

estadoBadgeTexto: {
  fontSize: 12,
  fontWeight: "900",
  color: "#225943",
  fontFamily: "serif",
},

estadoBadgeTextoInativo: {
  color: "#B42318",
},

acaoBotaoEscuro: {
  width: 38,
  height: 38,
  borderRadius: 10,
  backgroundColor: "#160909",
  alignItems: "center",
  justifyContent: "center",
},

acaoBotaoAtivar: {
  width: 38,
  height: 38,
  borderRadius: 10,
  backgroundColor: "#FDB515",
  alignItems: "center",
  justifyContent: "center",
},



botaoTodosInativos: {
  height: 48,
  borderRadius: 12,
  backgroundColor: "#160909",
  paddingHorizontal: 18,
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
},

botaoTodosInativosTexto: {
  fontSize: 15,
  fontWeight: "900",
  color: "#FFFFFF",
  fontFamily: "serif",
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