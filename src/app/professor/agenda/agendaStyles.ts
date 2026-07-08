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
    paddingHorizontal: 20,
    paddingTop: 58,
    paddingBottom: 50,
  },

  voltar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
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
    marginBottom: 22,
  },

  mesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  setaMes: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  mesTitulo: {
    flex: 1,
    textAlign: "center",
    fontSize: 25,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  semanaLinha: {
    flexDirection: "row",
    marginBottom: 10,
  },

  semanaTexto: {
    width: "14.28%",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "900",
    color: "#777",
    fontFamily: "serif",
  },

  calendarioGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
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
    borderRadius: 999,
    marginBottom: 5,
  },

  diaBotaoSelecionado: {
    backgroundColor: "#FFF3C4",
  },

  diaNumero: {
    fontSize: 21,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  diaNumeroSelecionado: {
    color: "#160909",
  },

  dotsLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 4,
    minHeight: 7,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  dotPlaceholder: {
    height: 7,
    marginTop: 4,
  },

  legendaLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 4,
    marginBottom: 24,
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
    fontSize: 13,
    fontWeight: "800",
    color: "#777",
    fontFamily: "serif",
  },

  dataTitulo: {
    fontSize: 24,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 14,
  },

  listaEventos: {
    gap: 14,
  },

  eventoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderLeftWidth: 6,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },

  eventoHeaderNovo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },

  eventoIconeNovo: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },

  eventoTipoNovo: {
    fontSize: 12,
    fontWeight: "900",
    color: "#777",
    fontFamily: "serif",
    textTransform: "uppercase",
    marginBottom: 2,
  },

  eventoTituloNovo: {
    fontSize: 20,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    lineHeight: 24,
  },

  infoLinhaEvento: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 7,
  },

  infoTextoEvento: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: "#777",
    fontFamily: "serif",
    lineHeight: 20,
  },

  vazioCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    padding: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  vazioTitulo: {
    fontSize: 21,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginTop: 10,
  },

  vazioTexto: {
    fontSize: 14,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 20,
  },

  botaoAgendar: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "#FDB515",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 24,
  },

  botaoAgendarTexto: {
    fontSize: 17,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },
});

export default styles;