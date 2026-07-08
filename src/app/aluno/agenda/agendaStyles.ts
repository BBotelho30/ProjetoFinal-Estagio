import { StyleSheet } from "react-native";
import globalStyles from "../../../styles/globalStyles";

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
    paddingHorizontal: 22,
    paddingTop: 60,
    paddingBottom: 120,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  voltar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  voltarTexto: {
    fontSize: 18,
    fontWeight: "800",
    color: "#160909",
    marginLeft: 8,
    fontFamily: "serif",
  },

  mesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 22,
    marginBottom: 18,
  },

  mesTitulo: {
    fontSize: 25,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    textTransform: "capitalize",
  },

  semana: {
    flexDirection: "row",
    marginBottom: 8,
  },

  diaSemana: {
    width: "14.28%",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "900",
    color: "#777",
    fontFamily: "serif",
  },

  calendario: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },

  diaVazio: {
    width: "14.28%",
    height: 58,
  },

  dia: {
    width: "14.28%",
    height: 58,
    alignItems: "center",
    justifyContent: "center",
  },

  diaSelecionado: {
    backgroundColor: "#FFF0C2",
    borderRadius: 30,
  },

  diaTexto: {
    fontSize: 20,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  marcador: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginTop: 4,
  },

  legenda: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },

  legendaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  legendaBolinha: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  legendaTexto: {
    fontSize: 12,
    fontWeight: "900",
    color: "#777",
    fontFamily: "serif",
  },

  dataSelecionada: {
    fontSize: 23,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 14,
  },

  semEventosCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#D6D6D6",
    alignItems: "center",
    justifyContent: "center",
  },

  semEventosTitulo: {
    fontSize: 21,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginTop: 10,
  },

  semEventosTexto: {
    fontSize: 14,
    fontWeight: "800",
    color: "#777",
    fontFamily: "serif",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },

  eventosLista: {
    gap: 12,
  },

  eventoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#D6D6D6",
    borderLeftWidth: 7,
  },

  eventoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },

  eventoIcone: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },

  eventoTipo: {
    fontSize: 12,
    fontWeight: "900",
    color: "#777",
    fontFamily: "serif",
    textTransform: "uppercase",
    marginBottom: 2,
  },

  eventoTitulo: {
    fontSize: 20,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    lineHeight: 24,
  },

  infoLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 7,
  },

  eventoTexto: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: "#777",
    fontFamily: "serif",
    lineHeight: 20,
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
});

const styles = {
  ...local,
  titulo: globalStyles.titulo,
};

export default styles;