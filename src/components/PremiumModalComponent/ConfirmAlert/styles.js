import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../../service/colors'

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  modalContainer: {
    width: 270,
    borderRadius: 14,
    backgroundColor: '#F8F8F8'
  },
  titleContainer: {
    width: '100%',
    height: 101,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: '#D3D3D3'
  },
  titleText: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    textAlign: 'center'
  },
  buttonContainer: {
    width: '100%',
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  buttonView: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  discoverButton: {
    borderLeftWidth: 1,
    borderColor: '#D3D3D3'
  },
  buttonText: {
    color: COLORS.BLUE,
    fontSize: 17,
    lineHeight: 22,
  }
})

export default styles
