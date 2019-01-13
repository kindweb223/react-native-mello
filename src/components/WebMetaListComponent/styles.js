import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'


const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 15
  },
  itemContainer: {
    height: 40,
    marginBottom: 12,
    backgroundColor: COLORS.LIGHT_SOFT_GREY,
    borderRadius: 5,
    marginRight: 50 
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
    color: '#000',
  },
})


export default styles
