import { StyleSheet } from "react-native";
import globalStyles from "../../../styles/globalStyles";

const local = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },

  voltar: { flexDirection: "row", alignItems: "center", marginBottom: 26 },
  voltarTexto: {
    fontSize: 18,
    fontWeight: "800",
    color: "#160909",
    marginLeft: 8,
    fontFamily: "serif",
  },

  subtitulo: {
    fontSize: 16,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    marginTop: 6,
    marginBottom: 22,
  },

  botaoCriar: {
    width: "100%",
    height: 60,
    backgroundColor: "#FDB515",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  textoBotaoCriar: {
    fontSize: 24,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },

  searchContainer: {
    flex: 1,
    height: 56,
    backgroundColor: "#E9E9E9",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#160909",
    fontFamily: "serif",
    marginLeft: 10,
  },

  filterToggle: {
    height: 56,
    backgroundColor: "#E9E9E9",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 14,
  },

  filterToggleText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  filterDropdown: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E9E9E9",
  },

  filterOption: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
  },

  filterOptionActive: { backgroundColor: "#FDB515" },

  filterOptionText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#160909",
    fontFamily: "serif",
  },

  filterOptionTextActive: { fontWeight: "900" },

  textoVazio: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
  },

  lista: { gap: 14 },

  card: {
    backgroundColor: "#E9E9E9",
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 6,
    borderLeftColor: "#FDB515",
  },

  cardTopo: { flexDirection: "row", alignItems: "center", marginBottom: 14 },

  cardIcone: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FDB515",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  cardInfo: { flex: 1 },

  cardTitulo: {
    fontSize: 19,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  cardSubtitulo: {
    fontSize: 14,
    fontWeight: "700",
    color: "#666",
    fontFamily: "serif",
    marginTop: 3,
  },

  resumoLinha: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },

  resumoTexto: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 13,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  secaoCard: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginTop: 8,
    marginBottom: 4,
  },

  cardTexto: {
    fontSize: 15,
    fontWeight: "700",
    color: "#555",
    fontFamily: "serif",
    marginBottom: 3,
  },

  cardActions: {
    marginTop: 12,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
  },

  actionEdit: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#160909",
  },

  actionDelete: { backgroundColor: "#e74c3c" },

  actionText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#160909",
    marginLeft: 7,
    fontFamily: "serif",
  },

  popupBotoesLinha: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginTop: 8,
  },

  popupBotaoCancelar: {
    flex: 1,
    height: 46,
    backgroundColor: "#160909",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  popupBotaoApagar: {
    flex: 1,
    height: 46,
    backgroundColor: "#e74c3c",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  popupTextoCancelar: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "serif",
  },

  popupTextoApagar: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "serif",
  },
});

const styles = {
  ...local,
  titulo: globalStyles.titulo,
  popupOverlay: globalStyles.popupOverlay,
  popupContainer: globalStyles.popupContainer,
  popupTitle: globalStyles.popupTitle,
  popupMessage: globalStyles.popupMessage,
  popupOkButton: globalStyles.popupOkButton,
  popupOkText: globalStyles.popupOkText,
};

export default styles;