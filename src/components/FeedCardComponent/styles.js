import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  title: {
   fontSize: 18,
   fontWeight: 'bold',
   marginVertical: 10, 
  },
  thumbnailsView: {
    width: '100%',
    height: 150,
  },
  thumbnails: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  bottomContainer: {
    marginVertical: 10,
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
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  text: {
    fontSize: 15,
    color: COLORS.MEDIUM_GREY,
    marginRight: 10 
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
