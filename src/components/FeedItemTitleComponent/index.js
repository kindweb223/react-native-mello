import React from 'react'
import {
  View,
  Text,
} from 'react-native'

import PropTypes from 'prop-types'
import { Foundation, Ionicons, Octicons } from 'react-native-vector-icons'
import styles from './styles'

const FeedItemTitleComponent = ({ data }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleView}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{data.headline}</Text>
        <View style={styles.pinView}>
          <Octicons name="pin" style={[styles.pinIcon, styles.active]} />
        </View>
      </View>

      <View style={styles.statsView}>
        <View style={styles.statsItemView}>
          <Ionicons name="md-person" style={[styles.feedIcon, styles.inActive]} />
          <Text style={[styles.feedText, styles.inActiveText]}>1</Text>
        </View>
        <View style={styles.statsItemView}>
          <Foundation name="credit-card"  style={[styles.feedIcon, styles.inActive]} />
          <Text style={[styles.feedText, styles.inActiveText]}>1</Text>
        </View>
      </View>

      <View style={styles.tagsView}>
      </View>
    </View>
  )
}

FeedItemTitleComponent.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired
}

export default FeedItemTitleComponent
