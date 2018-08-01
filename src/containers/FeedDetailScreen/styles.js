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
    paddingBottom: CONSTANTS.ACTION_BAR_HEIGHT,
  },
  emptyView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: CONSTANTS.SCREEN_HEIGHT - CONSTANTS.ACTION_BAR_HEIGHT - 200,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.MEDIUM_GREY,
    marginTop: 27
  },
  scrollView: {
    zIndex: 9,
    paddingTop: NAV_BAR_HEIGHT,
  },
  detailView: {
    flex: 1,
    paddingVertical: 10
  },
  tagView: {
    marginVertical: 10,
  },
  normalHeader: {
    height: NAV_BAR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: CONSTANTS.PADDING
  },
  headerTitleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '50%',
    width: '100%',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.PRIMARY_BLACK,
    marginRight: 10,
    flex: 1
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  backView: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: '100%'
  },
  backIcon: {
    fontSize: 35,
    color: COLORS.PURPLE,
    marginRight: 6
  },
  rightHeader: {
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarView: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingView: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 100
  },
  settingMenuView: {
    borderRadius: 20,
    backgroundColor: '#fff',
    width: 122,
    height: 260,
    paddingTop: 10,
    position: 'absolute',
    right: CONSTANTS.PADDING,
    zIndex: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5
      },
      android: {
        elevation: 20
      }
    })
  },  
})

export default styles
