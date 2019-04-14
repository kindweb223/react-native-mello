import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 475,
    borderRadius: 18,
    backgroundColor: '#fff'
  },
  headerView: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  closeButtonView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  mainView: {
    paddingHorizontal: 24,
    paddingBottom: 25
  },
  iconView: {
    width: 94,
    height: 94,
  },
  shareIcon: {
    width: 50
  },
  title: {
    fontSize: 22,
    lineHeight: 26,
    paddingVertical: 20
  },
  subTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.ACTION_SHEET_TITLE
  },
  buttonView: {
    paddingHorizontal: 24,
    paddingBottom: 10,
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    marginHorizontal: 5,
  }
})

export default styles
