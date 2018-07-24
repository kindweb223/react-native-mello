import React from 'react'
import {
  View
} from 'react-native'

import PropTypes from 'prop-types'
import styles from './styles'
import FeedCoverImageComponent from '../FeedCoverImageComponent'
import FeedItemTitleComponent from '../FeedItemTitleComponent'

const FeedItemComponent = ({ item, pinFlag }) => (
  <View style={styles.container}>
    {item.coverImages && item.coverImages.length && (
      <View style={styles.thumbnailsView}>
        <FeedCoverImageComponent data={item.coverImages} />
      </View>
    )}
    <FeedItemTitleComponent data={item} pinFlag={pinFlag} />
  </View>
)

FeedItemComponent.propTypes = {
  item: PropTypes.objectOf(PropTypes.any),
  pinFlag: PropTypes.bool.isRequired
}

export default FeedItemComponent
