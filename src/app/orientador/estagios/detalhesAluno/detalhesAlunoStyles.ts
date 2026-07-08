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
    paddingHorizontal: 10,
    paddingTop: 58,
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

  alunoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderLeftWidth: 6,
    borderLeftColor: "#FDB515",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 18,
  },

  alunoIcone: {
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
    borderWidth: 3,
    borderColor: "#FDB515",
  },

  alunoNome: {
    fontSize: 25,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    lineHeight: 29,
  },

  alunoTexto: {
    fontSize: 14,
    fontWeight: "800",
    color: "#777",
    fontFamily: "serif",
    marginTop: 3,
  },

  alunoBadge: {
    alignSelf: "flex-start",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginTop: 8,
  },

  alunoBadgeTexto: {
    fontSize: 13,
    fontWeight: "900",
    color: "#225943",
    fontFamily: "serif",
  },

  estagioHero: {
    backgroundColor: "#FDB515",
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
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
    fontWeight: "900",
    color: "#7A4F00",
    fontFamily: "serif",
    marginTop: 8,
  },

  estagioHeroBadge: {
    marginTop: 16,
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },

  estagioHeroBadgeTexto: {
    fontSize: 13,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  secaoTitulo: {
    fontSize: 25,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 14,
    marginTop: 4,
  },

  pessoaCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 10,
  },

  pessoaIcone: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#FFF3C4",
    alignItems: "center",
    justifyContent: "center",
  },

  pessoaLabel: {
    fontSize: 16,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  pessoaNome: {
    fontSize: 15,
    fontWeight: "800",
    color: "#777",
    fontFamily: "serif",
    marginTop: 5,
  },

  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 28,
  },

  infoBox: {
    width: "48.7%",
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
    fontSize: 15,
    fontWeight: "900",
    color: "#777",
    fontFamily: "serif",
    marginTop: 8,
    lineHeight: 20,
  },

  avaliacaoCard: {
    backgroundColor: "#E9E9E9",
    borderRadius: 14,
    padding: 16,
    marginBottom: 28,
  },

  avaliacaoNota: {
    fontSize: 22,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 6,
  },

  avaliacaoTexto: {
    fontSize: 15,
    fontWeight: "800",
    color: "#777",
    fontFamily: "serif",
    lineHeight: 20,
  },

  acoesLista: {
    gap: 10,
  },

  acaoCard: {
    height: 58,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  acaoTexto: {
    flex: 1,
    fontSize: 17,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },
});

export default styles;