import { StyleSheet, Platform } from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper';
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
const MODAL_HEIGHT = 220

export default {
  container: {
    width: CONSTANTS.SCREEN_WIDTH,
    height: CONSTANTS.SCREEN_HEIGHT + ifIphoneX(34, 0),
    alignItems: 'center',
    justifyContent: 'center'
  },
  innerContainer: {
    width: CONSTANTS.SCREEN_WIDTH,
    height: CONSTANTS.SCREEN_HEIGHT
  },
  headerView: {
    position: 'absolute',
    top: CONSTANTS.STATUSBAR_HEIGHT + 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: CONSTANTS.PADDING
  },
  btnback: {
    width: 100,
    height: 30,
    backgroundColor: '#ff0'
  },
  contentView: {
    width: '100%',
    height: CONSTANTS.SCREEN_HEIGHT - MODAL_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  defaultAvatar: {
    marginTop: 25,
    width: 100,
    height: 100,
  },
  subTitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 15,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 39,
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
    backgroundColor: COLORS.PURPLE,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18
  },
  forgotView: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotText: {
    color: COLORS.PURPLE,
    fontWeight: '600'
  }
}
