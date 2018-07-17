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
  navView: {
    height: CONSTANTS.MINI_NAVIGATION_BAR_HEIGTH,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    alignItems: 'flex-end',
  },
  backView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  backIcon: {
    fontSize: 35,
    color: COLORS.PURPLE,
    marginRight: 6
  },
  backTitle: {
    fontSize: 20,
    color: COLORS.PURPLE,
  },
  titleView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.PRIMARY_BLACK,
  },
  miniTitleView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  miniTitle: {
    fontSize: 16,
    color: COLORS.PRIMARY_BLACK,
  },
})

export default styles
