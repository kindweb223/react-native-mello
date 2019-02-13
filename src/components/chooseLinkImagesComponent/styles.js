import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
import colors from '../../service/colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: CONSTANTS.SCREEN_HEIGHT
  },
  topContainer: {
    width: '100%',
    height: 34,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: Platform.OS === 'android' ? 15 : 0
  },
  btnClose: {
    width: 90,
    height: '100%',
    paddingHorizontal: CONSTANTS.PADDING,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  textButton: {
    color: '#000',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
    textAlign: 'center',
  },
  mainInnerContainer: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 8
  },
  imageContainer: {
    width: Math.round((CONSTANTS.SCREEN_WIDTH - 64) / 3),
    height: Math.round((CONSTANTS.SCREEN_WIDTH - 64) / 3),
    margin: 8,
    borderRadius: 10,
    overflow: 'hidden'
  },
  imageItem: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.05);'    
  },
  selectedIcon: {
    position: 'absolute',
    right: 10,
    bottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
  },
  icon: {
    position: 'absolute',
    right: 10,
    bottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.MEDIUM_GREY
  },
  checkIcon: {
    position: 'absolute',
    left: 0,
    top: -2,
    fontSize: 22,
    color: COLORS.PURPLE,
  },
})


export default styles
