import { StyleSheet } from 'react-native'
import COLORS from '../../../service/colors'
import CONSTANTS from '../../../service/constants'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 16,
    paddingBottom: 17,
    paddingHorizontal: 11,
    borderRadius: 18,
    backgroundColor: COLORS.LIGHT_GREY_PLACEHOLDER
  },
  leftContainer: {
    flex: 1
  },
  title: {
   fontSize: 16,
   lineHeight: 22,
  },
  greyTitle: {
    fontSize: 16,
    color: COLORS.MEDIUM_GREY,
  },
  subView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 10
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
  },
  thumbnailsView: {
    width: '100%',
    width: 78,
    height: 78
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
