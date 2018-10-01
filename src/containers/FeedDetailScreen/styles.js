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
  loadingView: {
    width: '100%',
    position: 'absolute'
  },
  emptyView: {
    flex: 1,
  },
  emptyInnerView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: CONSTANTS.SCREEN_HEIGHT - CONSTANTS.ACTION_BAR_HEIGHT - 200,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.MEDIUM_GREY,
    marginTop: 27
  },
  navBar: {
    width: '100%',
    height: NAV_BAR_HEIGHT,
    paddingHorizontal: CONSTANTS.PADDING,
    backgroundColor: '#fff',
    zIndex: 11,
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
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingView: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15
  },
  collapseView: {
    width: '100%',
    paddingHorizontal: CONSTANTS.PADDING,
    paddingBottom: 20,
    paddingTop: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    zIndex: 11,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 5
      },
      android: {
        elevation: 20
      }
    })
  },
  scrollView: {
  },
  detailView: {
    paddingVertical: 10
  },
  modalContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: COLORS.LIGHT_GREY_MODAL_BACKGROUND,
  },
  settingMenuView: {
    borderRadius: 20,
    backgroundColor: '#fff',
    width: 122,
    paddingVertical: 10,
    position: 'absolute',
    right: CONSTANTS.PADDING,
    top: CONSTANTS.STATUSBAR_HEIGHT + 60,
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
  shareScreenContainer: {
    margin: 0,
  },
  longHoldModalContainer: {
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectFeedoModalContainer: {
    margin: 0,
    justifyContent: 'center',
  },
})

export default styles
