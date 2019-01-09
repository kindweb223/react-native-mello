import React from 'react'
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import PropTypes from 'prop-types'
import Entypo from 'react-native-vector-icons/Entypo'
import UserAvatarComponent from '../UserAvatarComponent'
import { getFullDurationFromNow } from '../../service/dateUtils'
import styles from './styles'
import COLORS from '../../service/colors'

// const TITLE_TEXT = {
//   IDEA_LIKED: 'IDEA_LIKED',
//   COMMENT_ADDED: 'COMMENT_ADDED',
//   USER_ACCESS_CHANGED: 'USER_ACCESS_CHANGED',
//   USER_JOINED_HUNT: 'USER_JOINED_HUNT',
//   IDEA_ADDED: 'IDEA_ADDED',
//   HUNT_UPDATED: 'HUNT_UPDATED',
//   USER_INVITED_TO_HUNT: 'USER_INVITED_TO_HUNT'
// }

class ActivityFeedComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  get renderItem() {
    const { data, user } = this.props

    let comment = ''
    let source = ''
    let link = null
    let target = null
    let link_last = null
    let target_last = null

    switch(data.activityTypeEnum) {
      case 'IDEA_ADDED':
        comment = ' added the Card '
        source = data.metadata.IDEA_PREVIEW
        link = ' to '
        target = data.metadata.HUNT_HEADLINE
        break;
      case 'IDEA_LIKED':
        comment = ' liked the Card '
        source = data.metadata.IDEA_PREVIEW
        link = ' in '
        target = data.metadata.HUNT_HEADLINE
        break;
      case 'COMMENT_ADDED':
        comment = ' commented on the Card '
        source = data.metadata.IDEA_PREVIEW
          link = ' in '
          target = data.metadata.HUNT_HEADLINE
        break;
      case 'IDEA_UPDATED':
        comment = ' updated the Card '
        source = data.metadata.IDEA_PREVIEW
        link = ' in '
        target = data.metadata.HUNT_HEADLINE
        break;
      case 'IDEA_MOVED':
        comment = ' moved the Card '
        source = data.metadata.IDEA_PREVIEW
        link = ' to '
        target = data.metadata.HUNT_HEADLINE
        break;
      case 'IDEA_DELETED':
        comment = ' deleted the Card '
        source = data.metadata.IDEA_PREVIEW
        link = ' from '
        target = data.metadata.HUNT_HEADLINE
        break;
      case 'HUNT_DELETED':
        comment = ' deleted the Flow '
        source = data.metadata.HUNT_HEADLINE
        break;
      case 'HUNT_UPDATED':
        comment = ' updated the Flow '
        source = data.metadata.HUNT_HEADLINE
        break;
      case 'USER_INVITED_TO_HUNT':
        comment = ' has been invited to Flow '
        source = data.metadata.HUNT_HEADLINE
        link = ' by '
        target = `${data.instigatorFirstName} ${data.instigatorLastName}`
        break;
      case 'USER_JOINED_HUNT':
        comment = ' joined the Flow '
        source = data.metadata.HUNT_HEADLINE
        break;
      case 'USER_ACCESS_CHANGED':
        comment = ' updated '
        source = data.metadata.INVITEE_USER_PROFILE_ID === user.userInfo.id ? 'your' : data.metadata.INVITEE_NAME + "'s"
        link = " permissions to "
        target = data.metadata.NEW_PERMISSIONS
        link_last = ' on Flow '
        target_last = data.metadata.HUNT_HEADLINE
        break;
      case 'USER_MENTIONED':
        // comment = ' mentioned to '
        // source = data.metadata.NEW_PERMISSIONS
        // link = ' on Flow '
        // target = data.metadata.HUNT_HEADLINE
        break;
      default:
        break;
    }

    return (
      <View>
        <View style={styles.titleView}>
          <Text>
            <Text style={styles.title}>
              {data.activityTypeEnum === 'USER_INVITED_TO_HUNT'
                ? data.metadata.INVIEE_NAME
                : `${data.instigatorFirstName} ${data.instigatorLastName}`
              }
            </Text>
            {comment}
            <Text style={styles.title}>{source}</Text>
            {link && link}
            <Text style={styles.title}>{target && target}</Text>
            {link_last && link_last}
            <Text style={styles.title}>{target_last && target_last}</Text>
          </Text>
        </View>
        <View style={styles.durationView}>
          <Text style={styles.text}>
            {getFullDurationFromNow(data.activityTime)}
          </Text>
          {/* <Entypo name="dot-single" size={15} color={COLORS.DARK_GREY} style={styles.dotIcon} /> */}
        </View>
      </View>
    )
  }

  render() {
    const { data } = this.props;
    const instigatorInfo = {
      imageUrl: data.instigatorPic,
      firstName: data.instigatorFirstName,
      lastName: data.instigatorLastName
    }

    return (
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <View style={styles.avatarView}>
            <UserAvatarComponent user={instigatorInfo} size={38} />
          </View>
        </View>

        <View style={styles.rightContainer}>
          <TouchableOpacity onPress={() => this.props.onReadActivity() }>
            {this.renderItem}
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

ActivityFeedComponent.defaultProps = {
  data: {}
}

ActivityFeedComponent.propTypes = {
  data: PropTypes.object
}

export default ActivityFeedComponent