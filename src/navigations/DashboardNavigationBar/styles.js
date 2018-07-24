import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: '100%',
    paddingHorizontal: CONSTANTS.PADDING,
    // zIndex: 999,
  },
  miniContainer: {
    height: CONSTANTS.MINI_NAVIGATION_BAR_HEIGTH,
    height: '100%',
    width: '100%',
    paddingHorizontal: CONSTANTS.PADDING,
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: '#fff',
  },
  navbarView: {
    justifyContent: 'flex-end',
    width: '100%',
    height: '50%',
  },
  searchIcon: {
    fontSize: 30,
    color: COLORS.LIGHT_GREY,
  },
  titleView: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
    height: '50%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.PRIMARY_BLACK,
  },
  miniNavbarView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
    paddingBottom: 10,
  },
  miniTitle: {
    fontSize: 18,
    color: COLORS.PRIMARY_BLACK,
    fontWeight: 'bold'
  },
  setting: {
    fontSize: 30,
    color: COLORS.LIGHT_GREY,
  },
})

export default styles
