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
    width: Math.round(CONSTANTS.SCREEN_WIDTH * 0.75),
    borderRadius: 12,
  },
  topContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    height: 45,
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
    fontSize: 17,
    lineHeight: 20,
    fontWeight: '500',
  },
  textDescription: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  textButton: {
    fontSize: 16,
    color: COLORS.BLUE,
  }
})
