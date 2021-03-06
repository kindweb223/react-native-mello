import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
import { fonts } from '../../themes'

export default {
  overlay: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? CONSTANTS.STATUSBAR_HEIGHT : 0,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    height: 50,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: CONSTANTS.PADDING,
  },
  body: {
    flex: 1,
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
  h3: {
    ...fonts.style.h3
  },
  sendEnableButtonText: {
    color: COLORS.PURPLE
  },
  sendDisableButtonText: {
    color: COLORS.MEDIUM_GREY
  },
  loadingView: {
    marginTop: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inviteeListView: {
    flex: 1,
    marginTop: 50,
    marginBottom: 0
  },
  inviteeListInnerView: {
    paddingBottom: CONSTANTS.STATUS_BOTTOM_BAR_HEIGHT
  },
  titleView: {
    paddingBottom: 5,
    paddingHorizontal: CONSTANTS.PADDING
  },
  titleText: {
    fontSize: 14,
    color: COLORS.DARK_GREY    
  },
  cancelText: {
    ...fonts.style.h3,
    color: COLORS.PURPLE,
    fontWeight: 'normal'
  },
  inviteeList: {
    marginTop: 9
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginTop: 10,
  },
  inviteeItem: {
    paddingVertical: 11,
    paddingHorizontal: CONSTANTS.PADDING
  },
  inputFieldView: {
    // paddingHorizontal: CONSTANTS.PADDING
  },
  padding: {
    paddingHorizontal: CONSTANTS.PADDING
  },
  tagInputItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderColor: COLORS.LIGHT_GREY_LINE
  },
  messageInputItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 3,
    marginVertical: 20,
    borderBottomWidth: 1,
    width: '100%',
    borderColor: COLORS.LIGHT_GREY_LINE,
  },
  textInput: {
    fontSize: 16,
    marginBottom: 5,
    width: '100%'
  },
  rightView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginTop: 10
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
  contactList: {
    paddingBottom: 10
  },
  contactItem: {
    paddingVertical: 5,
  },
  invalidEmail: {
    width: '100%',
    backgroundColor: COLORS.LIGHT_RED,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  invalidEmailText: {
    color: COLORS.MEDIUM_RED,
    fontWeight: '600'
  },
  removeModal: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    left: 0,
    paddingHorizontal: 21,
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
  actionButtons: {
    flexDirection: 'column'
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.SEPARATOR_GREY,
    marginHorizontal: 16
  },
}
