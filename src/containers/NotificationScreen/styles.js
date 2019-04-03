import { StyleSheet, Platform } from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 54,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY_PLACEHOLDER
  },
  buttonWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: 80
  },
  doneButton: {
    fontSize: 16,
    fontWeight: 'normal',
    color: COLORS.PURPLE
  },
  textTitle: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  contentFlatList: {
    paddingBottom: 16
  },
  itemView: {
    paddingTop: 16,
    paddingBottom: 14
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.SEPARATOR_GREY
  },
  activityItem: {
    backgroundColor: COLORS.LIGHT_PURPLE_BACKGROUND
  },
  itemContainer: {
    backgroundColor: 'transparent',
  },
  swipeItemContainer: {
    flex: 1,
    backgroundColor: COLORS.DARK_RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerView: {
    paddingVertical: 20
  },
  modalContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: COLORS.LIGHT_GREY_MODAL_BACKGROUND,
  },
  settingMenuView: {
    borderRadius: 20,
    backgroundColor: '#fff',
    width: 122,
    paddingVertical: 10,
    position: 'absolute',
    right: CONSTANTS.PADDING,
    top: CONSTANTS.STATUSBAR_HEIGHT + ifIphoneX(70, 60),
    zIndex: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5
      },
      android: {
        elevation: 20
      }
    })
  },
  emptyView: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    lineHeight: 22,
    letterSpacing: 0.34,
    fontWeight: '600',
    marginTop: 38,
    marginBottom: 10
  },
  subTitle: {
    fontSize: 14,
    lineHeight: 20
  }
})

export default styles
