import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 13,
  },
  commentTextView: {
    flex: 1,
    marginLeft: 9
  },
  commenterName: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: 'bold'
  },
  commentText: {
    color: COLORS.DARK_GREY,
    fontSize: 14,
    lineHeight: 21
  },
  viewAllContainer: {
    marginLeft: 33,
    marginBottom: 64
  },
})

export default styles
