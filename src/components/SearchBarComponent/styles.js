import { StyleSheet } from "react-native";
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

export default StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: CONSTANTS.PADDING,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  btnCancelView: {
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  btnCancelText: {
    color: COLORS.DARK_GREY,
    fontWeight: '600'
  },
  btnCloseView: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 40,
  },
  btnClose: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchBar: {
    backgroundColor: COLORS.LIGHT_GREY_LINE,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  searchIconView: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6,
    position: 'absolute',
    top: 3,
    left: 0
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
