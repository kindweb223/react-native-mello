import { StyleSheet } from "react-native";
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

export default StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: CONSTANTS.PADDING,
  },
  searchContainer: {
    width: '100%',
    backgroundColor: COLORS.LIGHT_GREY_LINE,
    paddingHorizontal: 5,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  searchIconView: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6
  },
  filterContainer: {
    width: '100%',
    paddingVertical: 20,
    backgroundColor: '#fff'
  },
  titleView: {
    paddingBottom: 7,
    borderBottomWidth: 1,
    borderColor: COLORS.LIGHT_GREY_LINE
  },
  title: {
    color: COLORS.MEDIUM_GREY
  },
  filterItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 5
  },
  filterItemText: {
    color: '#000',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '500'
  }
});
