import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.FOREGROUND_COLOR,
    justifyContent: 'center',
  },
  backgroundContainer: {
    flex: 1,
  },
  contentContainer: {
    borderRadius: 18,
    backgroundColor: '#fff',
    maxHeight: CONSTANTS.SCREEN_HEIGHT - 150,
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
    marginVertical: 13,
  },
  textInputNote: {
    fontSize: 16,
    lineHeight: 23,
    marginHorizontal: 20,
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
      { rotate: '135deg' }, 
      { rotateY: '180deg' },
    ],
  },
})


export default styles
