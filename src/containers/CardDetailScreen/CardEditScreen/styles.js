import { StyleSheet } from 'react-native'
import COLORS from '../../../service/colors'
import CONSTANTS from '../../../service/constants'

const FOOTER_HEIGHT = 50

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
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContainer: {
    marginTop: 6,
    paddingRight: 16,
    backgroundColor: '#fff',
    alignItems: 'flex-end'
  },
  closeButtonView: {
    width: 110,
    height: 34,
    borderRadius: 20,
    justifyContent: 'center',
    backgroundColor: COLORS.PURPLE
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
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
  }
})


export default styles
