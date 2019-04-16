import { StyleSheet } from 'react-native'
import COLORS from '../../../service/colors'
import CONSTANTS from '../../../service/constants'

const styles = StyleSheet.create({
  container: {
    top: 0,
    width: CONSTANTS.SCREEN_WIDTH,
    flex: 1,
    backgroundColor: 'white'
  },
  headerContainer: {
    marginTop: 5,
    paddingHorizontal: 6,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 55
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
  footerContainer: {
    width: '100%',
    backgroundColor: 'transparent',
    paddingHorizontal: CONSTANTS.PADDING,
    height: 55,
    bottom: 0,
  },
  hideKeyboardContainer: {
    position: 'absolute',
    right: 16,
    bottom: 58,
  },
  buttonItemContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
})


export default styles
