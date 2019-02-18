import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: CONSTANTS.STATUSBAR_HEIGHT,
    backgroundColor: COLORS.SOFT_GREY,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 5,
  },
  shadowContainer: {
    marginHorizontal: 0,
    marginTop: 16,
    marginBottom: 0,
    backgroundColor: '#fff',
    shadowColor: '#000',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.08,
		shadowRadius: 33,
  },
  rowContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    width: 27,
    height: 27,
    borderRadius: 13.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    marginRight: 16,
    maxHeight: 100,
  },
})

export default styles
