import { StyleSheet, Platform } from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(46, 46, 46, 1)',
    flex: 1,
    paddingTop: ifIphoneX(70, 58),
    paddingLeft: 10,
    paddingRight: 10
  },
  melloIcon: {
    width: 33,
    height: 20,
    marginBottom: 40
  }
})

export default styles