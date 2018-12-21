import { StyleSheet, Platform } from 'react-native'
import CONSTANTS from '../../service/constants'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  flatList: {
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.SEPARATOR_GREY
  },
  feedoItem: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 18
  },
  feedoSelectItem: {
    borderWidth: 1,
    borderColor: COLORS.PURPLE,
    borderRadius: 18
  }
})

export default styles
