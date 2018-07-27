import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: CONSTANTS.ACTION_BAR_HEIGHT,
    width: '100%',
    backgroundColor: 'transparent',
    alignItems: 'center',
    paddingVertical: 8,
    position: 'absolute',
    bottom: 0,
  },
  innerContainer: {
    width: 280,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  plusButton: {
    borderRadius: 21,
    backgroundColor: COLORS.PURPLE,
    alignItems: 'center'
  },
  plusButtonIcon: {
    color: '#fff',
    fontSize: 20,
  },
  iconStyle: {
    width: 42,
    height: 42,
    justifyContent: 'center',
  },
  buttonView: {
    width: 100,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.PURPLE,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  shareIcon: {
    color: '#fff',
    fontSize: 18,
  },
  pinIcon: {
    color: '#fff',
    fontSize: 18,
    transform: [{ rotate: '-90deg' }]
  },
  buttonText: {
    color: '#fff',
    fontSize: 14
  },
  settingMenu: {
    margin: 0,
  },
  settingMenuView: {
    borderRadius: 20,
    backgroundColor: '#fff',
    width: 122,
    height: 167,
    paddingTop: 10,
    position: 'absolute',
    bottom: 100,
    right: (CONSTANTS.SCREEN_WIDTH - 280) / 2,
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
    })
  },
  settingItem: {
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  settingButtonText: {
    color: COLORS.PURPLE,
    fontSize: 14,
  },
  deleteButtonText: {
    color: COLORS.RED,
    fontSize: 14,
  }
})

export default styles
