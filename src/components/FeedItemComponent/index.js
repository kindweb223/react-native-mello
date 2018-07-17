import React from 'react'
import {
  View,
  Image
} from 'react-native'

import PropTypes from 'prop-types'
import styles from './styles'
import FeedItemInviteeComponent from '../FeedItemInviteeComponent'

const FeedItemComponent = ({ item }) => (
  <View style={styles.container}>
    {item.owner.imageUrl && (
      <View style={styles.thumbnailsView}>
        <Image  style={styles.thumbnails} source={{ uri: item.owner.imageUrl }} />
      </View>
    )}

    <FeedItemInviteeComponent data={item} />
  </View>
)

FeedItemComponent.propTypes = {
  item: PropTypes.objectOf(PropTypes.any)
}

export default FeedItemComponent
