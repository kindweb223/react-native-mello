import React from 'react'
import {
  Image,
  View
} from 'react-native'

import PropTypes from 'prop-types'
import styles from './styles'

const FeedCoverImageComponent = ({ data }) => (
  <View style={styles.list}>
    {data.map((item, key) => (
      <View key={key} style={[styles.thumbnails, key === 0 ? styles.first : (key === data.length - 1 ? styles.last : '')]}>
        <Image
          style={styles.image}
          source={{ uri: item.coverImage }}
        />
      </View>
    ))}
  </View>
)

FeedCoverImageComponent.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired
}

export default FeedCoverImageComponent
