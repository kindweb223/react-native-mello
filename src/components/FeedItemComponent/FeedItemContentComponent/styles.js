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
  cardIcon: {
    height: 9,
    width: 13,
    marginRight: 5
  },
  profileIcon: {
    height: 11.67,
    width: 10,
    marginRight: 5,
    marginBottom: 2
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
    marginTop: 7
  }
})

export default styles
