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
    paddingLeft: 16,
    position: 'absolute',
    top: 38,
  },
  headerTitle: {
    flex: 1,
    lineHeight: 24,
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
    marginTop: 4,
    color: COLORS.PRIMARY_BLACK
  },
  contentView: {
    width: '100%'
  },
  summaryView: {
    paddingHorizontal: CONSTANTS.PADDING,
    // marginTop: 10
  },
  summaryText: {
    fontSize: 14,
    color: COLORS.PRIMARY_BLACK
  },
  summaryPlaceHolderText: {
    fontSize: 14,
    color: COLORS.MEDIUM_GREY
  },
  tagView: {
    paddingHorizontal: CONSTANTS.PADDING,
    marginBottom: 10
  },
  imageView: {
    marginTop: 20,
    paddingHorizontal: CONSTANTS.PADDING,
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
    width: '100%',
    paddingHorizontal: 6,
    marginTop: 20
  },
  footerView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 4
  },
  footerLeftBtnView: {
    flexDirection: 'row'
  },
  btnView: {
    paddingHorizontal: 4,
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  collapseIconView: {
    width: 60,
    height: 25,
    alignItems: 'flex-start',
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
