import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  menuContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center'
  },
  settingItem: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  settingButtonText: {
    color: COLORS.PURPLE,
    fontSize: 14,
  },
  deleteButtonText: {
    color: COLORS.RED,
    fontSize: 14,
  },
})

export default styles
