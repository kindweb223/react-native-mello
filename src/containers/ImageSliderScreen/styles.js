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
    left: 10,
    alignSelf: 'flex-end',
    position: 'absolute',
  },
  coverButton: {
    bottom: 36,
    left: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute'
  },
  coverText: {
    color: '#fff'
  },
  deleteButton: {
    height: 30,
    width: 30,
    bottom: 30,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute'
  },
  previewImage: {
    width: '100%',
    height: '100%'
  }
})


export default styles
