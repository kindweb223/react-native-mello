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
  plusButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 15,
    backgroundColor: COLORS.PURPLE,
    justifyContent: 'center',
    alignItems: 'center'
  },
  linkButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  linkDisableButton: {
    backgroundColor: COLORS.LIGHT_GREY,
  },
  linkEnableButton: {
    backgroundColor: COLORS.LIGHT_YELLOW,
  },
  tileView: {
    justifyContent: 'center',
    alignItems: 'flex-start'
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  viewText: {
    fontSize: 14,
    marginHorizontal: 5,
    fontWeight: '600',
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
})

export default styles
