import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  list: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden'
  },
  thumbnails: {
    flex: 1,
    overflow: 'hidden'
  },
  first: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  last: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  image: {
    flex: 1
  }
})

export default styles
