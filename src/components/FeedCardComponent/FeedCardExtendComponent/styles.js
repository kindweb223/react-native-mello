import { StyleSheet } from 'react-native'
import COLORS from '../../../service/colors'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16
  },
  subContainer: {
    width: '100%',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: COLORS.LIGHT_SOFT_GREY,
    overflow: 'hidden'
  },
  thumbnailsView: {
    width: '100%'
  },
  thumbnails: {
    width: '100%',
    height: '100%'
  },
  contentContainer: {
    width: '100%',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 8,
  },
  title: {
   fontSize: 13,
   lineHeight: 17,
   fontWeight: '500'
  },
  greyTitle: {
    fontSize: 16,
    color: COLORS.MEDIUM_GREY,
  },
  subView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 4
  },
  avatar: {
    marginRight: 8,
  },
  text: {
    fontSize: 13,
    color: COLORS.MEDIUM_GREY,
    lineHeight: 17 
  },
  dotIcon: {
    marginRight: 5,
    color: COLORS.MEDIUM_GREY,
  },
  linkStyle: {
    color: '#000'
  },
  commentView: {
    marginLeft: -3,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
})

export default styles
