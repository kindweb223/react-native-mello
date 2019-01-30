import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../../service/colors'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 475,
    borderRadius: 18,
    backgroundColor: '#fff',
    overflow: 'hidden'
  },
  headerView: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: 16
  },
  closeButtonView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  mainView: {
    padding: 24
  },
  iconView: {
    width: 94,
    height: 94,
    borderRadius: 47,
    backgroundColor: COLORS.LIGHT_PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5
  },
  shareIcon: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 22,
    lineHeight: 26,
    paddingVertical: 16
  },
  subTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.ACTION_SHEET_TITLE
  },
  buttonView: {
    padding: 24,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  button: {
    width: '100%',
    height: 61,
    borderRadius: 14,
    backgroundColor: COLORS.PURPLE,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    lineHeight: 24,
    fontWeight: '600'
  }
})

export default styles
