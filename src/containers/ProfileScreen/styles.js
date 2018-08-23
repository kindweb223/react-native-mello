import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

export default {
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    paddingTop: CONSTANTS.STATUSBAR_HEIGHT,
    backgroundColor: COLORS.SOFT_GREY
  },
  closeButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 0
  },
  scrollView: {
    width: '100%',
    height: '100%'
  },
  body: {
    width: '100%',
    height: '100%'
  },
  headerView: {
    marginVertical: 40,
    backgroundColor: COLORS.SOFT_GREY,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarView: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden'
  },
  editView: {
    width: 32,
    height: 32,
    borderRadius: 16,
    // overflow: 'hidden',
    position: 'absolute',
    top: 10,
    right: -10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 10
      }
    })
  },
  editIcon: {
    width: 25,
    height: 25
  },
  name: {
    fontWeight: 'bold',
    fontSize: 28,
    color: '#000',
    marginTop: 30,
    marginBottom: 10
  },
  email: {
    fontSize: 14,
    color: COLORS.MEDIUM_GREY
  },
  aboutTitleView: {
    width: '100%',
    paddingHorizontal: CONSTANTS.PADDING,
    borderBottomWidth: 1,
    borderColor: COLORS.LIGHT_GREY_LINE,
    paddingVertical: 15,
  },
  aboutTitle: {
    fontWeight: '600',
    fontSize: 16
  },
  settingView: {
    backgroundColor: '#fff',
    paddingBottom: 30,
    width: '100%',
  },
  settingLeftView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  leftIcon: {
    marginRight: 20
  },
  itemView: {
    paddingHorizontal: CONSTANTS.PADDING,
    width: '100%',
  },
  aboutItem: {
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: COLORS.LIGHT_GREY_LINE,
    width: '100%'
  },
  title: {
    fontSize: 16
  },
  signoOutView: {
    backgroundColor: '#fff',
    paddingVertical: 30,
    width: '100%',
  },
  signOutItem: {
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: COLORS.LIGHT_GREY_LINE,
    width: '100%'
  },
  bottomView: {
    backgroundColor: '#fff',
    paddingBottom: 60,
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  version: {
    color: COLORS.MEDIUM_GREY,
    fontSize: 12,
  },
  bottomItemView: {
    marginTop: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  favicon: {
    marginHorizontal: 7
  }
}
