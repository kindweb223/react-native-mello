import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

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
    padding: 16,
  },
  backButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  textBack: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
    marginLeft: 5,
    color: COLORS.PURPLE,
  },
  saveButtonWapper: {
    width: 80,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: (CONSTANTS.SCREEN_WIDTH - 22 - 30) / 3,
    height: (CONSTANTS.SCREEN_WIDTH - 22 - 30) / 3,
    margin: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.05);',
  },
  imageItem: {
    width: '100%',
    height: '100%',
  },
  
  icon: {
    position: 'absolute',
    right: 5,
    top: 5,
  },
})


export default styles
