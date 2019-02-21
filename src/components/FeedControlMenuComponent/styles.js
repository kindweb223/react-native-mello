import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  menuContainer: {
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 5
  },
  settingButtonText: {
    color: COLORS.PRIMARY_BLACK,
    fontSize: 14,
  },
  deleteButtonText: {
    color: COLORS.RED,
    fontSize: 14,
  },
  menuIcon: {
    width: 24,
    height: 24,
    marginRight: 15,
    marginLeft: 5
  },
  shareIcon: {
    color: '#fff',
    fontSize: 14,
  },
  pinIcon: {
    color: '#fff',
    fontSize: 16,
    transform: [{ rotate: '-90deg' }]
  },
  buttonText: {
    color: '#fff',
    fontSize: 14
  },
  separator: {
    height: 1,
    backgroundColor: '#EFEFEF',
    marginVertical: 10
  }
})

export default styles
