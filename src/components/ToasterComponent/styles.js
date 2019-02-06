import { StyleSheet, Platform } from 'react-native'
import CONSTANTS from '../../service/constants'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.TOASTER_GREY,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5
      },
      android: {
        elevation: 20
      }
    }),
    paddingHorizontal: 16,
    width: CONSTANTS.SCREEN_SUB_WIDTH,
    marginLeft: CONSTANTS.PADDING,
    height: 50,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: CONSTANTS.ACTION_BAR_HEIGHT,
  },
  titleView: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
    color: '#fff'
  },
  buttonView: {
    marginLeft: 20,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600'
  }
})

export default styles
