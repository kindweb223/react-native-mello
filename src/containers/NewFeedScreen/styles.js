import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
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
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 9
  },
  closeButtonWrapper: {
    paddingHorizontal: 2,
  },
  createButtonWapper: {
    marginRight: 5,
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
    marginTop: 8,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 16
  },
  bottomLeftContainer: {
    flexDirection: 'row'
  },
  bottomItemContainer: {
    paddingHorizontal: 4,
    marginRight: 15,
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
  attachView: {
    marginLeft: 6,
    marginTop: 20
  }
})


export default styles
