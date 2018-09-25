import { StyleSheet, Platform } from 'react-native'
import CONSTANTS from '../../service/constants'
import COLORS from '../../service/colors'
const NAV_BAR_HEIGHT = 60

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    flex: 1
  },
  navbar: {
    height: NAV_BAR_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: CONSTANTS.PADDING,
    borderBottomWidth: 1,
    borderColor: COLORS.LIGHT_GREY_LINE
  },
  headerTitleView: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.PRIMARY_BLACK,
  },
  backView: {
    width: 100,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100%'
  },
  backTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 5,
    color: COLORS.PURPLE,
  },
  emptyView: {
    position: 'absolute',
    top: CONSTANTS.STATUSBAR_HEIGHT + NAV_BAR_HEIGHT,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: CONSTANTS.SCREEN_HEIGHT - CONSTANTS.STATUSBAR_HEIGHT - 100
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.MEDIUM_GREY,
    marginTop: 27
  }
})

export default styles
