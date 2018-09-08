import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingTop: 11,
    paddingBottom: 6,
    paddingLeft: 11,
    paddingRight: 6,
    borderRadius: 18,
  },
  title: {
   fontSize: 16,
   fontWeight: 'bold',
  },
  greyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.MEDIUM_GREY,
  },
  thumbnailsView: {
    width: '100%',
    height: 144,
    marginTop: 5,
  },
  thumbnails: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  bottomContainer: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  avatar: {
    marginRight: 5,
  },
  text: {
    fontSize: 14,
    color: COLORS.MEDIUM_GREY,
    marginRight: 5 
  },
  dotIcon: {
    marginRight: 5,
    color: COLORS.MEDIUM_GREY,
  }
})

export default styles
