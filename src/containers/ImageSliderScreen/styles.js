import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonWrapper: {
    padding: 10,
    top: 30,
    right: 10,
    alignSelf: 'flex-end',
    position: 'absolute',
  },
  borderButtonWrapper: {
    height: 42,
    width: 142,
    borderWidth: 1,
    borderColor: COLORS.MEDIUM_GREY,
    borderRadius: 21,
    bottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute'
  },
  textButton: {
    fontSize: 14,
    color: '#fff',
  },
})


export default styles
