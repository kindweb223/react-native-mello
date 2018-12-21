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
  normalHeader: {
    height: 50,
    backgroundColor: 'transparent'
  },
  navbarView: {
    flexDirection: 'row',
    width: '100%',
    height: SEARCHBAR_HEIGHT,
    paddingHorizontal: 11,
    backgroundColor: '#fff',
    zIndex: 11,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  searchIconView: {
    width: 70,
    height: '100%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  minHeader: {
    flexDirection: 'row',
    height: '100%'
  },
  minTitleView: {
    width: CONSTANTS.SCREEN_WIDTH - 120 - 22,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  minTitle: {
    fontSize: 16,
    color: COLORS.PRIMARY_BLACK,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  settingIconView: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'absolute',
    right: 12,
    top: 5
  },
  feedListView: {
    zIndex: 10,
    marginTop: SEARCHBAR_HEIGHT - 15,
    paddingTop: 15,
    marginBottom: Platform.OS === 'ios' ? ifIphoneX(0, 56) : 56
  },
  feedListContainer: {
    paddingTop: 8
  },
  tabBarStyle: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    height: CONSTANTS.TAB_BAR_HEIGHT,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 0,
    paddingLeft: 16
  },
  tabBarItemStyle: {
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    overflow: 'hidden',
    height: 30
  },
  activeTabBarItemStyle: {
    backgroundColor: COLORS.LIGHT_GREY_PLACEHOLDER,
  },
  tabBarTextStyle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'left',
    color: COLORS.DARK_GREY
  },
  activeTabBarTextStyle: {
    color: '#000'
  },
  longHoldModalContainer: {
    margin: 0,
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
  emptyTabInnerView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: CONSTANTS.SCREEN_HEIGHT - CONSTANTS.ACTION_BAR_HEIGHT - CONSTANTS.TAB_BAR_HEIGHT - 100
  },
  emptyTabInnerSubView: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%'
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.MEDIUM_GREY,
    marginTop: 27
  },
  badgeView: {
    width: 18,
    height: 18,
    marginLeft: 5,
    borderRadius: 9,
    backgroundColor: COLORS.PURPLE,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeText: {
    color: '#fff',
    fontSize: 10
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
  }
})

export default styles
