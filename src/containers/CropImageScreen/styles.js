import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const CIRCLE_SIZE = 70

export default {
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#fff'
  },
  body: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  headerView: {
    width: '100%',
    height: 50,
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: COLORS.LIGHT_GREY_LINE,
    marginBottom: 1,
  },
  closeButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  imageView: {
    width: '100%',
    position: 'absolute',
    left: 0,
    top: 51 + (CONSTANTS.SCREEN_HEIGHT - 150 - CONSTANTS.SCREEN_WIDTH) / 2,
  },
  image: {
    width: '100%',
    height: '100%'
  },
  footerView: {
    width: '100%',
    height: 90,
    position: 'absolute',
    left: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: CONSTANTS.PADDING
  },
  saveBtn: {
    height: 60,
    width: CONSTANTS.SCREEN_SUB_WIDTH,
    borderRadius: 14,
    backgroundColor: COLORS.PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff'
  }
}
