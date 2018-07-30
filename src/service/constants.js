import { Dimensions } from 'react-native'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default {
  SCREEN_WIDTH: width,
  SCREEN_HEIGHT: height,
  SCREEN_SUB_WIDTH: width - 32,
  PADDING: 16,
  NORMAL_NAVIGATION_BAR_HEIGTH: 100,
  MINI_NAVIGATION_BAR_HEIGTH: 60,
  FILTER_HEIGHT: 62,
  ACTION_BAR_HEIGHT: 82,
  TAB_BAR_HEIGHT: 60,
  ANIMATEION_MILLI_SECONDS: 200,
}
