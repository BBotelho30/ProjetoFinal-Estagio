import { StyleSheet } from "react-native";
import globalStyles from "../../../styles/globalStyles";

const local = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 120 },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  voltar: { flexDirection: "row", alignItems: "center", marginBottom: 24 },

  voltarTexto: {
    fontSize: 18,
    fontWeight: "800",
    color: "#160909",
    marginLeft: 8,
    fontFamily: "serif",
  },

  resumoCard: {
    backgroundColor: "#E9E9E9",
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    marginBottom: 18,
  },

  resumoTitulo: {
    fontSize: 21,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  resumoTexto: {
    fontSize: 15,
    fontWeight: "700",
    color: "#666",
    fontFamily: "serif",
    marginTop: 4,
  },

  horasLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 8,
  },

  horasTexto: {
    fontSize: 15,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  progressoFundo: {
    width: "100%",
    height: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressoBarra: {
    height: "100%",
    backgroundColor: "#FDB515",
    borderRadius: 10,
  },

  faltasResumo: {
    marginTop: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
  },

  faltasTexto: {
    fontSize: 14,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 3,
  },

  botoesRegistoLinha: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 22,
  },

  botaoCriar: {
    flex: 1,
    height: 58,
    backgroundColor: "#FDB515",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  botaoFalta: {
    flex: 1,
    height: 58,
    backgroundColor: "#160909",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  textoBotaoCriar: {
    fontSize: 20,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  textoBotaoFalta: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "serif",
  },

  secaoTitulo: {
    fontSize: 24,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 14,
    marginTop: 8,
  },

  textoVazio: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    textAlign: "center",
  },

  lista: { gap: 12, marginBottom: 18 },

  cardPresenca: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#D6D6D6",
    borderLeftWidth: 6,
    borderLeftColor: "#FDB515",
  },

  cardFalta: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#D6D6D6",
    borderLeftWidth: 6,
    borderLeftColor: "#e74c3c",
  },

  cardTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },

  dataTexto: {
    fontSize: 19,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  horarioTexto: {
    fontSize: 15,
    fontWeight: "800",
    color: "#777",
    fontFamily: "serif",
    marginTop: 3,
  },

  badgeEstado: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  badgeTexto: {
    fontSize: 12,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  infoTexto: {
    fontSize: 15,
    fontWeight: "800",
    color: "#555",
    fontFamily: "serif",
    marginTop: 4,
  },

  validacaoTexto: {
    fontSize: 14,
    fontWeight: "900",
    color: "#B77900",
    fontFamily: "serif",
    marginTop: 8,
  },

  observacoesTexto: {
    fontSize: 14,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    marginTop: 6,
  },

  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 22,
  },

  modalContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
  },

  modalTitulo: {
    fontSize: 26,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    textAlign: "center",
    marginBottom: 18,
  },

  input: {
    width: "100%",
    height: 54,
    backgroundColor: "#E9E9E9",
    borderRadius: 9,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: "700",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 12,
  },

  label: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 8,
  },

  tipoLinha: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },

  tipoBotao: {
    flex: 1,
    height: 48,
    backgroundColor: "#E9E9E9",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },

  tipoSelecionado: {
    backgroundColor: "#FDB515",
  },

  tipoTexto: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  botaoDocumento: {
    width: "100%",
    minHeight: 52,
    backgroundColor: "#E9E9E9",
    borderRadius: 9,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },

  textoDocumento: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
  },

  modalBotoes: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },

  botaoCancelar: {
    flex: 1,
    height: 50,
    backgroundColor: "#160909",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },

  botaoGuardar: {
    flex: 1,
    height: 50,
    backgroundColor: "#FDB515",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },

  textoCancelar: {
    fontSize: 17,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "serif",
  },

  textoGuardar: {
    fontSize: 17,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
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
    fontSize: 11,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
  },

  bottomTextoAtivo: {
    fontSize: 11,
    fontWeight: "900",
    color: "#FDB515",
    fontFamily: "serif",
  },

  avisoReprovacao: {
  backgroundColor: "#F8C8C8",
  borderRadius: 12,
  padding: 14,
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
  marginBottom: 18,
},

avisoReprovacaoTexto: {
  flex: 1,
  fontSize: 14,
  fontWeight: "900",
  color: "#160909",
  fontFamily: "serif",
},

calendarioCard: {
  backgroundColor: "#FFFFFF",
  borderRadius: 16,
  borderWidth: 1,
  borderColor: "#D9D9D9",
  padding: 14,
  marginBottom: 16,
},

