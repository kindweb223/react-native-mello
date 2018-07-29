import React from 'react'
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native'

import PropTypes from 'prop-types'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import styles from './styles'

class DashboardActionBar extends React.Component {
  render () {
    const { filtering } = this.props

    return (
      <View style={[styles.container, filtering ? styles.filterContainer : styles.actionContainer]}>
        {filtering && (
          <View style={styles.filteringView}>
            <TouchableOpacity>
              <View style={[styles.iconStyle, styles.filterButton]}>
                <MaterialCommunityIcons name="filter-variant" style={styles.filteringButtonIcon} />
              </View>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.actionView}>
          <View style={styles.notificationView}>
            <Ionicons name="md-notifications" style={styles.notificationIcon} />
            <Text style={styles.notificationText}>0</Text>
          </View>
          <View style={styles.plusButtonView}>
            <TouchableOpacity>
              <View style={[styles.iconStyle, styles.plusButton]}>
                <Feather name="plus" style={styles.plusButtonIcon} />
              </View>
            </TouchableOpacity>
          </View>
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
