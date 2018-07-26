import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginTop: 30,
  },
  itemContainer: {
    alignSelf: 'flex-start',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingLeft: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  attachment: {
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
})


export default styles
