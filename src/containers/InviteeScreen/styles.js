import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

export default {
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    paddingBottom: 21,
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
    height: 66,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: CONSTANTS.PADDING
  },
  closeButton: {
    width: 50,
    height: 50,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  sendButtonView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 34,
    width: 80,
    borderRadius: 17
  },
  sendEnableButtonView: {
    backgroundColor: COLORS.PURPLE
  },
  sendDisableButtonView: {
    backgroundColor: COLORS.LIGHT_GREY
  },
  sendButtonText: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '600'
  },
  sendEnableButtonText: {
    color: '#fff'
  },
  sendDisableButtonText: {
    color: COLORS.MEDIUM_GREY
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000'
  },
  inviteeListView: {
    marginTop: 24,
    maxHeight: CONSTANTS.SCREEN_HEIGHT - 260,
    paddingHorizontal: CONSTANTS.PADDING
  },
  titleView: {
    paddingBottom: 5,
  },
  titleText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600'
  },
  inviteeItem: {
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderColor: COLORS.LIGHT_GREY_LINE
  },
  inputItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.LIGHT_GREY_LINE,
  },
}
