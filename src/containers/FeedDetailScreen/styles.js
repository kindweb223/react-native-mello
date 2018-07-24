import { StyleSheet } from 'react-native'
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
    overflow: 'hidden'
  },
  container: {
    flex: 1,
    paddingBottom: CONSTANTS.ACTION_BAR_HEIGHT,
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingTop: 100
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.MEDIUM_GREY,
    marginVertical: 20
  },
  detailView: {
    flex: 1,
    paddingHorizontal: CONSTANTS.PADDING,
    paddingVertical: 10
  },
  collapseHeader: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  collapseHeaderText: {
    color: COLORS.MEDIUM_GREY,
    flex: 1,
    marginRight: 10,
    fontSize: 18,
  },
  arrowDownIcon: {
    fontSize: 20,
    color: COLORS.MEDIUM_GREY
  },
  contentText:{
    fontSize: 18
  }
})

export default styles
