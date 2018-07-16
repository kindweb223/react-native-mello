import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: CONSTANTS.ACTION_BAR_HEIGHT,
    width: '100%',
    paddingHorizontal: CONSTANTS.PADDING,
    paddingVertical: 8,
    position: 'absolute',
    bottom: 0,
    borderTopWidth: 1,
    borderColor: COLORS.PURPLE
  },
  filterContainer: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row'
  },
  actionContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-start'
  },
  filteringView: {
    flex: 1,
  },
  actionView: {
    flex: 1,
  }
})

export default styles
