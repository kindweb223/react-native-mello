import { StyleSheet } from "react-native";
import COLORS from '../../service/colors';

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center"
  },
  textInputContainer: {
    minWidth: 50,
    height: 40,
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 16,
    color: "rgba(0, 0, 0, 0.87)",
  },
  tagInputCoverContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  textLabel: {
    margin: 0,
    padding: 0,
    fontSize: 16,
    color: COLORS.MEDIUM_GREY,
  },
  tag: {
    justifyContent: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 16,
    paddingLeft: 12,
    paddingRight: 12,
    height: 32,
    marginVertical: 4,
    marginRight: 8,
  },
  tagLabel: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.87)"
  },
});
