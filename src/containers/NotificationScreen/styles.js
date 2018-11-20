import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  textTitle: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  contentFlatList: {
    paddingBottom: 16
  },
  itemView: {
    paddingTop: 16
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.SEPARATOR_GREY
  }
})

export default styles
