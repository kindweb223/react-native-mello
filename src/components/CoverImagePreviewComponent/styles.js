import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  previewModal: {
    margin: 0,
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%'
  },
  imageCover: {
    width: '100%',
    height: '100%'
  },
  imageNumberContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 20
      }
    }),
  },
  textImageNumber: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.DARK_GREY,
  },
})


export default styles
