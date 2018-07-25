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
  all: {
    borderRadius: 10,
  },
  first: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  middle: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#fff'
  },
  last: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderLeftWidth: 1,
    borderColor: '#fff'
  },
  image: {
    flex: 1
  }
})

export default styles
