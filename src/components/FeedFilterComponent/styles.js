import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

export default {
  overlay: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    left: 0,
    paddingTop: 10,
    paddingBottom: 45,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  closeButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    paddingLeft: CONSTANTS.PADDING,
    fontSize: 18,
    lineHeight: 25,
    color: '#000'
  },
  body: {
    paddingHorizontal: CONSTANTS.PADDING,
  },
  row: {
    marginBottom: 25,
  },
  labelText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#000'
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
    backgroundColor: COLORS.SOFT_GREY
  },
  btnText: {
    fontSize: 13,
    lineHeight: 14,
    fontWeight: '500'
  },
  btnSelectText: {
    color: '#fff'
  },
  btnDeselectText: {
    color: '#000'
  },
  heartIcon: {
    marginRight: 6
  },
  splitter: {
    width: 1,
    height: '100%',
    backgroundColor: COLORS.LIGHT_GREY_BORDER_LINE
  }
}
