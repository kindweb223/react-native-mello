import { StyleSheet } from 'react-native'
import COLORS from '../../../service/colors'

const styles = StyleSheet.create({
  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsView: {
    flexDirection: 'row',
    marginTop: 5
  },
  statsItemView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16
  },
  feedIcon: {
    marginRight: 5
  },
  feedText: {
    fontSize: 13
  },
  active: {
    color: COLORS.PURPLE
  },
  inActive: {
    color: COLORS.LIGHT_GREY
  },
  inActiveText: {
    color: COLORS.MEDIUM_GREY
  },
  rightView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pinIcon: {
    transform: [{ rotate: '-90deg' }]
  },
  avatarView: {
    marginLeft: 10
  },
  tagsView: {
    marginTop: 3
  }
})

export default styles
