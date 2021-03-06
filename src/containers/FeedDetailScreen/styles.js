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
    paddingBottom: Platform.OS === 'ios' ? ifIphoneX(0, 56) : 56
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
    backgroundColor: '#ff0',
    height: NAV_BAR_HEIGHT,
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
    alignItems: 'center'
  },
  touchablePadding: {
    paddingVertical: 5, 
    paddingHorizontal: 5
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
    marginLeft: 2
  },
  titleContainer: {
    flexDirection: 'row'
  },
  collapseView: {
    flex: 1,
    marginBottom: 16,
    paddingTop: 0,
    backgroundColor: '#fff',
    zIndex: 11
  },
  filterIconView: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginRight: 8,
    paddingRight: 8,
    width: 34,
    height: 30
  },
  filterIcon: {
    width: 18,
    height: 14
  },
  collpaseSeparator: {
    marginTop: 16
  },
  scrollView: {
  },
  detailView: {    
    paddingTop: 15,
    paddingBottom: Platform.OS === 'ios' ? ifIphoneX(48, 10) : 10
  },
  modalContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 15,
    backgroundColor: 'transparent',
  },
  settingMenuView: {
    borderRadius: 20,
    backgroundColor: '#fff',
    width: 220,
    paddingTop: 10,
    paddingBottom: 15,
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
  },
  buttonContainer: {
    paddingHorizontal: CONSTANTS.PADDING,
    marginBottom: 30,
    flexDirection: 'row'
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: 70,
    borderRadius: 6,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  acceptButtonView: {
    backgroundColor: COLORS.PURPLE
  },
  ignoreButtonView: {
    backgroundColor: COLORS.LIGHT_SOFT_GREY
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600'
  },
  acceptButtonText: {
    color: '#fff'
  },
  ignoreButtonText: {
    color: COLORS.PRIMARY_BLACK
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
  btnInvite: {
    color: COLORS.PURPLE,
    fontSize: 16,
    fontWeight: '500'
  }
})

export default styles
