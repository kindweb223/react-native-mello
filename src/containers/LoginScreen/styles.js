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
  avatarView: {
    backgroundColor: '#fff',
    borderRadius: 36,
    width: 72,
    height: 72,
    marginBottom: 15,
  },
  avatar: {
    width: '100%',
    height: '100%'
  },
  subTitle: {
    fontSize: 14,
    color: '#fff'
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
  inputView: {
    borderRadius: 16,
    width: '100%',
    height: 50,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.LIGHT_GREY_LINE,
    paddingHorizontal: 16,
    width: '100%'
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
