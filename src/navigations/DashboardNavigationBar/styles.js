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
    backgroundColor: 'white',
  },
  subContainer: {
    flex: 1,
  },
  searchView: {
    flex: 1,
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
  miniTitleView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  miniTitle: {
    fontSize: 16,
    color: COLORS.PRIMARY_BLACK,
  },
})

export default styles
