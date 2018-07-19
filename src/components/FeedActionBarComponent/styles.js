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
    width: 270,
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
    fontSize: 16
  },
  settingMenuView: {
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingVertical: 12,
    width: 130,
    position: 'absolute',
    bottom: 70,
    right: 0,
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
    paddingVertical: 12,
  },
  settingButtonText: {
    color: COLORS.PURPLE,
    fontSize: 16,
  },
  deleteButtonText: {
    color: COLORS.RED,
    fontSize: 16,
  }
})

export default styles
