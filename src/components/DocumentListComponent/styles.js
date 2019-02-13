import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  listContainer: {
    // marginTop: 16,
  },
  itemContainer: {
    alignSelf: 'flex-start',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 15,
  },
  itemSelectBackgroundContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: COLORS.BLUE,
    borderRadius: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  attachment: {
    marginLeft: Platform.OS === 'android' ? 3 : 0,
    transform: [
      { rotate: '135deg' }, 
      { rotateY: '180deg' },
    ],
  },
  textFileName: {
    fontSize: 14,
    lineHeight: 21,
    marginLeft: 15,
    maxWidth: CONSTANTS.SCREEN_WIDTH - 100,
  },
  closeButtonContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  modalContainer: {
    margin: 0,
  },

})


export default styles
