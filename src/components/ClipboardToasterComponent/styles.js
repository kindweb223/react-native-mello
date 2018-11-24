import { StyleSheet, Platform } from 'react-native'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#696974',
    // ...Platform.select({
    //   ios: {
    //     shadowColor: '#000',
    //     shadowOffset: { height: 5 },
    //     shadowOpacity: 0.3,
    //     shadowRadius: 5
    //   },
    //   android: {
    //     elevation: 20
    //   }
    // }),
    // width: CONSTANTS.SCREEN_SUB_WIDTH,
    // marginLeft: CONSTANTS.PADDING,
    // borderRadius: 16,
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    // position: 'absolute',
    // bottom: CONSTANTS.ACTION_BAR_HEIGHT,
    // zIndex: 1,
    
    position: 'absolute',
    bottom: CONSTANTS.ACTION_BAR_HEIGHT,
    zIndex: 1,
  },
  mainContainer: {
    backgroundColor: '#696974',
    width: CONSTANTS.SCREEN_SUB_WIDTH,
    // marginLeft: CONSTANTS.PADDING,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  textTitle: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  textsContainer: {
    flex: 1,
    marginLeft: 18,
    justifyContent: 'center'
  },
  textDescription: {
    fontSize: 12,
    lineHeight: 14,
    color: '#FFFFFF',
  }
})

export default styles
