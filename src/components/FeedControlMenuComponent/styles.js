import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  menuContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center'
  },
  settingItem: {
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 5
  },
  settingButtonText: {
    color: COLORS.PURPLE,
    fontSize: 14,
  },
  deleteButtonText: {
    color: COLORS.RED,
    fontSize: 14,
  },
  buttonView: {
    width: 92,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.PURPLE,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 15
  },
  buttonShareView: {
    marginBottom: 5
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
  }
})

export default styles
