import { StyleSheet } from 'react-native'
export const hairlineWidth = StyleSheet.hairlineWidth
import COLORS from '../../service/colors'

export default {
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.4,
    backgroundColor: '#000'
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent'
  },
  body: {
    marginHorizontal: 5,
    marginBottom: 20,
    alignSelf: 'flex-end',
    borderRadius: 14,
    backgroundColor: 'transparent'
  },
  titleBox: {
    backgroundColor: '#fff',
    height: 45,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: COLORS.MEDIUM_GREY,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  titleText: {
    color: COLORS.ACTION_SHEET_TITLE,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 13
  },
  buttonBox: {
    backgroundColor: '#fff',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopWidth: 0,
  },
  actionButtonText: {
    fontSize: 20,
    color: COLORS.RED
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600'
  },
  cancelButtonBox: {
    height: 56,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 10
  }
}
