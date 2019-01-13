import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

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
  commentList: {
    flex: 1,
    overflow: 'hidden'
  },
  gradientView: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 60,
    left: 30
  }
})

export default styles
