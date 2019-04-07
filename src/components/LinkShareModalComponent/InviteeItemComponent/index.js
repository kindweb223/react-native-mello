import React from 'react'
import {
  View,
  Text
} from 'react-native'
import PropTypes from 'prop-types'
import Entypo from 'react-native-vector-icons/Entypo'
import COLORS from '../../../service/colors'
import styles from './styles'
import UserAvatarComponent from '../../UserAvatarComponent';


const InviteeItemComponent = ({ invitee, isViewOnly, isOwnerInvitee, isOnlyTitle, hideLike, isShowSeparator }) => {
  const { userProfile, inviteStatus } = invitee
  const userName = userProfile.newUser ? userProfile.email : `${userProfile.firstName} ${userProfile.lastName}`

  let statusTxt
  if (inviteStatus === 'INVITED') {
    statusTxt = 'Pending'
  } else if (inviteStatus === 'DECLINED') {
    statusTxt = 'Declined'
  }

  return (
    <View style={styles.container}>
      <View style={[styles.avatarView, isOnlyTitle ? { alignItems: 'center' } : { alignItems: 'flex-start' }]}>
        <View style={styles.avatar}>
          <UserAvatarComponent
            user={userProfile}
            size={38}
            color="#ECEDEE"
            textColor="#000"
          />
        </View>
        <View style={styles.infoView}>
          {userProfile.firstName !== null && userProfile.lastName !== null && (
            <Text style={styles.title}>{userName}</Text>
          )}
          {!isOnlyTitle && (
            hideLike
            ? [
                <Text
                  key="0"
                  style={userProfile.firstName !== null && userProfile.lastName !== null ? styles.subtitle : styles.title}
                >
                  {userProfile.email}
                </Text>
              ]
            : [
                <Text
                  key="0"
                  style={userProfile.firstName !== null && userProfile.lastName !== null ? styles.subtitle : styles.title}
                >
                  {userProfile.email}
                </Text>
                // <View key="1" style={styles.cardView}>
                //   <Text style={styles.subtitle}>{invitee.ideas ? invitee.ideas.length : 0} cards</Text>
                //   <Text  style={styles.subtitle}>0 likes</Text>
                // </View>
              ]
          )}
          {isShowSeparator &&
            <View style={[styles.separator, {
              marginTop: userProfile.firstName !== null && userProfile.lastName !== null ? 5 : 21
            }]} />
          }
        </View>
      </View>

      {!isViewOnly && (
        isOwnerInvitee
        ? <View style={styles.rightView}>
            <Text style={[styles.viewText, styles.viewDisableText]}>
              Owner
            </Text>
          </View>
        : <View style={styles.rightView}>
            <Text style={[styles.viewText, styles.viewEnableText]}>
              {invitee.permissions}
            </Text>
            <Entypo name="cog" style={[styles.cogIcon, styles.cogEnableIcon]} />
          </View>
      )}

      {inviteStatus !== 'ACCEPTED' && (
        <View style={styles.rightView}>
          <Text style={[styles.viewText, { color: inviteStatus === 'INVITED' ? COLORS.DARK_GREY : 'red' }]}>
            {statusTxt}
          </Text>
        </View>
      )}
    </View>
  )
}

InviteeItemComponent.defaultProps = {
  isViewOnly: true,
  isOnlyTitle: false,
  isOwnerInvitee: false,
  hideLike: false,
  isShowSeparator: true
}

InviteeItemComponent.propTypes = {
  invitee: PropTypes.objectOf(PropTypes.any).isRequired,
  isViewOnly: PropTypes.bool,
  isOnlyTitle: PropTypes.bool,
  isOwnerInvitee: PropTypes.bool,
  hideLike: PropTypes.bool,
  isShowSeparator: PropTypes.bool
}

export default InviteeItemComponent
