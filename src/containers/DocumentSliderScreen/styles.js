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
    left: 10,
    padding: 10,
    alignSelf: 'flex-end',
  },
  webViewContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 80,
    bottom: 35,
  },
  scrollViewContainer: {
    flex: 1,
    marginBottom: 45,
    backgroundColor: '#fff'
  },
  scrollViewContentContainer: {
    flex: 1
  },
  errorViewContainer: {
    flex: 1,
    backgroundColor: 'steelblue'
  },
  deleteButtonWrapper: {
    position: 'absolute',
    height: 30,
    width: 30,
    bottom: 25,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotStyle: {
    width: 6,
    height: 6,
  }
})


export default styles
