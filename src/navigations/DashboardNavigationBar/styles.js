import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: CONSTANTS.PADDING,
    backgroundColor: '#fff'
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: '#fff',
  },
  navbarView: {
    justifyContent: 'flex-end',
    width: '100%',
    height: '50%',
  },
  titleView: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
    height: '50%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.PRIMARY_BLACK,
  },
  miniNavbarView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
    paddingBottom: 10,
  },
  miniTitle: {
    fontSize: 16,
    color: COLORS.PRIMARY_BLACK,
    marginBottom: 3,
    fontWeight: 'bold'
  }
})

export default styles
