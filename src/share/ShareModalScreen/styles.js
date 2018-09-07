import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

export default styles = StyleSheet.create({
  container: {
    height: CONSTANTS.SCREEN_HEIGHT,
    width: CONSTANTS.SCREEN_WIDTH,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'center',
  },
  modalContentContainer: {
    backgroundColor: '#F4F4F4',
    height: 150,
    width: 300,
    borderRadius: 20,
  },
  topContainer: {
    flex: 2,
    // padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.LIGHT_GREY,
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    backgroundColor: COLORS.LIGHT_GREY,
    width: 1,
    height: '100%',
  },
  textTitle: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: 'bold',
  },
  textDescription: {
    fontSize: 16,
    lineHeight: 20,
  },
  textButton: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.PURPLE,
  }
})
