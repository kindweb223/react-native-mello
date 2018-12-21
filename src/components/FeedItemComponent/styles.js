import { StyleSheet } from 'react-native'
import CONSTANTS from '../../service/constants'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: CONSTANTS.PADDING,
    paddingVertical: 0
  },
  thumbnailsView: {
    width: '100%',
    height: (CONSTANTS.SCREEN_SUB_WIDTH - 3) / 4,
    marginBottom: 8,
    marginTop: 1
  },
})

export default styles
