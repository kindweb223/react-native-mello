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
  btnContinue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff'
  },
  modalContainer: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    height: CONSTANTS.SCREEN_HEIGHT - 100,
    paddingHorizontal: CONSTANTS.PADDING,
    paddingVertical: 40,
  }
}
