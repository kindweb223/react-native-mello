import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    flex: 1
  },
  tabBarStyle: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: COLORS.PURPLE,
    borderBottomColor: COLORS.PURPLE,
    height: 62,
    alignItems: 'center',
    marginTop: 0,
  },
  tabBarTextStyle: {
    fontSize: 16,
    fontWeight: 'bold'
  }
})

export default styles
