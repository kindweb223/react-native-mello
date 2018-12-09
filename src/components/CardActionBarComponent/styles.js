import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 54 + 28,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'transparent'
  },
  rowContainer: {
    height: 54,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.PURPLE,
    borderRadius: 18,
    paddingHorizontal: 10
  },
  plusButtonIcon: {
    color: '#fff',
    fontSize: 20,
  },
  buttonContainer: {
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 13
  },
  arrowIcon: {
    marginRight: 8
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
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
    bottom: CONSTANTS.ACTION_BAR_HEIGHT + 20,
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
