import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: CONSTANTS.ACTION_BAR_HEIGHT,
    width: '100%',
    paddingHorizontal: CONSTANTS.PADDING,
    paddingVertical: 16,
    position: 'absolute',
    backgroundColor: '#fff',
    bottom: 0
  },
  filterContainer: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row'
  },
  actionContainer: {
    alignItems: 'flex-end',
  },
  filteringView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  filterButton: {
    alignItems: 'flex-start'
  },
  actionView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  plusButtonView: {
    marginLeft: 15
  },
  plusButton: {
    borderRadius: 21,
    backgroundColor: COLORS.PURPLE,
    alignItems: 'center'
  },
  plusButtonIcon: {
    color: '#fff',
    fontSize: 30,
  },
  iconStyle: {
    width: 42,
    height: 42,
    justifyContent: 'center',
  },
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
  notificationText: {
    color: COLORS.PURPLE,
    fontSize: 14,
    marginLeft: 5
  }
})

export default styles
