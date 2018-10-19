import { StyleSheet, Platform } from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper';
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const MODAL_HEIGHT = 220

export default {
  container: {
    width: CONSTANTS.SCREEN_WIDTH,
    height: CONSTANTS.SCREEN_HEIGHT
  },
  safeView: {
    flex: 1
  },
  dotStyle: {
    width: 6,
    height: 6
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
  },
  swipeContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  titleView: {
    width: '100%',
    paddingHorizontal: CONSTANTS.PADDING
  },
  titleText: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: 'bold',
    letterSpacing: 1.2
  },
  lastTextView: {
    flexDirection: 'row'
  },
  sliderFirstImagView: {
    width: '100%',
    height: 270,
    overflow: 'hidden',
    marginVertical: 20
  },
  videoLInkView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: CONSTANTS.PADDING
  },
  linkText: {
    color: COLORS.PURPLE,
    fontSize: 16,
    fontWeight: '600'
  },
  video: {
    display: 'none'
  },
  // Second screen
  sliderSecondImagView: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 430,
    overflow: 'hidden',
    marginVertical: 20
  },
}
