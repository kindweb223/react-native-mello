import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: CONSTANTS.PADDING,
    flexDirection: 'row',
    paddingVertical: 15
  },
  leftContainer: {
    width: 50
  },
  rightContainer: {
    flex: 1
  },
  title: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600'
  },
  durationView: {
    marginTop: 10,
    flexDirection: 'row'
  },
  text: {
    fontSize: 12,
    color: COLORS.DARK_GREY
  },
  readText: {
    color: COLORS.PURPLE
  },
  dotIcon: {
    marginLeft: 5
  }
})

export default styles
