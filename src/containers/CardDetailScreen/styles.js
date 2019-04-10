import { StyleSheet, Platform } from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const FOOTER_HEIGHT = Platform.OS === 'ios' ? CONSTANTS.SCREEN_WIDTH / 7.5 : CONSTANTS.SCREEN_WIDTH / 7.5 + 10

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
    color: 'black',
    fontWeight: 'normal',
    lineHeight: CONSTANTS.TEXT_INPUT_LINE_HEIGHT,
    marginBottom: 0,
    marginHorizontal: 16,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  textHtmlIdea: {
    marginBottom: 0,
    marginHorizontal: 16,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    width: '100%'
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? ifIphoneX(53, 30) : 10,
    right: 8,
    width: 50,
    height: 50,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeButtonView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.ACTION_SHEET_TITLE,
    width: 34,
    height: 34,
    borderRadius: 17,
    paddingTop: Platform.OS === 'ios' ? 2 : 0,
    paddingLeft: Platform.OS === 'ios' ? 2 : 0
  },
  coverImageContainer: {
    zIndex: 2
  },
  tempCoverImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  ideaContentView: {
    paddingBottom: 50 // Why padding 50?
  },
  inviteeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: CONSTANTS.PADDING,
    width: '100%',
    height: 50,
    borderColor: COLORS.LIGHT_GREY_LINE,
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
    marginBottom: Platform.OS === 'android' ? 10 : 0,
    paddingVertical: 5,
    height: FOOTER_HEIGHT,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  addCommentView: {
    justifyContent: 'center',
    backgroundColor: COLORS.LIGHT_SOFT_GREY,
    marginHorizontal: CONSTANTS.PADDING,
    paddingHorizontal: CONSTANTS.PADDING,    
    flex: 1,
    height: '100%',
    borderRadius: 5
  },
  textAddComment: {
    fontSize: 16
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
  settingCardMenuView: {
    borderRadius: 20,
    backgroundColor: '#fff',
    width: 122,
    paddingVertical: 10,
    marginBottom: 32,
    position: 'absolute',
    right: 55,
    bottom: CONSTANTS.STATUS_BOTTOM_BAR_HEIGHT + 10,
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
  }
})


export default styles
