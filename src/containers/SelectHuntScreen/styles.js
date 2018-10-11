import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'


export default styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: COLORS.MODAL_BACKGROUND,
  },
  feedContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: CONSTANTS.SCREEN_VERTICAL_MIN_MARGIN,
    bottom: CONSTANTS.SCREEN_VERTICAL_MIN_MARGIN,
  },
  newFeedContainer: {
    // backgroundColor: '#fff',
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
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  extensionTopContainer: {
    paddingHorizontal: 0, 
    height: 50,
    paddingVertical: 0,
    // backgroundColor: '#D5D5D5',
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
    backgroundColor: '#C6C6C6',
    marginBottom: 10,
  },
})
