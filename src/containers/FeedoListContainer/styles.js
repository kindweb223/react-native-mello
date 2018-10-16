import { StyleSheet, Platform } from 'react-native'
import CONSTANTS from '../../service/constants'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  flatList: {
    paddingBottom: CONSTANTS.ACTION_BAR_HEIGHT + 50
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY_LINE,
    marginTop: 16,
    marginBottom: 12
  }
})

export default styles
