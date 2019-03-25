import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
import { ifIphoneX } from 'react-native-iphone-x-helper'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  topBarWrapper: {
    flex: 1,
    height: 44,
    top: ifIphoneX(44, 20),
    alignSelf: 'stretch',
    flexDirection: 'row',
  },
  closeButtonWrapper: {
    left: 0,
    paddingLeft: 20,
    padding: 10,
    width: 60,
  },
  headerTitleLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    top: 12
  },
  webViewContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: ifIphoneX(84, 64),
    bottom: 0,
  },
  scrollViewContainer: {
    flex: 1,
    marginBottom: 0,
    backgroundColor: '#fff'
  },
  scrollViewContentContainer: {
    flex: 1
  },
  errorViewContainer: {
    flex: 1,
    backgroundColor: 'steelblue'
  },
  deleteButtonWrapper: {
    position: 'absolute',
    height: 30,
    width: 30,
    bottom: 25,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotStyle: {
    width: 6,
    height: 6,
  }
})


export default styles
