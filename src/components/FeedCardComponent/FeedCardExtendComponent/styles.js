import { StyleSheet } from 'react-native'
import COLORS from '../../../service/colors'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 10,
    marginBottom: 6
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
    alignItems: 'center'
  },
  textHtmlIdea: {
    marginBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    width: '100%'
  }
})

export default styles
