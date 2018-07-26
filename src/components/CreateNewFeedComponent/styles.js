import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#00000020',
  },
  mainContentContainer: {
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 12,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  leftContentContainer: {
    paddingHorizontal: 12,
  },
  rightContentContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  textTitle: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '500',
    color: '#000',
  },
  textDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.DARK_GREY,
  },
});


export default styles
