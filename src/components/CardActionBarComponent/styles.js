import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 50 + 40,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'transparent'
  },
  rowContainer: {
    height: 50,
    width: 210,
    paddingHorizontal: 23,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.TOASTER_GREY,
    borderRadius: 8
  },
  buttonView: {
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  arrowIcon: {
    marginRight: 8
  },
})

export default styles
