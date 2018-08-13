import React from 'react'
import {
  View,
  Text
} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
import Entypo from 'react-native-vector-icons/Entypo'
import PropTypes from 'prop-types'
import UserAvatar from 'react-native-user-avatar'
import { filter } from 'lodash'
import Image from 'react-native-image-progress'
import { getDurationFromNow } from '../../service/dateUtils'
import styles from './styles'

const CardBottomComponent = ({ data, invitee, invitees }) => {
  const userName = `${invitee.userProfile.firstName} ${invitee.userProfile.lastName}`
  let isOnlyInvitee = false
  if (invitees.length === 1 && invitees[0].userProfile.id === invitee.userProfile.id) {
    isOnlyInvitee = true
  }

  return (
    <View style={styles.bottomContainer}>
      <View style={styles.subView}>
        {!isOnlyInvitee && (
          [
            <View key="0" style={styles.avatar}>
              {invitee.imageUrl
                ? <UserAvatar
                    size="30"
                    name={userName}
                    color="#000"
                    textColor="#fff"
                    src={invitee.imageUrl}
                  />
                : <UserAvatar
                    size="30"
                    name={userName}
                    color="#000"
                    textColor="#fff"
                  />
              }
            </View>,
            <Text key="1" style={styles.text}>{invitee.userProfile.firstName}</Text>,
            <Entypo key="2" name="dot-single" style={styles.dotIcon} />
          ]
        )}
        <Text style={styles.text}>
          {getDurationFromNow(data.publishedDate)}
        </Text>
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
  invitee: PropTypes.objectOf(PropTypes.any).isRequired,
  invitees: PropTypes.arrayOf(PropTypes.any).isRequired
}

const FeedCardComponent = ({ data, invitees }) => {
  const invitee = filter(invitees, item => item.id === data.inviteeId)[0]

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
      {invitee && (
        <CardBottomComponent data={data} invitee={invitee} invitees={invitees} />
      )}
    </View>
  )
}

FeedCardComponent.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  invitees: PropTypes.arrayOf(PropTypes.any).isRequired
}

export default FeedCardComponent
