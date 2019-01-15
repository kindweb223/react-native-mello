import { StyleSheet, Platform } from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper';
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const MODAL_HEIGHT = 220

export default {
  container: {
    width: CONSTANTS.SCREEN_WIDTH,
    height: CONSTANTS.SCREEN_HEIGHT,
    backgroundColor: '#fff'
  },
  safeView: {
    flex: 1
  },
  dotStyle: {
    width: 8,
    height: 8,
    borderWidth: 1,
    borderColor: COLORS.DARK_GREY
  },
  navbarView: {
    marginTop: 30,
    marginBottom: 46,
    height: 34,
    paddingHorizontal: CONSTANTS.PADDING * 2
  },
  swipeContainer: {
    justifyContent: 'center',
    paddingHorizontal: CONSTANTS.PADDING * 2
  },
  logoViewContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: CONSTANTS.PADDING * 2
  },
  logoView: {
    marginBottom: 35,
    marginTop: 100
  },
  subText: {
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: 1.2
  },
  titleView: {
    height: 116,
  },
  titleText: {
    fontSize: 22,
    lineHeight: 28
  },
  lottieView: {
    width: '100%',
    height : 375,
    marginTop: 14
  },
  imageView: {
    width: '100%',
    height : 375,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 50
  },
  skipButtonView: {
    position: 'absolute',
    right: 0,
    bottom: ifIphoneX(43, 10)
  },
  skipButton: {
    paddingHorizontal: CONSTANTS.PADDING * 2
  },
  skipButtonText: {
    color: '#000',
    fontSize: 16,
    lineHeight: 22
  },
  signupFormView: {
    marginTop: 140
  },
  signupTextView: {
    height: 56,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 17
  },
  bottomContainer: {
    width: '100%',
    paddingHorizontal: CONSTANTS.PADDING,
    paddingTop: 24
  },
  buttonView: {
    borderRadius: 14,
    width: '100%',
    height: 61,
    flexDirection: 'row',
    alignItems: 'center',      
    backgroundColor: COLORS.LIGHT_SOFT_GREY,
    paddingHorizontal: 22,
    marginBottom: 24
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    marginLeft: 48
  },
  signinView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28
  },
  signinText: {
    color: COLORS.ACTION_SHEET_TITLE,
    fontSize: 16,
    lineHeight: 22
  }
}
