import { StyleSheet, Platform } from 'react-native'
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
  headerView: {
    width: CONSTANTS.SCREEN_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: CONSTANTS.STATUSBAR_HEIGHT
  },
  headerTitle: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16
  },
  closeButtonView: {
    paddingHorizontal: 4,
    position: 'absolute',
    right: 14
  },
  button: {
    width: (CONSTANTS.SCREEN_WIDTH - 50) / 2,
    borderRadius: 6,
    borderColor: 'white',
    borderWidth: 1,
    paddingVertical: 5,
    bottom: Platform.OS === 'ios' ? 32 : 20,
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
