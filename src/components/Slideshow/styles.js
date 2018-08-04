import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {

  },
  bubbleView: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bubbles: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
    alignSelf: 'center'
  },
  emptyBubble: {
    backgroundColor: '#999',
  },
  filledBubble: {
    backgroundColor: '#fff',
  }
})


export default styles