calendarioModalContainer: {
  width: "100%",
  backgroundColor: "#FFFFFF",
  borderRadius: 18,
  padding: 18,
},

calendarioHeader: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 16,
},

calendarioSeta: {
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: "#FFF3C4",
  alignItems: "center",
  justifyContent: "center",
},

calendarioTitulo: {
  flex: 1,
  textAlign: "center",
  fontSize: 20,
  fontWeight: "900",
  color: "#160909",
  fontFamily: "serif",
  textTransform: "capitalize",
},

diasSemanaLinha: {
  flexDirection: "row",
  marginBottom: 8,
},

diaSemanaTexto: {
  width: "14.28%",
  textAlign: "center",
  fontSize: 13,
  fontWeight: "900",
  color: "#777",
  fontFamily: "serif",
},

calendarioGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
},

diaVazio: {
  width: "14.28%",
  aspectRatio: 1,
},

diaBotao: {
  width: "14.28%",
  aspectRatio: 1,
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 12,
  marginBottom: 4,
},

diaSelecionado: {
  backgroundColor: "#FFF3C4",
},

diaForaEstagio: {
  opacity: 0.25,
},

diaTexto: {
  fontSize: 15,
  fontWeight: "900",
  color: "#160909",
  fontFamily: "serif",
},

diaTextoSelecionado: {
  color: "#160909",
},

diaTextoForaEstagio: {
  color: "#999",
},

diaDot: {
  width: 7,
  height: 7,
  borderRadius: 4,
  marginTop: 3,
},

legendaLinha: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 12,
  marginTop: 12,
},

legendaItem: {
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
},

legendaDot: {
  width: 8,
  height: 8,
  borderRadius: 4,
},

legendaTexto: {
  fontSize: 12,
  fontWeight: "800",
  color: "#777",
  fontFamily: "serif",
},

detalhesDiaCard: {
  backgroundColor: "#E9E9E9",
  borderRadius: 14,
  padding: 14,
  marginBottom: 18,
},

detalhesDiaTitulo: {
  fontSize: 18,
  fontWeight: "900",
  color: "#160909",
  fontFamily: "serif",
  marginBottom: 8,
},

detalhesDiaTexto: {
  fontSize: 14,
  fontWeight: "700",
  color: "#777",
  fontFamily: "serif",
  lineHeight: 20,
},

registoDiaBox: {
  backgroundColor: "#FFFFFF",
  borderRadius: 12,
  padding: 12,
  marginTop: 8,
},

registoDiaTitulo: {
  fontSize: 15,
  fontWeight: "900",
  color: "#160909",
  fontFamily: "serif",
},

registoDiaTexto: {
  fontSize: 14,
  fontWeight: "700",
  color: "#777",
  fontFamily: "serif",
  marginTop: 4,
},

inputBotao: {
  width: "100%",
  height: 54,
  backgroundColor: "#E9E9E9",
  borderRadius: 9,
  paddingHorizontal: 14,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 12,
},

inputBotaoTexto: {
  fontSize: 16,
  fontWeight: "700",
  color: "#160909",
  fontFamily: "serif",
},

inputBotaoPlaceholder: {
  color: "#8c8787",
},

relogioContainer: {
  width: "100%",
  backgroundColor: "#FFFFFF",
  borderRadius: 18,
  padding: 22,
},

relogioTitulo: {
  fontSize: 24,
  fontWeight: "900",
  color: "#160909",
  fontFamily: "serif",
  textAlign: "center",
  marginBottom: 18,
},

relogioDisplay: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 16,
  marginBottom: 18,
},

relogioColuna: {
  alignItems: "center",
},

relogioBotao: {
  width: 54,
  height: 44,
  borderRadius: 14,
  backgroundColor: "#FFF3C4",
  alignItems: "center",
  justifyContent: "center",
},

relogioNumero: {
  fontSize: 48,
  fontWeight: "900",
  color: "#160909",
  fontFamily: "serif",
  marginVertical: 8,
},

relogioSeparador: {
  fontSize: 48,
  fontWeight: "900",
  color: "#160909",
  fontFamily: "serif",
},
});

const styles = {
  ...local,
  titulo: globalStyles.titulo,
  popupContainer: globalStyles.popupContainer,
  popupTitle: globalStyles.popupTitle,
  popupMessage: globalStyles.popupMessage,
  popupOkButton: globalStyles.popupOkButton,
  popupOkText: globalStyles.popupOkText,
};

export default styles;