import { StyleSheet, Platform } from 'react-native'
import colors from '../../service/colors'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingLeft: 16,
    paddingTop: 10,
    paddingBottom: 22
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    color: colors.DARK_GREY
  },
  closeContainer: {
    backgroundColor: colors.PURPLE,
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeIcon: {
    width: 19,
    height: 19
  }
})

export default styles