import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 15,
  },
  textBack: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '500',
    marginLeft: 5,
    color: COLORS.PURPLE,
  },
  textTitle: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 15,
  },
  itemContainer: {
    marginHorizontal: 9,
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  itemContentContainer: {
    flex: 1,
    paddingHorizontal: 7,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  swipeItemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textsContainer: {
    flex: 1,
    marginLeft: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textItemName: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    color: COLORS.DARK_GREY,
  },
  textItemTime: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.DARK_GREY,
  },
  textItemComment: {
    fontSize: 16,
    lineHeight: 23,
  },

})


export default styles