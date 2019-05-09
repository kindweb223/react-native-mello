import { StyleSheet, Platform } from 'react-native'
import CONSTANTS from '../../service/constants'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  androidContainer: {
    backgroundColor: 'transparent',
    width: CONSTANTS.SCREEN_WIDTH,
    paddingVertical: 20,
    height: 195,
    position: 'absolute',
    right: 0
  },
  iosContainer: {
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    width: CONSTANTS.SCREEN_WIDTH,
    height: 155,
    position: 'absolute',
    right: 0
  },
  tipBody: {
    backgroundColor: '#fff',
    width: CONSTANTS.SCREEN_WIDTH - 16,
    height: 144,
    marginLeft: 8,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 6,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  avatarIconView: {
    width: 47,
    height: 47,
    borderRadius: 24,
    backgroundColor: COLORS.LIGHT_PURPLE_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  avatarIcon: {
    width: 20,
    height: 40
  },
  contentView: {
    alignItems: 'flex-start',
    flex: 1,
    height: 47,
    paddingVertical: 1
  },
  title: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
    marginBottom: 6
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  buttonView: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 15
  },
  triangel: {
    position: 'absolute'
  }
})

export default styles
