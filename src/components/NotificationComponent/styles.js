import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  notificationView: {
    width: 57,
    height: 42,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  notificationIcon: {
    color: COLORS.PURPLE,
    fontSize: 20,
  },
  notificationText: {
    color: COLORS.PURPLE,
    fontSize: 14,
    marginLeft: 5
  }
})

export default styles
