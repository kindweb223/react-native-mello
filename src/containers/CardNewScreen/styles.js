import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  cardContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  textInputIdea: {
    fontSize: 16,
    lineHeight: CONSTANTS.TEXT_INPUT_LINE_HEIGHT,
    minHeight: 40,
    marginTop: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  attachmentButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonItemContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconView: {
    paddingHorizontal: 8,
    height: 32,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hideKeyboardContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  attachment: {
    transform: [
      {rotateZ: '-135deg'},
      {rotateY: '180deg'},
    ],
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInvitee: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.DARK_GREY,
  },
  iconDot: {
    marginHorizontal: 7,
    color: COLORS.DARK_GREY,
  },
  cellContainer: {
    marginLeft: 15,
  },
  mainHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: Platform.OS === 'ios' ? 0 : 10
  },
  extensionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 4,
    paddingRight: 6,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY_LINE,
    height: 44,
  },
  closeButtonShareWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  textBack: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '500',
    marginLeft: 5,
    color: COLORS.PURPLE,
  },
  coverImageContainer: {
    // marginTop: 16,
  },
  extensionCoverImageContainer: {
    height: Math.round(CONSTANTS.SCREEN_WIDTH * 0.468),
    width: CONSTANTS.SCREEN_WIDTH - 64,
    marginHorizontal: 16,
    marginTop: 15,
    borderRadius: 5,
    overflow: 'hidden',
  },
  coverImageSelectContainer: {
    marginHorizontal: 16,
    marginTop: 15,
    height: CONSTANTS.SCREEN_WIDTH * 0.48,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.SOFT_GREY,
  },
  coverImageSelectButtonWrapper: {
    height: 34,
    width: 186,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PURPLE,
  },
  btnClose: {
    width: 90,
    height: 34,
    paddingHorizontal: CONSTANTS.PADDING,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  textButton: {
    color: '#000',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
    textAlign: 'center',
  },
  selectFeedoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  extensionSelectFeedoContainer: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: '#D5D5D5',
    paddingHorizontal: 7,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderTopWidth: 1,
    borderTopColor: COLORS.LIGHT_GREY_LINE,
  },
  textCreateCardIn: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.DARK_GREY,
    marginHorizontal: 9,
  },
  textFeedoName: {
    fontSize: 14,
    lineHeight: 21,
    maxWidth: Math.round(CONSTANTS.SCREEN_WIDTH * 0.32),
    color: COLORS.PURPLE
  },
  selectFeedoButtonContainer: {
    flexDirection: 'row',
    paddingLeft: 9,
    height: 30,
    borderRadius: 5,
    backgroundColor: COLORS.LIGHT_GREY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  url: {
    color: COLORS.BLUE,
  },
  successModal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  successView: {
    width: 146,
    height: 146,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  successIcon: {
    fontSize: 80,
    color: COLORS.PURPLE
  },
  successText: {
    fontSize: 15,
    color: COLORS.PURPLE
  },
  loadingIcon: {
    marginRight: 10
  },
  ckEditorBtnText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.DARK_GREY
  }
})


export default styles
