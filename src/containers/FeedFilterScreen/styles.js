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
    flex: 1,
    paddingBottom: 30
  },
  scrollView: {
    zIndex: 9,
    paddingTop: NAV_BAR_HEIGHT,
  },
  detailView: {
    flex: 1,
    paddingTop: 10
  },
  normalHeader: {
    height: NAV_BAR_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: CONSTANTS.PADDING
  },
  headerTitleView: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.PRIMARY_BLACK,
    marginRight: 10
  },
  miniNavView: {
    width: '100%',
    height: NAV_BAR_HEIGHT,
    paddingHorizontal: CONSTANTS.PADDING,
    backgroundColor: '#fff',
    zIndex: 11,
    position: 'absolute',
    left: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'transparent'
  },
  backView: {
    width: 150,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100%'
  },
  backIcon: {
    fontSize: 35,
    color: COLORS.PURPLE,
    marginRight: 6
  },
  backTitle: {
    color: COLORS.PURPLE,
    fontSize: 18,
    fontWeight: '500'
  },
  emptyContainer: {
    width: '100%',
    paddingVertical: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.MEDIUM_GREY
  }
})

export default styles
