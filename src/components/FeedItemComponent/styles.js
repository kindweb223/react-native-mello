import { StyleSheet } from 'react-native'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: CONSTANTS.PADDING,
  },
  thumbnailsView: {
    width: '100%',
    height: 150,
    marginBottom: 6,
  },
})

export default styles
