import { Dimensions, Platform } from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? ifIphoneX(34, 20) : 20;

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default {
  SCREEN_WIDTH: width,
  SCREEN_HEIGHT: height,
  SCREEN_SUB_WIDTH: width - 32,
  STATUSBAR_HEIGHT: STATUSBAR_HEIGHT,
  PADDING: 16,
  NORMAL_NAVIGATION_BAR_HEIGTH: 100,
  MINI_NAVIGATION_BAR_HEIGTH: 60,
  FILTER_HEIGHT: 62,
  ACTION_BAR_HEIGHT: 82,
  TAB_BAR_HEIGHT: 60,
  ANIMATEION_MILLI_SECONDS: 200,

  FEED_NONE: 0,
  FEED_NEW: 1,
  FEED_VIEW: 2,
  FEED_EDIT: 3,

  CARD_NONE: 0,
  CARD_NEW: 1,
  CARD_VIEW: 2,
  CARD_EDIT: 3,

  FEEDO_FIRST_SELECT: 1,
  FEEDO_LATER_SELECT: 2,

  MAIN_APP_CARD: 1,
  EXTENTION_CARD: 2,

  APP_GROUP_USER_IDENTIFIER: "group.hunt.mobile.user.info",
  APP_GROUP_TOKEN_IDENTIFIER: "group.hunt.mobile.token",
}