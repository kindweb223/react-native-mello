import { StyleSheet, Platform } from 'react-native'

export default {
  overlay: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    left: 0,
    paddingHorizontal: 21,
    paddingVertical: 21,
    borderRadius: 18,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 8
      },
      android: {
        elevation: 20
      }
    })
  },
  button: {
    marginTop: 20
  }
}