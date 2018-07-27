import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  collapseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: CONSTANTS.PADDING,
    marginTop: 10,
    justifyContent: 'space-between',
    borderColor: COLORS.LIGHT_GREY,
    height: 30,
    borderBottomWidth: 1
  },
  noncollapseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: CONSTANTS.PADDING,
    marginTop: 10,
    justifyContent: 'space-between',
    borderColor: COLORS.LIGHT_GREY,
    borderBottomWidth: 0
  },
  headerText: {
    color: '#000',
    flex: 1,
    marginRight: 10,
    fontSize: 16,
  },
  collapseHeaderText: {
    color: COLORS.MEDIUM_GREY,
    flex: 1,
    marginRight: 10,
    fontSize: 16,
  },
  arrowDownIcon: {
    fontSize: 20,
    color: COLORS.MEDIUM_GREY,
    marginTop: 5,
  },
  contentText:{
    fontSize: 16
  },
  contentView: {
    paddingHorizontal: CONSTANTS.PADDING,
    paddingBottom: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: '#fff',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10
      },
      android: {
        elevation: 20
      }
    })
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
  attachItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
  },
  attachIcon: {
    width: 30,
    height: 30,
  },
  attachFileText: {
    marginLeft: 5,
    fontSize: 16
  },
  footerView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  collapseIconView: {
    width: 60,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowUpIcon: {
    fontSize: 25,
    color: COLORS.MEDIUM_GREY,
  },
  previewModal: {
    margin: 0,
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%'
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  previewImage: {
    width: '100%',
    height: 210,
  },
  closeIconView: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  closeIcon: {
    color: '#fff',
    fontSize: 40
  },
})

export default styles
