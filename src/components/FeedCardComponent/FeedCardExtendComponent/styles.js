import { StyleSheet } from 'react-native'
import COLORS from '../../../service/colors'
import CONSTANTS from '../../../service/constants'

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingTop: 16,
    paddingBottom: 17,
    paddingHorizontal: 11,
    borderRadius: 18
  },
  title: {
   fontSize: 16,
   lineHeight: 22,
  },
  greyTitle: {
    fontSize: 16,
    color: COLORS.MEDIUM_GREY,
  },
  thumbnailsView: {
    width: '100%',
    height: 144,
    marginTop: 4,
    marginBottom: 8
  },
  thumbnails: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  bottomContainer: {
    marginTop: 3,
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
    marginRight: 10,
  },
  text: {
    fontSize: 14,
    color: COLORS.MEDIUM_GREY,
    lineHeight: 21,
    marginRight: 5 
  },
  dotIcon: {
    marginRight: 5,
    color: COLORS.MEDIUM_GREY,
  },
  linkStyle: {
    color: '#000'
  }
})

export default styles
