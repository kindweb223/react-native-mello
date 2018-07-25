import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 5,
  },
  imageContainer: {
    marginTop: 15,
    marginRight: 15,
  },
  imageFeed: {
    width: CONSTANTS.SCREEN_WIDTH * 0.28,
    height: CONSTANTS.SCREEN_WIDTH * 0.28,
  },
  imageRemoveContainer: {
    position: 'absolute',
    right: 7,
    top: 7,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.PURPLE,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
})


export default styles
