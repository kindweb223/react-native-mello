import { StyleSheet } from 'react-native'
import COLORS from '../../../service/colors'
import CONSTANTS from '../../../service/constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: CONSTANTS.PADDING,
    backgroundColor: COLORS.LIGHT_PURPLE_BACKGROUND,
    flexDirection: 'row',
    paddingVertical: 12
  },
  leftContainer: {
    width: 70
  },
  rightContainer: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600'
  },
  updatesData: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 'normal'
  },
  timeView: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  text: {
    fontSize: 12,
    lineHeight: 21,
    color: COLORS.DARK_GREY
  },
  coverImage: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: COLORS.LIGHT_GREY_PLACEHOLDER
  },
  contentView: {
    flexDirection: 'column',
    paddingRight: 15
  }
})

export default styles
