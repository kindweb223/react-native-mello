import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  collapseHeader: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: CONSTANTS.PADDING,
    justifyContent: 'space-between',
    borderColor: COLORS.LIGHT_GREY
  },
  collapseHeaderText: {
    color: COLORS.MEDIUM_GREY,
    flex: 1,
    marginRight: 10,
    fontSize: 18,
  },
  arrowDownIcon: {
    fontSize: 20,
    color: COLORS.MEDIUM_GREY,
    marginTop: 5,
  },
  contentText:{
    fontSize: 18
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
        shadowRadius: 5
      },
      android: {
        elevation: 20
      }
    })
  },
  footerView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  arrowUpIcon: {
    fontSize: 25,
    color: COLORS.MEDIUM_GREY,
  },
  tagView: {
    marginVertical: 10
  },
  imageView: {
    marginVertical: 10
  },
  feedImage: {
    width: 100,
    height: 100,
    marginRight: 16
  },
  feedLastImage: {
    width: 100,
    height: 100,
  },
  image: {
    width: '100%',
    height: '100%'
  }
})

export default styles
