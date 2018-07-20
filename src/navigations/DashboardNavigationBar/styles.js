import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: '100%',
    paddingHorizontal: CONSTANTS.PADDING,
    zIndex: 999,
  },
  miniContainer: {
    height: CONSTANTS.MINI_NAVIGATION_BAR_HEIGTH,
    width: '100%',
    paddingHorizontal: CONSTANTS.PADDING,
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: '#fff',
  },
  subContainer: {
    flex: 1,
  },
  navbarView: {
    justifyContent: 'flex-end',
    width: '100%',
    paddingTop: 16,
    height: 50,
  },
  searchIcon: {
    fontSize: 30,
    color: COLORS.LIGHT_GREY,
  },
  titleView: {
    justifyContent: 'flex-end',
    backgroundColor: '#fff',
    width: '100%',
    height: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.PRIMARY_BLACK,
  },
  miniNavbarView: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    paddingBottom: 10
  },
  miniTitle: {
    fontSize: 16,
    color: COLORS.PRIMARY_BLACK,
    fontWeight: 'bold'
  },
  settingButton: {
    position: 'absolute',
    bottom: 5,
    right: 0
  },
  setting: {
    fontSize: 30,
    color: COLORS.LIGHT_GREY,
  },
})

export default styles
