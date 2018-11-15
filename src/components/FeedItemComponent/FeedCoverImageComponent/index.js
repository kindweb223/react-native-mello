import React from 'react'
import {
  View
} from 'react-native'

import PropTypes from 'prop-types'
import Image from 'react-native-image-progress'
import styles from './styles'
import FastImage from "react-native-fast-image";

const FeedCoverImageComponent = ({ data }) => (
  <View style={styles.list}>
    {data.map((item, key) => (
      <View
        key={key}
        style={
          [
            styles.thumbnails,
            key === 0
              ? (data.length === 1 ? styles.all : styles.first)
              : (data.length > 1 && key === data.length - 1 ? styles.last : styles.middle)
          ]
        }
      >
        {item
          ? <FastImage
              style={styles.image}
              source={{uri: item.coverImage}}
            />
          : <View style={styles.emptyCoverImageView} />
        }
      </View>
    ))}
  </View>
)

FeedCoverImageComponent.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired
}

export default FeedCoverImageComponent
