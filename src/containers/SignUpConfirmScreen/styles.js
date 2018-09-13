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
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerView: {
    position: 'absolute',
    top: CONSTANTS.STATUSBAR_HEIGHT + 20,
    left: 0,
    width: CONSTANTS.SCREEN_WIDTH,
    paddingHorizontal: CONSTANTS.PADDING
  },
  btnBack: {
    width: 50,
    height: 30,
  },
  title: {
    fontSize: 29,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center'
  },
  subTitleView: {
    marginTop: 25
  },
  subTitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center'
  },
  buttonView: {
    padding: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnSend: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff'
  }
}
