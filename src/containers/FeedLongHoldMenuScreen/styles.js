import { StyleSheet } from 'react-native'
export const hairlineWidth = StyleSheet.hairlineWidth

export default {
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.4,
    backgroundColor: '#000'
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent'
  },
  body: {
    marginHorizontal: 5,
    marginBottom: 20,
    alignSelf: 'flex-end',
    borderRadius: 14,
    backgroundColor: 'transparent'
  },
  titleBox: {
    height: 50,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#c2c2c2',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  titleText: {
    color: '#A2A5AE',
    textAlign: 'center',
    fontSize: 13
  },
  buttonBox: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopWidth: 0,
  },
  buttonText: {
    fontSize: 20,
    color: '#FF3626',
  },
  cancelButtonBox: {
    height: 50,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 10
  }
}
