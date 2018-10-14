import { Dimensions, Platform } from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? ifIphoneX(36, 20) : 20;

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
  ACTION_BAR_HEIGHT: Platform.OS === 'ios' ? ifIphoneX(82, 56) : 56,
  STATUS_BOTTOM_BAR_HEIGHT: Platform.OS === 'ios' ? ifIphoneX(16, 0) : 0,
  TAB_BAR_HEIGHT: 40,
  ANIMATEION_MILLI_SECONDS: 200,
  SCREEN_VERTICAL_MIN_MARGIN: Math.round(height * 0.145),

  // Feedo show type
  FEED_NONE: 0,
  FEED_NEW: 1,
  FEED_VIEW: 2,
  FEED_EDIT: 3,

  // Idea show type
  CARD_NONE: 0,
  CARD_NEW: 1,
  CARD_VIEW: 2,
  CARD_EDIT: 3,

  // Select feedo type in main app
  FEEDO_FROM_MAIN: 1,
  FEEDO_FROM_CARD: 2,
  FEEDO_FROM_COLLAPSE: 3,

  MAIN_APP_FEEDO: 1,
  SHARE_EXTENTION_FEEDO: 2,

  // Select feedo type in share extension
  FEEDO_SELECT_FROM_MAIN: 1,
  FEEDO_SELECT_FROM_SHARE_EXTENSION: 2,

  // Card type for main app (dashboard / feedo detail) or share extension
  MAIN_APP_CARD_FROM_DETAIL: 1,
  MAIN_APP_CARD_FROM_DASHBOARD: 2,
  SHARE_EXTENTION_CARD: 3,

  // App Group
  APP_GROUP_USER_IDENTIFIER: 'group.hunt.mobile.user.info',
  APP_GROUP_TOKEN_IDENTIFIER: 'group.hunt.mobile.token',

  // Push Notification
  UNKOWN_PUSH_NOTIFICATION: 'UNKOWN_PUSH_NOTIFICATION',
  NEW_LIKE_ON_IDEA: 'NEW_LIKE_ON_IDEA',
  NEW_COMMENT_ON_IDEA: 'NEW_COMMENT_ON_IDEA',
  USER_ACCESS_CHANGED: 'USER_ACCESS_CHANGED',
  USER_JOINED_HUNT: 'USER_JOINED_HUNT',
  NEW_IDEA_ADDED: 'NEW_IDEA_ADDED',
  USER_EDITED_HUNT: 'USER_EDITED_HUNT',
  USER_INVITED_TO_HUNT: 'USER_INVITED_TO_HUNT',

  USER_DEVICE_TOKEN: 'USER_DEVICE_TOKEN',
  CARD_SAVED_FEEDO_ID: 'CARD_SAVED_FEEDO_ID',
}