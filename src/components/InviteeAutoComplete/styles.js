import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  mainContentContainer: {
    maxHeight: CONSTANTS.SCREEN_HEIGHT - 150,
  },
  inviteeItem: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: COLORS.LIGHT_GREY_LINE,
  },
})
