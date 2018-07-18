import React from 'react'
import {
  View,
  Text,
} from 'react-native'

import PropTypes from 'prop-types'
import { Foundation, Ionicons } from 'react-native-vector-icons'
import styles from './styles'

const FeedItemInviteeComponent = ({ data }) => (
  <View style={styles.container}>
    <View style={styles.titleView}>
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{data.headline}</Text>
    </View>

    <View style={styles.statsView}>
      <View style={styles.statsItemView}>
        <Ionicons name="md-person" style={[styles.feedIcon, styles.inActive]} />
        <Text style={[styles.feedText, styles.inActiveText]}>5</Text>
      </View>
      <View style={styles.statsItemView}>
        <Foundation name="credit-card"  style={[styles.feedIcon, styles.inActive]} />
        <Text style={[styles.feedText, styles.inActiveText]}>2</Text>
      </View>
    </View>

    <View style={styles.tagsView}>
    </View>
  </View>
)

FeedItemInviteeComponent.propTypes = {
  data: PropTypes.objectOf(PropTypes.any)
}

export default FeedItemInviteeComponent
