import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

export default styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    paddingVertical: 20,
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
  saveButtonContainer: {
    width: 80,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.PURPLE,
    justifyContent: 'center',
  },
  textButton: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
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
