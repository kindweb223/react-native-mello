import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    marginTop: 22,
    paddingHorizontal: CONSTANTS.PADDING,
  },
  title: {
   fontSize: 16,
   fontWeight: 'bold',
  },
  thumbnailsView: {
    width: '100%',
    height: 150,
    marginTop: 5,
  },
  thumbnails: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  bottomContainer: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
    marginLeft: 5 
  },
  iconView: {
    flexDirection: 'row',
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    color: COLORS.LIGHT_GREY,
    fontSize: 16,
  },
  iconText: {
    color: COLORS.MEDIUM_GREY,
    marginLeft: 5,
    fontSize: 15,
  }
})

export default styles
