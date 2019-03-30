import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  buttonWrapper: {
    flexDirection: 'row',
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 14,
    color: COLORS.MEDIUM_GREY,
    marginLeft: 5
  },
  commentIcon: {
    width: 15,
    height: 13
  }
})

export default styles
