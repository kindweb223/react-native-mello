import { StyleSheet } from 'react-native'
import CONSTANTS from '../../service/constants'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  container: {
    width: CONSTANTS.SCREEN_WIDTH,
    height: CONSTANTS.SCREEN_HEIGHT,
    backgroundColor: 'transparent'
  },
  toasterContainer: {    
    position: 'absolute',
    bottom: CONSTANTS.ACTION_BAR_HEIGHT,
    padding: CONSTANTS.PADDING,
    zIndex: 1,
  },
  mainContainer: {
    backgroundColor: COLORS.TOASTER_GREY,
    width: CONSTANTS.SCREEN_SUB_WIDTH,
    height: 83,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  textTitle: {
    fontSize: 16,
    lineHeight: 22,
    color: '#FFF'
  },
  feedTitle: {
    fontSize: 16,
    marginLeft: 5,
    lineHeight: 22,
    fontWeight: '600',
    color: '#fff'
  },
  textsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  textsContainerNoImage: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageCover: {
    width: 45,
    height: 45,
    borderRadius: 5,
    marginRight: 18
  },
})

export default styles
