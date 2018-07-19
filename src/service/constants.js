import { Dimensions } from 'react-native'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default {
  SCREEN_WIDTH: width,
  SCREEN_HEIGHT: height,
  PADDING: 16,
  NORMAL_NAVIGATION_BAR_HEIGTH: 100,
  MINI_NAVIGATION_BAR_HEIGTH: 55,
  FILTER_HEIGHT: 62,
  ACTION_BAR_HEIGHT: 82,
}
