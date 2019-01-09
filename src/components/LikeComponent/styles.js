import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  container: {
    height: 30,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  likeContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    position: 'absolute',
    top: 6,
    fontSize: 14,
    color: COLORS.MEDIUM_GREY,
  },
})

export default styles
