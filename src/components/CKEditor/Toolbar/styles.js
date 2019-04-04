import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../../service/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  firstToolbarView: {
    flex: 1,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  toolbarBorderView: {
    flex: 1,
    paddingHorizontal: 25,
    marginHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
  },
  secondToolbarView: {
    flex: 1,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  toolView: {
    paddingHorizontal: 16
  },
  leftIcon: {
    transform: [
      { rotateY: '180deg' },
    ],
  }
})

export default styles
