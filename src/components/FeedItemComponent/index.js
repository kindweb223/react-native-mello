import React from 'react'
import {
  View
} from 'react-native'

import styles from './styles'
import FeedItemTitleComponent from '../FeedItemTitleComponent'

class FeedItemComponent extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.thumbnails} />
        <FeedItemTitleComponent />
        <FeedItemTitleComponent />
      </View>
    )
  }
}

export default FeedItemComponent
