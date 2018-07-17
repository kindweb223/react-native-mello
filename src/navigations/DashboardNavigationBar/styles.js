import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    height: CONSTANTS.NORMAL_NAVIGATION_BAR_HEIGTH,
    width: '100%',
    paddingHorizontal: CONSTANTS.PADDING
  },
  miniContainer: {
    height: CONSTANTS.MINI_NAVIGATION_BAR_HEIGTH,
    width: '100%',
    paddingHorizontal: CONSTANTS.PADDING
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
    paddingVertical: 16,
    width: '100%',
    height: CONSTANTS.MINI_NAVIGATION_BAR_HEIGTH,
  },
  searchIcon: {
    fontSize: 30,
    color: COLORS.LIGHT_GREY,
  },
  titleView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.PRIMARY_BLACK,
  },
  miniNavbarView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 16,
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
