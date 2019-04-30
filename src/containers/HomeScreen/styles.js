import { StyleSheet, Platform } from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper';
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const SEARCHBAR_HEIGHT = 40
const NAV_BAR_HEIGHT = 55

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%'
  },
  statusBarUnderlay: {
    height: 0,
    backgroundColor: '#fff',
  },
  feedListContainer: {
    marginTop: 8,
    flex: 1
  },
  feedListContainerLongHold: {
    marginTop: Platform.OS === 'ios' ? ifIphoneX(-48, -40) : -40
  },
  modalContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: COLORS.MODAL_BACKGROUND,
  },
  quickActionModalContainer: {
    paddingBottom: ifIphoneX(22, 0)
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
    top: Platform.OS === 'ios' ? CONSTANTS.STATUSBAR_HEIGHT : 0,
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
    paddingTop: 10,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerView: {
    width: CONSTANTS.SCREEN_WIDTH,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 0 : 8
  },
  searchIconView: {
    paddingHorizontal: 12,
    height: 42,    
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  settingIconView: {
    width: 38,
    alignItems: 'flex-end',
    marginRight: 12
  },
  menuIconView: {
    padding: 10,
    marginLeft: 12
  },
  menuIcon: {
    width: 18,
    height: 14
  },
  title: {
    fontWeight: '500',
    fontSize: 18,
    color: 'rgba(102, 104, 115, 1)',
    textAlign: 'center'
  }
})

export default styles
