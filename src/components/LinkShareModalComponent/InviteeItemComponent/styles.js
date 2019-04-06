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
    fontSize: 14,
    fontWeight: '600',
    paddingBottom: 6,
    color: '#000'
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.DARK_GREY,
    marginRight: 17
  },
  cardView: {
    flexDirection: 'row'
  },
  rightView: {
    position: 'absolute',
    top: 20,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewText: {
    fontSize: 13,
    fontWeight: 'normal',
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
  infoView: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.LIGHT_GREY_LINE,
    marginTop: 5
  }
})

export default styles
