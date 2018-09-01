import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    marginHorizontal: 10,
  },
  itemContainer: {
    flex: 1,
    height: 94,
    paddingTop: 10,
    marginBottom: 5,
    marginLeft: 10,
    paddingRight: 10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor:  COLORS.SOFT_GREY,
  },
  imageCover: {
    width: 84,
    height: 84,
    borderRadius: 5,
  },
  infoContainer: {
    flex: 1,
    padding: 16,
    marginRight: 34,
    justifyContent: 'center',
  },
  textTitle: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    color: '#000',
  },
  textDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.DARK_GREY,
  },
  closeButtonContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 26,
    height: 26,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeSubButtonContainer: {
    width: 22,
    height: 22,
    borderRadius: 12,
    backgroundColor: COLORS.BLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },
})


export default styles
