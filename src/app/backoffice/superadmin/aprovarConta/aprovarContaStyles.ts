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
    backgroundColor: "rgba(255,255,255,0.07)",
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
    backgroundColor: "rgba(255,255,255,0.06)",
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


  filterToggle: {
    height: 50,
    backgroundColor: "#FDB515",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 18,
  },

  filterToggleText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  filterDropdown: {
    width: 220,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E4E7EC",
    alignSelf: "flex-end",
  },

  filterOption: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
  },

  filterOptionActive: {
    backgroundColor: "#FDB515",
  },

  filterOptionText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
  },

  lista: {
    gap: 16,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    borderLeftWidth: 6,
    borderLeftColor: "#FDB515",
    borderWidth: 1,
    borderColor: "#E4E7EC",

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },

  cardTopo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#FDB515",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },

  info: {
    flex: 1,
  },

  nome: {
    fontSize: 24,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  numeroTopo: {
    fontSize: 16,
    fontWeight: "800",
    color: "#667085",
    marginTop: 3,
    fontFamily: "serif",
  },

  estadoBadge: {
    backgroundColor: "#FFF7E0",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "#FDB515",
  },

  estadoBadgeTexto: {
    fontSize: 14,
    fontWeight: "900",
    color: "#B77900",
    fontFamily: "serif",
    textTransform: "capitalize",
  },

  detalhesGrid: {
    backgroundColor: "#F7F8FA",
    borderRadius: 14,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: "#E4E7EC",
  },

  linhaInfo: {
    flexDirection: "row",
    alignItems: "center",
  },

  label: {
    width: 80,
    fontSize: 17,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  valor: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: "#555",
    fontFamily: "serif",
  },


  valorTipo: {
  flex: 1,
  fontSize: 17,
  fontWeight: "700",
  color: "#555",
  fontFamily: "serif",
  textTransform: "capitalize",
},

  botoes: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },

  botao: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
  },

  botaoAprovar: {
    backgroundColor: "#45a02cff",
  },

  botaoRejeitar: {
    backgroundColor: "#ef1a1aff",
  },

  botaoTexto: {
    fontSize: 17,
    fontWeight: "900",
    color: "#ffffffff",
    fontFamily: "serif",
  },

  botaoTextoRejeitar: {
    fontSize: 17,
    fontWeight: "900",
    color: "#FFFFFF",
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

  vazioTexto: {
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
    zIndex: 10,
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

      logoSidebar: {
    width: 62,
    height: 62,
    borderRadius: 31,
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
  flexDirection: "row",
  alignItems: "flex-end",
  gap: 14,
  zIndex: 1000,
  overflow: "visible",
},

searchContainer: {
  flex: 2,
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
  height: 50,
  fontSize: 16,
  fontWeight: "700",
  color: "#160909",
  fontFamily: "serif",
  marginLeft: 10,
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

menuIconWrapper: {
  width: 24,
  height: 24,
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
},

notificacaoBadge: {
  position: "absolute",
  top: -8,
  right: -10,
  minWidth: 18,
  height: 18,
  borderRadius: 9,
  backgroundColor: "#EF4444",
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: 4,
  borderWidth: 1,
  borderColor: "#225943",
},

notificacaoTexto: {
  fontSize: 10,
  fontWeight: "900",
  color: "#FFFFFF",
  fontFamily: "serif",
},

menuTextoComBadge: {
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
},

notificacaoBadgeTexto: {
  minWidth: 22,
  height: 22,
  borderRadius: 11,
  backgroundColor: "#EF4444",
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: 6,
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

tabelaLinha: {
  minHeight: 64,
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 16,
  backgroundColor: "#FFFFFF",
  borderBottomWidth: 1,
  borderBottomColor: "#E4E7EC",
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
  flex: 1.5,
},

colTipo: {
  flex: 1,
},

colNumero: {
  flex: 1.2,
},

colEmail: {
  flex: 1.8,
},

colEstado: {
  flex: 0.9,
},

colAcoes: {
  flex: 1,
},

estadoBadgeTabela: {
  alignSelf: "flex-start",
  backgroundColor: "#FFF7E0",
  color: "#B77900",
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 999,
  fontSize: 13,
  fontWeight: "900",
  fontFamily: "serif",
  overflow: "hidden",
},

acoes: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
},

acaoBotaoAprovar: {
  width: 36,
  height: 36,
  borderRadius: 9,
  backgroundColor: "#45a02cff",
  alignItems: "center",
  justifyContent: "center",
},

acaoBotaoRejeitar: {
  width: 36,
  height: 36,
  borderRadius: 9,
  backgroundColor: "#ef1a1aff",
  alignItems: "center",
  justifyContent: "center",
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