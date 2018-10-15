import { StyleSheet, Platform } from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper';
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const SEARCHBAR_HEIGHT = 60

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    flex: 1,
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
    width: 60,
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
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginRight: -2
  },
  feedListView: {
    zIndex: 10,
    paddingTop: SEARCHBAR_HEIGHT,
    marginBottom: Platform.OS === 'ios' ? ifIphoneX(0, 56) : 56
  },
  feedListContainer: {
    paddingTop: 16,
    backgroundColor: '#ff0'
  },
  tabBarStyle: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    height: CONSTANTS.TAB_BAR_HEIGHT,
    alignItems: 'center',
  },
  tabBarTextStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left'
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
  }
})

export default styles
