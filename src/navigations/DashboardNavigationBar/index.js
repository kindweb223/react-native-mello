/* global require */
import React from 'react'
import {
  View,
  Text,
  Image,
  Platform,
  StatusBar,
  TouchableOpacity,
  Animated
} from 'react-native'

import PropTypes from 'prop-types'
import styles from './styles'
const SEARCH_ICON = require('../../../assets/images/Search/Grey.png')
const SETTING_ICON = require('../../../assets/images/Settings/Grey.png')

class DashboardNavigationBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      animation: new Animated.Value(),
      mode: 'Normal'
    }
  }

  render () {
    const { mode } = this.props

    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" backgroundColor="blue" />}
        {Platform.OS === 'android' && (
          <View style={styles.statusBarUnderlay} />
        )}

        {mode === 'normal' && (
          [
            <View key="1" style={styles.navbarView}>
              <Image source={SEARCH_ICON} />
            </View>,
            <View key="2" style={styles.titleView}>
              <Text style={styles.title}>My feeds</Text>
              <TouchableOpacity>
                <Image source={SETTING_ICON} />
              </TouchableOpacity>
            </View>
          ]
        )}

        {mode === 'mini' && (
          <View style={styles.miniNavbarView}>
            <Image source={SEARCH_ICON} />
            <Text style={styles.miniTitle}>My feeds</Text>
            <TouchableOpacity>
              <Image source={SETTING_ICON} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    )
  }
}

DashboardNavigationBar.defaultProps = {
  mode: 'normal'
}

DashboardNavigationBar.propTypes = {
  mode: PropTypes.string
}

export default DashboardNavigationBar
