import React from 'react'
import {
  View,
  Text,
} from 'react-native'

import { MaterialCommunityIcons, FontAwesome, Ionicons } from 'react-native-vector-icons'
import styles from './styles'

class FeedItemTitleComponent extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleView}>
          <Text style={styles.title}>Feed Title</Text>
        </View>

        <View style={styles.statsView}>
          <View style={styles.statsItemView}>
            <Ionicons name="md-person" style={[styles.feedIcon, styles.active]} />
            <Text style={[styles.feedText, styles.active]}>5</Text>
          </View>
          <View style={styles.statsItemView}>
            <FontAwesome name="square"  style={[styles.feedIcon, styles.active]} />
            <Text style={[styles.feedText, styles.active]}>2</Text>
          </View>
          <View style={styles.statsItemView}>
            <MaterialCommunityIcons name="message" style={[styles.feedIcon, styles.inActive]} />
            <Text style={[styles.feedText, styles.inActive]}>3</Text>
          </View>
        </View>

        <View style={styles.tagsView}>
        </View>
      </View>
    )
  }
}

export default FeedItemTitleComponent
