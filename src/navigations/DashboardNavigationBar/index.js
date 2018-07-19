import React from 'react'
import {
  View,
  Text,
  Platform,
  StatusBar,
  TouchableOpacity,
  Animated
} from 'react-native'

import PropTypes from 'prop-types'
import styles from './styles'
import { FontAwesome } from 'react-native-vector-icons'

class DashboardNavigationBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      animation: new Animated.Value(),
      mode: 'Normal'
    }
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   if (prevState.mode !== nextProps.mode) {
  //     Animated.spring(prevState.animation, {toValue: nextProps.mode === 'mini' ? 0 : 100}).start()
  //   }
  //   return {
  //     mode: nextProps.mode
  //   }
  // }

  render () {
    const { mode } = this.props

    return (
      <View style={mode === 'normal' ? styles.container : styles.miniContainer}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        {Platform.OS === 'android' && (
          <View style={styles.statusBarUnderlay} />
        )}

        {mode === 'normal' && (
            <View style={styles.subContainer}>
              <View style={styles.navbarView}>
                <FontAwesome name="search" style={styles.searchIcon} />
              </View>
              <View style={styles.titleView}>
                <Text style={styles.title}>My feeds</Text>
                <TouchableOpacity style={styles.settingButton}>
                  <FontAwesome name="cog" style={styles.setting} />
                </TouchableOpacity>
              </View>
            </View>
        )}

        {mode === 'mini' && (
          <View style={styles.miniNavbarView}>
            <Text style={styles.miniTitle}>My feeds</Text>
            <TouchableOpacity style={styles.settingButton}>
              <FontAwesome name="cog" style={styles.setting} />
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
