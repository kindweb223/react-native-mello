import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  contentContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    paddingVertical: 20,
    backgroundColor: '#fff',
    maxHeight: CONSTANTS.SCREEN_HEIGHT - 150,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButtonContainer: {
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textBack: {
    color: COLORS.PURPLE,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginLeft: 5,
  },
  mainContentContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  tagItemContainer: {
  },
  textTagItem: {
    fontSize: 16,
    lineHeight: 35,
  },
})