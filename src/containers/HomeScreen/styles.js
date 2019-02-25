import { StyleSheet, Platform } from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper';
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const SEARCHBAR_HEIGHT = 40
const NAV_BAR_HEIGHT = 55

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? ifIphoneX(0, 10) : 10
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: '#fff',
  },
  feedListContainer: {
    marginTop: 8
  },
  feedListContainerLongHold: {
    marginTop: -32
  },
  modalContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: COLORS.MODAL_BACKGROUND,
  },
  emptyView: {
    flex: 1,
  },
  emptyInnerView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: CONSTANTS.SCREEN_HEIGHT - CONSTANTS.ACTION_BAR_HEIGHT - 100
  },
  emptyInnerSubView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: CONSTANTS.SCREEN_HEIGHT - CONSTANTS.ACTION_BAR_HEIGHT - 350
  },
  topButtonView: {
    width: '100%',
    height: NAV_BAR_HEIGHT,
    paddingHorizontal: CONSTANTS.PADDING,
    position: 'absolute',
    right: 0,
    top: CONSTANTS.STATUSBAR_HEIGHT,
    paddingTop: 8,
    alignItems: 'flex-end',
    backgroundColor: '#fff'
  },
  btnDoneView: {
    width: 69,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.PURPLE,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnDoneText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500'
  },
  headerView: {
    width: CONSTANTS.SCREEN_WIDTH,
    height: 45,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  notificationView: {
    paddingHorizontal: 16,
    height: 42,    
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  notificationIcon: {
    width: 18
  },
  notificationText: {
    color: COLORS.PURPLE,
    fontSize: 16,
    marginLeft: 5,
    lineHeight: 20
  },
  settingIconView: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'absolute',
    right: 12,
    paddingTop: 10
  },
})

export default styles
