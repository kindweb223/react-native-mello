import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  listView: {
    paddingTop: 20
  },
  listContentView: {
    paddingBottom: CONSTANTS.STATUS_BOTTOM_BAR_HEIGHT + 10
  },
  listItem: {
    paddingHorizontal: CONSTANTS.PADDING,
    marginBottom: 24
  },
  btnView: {
    width: 86,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.SOFT_GREY,
    borderRadius: 6,
    marginTop: 8
  },
  btnText: {
    color: 'black',
    fontSize: 15,
    fontWeight: '500'
  }
})

export default styles
