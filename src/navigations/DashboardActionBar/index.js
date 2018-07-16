import React from 'react'
import {
  View,
  TouchableOpacity
} from 'react-native'

import PropTypes from 'prop-types'
import { Feather, MaterialCommunityIcons } from 'react-native-vector-icons'
import NotificationComponent from '../../components/NotificationComponent'
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
          <NotificationComponent count={10} />
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
