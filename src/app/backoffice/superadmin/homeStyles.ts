import { StyleSheet } from "react-native";
import backofficeStyles from "../../../styles/backofficeStyles";

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

  main: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 34,
    paddingTop: 32,
    paddingBottom: 44,
  },

  header: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 28,
    paddingVertical: 24,
    marginBottom: 26,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 3,
  },

  titulo: {
    fontSize: 38,
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

  headerProfile: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#FFF7E0",
    alignItems: "center",
    justifyContent: "center",
  },

  sectionTitle: {
    fontSize: 25,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 16,
  },

  cardsContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 18,
  },

  card: {
    width: "48.5%",
    minHeight: 108,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderLeftWidth: 6,
    borderLeftColor: "#FDB515",

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  cardTexto: {
    flex: 1,
    marginLeft: 16,
  },

  cardTitulo: {
    fontSize: 21,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 5,
  },

  cardDescricao: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    fontFamily: "serif",
    lineHeight: 20,
  },

  logoSidebar: {
  width: 62,
  height: 62,
  borderRadius: 31,
  },

  profileButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFF7E0",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FDB515",
    overflow: "hidden",
  },

  profileImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
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
  popupBotoesLinha: backofficeStyles.popupBotoesLinha,
  popupBotaoCancelar: backofficeStyles.popupBotaoCancelar,
  popupBotaoSair: backofficeStyles.popupBotaoPerigo,
  popupTextoCancelar: backofficeStyles.popupTextoCancelar,
  popupTextoSair: backofficeStyles.popupTextoPerigo,
};

export default styles;
