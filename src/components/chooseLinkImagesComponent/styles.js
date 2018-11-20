import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
import colors from '../../service/colors';

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    backgroundColor: '#fff',
    maxHeight: CONSTANTS.SCREEN_HEIGHT - 200,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  backButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 16,
  },
  saveButtonWapper: {
    width: 80,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  textSave: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  textTitle: {
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
  },
  mainContainer: {
    marginVertical: 28,
    paddingHorizontal: 11,
  },
  imageContainer: {
    width: Math.round((CONSTANTS.SCREEN_WIDTH - 22 - 30) / 3),
    height: Math.round((CONSTANTS.SCREEN_WIDTH - 22 - 30) / 3),
    margin: 5,
  },
  imageItem: {
    width: Math.round((CONSTANTS.SCREEN_WIDTH - 22 - 30) / 3) - 5,
    height: Math.round((CONSTANTS.SCREEN_WIDTH - 22 - 30) / 3) - 5,
    backgroundColor: 'rgba(0, 0, 0, 0.05);',
    marginRight: 5,
    marginTop: 5,
    borderRadius: 5,
  },
  selectedIcon: {
    position: 'absolute',
    right: 10,
    bottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 18,
    height: 18,
    borderRadius: 45,
    backgroundColor: '#FFFFFF',
  },
  icon: {
    position: 'absolute',
    right: 10,
    bottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 18,
    height: 18,
    borderRadius: 45,
    backgroundColor: '#FFFFFF',
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
