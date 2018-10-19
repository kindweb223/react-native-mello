import { StyleSheet, Platform } from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper';
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const MODAL_HEIGHT = 220

export default {
  container: {
    width: CONSTANTS.SCREEN_WIDTH,
    height: CONSTANTS.SCREEN_HEIGHT + ifIphoneX(34, 0)
  },
  innerContainer: {
    width: CONSTANTS.SCREEN_WIDTH,
    height: CONSTANTS.SCREEN_HEIGHT
  },
  contentView: {
    width: '100%',
    height: CONSTANTS.SCREEN_HEIGHT - MODAL_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoView: {
    marginTop: CONSTANTS.STATUSBAR_HEIGHT,
    marginBottom: 32
  },
  logo: {
    width: 75,
    height: 75
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 39,
    color: '#fff'
  },
  subTitle: {
    marginTop: 22,
    fontSize: 14,
    color: '#fff'
  },
  modalContainer: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: '#fff',
    padding: CONSTANTS.PADDING,
    height: MODAL_HEIGHT,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
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
    fontSize: 18
  }
}
