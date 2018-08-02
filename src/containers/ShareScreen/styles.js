import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

export default {
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    height: 220,
    borderRadius: 18,
    backgroundColor: '#fff',
    paddingHorizontal: CONSTANTS.PADDING,
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
    alignItems: 'center'
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
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.SOFT_GREY
  },
  innerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  plusButtonView: {
    marginRight: 15
  },
  plusButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.PURPLE,
    justifyContent: 'center',
    alignItems: 'center'
  },
  linkButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.LIGHT_YELLOW,
    justifyContent: 'center',
    alignItems: 'center'
  },
  plusButtonIcon: {
    color: '#fff',
    fontSize: 30,
  },
  tileView: {
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000'
  },
  description: {
    fontSize: 14,
    color: COLORS.MEDIUM_GREY
  },
  rightView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  viewText: {
    color: COLORS.PURPLE,
    fontSize: 14,
    marginHorizontal: 5,
    fontWeight: '600',
  },
  cogIcon: {
    color: COLORS.PURPLE,
    marginTop: 2,
    fontSize: 10
  }
}
