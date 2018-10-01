import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const NAV_BAR_HEIGHT = 60

const styles = StyleSheet.create({
  collapseView: {
    width: '100%'
  },
  collapseHeaderView: {
    width: '100%'
  },
  collpaseHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerTitle: {
    flex: 1,
    lineHeight: 28,
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.PRIMARY_BLACK
  },
  contentView: {
    width: '100%'
  },
  summaryText: {
    fontSize: 16,
    marginVertical: 10
  },
  tagView: {
    marginVertical: 10
  },
  imageView: {
    marginVertical: 10
  },
  feedImage: {
    width: 105,
    height: 105,
    marginRight: 16
  },
  feedLastImage: {
    width: 105,
    height: 105,
  },
  image: {
    width: '100%',
    height: '100%'
  },
  attachView: {
    width: '100%'
  },
  footerView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  collapseIconView: {
    width: 60,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewModal: {
    margin: 0,
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%'
  }
})

export default styles
