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
    fontSize: 38,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  subtitulo: {
    fontSize: 15,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    marginTop: 6,
    marginBottom: 22,
  },

  label: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 8,
    marginTop: 12,
  },

  selectToggle: {
    minHeight: 56,
    backgroundColor: "#E9E9E9",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  selectToggleText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
  },

  pickerLista: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 14,
    padding: 8,
    marginTop: 8,
    marginBottom: 8,
    maxHeight: 260,
  },

  opcao: {
    padding: 13,
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: "#F7F7F7",
  },

  opcaoSelecionada: {
    backgroundColor: "#FFF3C4",
    borderWidth: 1,
    borderColor: "#FDB515",
  },

  opcaoLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  opcaoTitulo: {
    fontSize: 15,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  opcaoTexto: {
    fontSize: 13,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    marginTop: 4,
  },

  tipoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 6,
  },

  tipoCard: {
    width: "48%",
    minHeight: 82,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    backgroundColor: "#FFFFFF",
    padding: 12,
    justifyContent: "center",
    gap: 8,
  },

  tipoCardAtivo: {
    backgroundColor: "#FDB515",
    borderColor: "#B77900",
  },

  tipoTexto: {
    fontSize: 14,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  input: {
    width: "100%",
    height: 56,
    backgroundColor: "#E9E9E9",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
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
    minHeight: 130,
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
    marginTop: 4,
    marginBottom: 12,
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

  botaoVerReunioes: {
    height: 56,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },

  botaoVerReunioesTexto: {
    fontSize: 17,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  mensagemVazia: {
    fontSize: 15,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    lineHeight: 21,
    padding: 10,
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

export default styles;