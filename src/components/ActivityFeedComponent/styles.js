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
  iconView: {
    width: 27,
    height: 27,
    borderRadius: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    width: 11,
    height: 11
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
