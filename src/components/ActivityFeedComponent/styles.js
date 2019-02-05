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
    width: 70
  },
  rightContainer: {
    flex: 1
  },
  itemView: {
    height: '100%',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600'
  },
  durationView: {
    flexDirection: 'row'
  },
  text: {
    fontSize: 12,
    lineHeight: 21,
    color: COLORS.DARK_GREY
  },
  dotIcon: {
    marginLeft: 5
  }
})

export default styles
