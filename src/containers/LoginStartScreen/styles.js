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
    borderColor: COLORS.MEDIUM_GREY
  },
  swipeContainer: {
    justifyContent: 'center',
    paddingHorizontal: CONSTANTS.PADDING * 2
  },
  logoView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginTop: 50,
    marginBottom: 35
  },
  logoText: {
    fontSize: 50,
    lineHeight: 50,
    fontWeight: 'bold',
    letterSpacing: 1.2
  },
  logo: {
    width: 60,
    height: 60
  },
  logoSubText: {
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: 1.2
  },
  titleView: {
    height: 116,
    marginBottom: 14
  },
  titleText: {
    fontSize: 22,
    lineHeight: 28
  },
  navbarView: {
    marginTop: 30,
    marginBottom: 46,
    height: 34,
    paddingHorizontal: CONSTANTS.PADDING * 2 - 5
  },
  navLogo: {
    width: 34,
    height: '100%'
  },
  lottieView: {
    width: '100%',
    height : 375
  },
  imageView: {
    width: '100%',
    height : 375,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  skipButtonView: {
    position: 'absolute',
    right: 0,
    bottom: 20
  },
  skipButton: {
    paddingHorizontal: CONSTANTS.PADDING * 2
  },
  skipButtonText: {
    color: COLORS.DARK_GREY,
    fontSize: 16,
    lineHeight: 22
  },
  lastTextView: {
    flexDirection: 'row'
  },
  bottomContainer: {
    width: '100%',
    paddingHorizontal: CONSTANTS.PADDING,
    paddingTop: 24
  },
  buttonView: {
    borderRadius: 14,
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PURPLE,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  },
  signinView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  signinText: {
    color: COLORS.PURPLE,
    fontSize: 16,
    marginTop: 21,
    marginBottom: 30
  }
}
