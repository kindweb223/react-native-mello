import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  container: {
    height: 30,
    width: 45,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
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
    width: 16,
    height: 16,
  },
  iconText: {
    position: 'absolute',
    top: 6,
    left: 30,
    fontSize: 14,
    color: COLORS.MEDIUM_GREY,
  },
})

export default styles
