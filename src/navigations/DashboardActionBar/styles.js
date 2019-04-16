import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height: CONSTANTS.ACTION_BAR_HEIGHT,
    width: '100%',
    paddingTop: 8,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  leftContainer: {
    flexDirection: 'row',
    marginLeft: 8
  },
  iconView: {
    height: 42,
    width: 42,
    marginRight: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  notificationView: {
    height: 42,
    width: 42,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  notificationText: {
    color: COLORS.PURPLE,
    fontSize: 14,
    marginLeft: 5,
    marginBottom: 2,
    fontWeight: '500'
  },
  rightContainer: {
    height: 42,
    justifyContent: 'center',
    alignItems: 'center'
  },
  plusButton: {
    paddingHorizontal: CONSTANTS.PADDING
  },
  searchIcon: {
    width: 18,
    height: 28
  },
  listIcon: {
    width: 18,
    height: 15
  },
  notificationIcon: {
    width: 17,
    height: 26
  }
})

export default styles
