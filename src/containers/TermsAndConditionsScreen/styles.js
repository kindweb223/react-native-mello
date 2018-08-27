import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
const MODAL_HEIGHT = 200

export default {
  container: {
    width: CONSTANTS.SCREEN_WIDTH,
    height: CONSTANTS.SCREEN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerView: {
    paddingTop: CONSTANTS.STATUSBAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    height: 80,
    marginBottom: 20,
    paddingHorizontal: CONSTANTS.PADDING
  },
  headerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  btnback: {
    width: 100,
    height: 30,
    backgroundColor: '#ff0'
  },
  modalContainer: {
    flex: 1,
    width: '100%',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: '#fff',
    paddingVertical: 30,
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
