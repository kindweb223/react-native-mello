import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: CONSTANTS.SCREEN_HEIGHT,
    backgroundColor: COLORS.MODAL_BACKGROUND,
  },
  mainContainer: {
    borderRadius: 18,
    marginHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, .95)',
    height: CONSTANTS.SCREEN_HEIGHT - CONSTANTS.SCREEN_VERTICAL_MIN_MARGIN * 2,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    height: 44,
  },
  cancelButtonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCancel: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: COLORS.PURPLE,
  },
  textTitle: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '600',
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
  },
  listContainer: {
    padding: 12,
  },
  imageContainer: {
  },
  imageItem: {
    width: Math.round((CONSTANTS.SCREEN_WIDTH - 32 - 24 - 24) / 3),
    height: Math.round((CONSTANTS.SCREEN_WIDTH - 32 - 24 - 24) / 3),
    backgroundColor: 'rgba(0, 0, 0, 0.05);',
    marginHorizontal: 4,
    marginVertical: 4,
  },
  line: {
    height: 1,
    backgroundColor: COLORS.LIGHT_GREY_LINE,
  },
  bottomContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginHorizontal: 16,
    height: Math.round(CONSTANTS.SCREEN_HEIGHT * 0.075),
    borderRadius: 18,
    backgroundColor: '#fff',
  },

})


export default styles
