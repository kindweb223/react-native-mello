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
  searchView: {
    width: '100%',
    marginBottom: 20
  },
  normalHeader: {
    height: NAV_BAR_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 11
  },
  headerTitleView: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5
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
    backgroundColor: '#fff',
    zIndex: 11,
    position: 'absolute',
    left: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  backView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: CONSTANTS.PADDING,
  },
  backTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 5,
    color: COLORS.PURPLE,
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
