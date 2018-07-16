import React from 'react'
import {
  View,
  Text,
  Platform,
  StatusBar
} from 'react-native'

import PropTypes from 'prop-types'
import styles from './styles'

class DashboardNavigationBar extends React.Component {
  render () {
    const { mode } = this.props

    return (
      <View style={mode === 'normal' ? styles.container : styles.miniContainer}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        {Platform.OS === 'android' && (
          <View style={styles.statusBarUnderlay} />
        )}

        {mode === 'normal'
          ? <View style={styles.subContainer}>
              <View style={styles.searchView}>
              </View>
              <View style={styles.titleView}>
                <Text style={styles.title}>My feeds</Text>
              </View>
            </View>
          : <View style={styles.subContainer}>
              <View style={styles.searchView}>
              </View>
              <View style={styles.miniTitleView}>
                <Text style={styles.minilTitle}>My feeds</Text>
              </View>
            </View>
        }
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
