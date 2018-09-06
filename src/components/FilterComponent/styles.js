import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

export default {
  overlay: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    left: 0,
    paddingTop: 21,
    paddingBottom: 40,
    borderRadius: 18,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 8
      },
      android: {
        elevation: 20
      }
    })
  },
  header: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: CONSTANTS.PADDING,
    marginBottom: 10,
  },
  closeButton: {
    width: 50,
    height: 50,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 18,
    color: '#000'
  },
  body: {
    paddingHorizontal: CONSTANTS.PADDING,
  },
  row: {
    marginBottom: 25,
  },
  countText: {
    fontSize: 14
  },
  buttonGroup: {
    width: '100%',
    height: 39,
    borderRadius: 6,
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden'
  },
  buttonView: {
    flex: 1,
    height: '100%'
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  buttonSelect: {
    backgroundColor: COLORS.PURPLE
  },
  buttonDeselect: {
    backgroundColor: COLORS.LIGHT_GREY_LINE
  },
  btnText: {
    fontSize: 14,
    fontWeight: '500'
  },
  btnSelectText: {
    color: '#fff'
  },
  btnDeselectText: {
    color: '#000',
  },
  heartIcon: {
    marginRight: 6
  },
  splitter: {
    width: 1,
    height: '100%',
    backgroundColor: COLORS.LIGHT_GREY
  }
}
