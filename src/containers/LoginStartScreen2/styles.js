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
    paddingVertical: 24
  },
  buttonView: {
    borderRadius: 14,
    width: '100%',
    height: 60,
    backgroundColor: COLORS.PURPLE,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18
  },
  signinView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  signinText: {
    color: COLORS.PURPLE,
    fontSize: 16,
    marginVertical: 21
  },
  swipeContainer: {
    width: '100%',
    height: '100%'
  },
  titleView: {
    paddingHorizontal: CONSTANTS.PADDING
  },
  titleText: {
    fontSize: 26,
    lineHeight: 32
  }
}
