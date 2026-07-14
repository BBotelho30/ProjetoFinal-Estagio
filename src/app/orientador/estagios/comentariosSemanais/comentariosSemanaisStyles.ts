import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
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
    paddingBottom: 50,
  },

  voltar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 26,
  },

  voltarTexto: {
    fontSize: 18,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  titulo: {
    fontSize: 38,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 24,
    lineHeight: 43,
  },

  estagioCard: {
    backgroundColor: "#E9E9E9",
    borderRadius: 14,
    borderLeftWidth: 6,
    borderLeftColor: "#FDB515",
    padding: 18,
    marginBottom: 18,
  },

  estagioTitulo: {
    fontSize: 22,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    lineHeight: 27,
  },

  estagioTexto: {
    fontSize: 15,
    fontWeight: "800",
    color: "#777",
    fontFamily: "serif",
    marginTop: 8,
  },

  alunoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    padding: 16,
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  alunoIcone: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#FDB515",
    alignItems: "center",
    justifyContent: "center",
  },

  alunoNome: {
    fontSize: 21,
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

  secaoTitulo: {
    fontSize: 24,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 14,
  },

  label: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 8,
    marginTop: 10,
  },

  inputBotao: {
    width: "100%",
    minHeight: 56,
    backgroundColor: "#E9E9E9",
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  inputBotaoTexto: {
    fontSize: 16,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
  },

  inputBotaoPlaceholder: {
    color: "#8c8787",
  },

  textArea: {
    width: "100%",
    minHeight: 145,
    backgroundColor: "#E9E9E9",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    fontSize: 16,
    fontWeight: "700",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 18,
  },

  botaoGuardar: {
    height: 56,
    borderRadius: 12,
    backgroundColor: "#FDB515",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 28,
  },

  botaoGuardarTexto: {
    fontSize: 17,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  botaoDisabled: {
    opacity: 0.55,
  },

  mensagemVazia: {
    fontSize: 15,
    fontWeight: "800",
    color: "#777",
    fontFamily: "serif",
    lineHeight: 22,
    marginTop: 4,
  },

  lista: {
    gap: 12,
  },

  comentarioCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    padding: 16,
  },

  comentarioHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },

  comentarioIcone: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FDB515",
    alignItems: "center",
    justifyContent: "center",
  },

  comentarioSemana: {
    fontSize: 17,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  comentarioData: {
    fontSize: 13,
    fontWeight: "800",
    color: "#777",
    fontFamily: "serif",
    marginTop: 4,
  },

  comentarioTexto: {
    fontSize: 15,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    lineHeight: 22,
  },

  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 22,
  },

  popupContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 22,
  },

  popupTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 8,
  },

  popupMessage: {
    fontSize: 15,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    lineHeight: 21,
  },

  popupOkButton: {
    height: 48,
    backgroundColor: "#FDB515",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },

  popupOkText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  popupBotoesLinha: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
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

  calendarioContainer: {
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

  diaBotao: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    marginBottom: 4,
  },

  diaBotaoSelecionado: {
    backgroundColor: "#FDB515",
  },

  diaBotaoVazio: {
    opacity: 0,
  },

  diaBotaoTexto: {
    fontSize: 15,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  diaBotaoTextoSelecionado: {
    color: "#160909",
  },
});

export default styles;