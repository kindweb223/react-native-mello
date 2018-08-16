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
  loadingView: {
    marginTop: 24,
    justifyContent: 'center',
    alignItems: 'center'
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
  tagInputItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderColor: COLORS.LIGHT_GREY_LINE,
  },
  messageInputItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 3,
    marginVertical: 20,
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
  },
  successModal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  successView: {
    width: 146,
    height: 146,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  successIcon: {
    fontSize: 80,
    color: COLORS.PURPLE
  },
  contactList: {
    maxHeight: 300
  },
  contactItem: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: COLORS.LIGHT_GREY_LINE,
  },
  invalidEmail: {
    width: '100%',
    backgroundColor: COLORS.LIGHT_RED,
    paddingHorizontal: CONSTANTS.PADDING,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  invalidEmailText: {
    color: COLORS.MEDIUM_RED,
    fontWeight: '600'
  }
}
