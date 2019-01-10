import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'


const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16
  },
  itemContainer: {
    marginTop: 12,
    marginBottom: 0,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageCover: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  textLink: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.BLUE,
  },
})


export default styles
