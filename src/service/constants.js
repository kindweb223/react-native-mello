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
  ACTION_BAR_HEIGHT: Platform.OS === 'ios' ? ifIphoneX(82, 64) : 56,
  STATUS_BOTTOM_BAR_HEIGHT: Platform.OS === 'ios' ? ifIphoneX(40, 0) : 0,
  TAB_BAR_HEIGHT: 45,
  ANIMATEION_MILLI_SECONDS: 200,
  ANIMATABLE_DURATION: 400,
  SCREEN_VERTICAL_MIN_MARGIN: Math.round(height * 0.145),
  TEXT_INPUT_LINE_HEIGHT: 22,
  CLIPBOARD_DATA_CONFIRM_DURATION: 6000,
  IMAGE_COMPRESS_DIMENSION_RATIO: 4,
  IMAGE_COMPRESS_QUALITY: 50,
  IMAGE_COMPRESS_FORMAT: 'JPEG',
  NETWORK_CONSUMER_PING_INTERVAL: 5000,

  
  // Mello show type
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
  FEEDO_SELECT_FROM_MOVE_CARD: 2,
  FEEDO_SELECT_FROM_SHARE_EXTENSION: 3,

  // Card type for main app (dashboard / feedo detail) or share extension
  MAIN_APP_CARD_FROM_DETAIL: 1,
  MAIN_APP_CARD_FROM_DASHBOARD: 2,
  SHARE_EXTENTION_CARD: 3,

  // App Group
  APP_GROUP_USER_IDENTIFIER: 'group.hunt.mobile.user.info',
  APP_GROUP_TOKEN_IDENTIFIER: 'group.hunt.mobile.token',
  APP_GROUP_LAST_USED_FEEDO: 'group.hunt.mobile.last.feedo',
  APP_GROUP_SHARE_STATE: 'group.hunt.mobile.share.state',

  // Push Notification
  UNKOWN_PUSH_NOTIFICATION: 'UNKOWN_PUSH_NOTIFICATION',
  IDEA_LIKED: 'IDEA_LIKED',
  COMMENT_ADDED: 'COMMENT_ADDED',
  USER_ACCESS_CHANGED: 'USER_ACCESS_CHANGED',
  USER_JOINED_HUNT: 'USER_JOINED_HUNT',
  IDEA_ADDED: 'IDEA_ADDED',
  HUNT_UPDATED: 'HUNT_UPDATED',
  USER_INVITED_TO_HUNT: 'USER_INVITED_TO_HUNT',
  USER_MENTIONED: 'USER_MENTIONED',

  USER_DEVICE_TOKEN: 'USER_DEVICE_TOKEN',
  CARD_SAVED_LAST_FEEDO_INFO: 'CARD_SAVED_LAST_FEEDO_INFO',
  ANDROID_SHARE_EXTENTION_FLAG: 'ANDROID_SHARE_EXTENTION_FLAG',

  CLIPBOARD_DATA: 'CLIPBOARD_DATA',

  // share extension modal buttons
  MODAL_OK: 1,
  MODAL_CLOSE: 2,

  PREMIUM_10MB_ALERT_MESSAGE: 'Oops you need to have a premium account to upload more than 10MB.',
  // 10MB
  MAX_UPLOAD_FILE_SIZE: 1024 * 1024 * 10,

  // file path in DocumentDirectoryPath
  PRIVACY_POLICE: '/MELLO_PRIVACY_POLICY.txt',
  TERMS_CONDITIONS: '/MELLO_TERMS_CONDITIONS.txt',
  HTML_CLASS_STYLES: {
    'text-big': { backgroundColor: 'transparent', fontSize: 24, fontWeight: 'bold', lineHeight: 32, color: 'black' }
  },
  HTML_TAGS_STYLE: {
    'p': { backgroundColor: 'transparent', fontSize: 16, marginTop: 0, marginBottom: 0, lineHeight: 22 },
    'ul': { paddingLeft: 0, marginLeft: 0, marginTop: 16, marginBottom: 8, paddingBottom: 0, fontSize: 16 },
    'ol': { paddingLeft: 0, marginLeft: 0, marginTop: 0, marginBottom: -8, padding: 0, fontSize: 16, lineHeight: 22 },
    'li': { paddingLeft: 0, marginTop: 0, marginBottom: -8, padding: 0, fontSize: 16, lineHeight: 22 },
    'h1': { backgroundColor: 'transparent' },
    'h2': { backgroundColor: 'transparent', fontSize: 24, fontWeight: 'bold', lineHeight: 32, color: 'black', marginTop: 16, marginBottom: 20 },
    'h3': { backgroundColor: 'transparent' },
    'h4': { backgroundColor: 'transparent' },
    'h5': { backgroundColor: 'transparent' },
    'h6': { backgroundColor: 'transparent' }
  },
  HTML_TAGS_STYLE_MASONRY: {
    'p': { backgroundColor: 'transparent', fontSize: 14, marginTop: 0, marginBottom: 0, lineHeight: 20 },
    'ul': { paddingLeft: 0, marginLeft: 0, marginTop: 12, marginBottom: 6, paddingBottom: 0, fontSize: 14 },
    'ol': { paddingLeft: 0, marginLeft: 0, marginTop: 0, marginBottom: -12, padding: 0, fontSize: 14, lineHeight: 20 },
    'li': { paddingLeft: 0, marginTop: 0, marginBottom: -12, padding: 0, fontSize: 14, lineHeight: 22 },
    'h1': { backgroundColor: 'transparent' },
    'h2': { backgroundColor: 'transparent', fontSize: 22, fontWeight: 'bold', lineHeight: 28, color: 'black', marginTop: 8, marginBottom: 16 },
    'h3': { backgroundColor: 'transparent' },
    'h4': { backgroundColor: 'transparent' },
    'h5': { backgroundColor: 'transparent' },
    'h6': { backgroundColor: 'transparent' }
  }
}