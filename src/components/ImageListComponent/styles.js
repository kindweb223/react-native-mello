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
  previewModal: {
    margin: 0,
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%'
  },
})


export default styles
