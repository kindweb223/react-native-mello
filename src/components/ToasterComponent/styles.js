import { StyleSheet, Platform } from 'react-native'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5
      },
      android: {
        elevation: 20
      }
    }),
    paddingHorizontal: 16,
    width: '100%',
    height: 50,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: CONSTANTS.ACTION_BAR_HEIGHT,
  },
  titleView: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    flex: 1,
    color: '#222'
  },
  buttonView: {
    marginLeft: 20,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    color: '#4A00CD',
    fontSize: 16,
    fontWeight: 'bold'
  }
})

export default styles
