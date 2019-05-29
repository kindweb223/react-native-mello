import { StyleSheet } from 'react-native'
import COLORS from '../../../service/colors'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  selected: {
    borderWidth: 1,
    borderColor: COLORS.PURPLE,
    borderRadius: 16
  },
  subContainer: {
    width: '100%',
    justifyContent: 'center',
    borderRadius: 16,
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
    paddingTop: 10
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
    marginBottom: 4,
    width: '100%'
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
    alignItems: 'center',
    backgroundColor: COLORS.LIGHT_SOFT_GREY,
    paddingBottom: 8
  },
  htmlView: {
    // marginBottom: 4,
    width: '100%'
  },
  textHtmlIdea: {
    position: 'absolute',
    left: 0,
    top: 0,
    marginBottom: 0,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 0,
    paddingBottom: 0,
    width: '100%'
  },
})

export default styles
