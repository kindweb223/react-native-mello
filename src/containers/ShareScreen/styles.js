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
    height: 60,
    borderBottomWidth: 1,
    borderColor: COLORS.SOFT_GREY
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
  rightView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  viewText: {
    fontSize: 14,
    marginHorizontal: 5,
    fontWeight: '600',
  },
  viewDisableText: {
    color: COLORS.LIGHT_GREY,
  },
  viewEnableText: {
    color: COLORS.PURPLE,
  },
  cogIcon: {
    marginTop: 2,
    fontSize: 10
  },
  cogDisableIcon: {
    color: COLORS.LIGHT_GREY,
  },
  cogEnableIcon: {
    color: COLORS.PURPLE,
  }
}
