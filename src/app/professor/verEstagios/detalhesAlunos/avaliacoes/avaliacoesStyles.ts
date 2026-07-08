import { StyleSheet } from "react-native";
import globalStyles from "../../../../../styles/globalStyles";

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
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 50,
  },

  voltar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },

  voltarTexto: {
    fontSize: 18,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  titulo: {
    fontSize: 36,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 20,
  },

  alunoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderLeftWidth: 6,
    borderLeftColor: "#FDB515",
  },

  alunoIcone: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: "#FDB515",
    alignItems: "center",
    justifyContent: "center",
  },

  alunoNome: {
    fontSize: 23,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  alunoTexto: {
    fontSize: 14,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    marginTop: 4,
  },

  estagioCard: {
    backgroundColor: "#FDB515",
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#B77900",
  },

  estagioTitulo: {
    fontSize: 23,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    lineHeight: 29,
  },

  estagioTexto: {
    fontSize: 15,
    fontWeight: "800",
    color: "#7A4F00",
    fontFamily: "serif",
    marginTop: 7,
  },

  secaoTitulo: {
    fontSize: 24,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 14,
    marginTop: 4,
  },

  resumoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 22,
  },

  resumoBox: {
    width: "48%",
    backgroundColor: "#E9E9E9",
    borderRadius: 14,
    padding: 14,
    minHeight: 86,
  },

  resumoBoxFull: {
    width: "100%",
    backgroundColor: "#FFF3C4",
    borderRadius: 14,
    padding: 14,
    minHeight: 86,
    borderWidth: 1,
    borderColor: "#FDB515",
  },

  resumoLabel: {
    fontSize: 13,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  resumoValor: {
    fontSize: 18,
    fontWeight: "900",
    color: "#777",
    fontFamily: "serif",
    marginTop: 8,
  },

  observacaoOrientadorBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    padding: 14,
    marginBottom: 22,
  },

  observacaoTitulo: {
    fontSize: 15,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 7,
  },

  observacaoTexto: {
    fontSize: 14,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    lineHeight: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 8,
    marginTop: 10,
  },

  input: {
    width: "100%",
    height: 56,
    backgroundColor: "#E9E9E9",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 17,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 6,
  },

  ajudaTexto: {
    fontSize: 13,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    marginBottom: 10,
  },

  textArea: {
    width: "100%",
    minHeight: 150,
    backgroundColor: "#E9E9E9",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    fontSize: 16,
    fontWeight: "700",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 22,
  },

  botaoGuardar: {
    height: 58,
    borderRadius: 12,
    backgroundColor: "#FDB515",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  botaoGuardarTexto: {
    fontSize: 18,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  botaoDisabled: {
    opacity: 0.55,
  },

  popupBotoesLinha: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },

  popupBotaoCancelar: {
    flex: 1,
    height: 48,
    backgroundColor: "#160909",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  popupTextoCancelar: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "serif",
  },

  popupBotaoConfirmar: {
    flex: 1,
    height: 48,
    backgroundColor: "#FDB515",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  popupTextoConfirmar: {
    fontSize: 16,
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
