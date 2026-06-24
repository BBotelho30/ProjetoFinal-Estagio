import { StyleSheet } from "react-native";
import globalStyles from "../../../styles/globalStyles";

const local = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
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
    marginTop: 18,
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
    fontSize: 13,
    fontWeight: "900",
    color: "#777",
    fontFamily: "serif",
  },

  calendario: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 26,
  },

  diaVazio: {
    width: "14.28%",
    height: 52,
  },

  dia: {
    width: "14.28%",
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },

  diaSelecionado: {
    backgroundColor: "#FFF0C2",
    borderRadius: 26,
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
    marginTop: 3,
  },

  dataSelecionada: {
    fontSize: 23,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 12,
  },

  textoVazio: {
    fontSize: 16,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    marginTop: 8,
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

  eventoTitulo: {
    fontSize: 19,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  eventoTexto: {
    fontSize: 15,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    marginTop: 6,
  },

  // Bottom bar styles

    page: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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