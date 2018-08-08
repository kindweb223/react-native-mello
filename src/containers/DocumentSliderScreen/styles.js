import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonWrapper: {
    position: 'absolute',
    top: 20,
    right: 10,
    padding: 10,
    alignSelf: 'flex-end',
  },
  borderButtonWrapper: {
    position: 'absolute',
    bottom: 20,
    height: 42,
    width: 142,
    borderWidth: 1,
    borderColor: COLORS.MEDIUM_GREY,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButton: {
    fontSize: 14,
    color: '#fff',
  },
  webViewContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 80,
    bottom: 80,
  },
  slideContainer: {
    flex: 1,
    marginBottom: 30,
  },
})


export default styles
