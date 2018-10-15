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
    marginLeft: 26,
    marginRight: 33
  },
  doll_feed_exist: {
    marginBottom: -40,
    marginLeft: 26,
    marginRight: 33
  },
  doll_card: {
    marginBottom: -125,
    marginRight: 27
  },
  bubbleImageView: {
    flex: 1,
    marginRight: CONSTANTS.PADDING
  },
  bubbleView: {
    width: '100%'
  },
  bubbleContent: {
    flex: 1,
    paddingLeft: 20,
    marginRight: 30,
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 16,
    lineHeight: 24
  },
  videoBtn: {
    width: '100%'
  },
  videoBtnText: {
    fontWeight: 'bold',
    color: COLORS.PURPLE,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    width: '100%'
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
  },
  video: {
    display: 'none'
  }
})

export default styles
