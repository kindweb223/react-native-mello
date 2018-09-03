import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

export default {
  container: {
    width: CONSTANTS.SCREEN_WIDTH,
    height: CONSTANTS.SCREEN_HEIGHT,
    backgroundColor: '#fff'
  },
  body: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  successView: {
    width: 134,
    height: 134,
    borderRadius: 67,
    marginBottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  titleView: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 14
  },
  subTitle: {
    fontSize: 14,
    color: COLORS.MEDIUM_GREY
  }
}
