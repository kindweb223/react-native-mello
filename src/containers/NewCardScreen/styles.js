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
  cardContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainer: {
    borderRadius: 18,
    backgroundColor: '#fff',
    maxHeight: CONSTANTS.SCREEN_HEIGHT - 150,
    paddingTop: 26,
    paddingBottom: 17,
  },
  mainContentContainer: {
    paddingHorizontal: 22,
  },
  textInputCardName: {
    fontSize: 18,
    lineHeight: 25,
  },
  textInputNote: {
    fontSize: 16,
    lineHeight: 23,
    marginTop: 15,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 22,
    paddingRight: 16,
    marginTop: 20,
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
