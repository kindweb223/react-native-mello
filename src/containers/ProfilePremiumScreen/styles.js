import { StyleSheet, Platform } from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

export default {
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_YELLOW
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  headerTitle: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 5
  },
  scrollView: {
    flex: 1
  },
  scrollInnerView: {
    paddingHorizontal: 32,
    paddingTop: 25
  },
  topView: {
    marginBottom: 60
  },
  title: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: 'bold',
    marginBottom: 13,
    marginTop: 16
  },
  subTitle: {
    fontSize: 18,
    lineHeight: 25,
    fontWeight: '600',
    marginTop: 32
  },
  description: {
    fontSize: 16,
    lineHeight: 22
  },
  premiumItem: {
    marginBottom: 60
  },
  premiumIcon: {
    height: 64
  },
  buttonView: {
    marginTop: 17,
    marginBottom: ifIphoneX(35, 17),
    paddingHorizontal: CONSTANTS.PADDING,
    width: '100%'
  },
  button: {
    borderRadius: 14,
    width: '100%',
    height: 61,
    backgroundColor: COLORS.DARK_YELLOW,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600'
  },
}
