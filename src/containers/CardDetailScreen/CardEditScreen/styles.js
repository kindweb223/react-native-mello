import { StyleSheet, Platform } from 'react-native'
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
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 55
  },
  closeButtonView: {
    paddingHorizontal: CONSTANTS.PADDING,
    height: 34,
    width: 90,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  textButton: {
    color: '#000',
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
    paddingVertical: CONSTANTS.PADDING,
    marginBottom: Platform.OS === 'ios' ? 0 : 24,
    marginVertical: 0,
    height: Platform.OS === 'ios' ? 40 : 52,
    flexDirection: 'row',
    alignItems: 'center'
  },
  hideKeyboardContainer: {
    position: 'absolute',
    right: 16,
    bottom: 40,
  },
  buttonItemContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
})


export default styles
