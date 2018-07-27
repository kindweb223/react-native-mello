import { StyleSheet } from "react-native";
import COLORS from '../../service/colors';

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
    margin: 4,
    borderRadius: 16,
    justifyContent: 'center',
  },
  textInput: {
    margin: 0,
    padding: 0,
    paddingRight: 12,
    flex: 1,
    height: 32,
    fontSize: 16,
    color: "rgba(0, 0, 0, 0.87)"
  },
  textLabel: {
    margin: 0,
    padding: 0,
    paddingHorizontal: 12,
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
    margin: 4
  },
  tagLabel: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.87)"
  },
});
