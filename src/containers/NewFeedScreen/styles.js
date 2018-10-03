import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  feedContainer: {
    flex: 1
  },
  contentContainer: {
    backgroundColor: '#fff'
  },
  tagCreationContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: COLORS.LIGHT_GREY_MODAL_BACKGROUND
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: CONSTANTS.STATUSBAR_HEIGHT + 10,
    paddingBottom: 16,
    paddingHorizontal: 10
  },
  closeButtonWrapper: {
    paddingHorizontal: 2,
  },
  createButtonWapper: {
    marginRight: 4,
    paddingHorizontal: 20,
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
    flex: 1,
  },
  textInputFeedName: {
    fontSize: 24,
    fontWeight: '500',
    lineHeight: 26,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  textInputNote: {
    fontSize: 16,
    lineHeight: 23,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  bottomLeftContainer: {
    flexDirection: 'row'
  },
  bottomItemContainer: {
    width: 32,
    height: 32,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  keyboardIconView: {
    width: 32,
    height: 32,
    backgroundColor: COLORS.PURPLE,
    borderRadius: 8,
    marginRight: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachment: {
    marginTop: -5,
    transform: [
      { rotate: '180deg' }, 
      { rotateY: '180deg' },
    ],
  }
})


export default styles
