import { StyleSheet, Platform } from 'react-native'
import CONSTANTS from '../../../service/constants'
import COLORS from '../../../service/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  innerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  linkButton: {
    width: 38,
    height: 38,
    borderRadius: 21,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  linkDisableButton: {
    backgroundColor: COLORS.LIGHT_GREY,
  },
  linkEnableButton: {
    backgroundColor: COLORS.PURPLE,
  },
  tileView: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000'
  },
  description: {
    fontSize: 14,
    color: COLORS.MEDIUM_GREY
  },
  rightView: {
    position: 'absolute',
    top: 8,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  viewText: {
    fontSize: 14,
    marginHorizontal: 5,
    fontWeight: '600',
    textTransform: 'capitalize'
  },
  viewDisableText: {
    color: COLORS.LIGHT_GREY,
  },
  viewEnableText: {
    color: COLORS.PURPLE,
  },
  cogIcon: {
    marginTop: 2,
    fontSize: 10
  },
  cogDisableIcon: {
    color: COLORS.LIGHT_GREY,
  },
  cogEnableIcon: {
    color: COLORS.PURPLE,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.LIGHT_GREY_LINE,
    marginTop: 10
  }
})

export default styles
