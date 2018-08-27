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
    marginTop: 10,
    backgroundColor: COLORS.PURPLE,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18
  },
  passwordPreview: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  avatarView: {
    marginBottom: 30,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.SOFT_GREY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    overflow: 'hidden'
  },
  avatarImg: {
    width: '100%',
    height: '100%'
  },
  uploadText: {
    color: COLORS.DARK_GREY,
    fontSize: 14
  },
  passwordScoreView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 15,
    marginTop: 5,
    paddingHorizontal: 10,
    width: '100%'
  },
  passwordScoreText: {
    fontSize: 12,
    color: COLORS.DARK_GREY
  },
  errorView: {
    height: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    width: '100%'
  },
  errorText: {
    color: COLORS.MEDIUM_RED,
    fontWeight: '600',
    fontSize: 12
  },
  checkboxView: {
    width: '100%'
  },
  termsText: {
    fontSize: 14,
    color: COLORS.PURPLE,
    textDecorationLine: 'underline',
    fontWeight: '600'
  }
}
