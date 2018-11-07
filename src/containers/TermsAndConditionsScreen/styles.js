import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

export default {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  textTitle: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 5,
  },
  scrollView: {
    paddingVertical: 20
  },
  innerContainer: {
    width: '100%',
    paddingHorizontal: CONSTANTS.PADDING
  },
  arrowView: {
    width: '100%',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  arrow: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.PURPLE,
    shadowColor: 'black',
    shadowOffset: { height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 20
  }
}
