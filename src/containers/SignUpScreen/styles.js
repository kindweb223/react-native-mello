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
    marginTop: 48
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
    height: 24,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 8,
    paddingTop: 8,
    width: '100%'
  },
  errorText: {
    color: COLORS.MEDIUM_RED,
    fontWeight: '600',
    fontSize: 12
  },
  checkboxView: {
    width: 300,
    marginTop: 8
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
