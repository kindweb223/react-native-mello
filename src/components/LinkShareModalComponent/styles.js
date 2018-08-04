import { StyleSheet, Platform } from 'react-native'
import CONSTANTS from '../../service/constants'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingVertical: 30,
    paddingHorizontal: CONSTANTS.PADDING,
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#fff'
  },
  headerView: {
    marginBottom: 25,
    width: '100%'
  },
  listItem: {
    width: CONSTANTS.SCREEN_SUB_WIDTH,
    height: 61,
    borderRadius: 14,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemNormal: {
    backgroundColor: '#F4F4F4'
  },
  itemLast: {
    backgroundColor: '#FFE5E5'
  },
  title: {
    fontSize: 18,
    fontWeight: '600'
  },
  titleNormal: {
    color: COLORS.PURPLE
  },
  titleLast: {
    color: '#F00'
  },
  description: {
    color: COLORS.PURPLE,
    fontSize: 14
  }
})

export default styles
