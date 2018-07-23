import React from 'react'
import {
  View,
  Image,
  Text
} from 'react-native'
import { FontAwesome, Feather } from 'react-native-vector-icons'
import PropTypes from 'prop-types'
import styles from './styles'

const CardBottomComponent = () => (
  <View style={styles.bottomContainer}>
    <View style={styles.subView}>
      <Image
        style={styles.avatar}
        source={{ uri: 'https://randomuser.me/api/portraits/men/74.jpg' }}
      />
      <Text style={styles.text}>@Val</Text>
      <Text style={styles.text}>- 3h</Text>
    </View>
    <View style={styles.subView}>
      <View style={styles.iconView}>
        <FontAwesome name="heart-o" style={styles.icon} />
        <Text style={styles.iconText}>0</Text>
      </View>
      <View style={styles.iconView}>
        <Feather name="message-square" style={styles.icon} />
        <Text style={styles.iconText}>0</Text>
      </View>
    </View>
  </View>
)

const FeedCardComponent = ({ data }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>another guy to check it</Text>
      {data.coverImage && data.coverImage.length && (
        <View style={styles.thumbnailsView}>
          <Image
            style={styles.thumbnails}
            source={{ uri: data.coverImage }}
          />
        </View>
      )}
      <CardBottomComponent data={data} />
    </View>
  )
}

FeedCardComponent.propTypes = {
  data: PropTypes.objectOf(PropTypes.any)
}

export default FeedCardComponent
