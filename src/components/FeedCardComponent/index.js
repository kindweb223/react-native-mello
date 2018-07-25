import React from 'react'
import {
  View,
  Image,
  Text
} from 'react-native'
import { FontAwesome, Feather } from 'react-native-vector-icons'
import PropTypes from 'prop-types'
import UserAvatar from 'react-native-user-avatar'
import { filter } from 'lodash'
import { getPastHoursFromNow } from '../../service/dateUtils'
import styles from './styles'

const CardBottomComponent = ({ data, invitee }) => {
  const userName = `${invitee.firstName} ${invitee.lastName}`

  return (
    <View style={styles.bottomContainer}>
      <View style={styles.subView}>
        <View style={styles.avatar}>
          {invitee.imageUrl
            ? <UserAvatar
                size="30"
                name={userName}
                colors={['#fff', '#000']}
                src={invitee.imageUrl}
              />
            : <UserAvatar
                size="30"
                name={userName}
                color="#000"
                colors={['#fff', '#000']}
              />
          }
        </View>
        <Text style={styles.text}>{userName}</Text>
        <Text style={styles.text}>- {getPastHoursFromNow(data.publisheddate)}</Text>
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
}

CardBottomComponent.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  invitee: PropTypes.objectOf(PropTypes.any).isRequired
}

const FeedCardComponent = ({ data, invitees }) => {
  const invitee = filter(invitees, item => item.id === data.inviteeId)[0]
  // console.log('INVITEE_DATA: ', invitee)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{data.title}</Text>
      {data.coverImage && data.coverImage.length && (
        <View style={styles.thumbnailsView}>
          <Image
            style={styles.thumbnails}
            source={{ uri: data.coverImage }}
          />
        </View>
      )}
      <CardBottomComponent data={data} invitee={invitee} />
    </View>
  )
}

FeedCardComponent.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  invitees: PropTypes.arrayOf(PropTypes.any).isRequired
}

export default FeedCardComponent
