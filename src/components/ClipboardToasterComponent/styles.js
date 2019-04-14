import { StyleSheet, Platform } from 'react-native'
import CONSTANTS from '../../service/constants'
import COLORS from '../../service/colors'

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
    bottom: 0,
    width: CONSTANTS.SCREEN_WIDTH,
    zIndex: 1,
  },
  mainContainer: {
    backgroundColor: COLORS.TOASTER_GREY,
    marginLeft: 8,
    marginRight: 8,
    width: CONSTANTS.SCREEN_WIDTH - CONSTANTS.PADDING,
    height: 80,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  textTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    color: '#FFF'
  },
  textsContainer: {
    flex: 1,
    marginLeft: 18,
    justifyContent: 'center'
  },
  textDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: '#FFF',
  }
})

export default styles
