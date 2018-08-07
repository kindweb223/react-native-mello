import React from 'react'
import {
  View,
  Text
} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import UserAvatar from 'react-native-user-avatar'
import Entypo from 'react-native-vector-icons/Entypo'
import COLORS from '../../../service/colors'
import styles from './styles'

const InviteeItemComponent = ({ invitee, isViewOnly, isOnlyTitle }) => {
  const { userProfile } = invitee
  const userName = `${userProfile.firstName} ${userProfile.lastName}`

  return (
    <View style={styles.container}>
      <View style={[styles.avatarView, isOnlyTitle ? { alignItems: 'center' } : { alignItems: 'flex-start' }]}>
        <View style={styles.avatar}>
          {userProfile.imageUrl
            ? <UserAvatar
                size="38"
                name={userName}
                src={userProfile.imageUrl}
              />
            : <UserAvatar
                size="38"
                name={userName}
                color="#ECEDEE"
                textColor="#000"
              />
          }
        </View>
        <View style={styles.infoView}>
          <Text style={styles.title}>{userProfile.firstName}</Text>
          {!isOnlyTitle && (
            [
              <Text key="0" style={styles.subtitle}>{userProfile.email}</Text>,
              <View key="1" style={styles.cardView}>
                <Text style={styles.subtitle}>{invitee.ideas ? invitee.ideas.length : 0} cards</Text>
                <Text  style={styles.subtitle}>0 likes</Text>
              </View>
            ]
          )}
        </View>
      </View>

      {!isViewOnly && (
        <View style={styles.rightView}>
          <Text style={[styles.viewText, styles.viewEnableText]}>
            {invitee.permissions}
          </Text>
          <Entypo name="cog" style={[styles.cogIcon, styles.cogEnableIcon]} />
        </View>
      )}
    </View>
  )
}

InviteeItemComponent.defaultProps = {
  isViewOnly: true,
  isOnlyTitle: false
}

InviteeItemComponent.propTypes = {
  invitee: PropTypes.objectOf(PropTypes.any).isRequired,
  isViewOnly: PropTypes.bool,
  isOnlyTitle: PropTypes.bool
}

export default InviteeItemComponent
