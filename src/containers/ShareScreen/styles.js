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
  shareButtonView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareIcon: {
    color: COLORS.PURPLE,
    fontSize: 16,
  },
  shareButtonText: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '600'
  },
  listItemView: {
    paddingHorizontal: CONSTANTS.PADDING,
    marginBottom: 24,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.LIGHT_GREY_LINE,
  },
  innerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  plusButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 15,
    backgroundColor: COLORS.PURPLE,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000'
  },
  inviteeListView: {
    maxHeight: 400
  },
  titleContainer: {
    paddingHorizontal: CONSTANTS.PADDING
  },
  titleView: {
    paddingBottom: 9,
    borderBottomWidth: 1,
    borderColor: COLORS.LIGHT_GREY_LINE,
  },
  titleText: {
    color: COLORS.MEDIUM_GREY,
    fontSize: 14
  },
  inviteeItemView: {
    paddingHorizontal: CONSTANTS.PADDING
  },
  inviteeItem: {
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderColor: COLORS.LIGHT_GREY_LINE
  }
}
