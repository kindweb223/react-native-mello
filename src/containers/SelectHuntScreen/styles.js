import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'


export default styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  feedContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
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
    // paddingHorizontal: 20,
    paddingVertical: 18,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  extensionTopContainer: {
    paddingHorizontal: 0, 
    height: 44,
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
    paddingHorizontal: 16,
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
    backgroundColor: COLORS.LIGHT_GREY_LINE,
    marginBottom: 10,
  },
})
