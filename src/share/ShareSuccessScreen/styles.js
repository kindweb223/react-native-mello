import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    width: CONSTANTS.SCREEN_WIDTH,
    height: CONSTANTS.SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.MODAL_BACKGROUND,
  },
  checkContainer: {
    width: 146,
    height: 146,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  openFeedoButtonContainer: {
    width: 124,
    height: 34,
    borderRadius: 18,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: CONSTANTS.SCREEN_VERTICAL_MIN_MARGIN,
  },
  textButton: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.DARK_GREY,
    textAlign: 'center',
  },

})


export default styles
