import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  doll_feed: {
    marginBottom: -125,
    marginLeft: CONSTANTS.PADDING
  },
  doll_card: {
    marginBottom: -125
  },
  bubbleView: {
    marginTop: -125,
    marginRight: CONSTANTS.PADDING
  },
  bubbleContent: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 40,
    bottom: 30,
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 16,
    marginRight: 20
  },
  videoBtn: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  videoBtnText: {
    fontWeight: 'bold',
    color: COLORS.PURPLE,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5
  },
  newFeedBtn: {
    width: '90%',
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.PURPLE,
    alignItems: 'center',
    justifyContent: 'center'
  },
  newFeedBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500'
  }
})

export default styles
