/* global require */
import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native'

import styles from './styles'
const SETTING_ICON = require('../../../assets/images/Settings/Grey.png')

class DashboardNavigationBar extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>My feeds</Text>
        <TouchableOpacity>
          <Image source={SETTING_ICON} />
        </TouchableOpacity>
      </View>
    )
  }
}

export default DashboardNavigationBar
