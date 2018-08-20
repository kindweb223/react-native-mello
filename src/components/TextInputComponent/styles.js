import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 10,
  },
  inputView: {
    borderRadius: 9,
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    width: '100%'
  },
  inputStyle: {
    flex: 1,
    height: '100%',
    backgroundColor: 'transparent',
    fontWeight: 'normal',
    fontSize: 16
  },
  errorView: {
    height: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    width: '100%'
  },
  errorText: {
    color: COLORS.MEDIUM_RED,
    fontWeight: '600',
    fontSize: 12
  }
})

export default styles
