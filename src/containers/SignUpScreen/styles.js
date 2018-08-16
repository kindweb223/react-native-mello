import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
const MODAL_HEIGHT = 200

export default {
  container: {
    width: CONSTANTS.SCREEN_WIDTH,
    height: CONSTANTS.SCREEN_HEIGHT,
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
  headerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  btnback: {
    width: 100,
    height: 30,
    backgroundColor: '#ff0'
  },
  modalContainer: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: '#fff',
    paddingHorizontal: CONSTANTS.PADDING,
    paddingTop: 40,
    paddingBottom: 55,
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
    backgroundColor: 'transparent'
  },
  forgotText: {
    color: COLORS.PURPLE,
    fontWeight: '600'
  }
}
