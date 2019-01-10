import { StyleSheet } from 'react-native'
import COLORS from '../../../service/colors'
import CONSTANTS from '../../../service/constants'

const FOOTER_HEIGHT = 50

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
  textInputIdea: {
    fontSize: 16,
    lineHeight: CONSTANTS.TEXT_INPUT_LINE_HEIGHT,
    marginTop: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContainer: {
    position: 'absolute',
    top: CONSTANTS.STATUSBAR_HEIGHT + 6,
    right: 16
  },
  closeButtonView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.MEDIUM_GREY,
    width: 34,
    height: 34,
    borderRadius: 17,
    paddingTop: 2,
    paddingLeft: 2,
  },
  coverImageContainer: {
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
  ideaContentView: {
  },
  inviteeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: CONSTANTS.PADDING,
    width: '100%',
    height: 50,
    borderColor: COLORS.LIGHT_SOFT_GREY,
    borderTopWidth: 1,
    borderBottomWidth: 1
  },
  inviteeView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
  footerContainer: {
    paddingTop: 5,
    height: FOOTER_HEIGHT
  },
  footerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textAddComment: {
    paddingHorizontal: 20
  },
  likeView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  threeDotButtonWrapper: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
})


export default styles
