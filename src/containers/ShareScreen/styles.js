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
    color: COLORS.PURPLE,
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '600'
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderColor: COLORS.SOFT_GREY,
    paddingHorizontal: CONSTANTS.PADDING,
  },
  innerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  plusButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
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
    marginTop: 24,
    maxHeight: CONSTANTS.SCREEN_HEIGHT - 260,
    paddingHorizontal: CONSTANTS.PADDING
  },
  titleView: {
    paddingBottom: 9,
    borderBottomWidth: 1,
    borderColor: COLORS.SOFT_GREY
  },
  titleText: {
    color: COLORS.MEDIUM_GREY,
    fontSize: 14
  },
  inviteeItem: {
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderColor: COLORS.SOFT_GREY
  }
}
