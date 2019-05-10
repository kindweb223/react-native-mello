import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    marginBottom: CONSTANTS.STATUSBAR_HEIGHT,
    backgroundColor: COLORS.SOFT_GREY,
    borderColor: COLORS.LIGHT_GREY_LINE,
    borderTopWidth: 1,
  },
  shadowContainer: {
    marginHorizontal: 0,
    marginBottom: 0,
    backgroundColor: '#fff',
    shadowColor: '#000',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.08,
		shadowRadius: 33,
  },
  rowContainer: {
    width: '100%'
  },
  buttonContainer: {
    position: 'absolute',
    right: 16,
    bottom: 8,
    width: 27,
    height: 27,
    borderRadius: 13.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    backgroundColor: 'white',
    borderColor: COLORS.LIGHT_GREY_LINE,
    borderWidth: 1,
    paddingLeft: 16,
    paddingRight: 35,
    paddingTop: 13,
    fontSize: 16
  },
  suggestionsRowContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetailsBox: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 16
  },
  displayNameText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black'
  },
  userNameText: {
    fontSize: 14,
    color: COLORS.DARK_GREY
  }
})

export default styles
