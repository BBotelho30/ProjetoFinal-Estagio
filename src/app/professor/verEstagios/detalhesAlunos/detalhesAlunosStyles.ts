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

  alunoHero: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    padding: 16,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderLeftWidth: 6,
    borderLeftColor: "#FDB515",
  },

  alunoIconeGrande: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: "#FDB515",
    alignItems: "center",
    justifyContent: "center",
  },

  fotoAluno: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: "#FDB515",
    overflow: "hidden",
  },

  alunoNome: {
    fontSize: 24,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    lineHeight: 29,
  },

  alunoTexto: {
    fontSize: 14,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    marginTop: 4,
  },

  estadoBadge: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "#D7F5DF",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },

  estadoBadgeTexto: {
    fontSize: 13,
    fontWeight: "900",
    color: "#225943",
    fontFamily: "serif",
  },

  estagioHero: {
    backgroundColor: "#FDB515",
    borderRadius: 16,
    padding: 20,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: "#B77900",
  },

  estagioHeroTitulo: {
    fontSize: 26,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    lineHeight: 31,
  },

  estagioHeroTexto: {
    fontSize: 16,
    fontWeight: "800",
    color: "#7A4F00",
    fontFamily: "serif",
    marginTop: 8,
  },

  estagioBadge: {
    marginTop: 14,
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },

  estagioBadgeTexto: {
    fontSize: 13,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    textTransform: "capitalize",
  },

  secaoTitulo: {
    fontSize: 24,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 14,
    marginTop: 8,
  },

  equipaCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  equipaIcone: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#FFF3C4",
    alignItems: "center",
    justifyContent: "center",
  },

  equipaFoto: {
    width: 58,
    height: 58,
    borderRadius: 29,
    overflow: "hidden",
  },

  equipaTitulo: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  equipaTexto: {
    fontSize: 15,
    fontWeight: "800",
    color: "#777",
    fontFamily: "serif",
    marginTop: 4,
  },

  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },

  infoBox: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    padding: 14,
    minHeight: 82,
  },

  infoLabel: {
    fontSize: 13,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  infoValor: {
    fontSize: 16,
    fontWeight: "900",
    color: "#777",
    fontFamily: "serif",
    marginTop: 7,
  },

  avaliacaoBox: {
    backgroundColor: "#FFF7E0",
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#FDB515",
  },

  avaliacaoNota: {
    fontSize: 24,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  avaliacaoTexto: {
    fontSize: 15,
    fontWeight: "700",
    color: "#777",
    fontFamily: "serif",
    marginTop: 8,
  },

  avaliacaoData: {
    fontSize: 13,
    fontWeight: "800",
    color: "#777",
    fontFamily: "serif",
    marginTop: 8,
  },

  avaliacaoVazia: {
    backgroundColor: "#E9E9E9",
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },

  avaliacaoVaziaTexto: {
    fontSize: 15,
    fontWeight: "800",
    color: "#777",
    fontFamily: "serif",
  },

  acoesLista: {
    gap: 10,
  },

  acaoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  acaoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  acaoTexto: {
    fontSize: 17,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },
});

export default styles;
