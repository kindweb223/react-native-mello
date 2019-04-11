import { StyleSheet } from 'react-native'
import COLORS from '../../../service/colors'
import CONSTANTS from '../../../service/constants'

const styles = StyleSheet.create({
  container: {
    width: CONSTANTS.SCREEN_WIDTH,
    height: CONSTANTS.SCREEN_HEIGHT,
    backgroundColor: 'transparent',
    backgroundColor: '#fff'
  },
  headerContainer: {
    marginTop: 5,
    paddingHorizontal: 6,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  closeButtonView: {
    paddingHorizontal: 10,
    height: 34,
    width: 90,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  textButton: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
    textAlign: 'center',
  },
  loadingIcon: {
    marginRight: 10
  },
  mainContainer: {
    flex: 1,
    padding: 8
  },
  footerContainer: {
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: CONSTANTS.PADDING,
    height: 55
  }
})


export default styles
