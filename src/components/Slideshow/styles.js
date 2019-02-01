import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    marginTop: 0
  },
  mainContentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  renderButtonWrapper: {
    marginBottom: -30
  },
  bubbleView: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bubbles: {
    width: 6,
    height: 6,
    borderRadius: 3,
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
