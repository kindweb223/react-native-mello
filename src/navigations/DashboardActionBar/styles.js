import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height: CONSTANTS.ACTION_BAR_HEIGHT,
    width: '100%',
    paddingTop: 8,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  leftContainer: {
    flexDirection: 'row'
  },
  iconView: {
    height: 42,
    paddingHorizontal: CONSTANTS.PADDING,
    justifyContent: 'center',
    alignItems: 'center'
  },
  rightContainer: {
    height: 42,
    justifyContent: 'center',
    alignItems: 'center'
  },
  plusButton: {
    paddingHorizontal: CONSTANTS.PADDING
  }
})

export default styles
