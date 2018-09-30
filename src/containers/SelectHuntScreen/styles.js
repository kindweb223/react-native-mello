import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
const ScreenVerticalMinMargin = 80;

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  feedContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: ScreenVerticalMinMargin,
    bottom: ScreenVerticalMinMargin,
  },
  newFeedContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  contentContainer: {
    borderRadius: 18,
    backgroundColor: '#fff',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  closeButtonWrapper: {
    paddingHorizontal: 4,
  },
  textButton: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 15,
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textBack: {
    color: COLORS.PURPLE,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginLeft: 5,
  },
  itemContainer: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
  },
})
