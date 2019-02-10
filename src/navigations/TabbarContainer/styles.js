import { StyleSheet } from 'react-native'
import CONSTANTS from '../../service/constants'

export default StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0
  },
  modalContainer: {
    width: CONSTANTS.SCREEN_WIDTH,
    height: CONSTANTS.SCREEN_HEIGHT
  }
})
