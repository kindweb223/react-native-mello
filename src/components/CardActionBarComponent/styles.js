import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: CONSTANTS.ACTION_BAR_HEIGHT,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'transparent',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  plusButtonIcon: {
    color: '#fff',
    fontSize: 20,
  },
  moveButtonContainer: {
    width: 100,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.PURPLE,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 14
  },
  settingMenu: {
    margin: 0,
  },
  moreButtonContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  settingMenuContainer: {
    position: 'absolute',
    bottom: 98,
    borderRadius: 20,
    backgroundColor: '#fff',
    paddingVertical: 12,
    right: (CONSTANTS.SCREEN_WIDTH - 150) / 2,
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
    paddingHorizontal: 24,
    paddingVertical: 12,
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
