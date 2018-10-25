import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    width: CONSTANTS.SCREEN_WIDTH,
    height: CONSTANTS.SCREEN_HEIGHT,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  backdropContainer: {
    flex: 1,
  },
  cardContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  textInputCardTitle: {
    fontSize: 18,
    lineHeight: 25,
    fontWeight: '600',
    marginHorizontal: 16,
  },
  textInputIdea: {
    fontSize: 16,
    lineHeight: CONSTANTS.TEXT_INPUT_LINE_HEIGHT,
    marginTop: 8,
    marginBottom: 16,
    marginHorizontal: 16,
    
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  textSeeMoreLessIdea: {
    fontSize: 16,
    lineHeight: 23,
    marginTop: 4,
    marginHorizontal: 16,
    color: COLORS.PURPLE,
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
    paddingHorizontal: 4,
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
  line: {
    height: 1,
    backgroundColor: COLORS.LIGHT_GREY_LINE,
    marginVertical: 15,
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
    paddingHorizontal: 6,
    height: 50
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 6,
    paddingRight: 16,
  },
  extensionHeaderContainer: {
    paddingVertical: 5,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY_LINE,
    height: 44,
  },
  closeButtonWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  backButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
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
  threeDotButtonWrapper: {
    width: 35,
    height: 35,
    // backgroundColor: COLORS.PURPLE,
    // borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverImageContainer: {
    height: Math.round(CONSTANTS.SCREEN_WIDTH * 0.565),
    marginTop: 15,
    overflow: 'hidden',
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
  textSelectButton: {
    fontSize: 15,
    fontWeight: '500',
    color: '#fff',
  },
  outSideMoreActionContainer: {
    position: 'absolute',
    right: 0,
    top: Platform.OS === 'ios' ? 20 : 0,
    height: 60,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: CONSTANTS.PADDING,
    paddingVertical: CONSTANTS.PADDING / 2,
  },
  addCardButtonWapper: {    
    width: 110,
    height: 34,
    borderRadius: 20,
    justifyContent: 'center',
  },
  textButton: {
    color: '#fff',
    fontSize: 16,
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
    color: COLORS.PRIMARY_BLACK, 
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
})


export default styles
