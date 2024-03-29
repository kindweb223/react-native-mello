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
    paddingHorizontal: 10,
    paddingVertical: 5,
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
    width: '100%'
  },
  passwordScoreText: {
    fontSize: 12,
    color: COLORS.DARK_GREY
  },
  errorView: {
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
  }
}
