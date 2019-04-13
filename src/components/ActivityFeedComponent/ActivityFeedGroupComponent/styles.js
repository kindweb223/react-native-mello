import { StyleSheet } from 'react-native'
import COLORS from '../../../service/colors'
import CONSTANTS from '../../../service/constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: CONSTANTS.PADDING,
    backgroundColor: '#fff',
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
    justifyContent: 'flex-end',
    width: 50
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
    paddingRight: 15,
    flex: 1
  }
})

export default styles
