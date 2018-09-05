import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    marginHorizontal: 20,
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
    right: 4,
    top: 4,
    width: 26,
    height: 26,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewModal: {
    margin: 0,
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%'
  },
  closeSubButtonContainer: {
    width: 22,
    height: 22,
    borderRadius: 12,
    backgroundColor: COLORS.BLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },
})


export default styles
