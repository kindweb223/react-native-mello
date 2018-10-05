import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  itemContainer: {
    marginBottom: 13,
  },
  textItemName: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: 'bold',
  },
  textItemComment: {
    fontSize: 14,
    lineHeight: 21,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },
  textAddComment: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.PURPLE,
    marginLeft: 11,
  },
})


export default styles
