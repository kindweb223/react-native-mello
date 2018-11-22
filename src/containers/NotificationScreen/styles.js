import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
const TAB_BAR_HEIGHT = 50

const styles = StyleSheet.create({
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  textTitle: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  tabBarStyle: {
    width: '100%',
    height: TAB_BAR_HEIGHT,
    marginTop: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0
  },
  tabStyle: {
    width: CONSTANTS.SCREEN_WIDTH / 2,
    height: TAB_BAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 0
  },
  tabBarTextStyle: {
    fontSize: 16
  },
  activeTabBarTextStyle: {
    color: COLORS.PURPLE,
    fontWeight: 'bold'
  },
  tabView: {
  },
  contentFlatList: {
    paddingBottom: 16
  },
  itemView: {
    paddingTop: 16
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.SEPARATOR_GREY
  },
  itemContainer: {
    backgroundColor: 'transparent',
  },
  swipeItemContainer: {
    flex: 1,
    backgroundColor: COLORS.PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
  }
})

export default styles
