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
    justifyContent: 'center',
    zIndex: 1,
  },
  contentContainer: {
    borderRadius: 18,
    backgroundColor: '#fff',
    paddingTop: 26,
    paddingBottom: 17,
  },
  mainContentContainer: {
  },
  textInputCardTitle: {
    fontSize: 18,
    lineHeight: 25,
    fontWeight: '600',
    marginHorizontal: 20,
  },
  textInputIdea: {
    fontSize: 16,
    lineHeight: 23,
    marginTop: 15,
    marginHorizontal: 20,
  },
  attachmentButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 22,
    paddingRight: 16,
    marginTop: 20,
  },
  buttonItemContainer: {
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
  line: {
    height: 1,
    backgroundColor: COLORS.LIGHT_GREY_LINE,
    marginVertical: 15,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInvitee: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.DARK_GREY,
  },
  iconDot: {
    marginHorizontal: 7,
    color: COLORS.DARK_GREY,
  },
  cellContainer: {
    marginLeft: 15,
  },
  heaerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 6,
  },
  closeButtonWrapper: {
    padding: 10,
  },
  imageCover: {
    marginHorizontal: 20,
    marginTop: 15,
    height: CONSTANTS.SCREEN_WIDTH * 0.384,
  },
})


export default styles
