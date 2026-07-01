import { StyleSheet } from "react-native";
import globalStyles from "../../styles/globalStyles";

const local = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 120,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  topIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 26,
  },

  ola: {
    fontSize: 22,
    fontWeight: "800",
    color: "#777",
    fontFamily: "serif",
  },

  nome: {
    fontSize: 34,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  fotoPerfil: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: "#FDB515",
  },

  secaoTitulo: {
    fontSize: 24,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 14,
    marginTop: 8,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 28,
  },

  cardAtalho: {
    width: "48%",
    minHeight: 118,
    backgroundColor: "#E9E9E9",
    borderRadius: 16,
    padding: 16,
    justifyContent: "space-between",
  },

  cardTitulo: {
    fontSize: 20,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  cardResponsavel: {
    backgroundColor: "#E9E9E9",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderLeftWidth: 6,
    borderLeftColor: "#FDB515",
  },

  responsavelIcone: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#FDB515",
    alignItems: "center",
    justifyContent: "center",
  },

  responsavelTitulo: {
    fontSize: 18,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  responsavelTexto: {
    fontSize: 14,
    fontWeight: "700",
    color: "#666",
    fontFamily: "serif",
    marginTop: 4,
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
    fontSize: 12,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
  },

  bottomTextoAtivo: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FDB515",
    fontFamily: "serif",
  },

  sidebarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    elevation: 999,
  },

  sidebarBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  sidebar: {
    width: "76%",
    height: "100%",
    backgroundColor: "#FDB515",
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
  },

  sidebarHeader: {
    height: 130,
    backgroundColor: "#225943",
    paddingTop: 50,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sidebarTitulo: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "serif",
  },

  sidebarImagemFixa: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#E9E9E9",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  sidebarBody: {
    flex: 1,
    backgroundColor: "#FDB515",
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 28,
  },

  sidebarItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
  },

  sidebarTexto: {
    fontSize: 18,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  logoutButton: {
    height: 52,
    backgroundColor: "#160909",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  logoutTexto: {
    fontSize: 17,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "serif",
  },

  modalBotoes: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },

  modalBotaoCancelar: {
    flex: 1,
    height: 52,
    backgroundColor: "#160909",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },

  modalBotaoCriar: {
    flex: 1,
    height: 52,
    backgroundColor: "#FDB515",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },

  modalBotaoTexto: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "serif",
  },

  modalBotaoTextoEscuro: {
    fontSize: 18,
    fontWeight: "900",
    color: "#160909",
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