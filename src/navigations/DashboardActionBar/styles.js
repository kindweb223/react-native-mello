import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: CONSTANTS.ACTION_BAR_HEIGHT,
    width: '100%',
    paddingHorizontal: CONSTANTS.PADDING,
    paddingTop: 16,
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
  filteringButtonIcon: {
    fontSize: 30,
    color: COLORS.PURPLE
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
  }
})

export default styles
