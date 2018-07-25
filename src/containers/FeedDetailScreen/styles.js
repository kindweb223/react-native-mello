import { StyleSheet, Platform } from 'react-native'
import CONSTANTS from '../../service/constants'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  normalHeader: {
    height: 120,
  },
  miniHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  container: {
    flex: 1,
    paddingBottom: CONSTANTS.ACTION_BAR_HEIGHT,
  },
  emptyView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: CONSTANTS.SCREEN_HEIGHT - CONSTANTS.ACTION_BAR_HEIGHT - 200,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.MEDIUM_GREY,
    marginVertical: 20
  },
  detailView: {
    flex: 1,
    paddingVertical: 10
  },
  tagView: {
    marginVertical: 10,
  }
})

export default styles
