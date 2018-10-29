import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 11,
    borderRadius: 18
  },
  title: {
   fontSize: 16,
   fontWeight: '600',
   lineHeight: 22
  },
  greyTitle: {
    fontSize: 16,
    color: COLORS.MEDIUM_GREY,
  },
  thumbnailsView: {
    width: '100%',
    height: 144,
    marginVertical: 6
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
  },
  linkStyle: {
    color: '#000'
  }
})

export default styles
