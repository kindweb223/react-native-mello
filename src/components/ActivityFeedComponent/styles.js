import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: CONSTANTS.PADDING,
    paddingVertical: 15,
    flexDirection: 'row'
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
    marginTop: 10
  },
  text: {
    fontSize: 12,
    color: COLORS.MEDIUM_GREY
  },
  readText: {
    color: COLORS.PURPLE
  }
})

export default styles
