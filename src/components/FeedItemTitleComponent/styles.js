import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 22,
  },
  titleView: {
  },
  title: {
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
    fontSize: 14
  },
  feedText: {
    fontSize: 14
  },
  active: {
    color: COLORS.PURPLE
  },
  inActive: {
    color: COLORS.LIGHT_GREY
  }
})

export default styles
