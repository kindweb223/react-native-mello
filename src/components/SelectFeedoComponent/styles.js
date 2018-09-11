import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

export default styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
   },
  contentContainer: {
    borderRadius: 18,
    backgroundColor: '#fff',
  },
  topContainer: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  closeButtonWrapper: {
    paddingHorizontal: 4,
  },
  textButton: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 15,
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textTitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
  },
  itemContainer: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY_MODAL_BACKGROUND,
  },
  textItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
  },
})
