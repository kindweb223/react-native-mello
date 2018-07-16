import React from 'react'
import {
  View,
} from 'react-native'

import PropTypes from 'prop-types'
import styles from './styles'

class DashboardActionBar extends React.Component {
  render () {
    const { filtering } = this.props

    return (
      <View style={[styles.container, filtering ? styles.filterContainer : styles.actionContainer]}>
        {filtering && (
          <View style={styles.filteringView}>
          </View>
        )}
        <View style={styles.actionView}>
        </View>
      </View>
    )
  }
}

DashboardActionBar.defaultProps = {
  filtering: true
}

DashboardActionBar.propTypes = {
  filtering: PropTypes.bool
}

export default DashboardActionBar
