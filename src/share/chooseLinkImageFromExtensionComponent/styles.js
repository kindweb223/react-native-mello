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
    height: CONSTANTS.SCREEN_HEIGHT - 200,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    // backgroundColor: '#D5D5D5',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    height: 50,
  },
  cancelButtonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCancel: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
    color: COLORS.PURPLE,
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
  listContainer: {
    paddingVertical: 16,
    paddingHorizontal: 11,
  },
  imageContainer: {
  },
  imageItem: {
    width: Math.round((CONSTANTS.SCREEN_WIDTH - 22 - 32 - 10) / 3),
    height: Math.round((CONSTANTS.SCREEN_WIDTH - 22 - 32 - 10) / 3),
    backgroundColor: 'rgba(0, 0, 0, 0.05);',
    marginRight: 5,
    marginBottom: 5,
  },
  line: {
    height: 1,
    backgroundColor: '#C6C6C6',
  },
  bottomContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginHorizontal: 16,
    height: 48,
    borderRadius: 18,
    backgroundColor: '#fff',
  },

})


export default styles
