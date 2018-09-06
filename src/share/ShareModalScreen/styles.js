import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

export default styles = StyleSheet.create({
  container: {
    height: CONSTANTS.SCREEN_HEIGHT,
    width: CONSTANTS.SCREEN_WIDTH,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'center',
  },
  modalContentContainer: {
    backgroundColor: '#F4F4F4',
    height: 150,
    width: 300,
    borderRadius: 20,
  },
})
