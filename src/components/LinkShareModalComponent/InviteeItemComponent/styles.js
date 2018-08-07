import { StyleSheet } from 'react-native'
import COLORS from '../../../service/colors'
import CONSTANTS from '../../../service/constants'

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  avatarView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  avatar: {
    marginRight: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000'
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.MEDIUM_GREY,
    marginRight: 17
  },
  cardView: {
    flexDirection: 'row'
  },
  rightView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewText: {
    fontSize: 14,
    marginHorizontal: 5,
    fontWeight: '600',
    textTransform: 'capitalize'
  },
  viewEnableText: {
    color: COLORS.PURPLE
  },
  viewDisableText: {
    color: COLORS.MEDIUM_GREY
  },
  cogIcon: {
    marginTop: 2,
    fontSize: 10
  },
  cogEnableIcon: {
    color: COLORS.PURPLE,
  },
})

export default styles
