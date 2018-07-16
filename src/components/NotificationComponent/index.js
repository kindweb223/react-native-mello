import React from 'react'
import {
  View,
  Text,
} from 'react-native'

import PropTypes from 'prop-types'
import { Ionicons } from 'react-native-vector-icons'
import styles from './styles'

const NotificationComponent = ({ count }) => (
  <View style={styles.notificationView}>
    <Ionicons name="md-notifications" style={styles.notificationIcon} />
    <Text style={styles.notificationText}>{count}</Text>
  </View>
)

NotificationComponent.propTypes = {
  count: PropTypes.number.isRequired
}
export default NotificationComponent
