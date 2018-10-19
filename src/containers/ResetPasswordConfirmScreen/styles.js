import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

export default {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnBack: {
    marginLeft: 10,
    width: 50,
    height: 30,
  },
  logo: {
    width: 30,
    height: 30
  },
  mailIcon: {
    marginBottom: 29
  },
  title: {
    fontSize: 28,
    lineHeight:29,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  subTitleView: {
    marginTop: 36
  },
  subTitle: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.MEDIUM_GREY,
    textAlign: 'center'
  },
  buttonView: {
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnSend: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.PURPLE
  }
}
