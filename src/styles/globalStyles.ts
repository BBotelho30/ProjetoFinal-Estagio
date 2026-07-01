import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
  // Titles
  titulo: {
    fontSize: 39,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
  },

  tituloAmarelo: {
    fontSize: 39,
    fontWeight: "900",
    color: "#FDB515",
    fontFamily: "serif",
    marginBottom: 30,
  },

  // Modal titles used in many screens
  modalTitulo: {
    fontSize: 28,
    fontWeight: "900",
    color: "#160909",
    fontFamily: "serif",
    marginBottom: 18,
    textAlign: "center",
  },

  // Popup / overlay
  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  popupContainer: {
    width: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  popupTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#160909",
    marginBottom: 8,
  },

  popupMessage: {
    fontSize: 16,
    color: "#1f1f1f",
    textAlign: "center",
    marginBottom: 16,
  },

  popupOkButton: {
    width: "60%",
    height: 46,
    backgroundColor: "#FDB515",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  popupOkText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#160909",
  },

  botaoAmarelo: {
  width: "100%",
  height: 60,
  backgroundColor: "#FDB515",
  borderRadius: 10,
  justifyContent: "center",
  alignItems: "center",
},

textoBotaoAmarelo: {
  fontSize: 24,
  fontWeight: "900",
  color: "#160909",
  fontFamily: "serif",
},

input: {
  width: "100%",
  height: 56,
  backgroundColor: "#E9E9E9",
  borderRadius: 10,
  paddingHorizontal: 16,
  fontSize: 16,
  fontWeight: "700",
  color: "#160909",
  fontFamily: "serif",
},

card: {
  backgroundColor: "#E9E9E9",
  borderRadius: 16,
  padding: 16,
  borderLeftWidth: 6,
  borderLeftColor: "#FDB515",
},

dropdown: {
  width: "100%",
  marginTop: 6,
  marginBottom: 12,
},

dropdownOption: {
  width: "100%",
  height: 48,
  backgroundColor: "#E9E9E9",
  borderRadius: 9,
  justifyContent: "center",
  paddingHorizontal: 14,
  marginBottom: 8,
},

dropdownOptionSelected: {
  backgroundColor: "#FDB515",
},

dropdownOptionText: {
  fontSize: 16,
  fontWeight: "800",
  color: "#160909",
  fontFamily: "serif",
},

selectToggle: {
  width: "100%",
  minHeight: 56,
  backgroundColor: "#E9E9E9",
  borderRadius: 9,
  paddingHorizontal: 16,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 16,
  marginTop: 5,
},

selectToggleText: {
  fontSize: 16,
  fontWeight: "700",
  color: "#160909",
  fontFamily: "serif",
},

});

export default globalStyles;
