import { StyleSheet } from "react-native";
import backofficeStyles from "../../../../styles/backofficeStyles";

const local = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },

content: {
  ...backofficeStyles.contentWeb,
  alignItems: "center",
},

  botaoVoltar: {
    alignSelf: "flex-start",
    marginLeft: "1%",
    height: 48,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
    marginBottom: 12,
  },

  textoVoltar: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

    cardPerfil: {
    ...backofficeStyles.card,
    width: 760,
    maxWidth: "100%",
    alignSelf: "center",
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 24,
    marginBottom: 18,
    },

  fotoBotao: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: "#FFF7E0",
    borderWidth: 4,
    borderColor: "#FDB515",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  fotoPerfil: {
    width: 116,
    height: 116,
    borderRadius: 58,
  },

  fotoEditarIcon: {
    position: "absolute",
    right: 5,
    bottom: 6,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FDB515",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  nomePerfil: {
    fontSize: 28,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginTop: 14,
  },

  emailPerfil: {
    fontSize: 15,
    fontWeight: "800",
    color: "#667085",
    fontFamily: "serif",
    marginTop: 3,
  },

  badge: {
    marginTop: 14,
    backgroundColor: "#FDB515",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  badgeTexto: {
    fontSize: 14,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

    formCard: {
    ...backofficeStyles.card,
    width: 760,
    maxWidth: "100%",
    alignSelf: "center",
    padding: 22,
    },

  infoBox: {
    backgroundColor: "#FFF7E0",
    borderWidth: 1,
    borderColor: "#FDB515",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 22,
  },

  infoTexto: {
    flex: 1,
    fontSize: 14,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
    lineHeight: 20,
  },

  label: {
    fontSize: 15,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 8,
    marginTop: 10,
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

  passwordBox: {
    height: 52,
    backgroundColor: "#F2F4F7",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  inputPassword: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
    outlineStyle: "none" as any,
  },

  ajudaTexto: {
    fontSize: 12,
    fontWeight: "800",
    color: "#667085",
    fontFamily: "serif",
    marginTop: 8,
    marginBottom: 22,
  },

  botaoEditar: {
    height: 56,
    borderRadius: 12,
    backgroundColor: "#FDB515",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },

  textoEditar: {
    fontSize: 18,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  botaoApagarFoto: {
    height: 54,
    borderRadius: 12,
    backgroundColor: "#E74C3C",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },

  textoApagarFoto: {
    fontSize: 17,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "serif",
  },

  botaoSair: {
    height: 54,
    borderRadius: 12,
    backgroundColor: "#101828",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },

  textoSair: {
    fontSize: 17,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "serif",
  },

  botaoDisabled: {
    opacity: 0.6,
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