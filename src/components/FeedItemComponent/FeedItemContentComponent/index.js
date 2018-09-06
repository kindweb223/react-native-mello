import React from 'react'
import {
  View,
  Text
} from 'react-native'

import PropTypes from 'prop-types'
import Foundation from 'react-native-vector-icons/Foundation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Octicons from 'react-native-vector-icons/Octicons'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import UserAvatar from 'react-native-user-avatar'
import Tags from "../../../components/FeedTags"
import styles from './styles'
import COLORS from '../../../service/colors'

const renderAvatar = (user) => {
  const size = 22
  const name = `${user.firstName} ${user.lastName}`;

  if (user.imageUrl || user.firstName || user.lastName) {
    return (
      <UserAvatar
        size={size}
        name={name}
        color={COLORS.LIGHT_GREY}
        textColor="#000"
        src={user.imageUrl}
      />
    );
  }
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: COLORS.LIGHT_GREY,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <EvilIcons name="envelope" size={18} color={COLORS.PURPLE} />
    </View>
  )
}

const FeedItemContentComponent = ({ data, pinFlag }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleView}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{data.headline}</Text>
        <View style={styles.rightView}>
          {pinFlag && (
            <Octicons name="pin" size={18} style={[styles.pinIcon, styles.active]} />
          )}
          {!data.metadata.owner && (
            <View style={styles.avatarView}>
              {renderAvatar(data.owner)}
            </View>
          )}
        </View>
      </View>

      <View style={styles.statsView}>
        <View style={styles.statsItemView}>
          <Ionicons name="md-person" feedIcon={15} style={[styles.feedIcon, data.metadata.newInvitees ? styles.active : styles.inActive]} />
          <Text style={[styles.feedText, data.metadata.newInvitees ? styles.active : styles.inActive]}>
            {data.metadata.invitees}
          </Text>
        </View>
        <View style={styles.statsItemView}>
          <Foundation name="credit-card" feedIcon={15} style={[styles.feedIcon, data.metadata.newIdeas ? styles.active : styles.inActive]} />
          <Text style={[styles.feedText, data.metadata.newIdeas  ? styles.active : styles.inActive]}>
            {data.metadata.ideasSubmitted}
          </Text>
        </View>
      </View>

      {data.tags.length > 0 && (
        <View style={styles.tagsView}>
          <Tags
            initialTags={data.tags}
            onChangeTags={() => {}}
            onTagPress={() => {}}
            inputStyle={{
              backgroundColor: 'white',
            }}
            tagContainerStyle={{
              backgroundColor: 'rgba(255, 208, 173, 0.35)'
            }}
            tagTextStyle={{
              color: COLORS.DARK_ORANGE,
              fontSize: 16,
            }}
          />
        </View>
      )}
    </View>
  )
}

FeedItemContentComponent.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  pinFlag: PropTypes.bool.isRequired
}

export default FeedItemContentComponent
