import { StyleSheet, Platform } from 'react-native'
import CONSTANTS from '../../../service/constants'
import COLORS from '../../../service/colors'

const styles = StyleSheet.create({
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
})

export default styles
