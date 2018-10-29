import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'


const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  itemContainer: {
    flex: 1,
    height: 40,
    marginTop: 12,
    marginBottom: 0,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor:  COLORS.SOFT_GREY,
  },
  imageCover: {
    width: 24,
    height: 24,
  },
  textLink: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.BLUE,
    marginLeft: 12,
  },
})


export default styles
