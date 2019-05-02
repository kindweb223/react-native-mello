import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  settingView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    height: 34,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingTop: 2,
    paddingHorizontal: CONSTANTS.PADDING / 2,
    marginRight: CONSTANTS.PADDING / 2,
  },
  settingIcon: {
    fontSize: 20,
    color: COLORS.ACTION_SHEET_TITLE
  }
})

export default styles
