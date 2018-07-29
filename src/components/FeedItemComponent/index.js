import React from 'react'
import {
  View
} from 'react-native'

import PropTypes from 'prop-types'
import styles from './styles'
import FeedCoverImageComponent from './FeedCoverImageComponent'
import FeedItemContentComponent from './FeedItemContentComponent'

const FeedItemComponent = ({ item, pinFlag }) => (
  <View style={styles.container}>
    {item.coverImages && item.coverImages.length > 0 && (
      <View style={styles.thumbnailsView}>
        <FeedCoverImageComponent data={item.coverImages} />
      </View>
    )}
    <FeedItemContentComponent data={item} pinFlag={pinFlag} />
  </View>
)

FeedItemComponent.propTypes = {
  item: PropTypes.objectOf(PropTypes.any),
  pinFlag: PropTypes.bool.isRequired
}

export default FeedItemComponent
