import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  buttonWrapper: {
    flexDirection: 'row',
    marginLeft: 5,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 14,
    color: COLORS.MEDIUM_GREY,
    marginLeft: 5,
  },
})

export default styles
