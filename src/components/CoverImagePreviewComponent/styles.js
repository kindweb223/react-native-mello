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
  progressView: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#E3E4E7'
  },
  progressContainer: {
    position: 'absolute',
    left: 24,
    bottom: 24,
    width: 171,
    height: 20,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center'
  },
})


export default styles
