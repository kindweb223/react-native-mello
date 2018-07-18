import React from 'react'
import {
  View
} from 'react-native'

import PropTypes from 'prop-types'
import styles from './styles'
import FeedCoverImageComponent from '../FeedCoverImageComponent'
import FeedItemTitleComponent from '../FeedItemTitleComponent'

const FeedItemComponent = ({ item }) => (
  <View style={styles.container}>
    {item.coverImages && (
      <View style={styles.thumbnailsView}>
        <FeedCoverImageComponent data={item.coverImages} />
      </View>
    )}
    <FeedItemTitleComponent data={item} />
  </View>
)

FeedItemComponent.propTypes = {
  item: PropTypes.objectOf(PropTypes.any)
}

export default FeedItemComponent
