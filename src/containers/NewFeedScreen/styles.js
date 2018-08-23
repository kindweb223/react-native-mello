import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  backdropContainer: {
    flex: 1,
  },
  feedContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainer: {
    borderRadius: 18,
    backgroundColor: '#fff',
  },
  tagCreationContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  closeButtonWrapper: {
    paddingHorizontal: 4,
  },
  createButtonWapper: {
    width: 80,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.PURPLE,
    justifyContent: 'center',
  },
  textButton: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  mainContentContainer: {
  },
  textInputFeedName: {
    fontSize: 24,
    fontWeight: '500',
    lineHeight: 26,
    marginHorizontal: 20,
    marginVertical: 8,
  },
  textInputNote: {
    fontSize: 16,
    lineHeight: 23,
    marginHorizontal: 20,
    marginVertical: 8,
  },
  bottomContainer: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginVertical: 20,
  },
  bottomItemContainer: {
    width: 32,
    height: 32,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachment: {
    transform: [
      { rotate: '90deg' },
    ],
  },
})


export default styles
