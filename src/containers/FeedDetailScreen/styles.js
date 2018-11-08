import { StyleSheet, Platform } from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper';
import CONSTANTS from '../../service/constants'
import COLORS from '../../service/colors'
const NAV_BAR_HEIGHT = 55

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? ifIphoneX(0, 56) : 56,
  },
  loadingView: {
    width: '100%',
    position: 'absolute'
  },
  emptyView: {
    flex: 1
  },
  emptyInnerView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: CONSTANTS.SCREEN_HEIGHT - CONSTANTS.ACTION_BAR_HEIGHT - 100
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.MEDIUM_GREY,
    marginTop: 27
  },
  navBar: {
    width: '100%',
    height: NAV_BAR_HEIGHT,
    paddingRight: CONSTANTS.PADDING,
    backgroundColor: '#fff',
    zIndex: 11,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  backView: {
    width: 50,
    paddingHorizontal: CONSTANTS.PADDING,
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: '100%',
  },
  backIcon: {
    color: COLORS.PURPLE,
    marginRight: 6
  },
  rightHeader: {
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingBottom: 10
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
    marginLeft: 13
  },
  collapseView: {
    width: '100%',
    marginBottom: 30,
    paddingTop: 0,
    backgroundColor: '#fff',
    zIndex: 11
  },
  collpaseSeparator: {
    marginTop: 16
  },
  detailView: {
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? ifIphoneX(120, 10) : 10
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
    top: CONSTANTS.STATUSBAR_HEIGHT + ifIphoneX(70, 60),
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
  tagCreationContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: COLORS.LIGHT_GREY_MODAL_BACKGROUND,
    zIndex: 100
  },
  separator: {
    backgroundColor: COLORS.SEPARATOR_GREY,
    width: '100%',
    height: 1,
  }
})

export default styles
