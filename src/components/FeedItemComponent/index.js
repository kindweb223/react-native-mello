import React from 'react'
import {
  View
} from 'react-native'

import PropTypes from 'prop-types'
import styles from './styles'
import FeedCoverImageComponent from './FeedCoverImageComponent'
import FeedItemContentComponent from './FeedItemContentComponent'

const FeedItemComponent = ({ item, pinFlag, page, clickEvent }) => (
  <View style={
    [
      styles.container,
      clickEvent === 'long' ? { paddingVertical: 11, paddingHorizontal: 11 } : { paddingVertical: 0 }
    ]
  }>
    {item.coverImages && item.coverImages.length > 0 && (
      <View style={styles.thumbnailsView}>
        <FeedCoverImageComponent data={item.coverImages} />
      </View>
    )}
    <FeedItemContentComponent data={item} pinFlag={pinFlag} page={page} clickEvent={clickEvent} />
  </View>
)

FeedItemComponent.defaultProps = {
  clickEvent: 'normal'
}

FeedItemComponent.propTypes = {
  clickEvent: PropTypes.string,
  item: PropTypes.objectOf(PropTypes.any),
  pinFlag: PropTypes.bool.isRequired
}

export default FeedItemComponent
