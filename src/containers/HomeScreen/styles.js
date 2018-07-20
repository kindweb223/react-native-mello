import { StyleSheet } from 'react-native'
import CONSTANTS from '../../service/constants'

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
  }
})

export default styles
