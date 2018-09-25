import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  listView: {
    paddingTop: 20,
    paddingBottom: CONSTANTS.ACTION_BAR_HEIGHT + 20 
  },
  listItem: {
    paddingHorizontal: CONSTANTS.PADDING,
    marginBottom: 24
  },
  btnView: {
    width: 85,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.MEDIUM_GREY,
    borderRadius: 17
  },
  btnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500'
  }
})

export default styles
