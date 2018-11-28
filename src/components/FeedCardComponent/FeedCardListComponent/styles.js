import { StyleSheet } from 'react-native'
import COLORS from '../../../service/colors'
import CONSTANTS from '../../../service/constants'

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  subContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
    paddingVertical: 13,
    paddingRight: 10,
    borderRadius: 18,
    backgroundColor: COLORS.LIGHT_SOFT_GREY
  },
  leftContainer: {
    flex: 1,
    justifyContent: 'space-between'
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
    marginLeft: 12,
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
  thumbnailsView: {
    width: '100%',
    width: 78,
    height: 78,
    marginLeft: 10
  },
  thumbnails: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  bottomView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
})

export default styles
