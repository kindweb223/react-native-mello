import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  settingView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 2,
    paddingLeft: 14
  },
  settingIcon: {
    fontSize: 20,
    color: COLORS.ACTION_SHEET_TITLE
  }
})

export default styles
