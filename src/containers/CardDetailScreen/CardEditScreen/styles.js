import { StyleSheet } from 'react-native'
import COLORS from '../../../service/colors'
import CONSTANTS from '../../../service/constants'

const styles = StyleSheet.create({
  container: {
    width: CONSTANTS.SCREEN_WIDTH,
    height: CONSTANTS.SCREEN_HEIGHT,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  cardContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  textInputIdea: {
    fontSize: 16,
    lineHeight: CONSTANTS.TEXT_INPUT_LINE_HEIGHT,
    marginTop: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  headerContainer: {
    marginTop: 5,
    paddingHorizontal: 6,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  closeButtonView: {
    paddingHorizontal: 10,
    height: 34,
    width: 90,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  textButton: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
    textAlign: 'center',
  },
  keyboardContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  keyboardButtonView: {
    width: 32,
    height: 32,
    backgroundColor: COLORS.PURPLE,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIcon: {
    marginRight: 15
  }
})


export default styles
