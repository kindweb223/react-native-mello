import { StyleSheet, Platform } from 'react-native'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5
      },
      android: {
        elevation: 20
      }
    }),
    paddingHorizontal: 15,
    width: '100%',
    height: 50,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 50,
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
