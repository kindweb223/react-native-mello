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
    marginBottom: 8,
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'transparent'
  },
  rowContainer: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.TOASTER_GREY,
    borderRadius: 18,
    paddingHorizontal: 20
  },
  buttonView: {
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // width: 80,
    // backgroundColor: '#f00'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  shareIcon: {
    marginRight: 5
  },
  pinIcon: {
    marginRight: 5,
    transform: [{ rotate: '-90deg' }]
  },
  settingMenu: {
    margin: 0,
  },
  settingMenuView: {
    borderRadius: 20,
    backgroundColor: '#fff',
    width: 135,
    paddingVertical: 10,
    position: 'absolute',
    bottom: 54 + 28 + 20,
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
  },
  btnMenu: {
    paddingHorizontal: 8,
    paddingVertical: 4
  }
})

export default styles
