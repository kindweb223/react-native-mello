import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  safeView: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff'
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
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
