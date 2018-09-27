import { StyleSheet } from 'react-native'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: CONSTANTS.PADDING,
    marginBottom: 26
  },
  thumbnailsView: {
    width: '100%',
    height: 137,
    marginBottom: 6,
  },
})

export default styles
