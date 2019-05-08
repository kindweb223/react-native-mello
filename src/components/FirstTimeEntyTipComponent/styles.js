import { StyleSheet, Platform } from 'react-native'
import CONSTANTS from '../../service/constants'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  androidContainer: {
    backgroundColor: 'transparent',
    width: CONSTANTS.SCREEN_WIDTH,
    paddingVertical: 20,
    height: 130,
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
    height: 90,
    position: 'absolute',
    right: 0
  },
  tipBody: {
    backgroundColor: '#fff',
    width: CONSTANTS.SCREEN_WIDTH - 16,
    height: 79,
    marginLeft: 8,
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarIconView: {
    width: 47,
    height: 47,
    borderRadius: 24,
    backgroundColor: COLORS.LIGHT_PURPLE_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  avatarIcon: {
    width: 20,
    height: 40
  },
  contentView: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flex: 1,
    height: 47,
    paddingVertical: 1
  },
  title: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  buttonView: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 8
  },
  triangel: {
    position: 'absolute'
  }
})

export default styles
