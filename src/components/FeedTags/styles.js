import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center"
  },

  textInputContainer: {
    flex: 1,
    width: 100,
    height: 32,
    marginRight: 4,
    borderRadius: 16,
    backgroundColor: "#ccc"
  },

  textInput: {
    margin: 0,
    padding: 0,
    paddingLeft: 10,
    paddingRight: 10,
    flex: 1,
    height: 25,
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.87)"
  },

  tag: {
    justifyContent: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 12.5,
    paddingLeft: 10,
    paddingRight: 10,
    height: 25,
    marginRight: 8
  },
  tagLabel: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.87)"
  }
});
