import { StyleSheet } from 'react-native'
import CONSTANTS from '../../service/constants'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  normalHeader: {
    height: 100,
  },
  miniHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden'
  },
  container: {
    flex: 1,
    paddingBottom: CONSTANTS.ACTION_BAR_HEIGHT,
  },
  tabBarStyle: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    height: 60,
    alignItems: 'center',
    marginTop: 0,
  },
  tabBarTextStyle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  newFeedModalContainer: {
    margin: 0,
  },
  newFeedContainer: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'transparent'
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingTop: 100
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.MEDIUM_GREY,
    marginVertical: 20
  }
})

export default styles
