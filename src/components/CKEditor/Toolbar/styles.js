import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../../service/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  firstToolbarView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  toolbarBorderView: {
    flex: 1,
    height: 25,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderLeftWidth: 2,
    borderColor: COLORS.LIGHT_GREY,
  },
  secondToolbarView: {
    flex: 1,
    flexDirection: 'row',
    // justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  firstIcon: {
    paddingLeft: 26,
    paddingRight: 26
  },
  leftIcon: {
    transform: [
      { rotateY: '180deg' },
    ],
  }
})

export default styles
