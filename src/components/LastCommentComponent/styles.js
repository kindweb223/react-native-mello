import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 13,
  },
  commentTextView: {
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
    lineHeight: 21,
  },
  viewAllContainer: {
    marginLeft: 33,
    marginBottom: 64
  },
})

export default styles
