import { StyleSheet } from "react-native";
import backofficeStyles from "../../../../styles/backofficeStyles";

const local = StyleSheet.create({
  page: {
    ...backofficeStyles.page,
  },

  container: {
    ...backofficeStyles.containerWeb,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingTexto: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
  },

  content: {
    ...backofficeStyles.contentWeb,
  },

  voltar: {
    ...backofficeStyles.voltar,
  },

  voltarTexto: {
    ...backofficeStyles.voltarTexto,
  },

  cardPerfil: {
    ...backofficeStyles.card,
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 24,
    marginBottom: 18,
  },

  fotoContainer: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  fotoPerfil: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 4,
    borderColor: "#FDB515",
  },

  fotoPlaceholder: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 4,
    borderColor: "#FDB515",
    backgroundColor: "#FFF7E0",
    alignItems: "center",
    justifyContent: "center",
  },

  cameraIcon: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FDB515",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },

  nome: {
    fontSize: 27,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    textAlign: "center",
  },

  email: {
    fontSize: 15,
    fontWeight: "700",
    color: "#667085",
    fontFamily: "serif",
    marginTop: 4,
    textAlign: "center",
  },

  tipoBadge: {
    marginTop: 12,
    backgroundColor: "#FDB515",
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  tipoBadgeTexto: {
    fontSize: 13,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  apagarFotoBotao: {
    marginTop: 12,
    backgroundColor: "#101828",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  apagarFotoTexto: {
    fontSize: 13,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "serif",
  },

  formCard: {
    ...backofficeStyles.card,
    padding: 22,
  },

  infoBox: {
    ...backofficeStyles.cardAmarelo,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 14,
  },

  infoTexto: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: "#160909",
    fontFamily: "serif",
    lineHeight: 19,
  },

  label: {
    ...backofficeStyles.label,
  },

  input: {
    ...backofficeStyles.input,
  },

  inputBloqueado: {
    ...backofficeStyles.inputBloqueado,
  },

  passwordContainer: {
    ...backofficeStyles.passwordContainer,
  },

  passwordInput: {
    ...backofficeStyles.passwordInput,
  },

  ajudaPassword: {
    ...backofficeStyles.ajudaTexto,
  },

  botaoEditar: {
    ...backofficeStyles.botaoAmarelo,
    marginTop: 22,
  },

  textoBotao: {
    ...backofficeStyles.textoBotaoAmarelo,
  },

  botoesLinha: {
    flexDirection: "row",
    gap: 12,
    marginTop: 22,
  },

  botaoCancelar: {
    flex: 1,
    ...backofficeStyles.botaoEscuro,
  },

  botaoGuardar: {
    flex: 1,
    ...backofficeStyles.botaoAmarelo,
  },

  textoCancelar: {
    ...backofficeStyles.textoBotaoEscuro,
    fontSize: 16,
  },

  textoGuardar: {
    ...backofficeStyles.textoBotaoAmarelo,
    fontSize: 16,
  },

  botaoSair: {
    ...backofficeStyles.botaoEscuro,
    marginTop: 16,
  },

  textoSair: {
    ...backofficeStyles.textoBotaoEscuro,
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