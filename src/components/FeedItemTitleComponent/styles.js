import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'

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
    paddingVertical: 5
  },
  statsItemView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16
  },
  feedIcon: {
    marginRight: 5,
    fontSize: 15
  },
  feedText: {
    fontSize: 14
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
  pinView: {
    marginLeft: 10,
  },
  pinIcon: {
    fontSize: 20,
    transform: [{ rotate: '-90deg' }]
  }
})

export default styles
