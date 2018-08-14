import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const MODAL_HEIGHT = 200

export default {
  container: {
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
    position: 'absolute',
    top: CONSTANTS.STATUSBAR_HEIGHT + 30
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
  inputView: {
    borderRadius: 16,
    width: '100%',
    height: 50,
    marginBottom: 20,
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: COLORS.LIGHT_GREY_LINE,
    paddingHorizontal: 16
  },
  inputStyle: {
    color: COLORS.PURPLE,
    flex: 1,
    height: '100%',
    fontWeight: '600'
  },
  buttonView: {
    borderRadius: 16,
    width: '100%',
    height: 60,
    backgroundColor: COLORS.PURPLE,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 20
  }
}
