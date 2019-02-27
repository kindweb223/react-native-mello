import { StyleSheet, Platform } from 'react-native'
import CONSTANTS from '../../service/constants'

export default StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: CONSTANTS.ACTION_BAR_HEIGHT,
    // height: 140,
    width: CONSTANTS.SCREEN_WIDTH,
    backgroundColor: 'transparent',
    zIndex: 1
  },
  containerCard: {
    width: CONSTANTS.SCREEN_WIDTH,
    height: CONSTANTS.SCREEN_HEIGHT,
    backgroundColor: 'transparent'
  },
  modalContainer: {
    width: CONSTANTS.SCREEN_WIDTH,
    height: CONSTANTS.SCREEN_HEIGHT,
    paddingBottom: Platform.OS === 'android' ? 24 : 0
  }
})
