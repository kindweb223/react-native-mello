import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 54 + 28,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 8,
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'transparent'
  },
  rowContainer: {
    height: 54,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.PURPLE,
    borderRadius: 18,
    paddingHorizontal: 10
  },
  buttonView: {
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 13
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
