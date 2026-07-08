import { StyleSheet } from "react-native";

const backofficeStyles = StyleSheet.create({
  // Títulos
  titulo: {
    fontSize: 34,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  tituloAmarelo: {
    fontSize: 34,
    fontWeight: "900",
    color: "#FDB515",
    fontFamily: "serif",
    marginBottom: 22,
  },

  subtitulo: {
    fontSize: 16,
    fontWeight: "700",
    color: "#667085",
    fontFamily: "serif",
  },

  // Layout base web
  page: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },

  containerWeb: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },

  contentWeb: {
    width: "100%",
    maxWidth: 820,
    alignSelf: "center",
    paddingHorizontal: 28,
    paddingTop: 34,
    paddingBottom: 50,
  },

  // Cards
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E4E7EC",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },

  cardCinza: {
    backgroundColor: "#F7F8FA",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E4E7EC",
  },

  cardAmarelo: {
    backgroundColor: "#FFF7E0",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#FDB515",
  },

  // Formulários
  label: {
    fontSize: 15,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 6,
    marginTop: 10,
  },

  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#F2F4F7",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: "700",
    color: "#160909",
    fontFamily: "serif",
    borderWidth: 1,
    borderColor: "#D0D5DD",
  },

  inputBloqueado: {
    opacity: 0.75,
  },

  passwordContainer: {
    width: "100%",
    height: 50,
    backgroundColor: "#F2F4F7",
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D0D5DD",
  },

  passwordInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#160909",
    fontFamily: "serif",
    paddingRight: 10,
  },

  ajudaTexto: {
    fontSize: 12,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    marginTop: 6,
    lineHeight: 17,
  },

  // Botões
  botaoAmarelo: {
    height: 52,
    backgroundColor: "#FDB515",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  textoBotaoAmarelo: {
    fontSize: 18,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  botaoEscuro: {
    height: 52,
    backgroundColor: "#101828",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  textoBotaoEscuro: {
    fontSize: 17,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "serif",
  },

  botaoPerigo: {
    height: 46,
    backgroundColor: "#e74c3c",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  textoBotaoPerigo: {
    fontSize: 15,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "serif",
  },

  // Voltar
  voltar: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  voltarTexto: {
    fontSize: 16,
    fontWeight: "800",
    color: "#160909",
    marginLeft: 8,
    fontFamily: "serif",
  },

  // Select / dropdown
  selectToggle: {
    width: "100%",
    minHeight: 50,
    backgroundColor: "#F2F4F7",
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#D0D5DD",
  },

  selectToggleText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#160909",
    fontFamily: "serif",
  },

  dropdown: {
    width: "100%",
    marginTop: 6,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E4E7EC",
    padding: 6,
  },

  dropdownOption: {
    width: "100%",
    minHeight: 44,
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 12,
    marginBottom: 4,
  },

  dropdownOptionSelected: {
    backgroundColor: "#FDB515",
  },

  dropdownOptionText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
  },

  // Pop-ups web/backoffice
  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  popupContainer: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 22,
    paddingVertical: 22,
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 5,
  },

  popupTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    textAlign: "center",
    marginBottom: 8,
  },

  popupMessage: {
    fontSize: 15,
    fontWeight: "700",
    color: "#555",
    fontFamily: "serif",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 18,
  },

  popupOkButton: {
    width: "100%",
    height: 44,
    backgroundColor: "#FDB515",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },

  popupOkText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  popupBotoesLinha: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    marginTop: 4,
  },

  popupBotaoCancelar: {
    flex: 1,
    height: 42,
    backgroundColor: "#160909",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  popupBotaoPerigo: {
    flex: 1,
    height: 42,
    backgroundColor: "#e74c3c",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  popupTextoCancelar: {
    fontSize: 15,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "serif",
  },

  popupTextoPerigo: {
    fontSize: 15,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "serif",
  },
});

export default backofficeStyles;