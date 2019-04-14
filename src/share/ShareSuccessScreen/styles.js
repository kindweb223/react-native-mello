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
    zIndex: 1,
  },
  mainContainer: {
    backgroundColor: COLORS.TOASTER_GREY,
    marginLeft: 8,
    marginRight: 8,
    width: CONSTANTS.SCREEN_WIDTH - CONSTANTS.PADDING,
    height: 80,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
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
    width: 55,
    height: 55,
    borderRadius: 5,
    marginRight: 16
  },
})

export default styles
