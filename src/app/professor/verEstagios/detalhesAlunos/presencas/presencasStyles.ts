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
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#FDB515",
    alignItems: "center",
    justifyContent: "center",
  },

  alunoNome: {
    fontSize: 22,
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

  resumoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },

  resumoBox: {
    width: "48%",
    backgroundColor: "#E9E9E9",
    borderRadius: 14,
    padding: 14,
    minHeight: 82,
  },

  resumoNumero: {
    fontSize: 25,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  resumoLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: "#777",
    fontFamily: "serif",
    marginTop: 4,
  },

  botaoValidarTudo: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#FDB515",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },

  botaoValidarTudoTexto: {
    fontSize: 17,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  botaoDisabled: {
    opacity: 0.45,
  },

  secaoTitulo: {
    fontSize: 24,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 14,
  },

  mensagemVazia: {
    fontSize: 15,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
  },

  lista: {
    gap: 12,
  },

  presencaCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    padding: 16,
  },

  presencaTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },

  presencaData: {
    fontSize: 19,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  presencaHora: {
    fontSize: 15,
    fontWeight: "800",
    color: "#777",
    fontFamily: "serif",
    marginTop: 4,
  },

  estadoBadge: {
    backgroundColor: "#FFF3C4",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  estadoBadgeValidado: {
    backgroundColor: "#D7F5DF",
  },

  estadoBadgeTexto: {
    fontSize: 12,
    fontWeight: "900",
    color: "#B77900",
    fontFamily: "serif",
  },

  estadoBadgeTextoValidado: {
    color: "#225943",
  },

  presencaInfoLinha: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },

  infoMiniBox: {
    flex: 1,
    backgroundColor: "#E9E9E9",
    borderRadius: 12,
    padding: 10,
  },

  infoMiniLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  infoMiniValor: {
    fontSize: 15,
    fontWeight: "900",
    color: "#777",
    fontFamily: "serif",
    marginTop: 5,
  },

  assinaturasLinha: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
  },

  assinaturaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  assinaturaTexto: {
    fontSize: 13,
    fontWeight: "800",
    color: "#777",
    fontFamily: "serif",
  },

  observacoes: {
    fontSize: 14,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    marginTop: 12,
    lineHeight: 20,
  },

  validadoTexto: {
    fontSize: 14,
    fontWeight: "900",
    color: "#225943",
    fontFamily: "serif",
    marginTop: 14,
  },

  botaoValidarDia: {
    height: 46,
    borderRadius: 10,
    backgroundColor: "#FDB515",
    marginTop: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  botaoValidarDiaTexto: {
    fontSize: 15,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
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

  validacoesLinha: {
  gap: 8,
  marginTop: 14,
},

validacaoItem: {
  flexDirection: "row",
  alignItems: "center",
  gap: 7,
},

validacaoTexto: {
  fontSize: 13,
  fontWeight: "800",
  color: "#777",
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