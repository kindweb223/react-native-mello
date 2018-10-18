import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 32,
    overflow: 'hidden'
  },
  textListView: {
    top: -32
  },
  titleText: {
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: 1.2,
    fontWeight: 'bold',
    color: COLORS.PURPLE
  }
})

export default styles
