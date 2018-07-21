import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: CONSTANTS.PADDING
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: '#fff',
  },
  navView: {
    height: '50%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  backView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  backButton: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  backIcon: {
    fontSize: 35,
    color: COLORS.PURPLE,
    marginRight: 6
  },
  backTitle: {
    fontSize: 20,
    color: COLORS.PURPLE,
  },
  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '50%',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.PRIMARY_BLACK,
    marginRight: 10,
    flex: 1
  },
  miniNavView: {
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 10,
  }
})

export default styles
