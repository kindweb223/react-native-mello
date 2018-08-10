import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

export default {
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    marginTop: CONSTANTS.STATUSBAR_HEIGHT,
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
    height: 50,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: CONSTANTS.PADDING / 2,
    paddingRight: CONSTANTS.PADDING
  },
  closeButton: {
    width: 50,
    height: 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
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
    maxHeight: 400,
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
    borderColor: COLORS.LIGHT_GREY_LINE,
  },
  inputFieldView: {
    paddingHorizontal: CONSTANTS.PADDING
  },
  inputItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 3,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: COLORS.LIGHT_GREY_LINE,
  },
  textInput: {
    fontSize: 16,
    marginBottom: 5,
  },
  rightView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10
  },
  viewText: {
    fontSize: 14,
    marginHorizontal: 5,
    fontWeight: '600',
    textTransform: 'capitalize',
    color: COLORS.PURPLE,
  },
  cogIcon: {
    marginTop: 2,
    fontSize: 10,
    color: COLORS.PURPLE,
  }
}
