import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    justifyContent: 'center',
    // zIndex: 1,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    borderRadius: 18,
    paddingTop: 26,
    paddingBottom: 17,
    backgroundColor: '#fff',
  },
  mainContentContainer: {
  },
  textInputCardTitle: {
    fontSize: 18,
    lineHeight: 25,
    fontWeight: '600',
    marginHorizontal: 20,
  },
  textInputIdea: {
    fontSize: 16,
    lineHeight: 23,
    marginTop: 15,
    marginHorizontal: 20,
  },
  attachmentButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 22,
    paddingRight: 16,
    marginTop: 20,
  },
  buttonItemContainer: {
    width: 32,
    height: 32,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hideKeyboardContainer:                 {
    backgroundColor: COLORS.PURPLE,
    borderRadius: 8,
    marginRight: 0,
    position: 'absolute',
    right: 16,
    bottom: 17,
  },
  attachment: {
    transform: [
      { rotate: '90deg' },
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
  shareHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 6,
    paddingRight: 16,
    marginBottom: 16,
  },
  closeButtonWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  threeDotButtonWrapper: {
    width: 35,
    height: 35,
    backgroundColor: COLORS.PURPLE,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCover: {
    marginHorizontal: 20,
    marginTop: 15,
    height: CONSTANTS.SCREEN_WIDTH * 0.48,
    borderRadius: 5,
  },
  coverImageSelectContainer: {
    marginHorizontal: 20,
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
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.BLUE,
    justifyContent: 'center',
  },
  textButton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  feedSelectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  textAddFeed: {
    fontSize: 16,
    lineHeight: 20,
  },
})


export default styles
