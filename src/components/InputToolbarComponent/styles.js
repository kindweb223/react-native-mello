import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  container: {
    margin: 16,
    backgroundColor: COLORS.SOFT_GREY,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 5,
  },
  rowContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 23,
    marginRight: 16,
    maxHeight: 100,
  },
})

export default styles
