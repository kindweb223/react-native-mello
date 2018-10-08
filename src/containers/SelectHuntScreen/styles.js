import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
const ScreenVerticalMinMargin = 80;

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#00000060',
  },
  feedContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: ScreenVerticalMinMargin,
    bottom: ScreenVerticalMinMargin,
  },
  newFeedContainer: {
    backgroundColor: '#fff',
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
  textTitle: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
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
  avatarContainer: {
    width: 32,
    height: 32,
    marginRight: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textItemTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
  },
  line: {
    height: 1,
    backgroundColor: COLORS.DARK_GREY,
    marginBottom: 10,
  },
})
