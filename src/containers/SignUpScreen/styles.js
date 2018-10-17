import { StyleSheet, Platform } from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper';
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
const NAVBAR_HEIGHT = 54

export default {
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: CONSTANTS.PADDING,
    justifyContent: 'center',
    marginTop: (CONSTANTS.SCREEN_HEIGHT - NAVBAR_HEIGHT - 480) / 2
  },
  btnBack: {
    width: 50,
    height: 30,
    paddingLeft: 10
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
    paddingTop: 4,
    width: '100%'
  },
  errorText: {
    color: COLORS.MEDIUM_RED,
    fontWeight: '600',
    fontSize: 12
  },
  checkboxView: {
    width: 300
  },
  termsText: {
    fontSize: 14,
    color: COLORS.PURPLE,
    textDecorationLine: 'underline',
    fontWeight: '600'
  },
  errorTncView: {
    height: 20,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    width: '100%'
  },
  loginButtonView: {
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnSend: {
    fontSize: 16,
  }
}
