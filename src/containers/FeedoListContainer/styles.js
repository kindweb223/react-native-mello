import { StyleSheet, Platform } from 'react-native'
import CONSTANTS from '../../service/constants'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  flatList: {
    paddingBottom: CONSTANTS.ACTION_BAR_HEIGHT - 45
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.SEPARATOR_GREY,
    marginBottom: 15
  }
})

export default styles
