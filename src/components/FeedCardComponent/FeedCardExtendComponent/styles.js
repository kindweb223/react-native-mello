import { StyleSheet } from 'react-native'
import COLORS from '../../../service/colors'
import CONSTANTS from '../../../service/constants'

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
    paddingVertical: 10,
  },
  title: {
   fontSize: 15,
   lineHeight: 19,
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
    paddingHorizontal: 12,
    marginTop: 2,
    marginBottom: 5
  },
  avatar: {
    marginRight: 10,
  },
  text: {
    fontSize: 14,
    color: COLORS.MEDIUM_GREY,
    lineHeight: 19,
    marginRight: 5 
  },
  dotIcon: {
    marginRight: 5,
    color: COLORS.MEDIUM_GREY,
  },
  linkStyle: {
    color: '#000'
  },
  bottomView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
})

export default styles
