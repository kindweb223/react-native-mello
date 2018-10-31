import { StyleSheet } from 'react-native'
import CONSTANTS from '../../service/constants'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: CONSTANTS.PADDING
  },
  thumbnailsView: {
    width: '100%',
    height: 137,
    marginVertical: 8,
  },
})

export default styles
