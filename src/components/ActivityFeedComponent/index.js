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

const TITLE_TEXT = {
  NEW_LINK_ON_IDEA: 'NEW_LINK_ON_IDEA',
  NEW_COMMENT_ON_IDEA: 'NEW_COMMENT_ON_IDEA',
  USER_ACCESS_CHANGED: 'USER_ACCESS_CHANGED',
  USER_JOINED_HUNT: 'USER_JOINED_HUNT',
  NEW_IDEA_ADDED: 'NEW_IDEA_ADDED',
  USER_EDITED_HUNT: 'USER_EDITED_HUNT',
  USER_INVITED_TO_HUNT: 'USER_INVITED_TO_HUNT'
}

class ActivityFeedComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  get renderItem() {
    const { data } = this.props

    let comment = ''
    let source = ''
    let link = null
    let target = null
    let link_last = null
    let target_last = null

    switch(data.activityTypeEnum) {
      case 'NEW_IDEA_ADDED':
        comment = ' added the Card '
        source = data.metadata.IDEA_PREVIEW
        link = ' to '
        target = data.metadata.HUNT_HEADLINE
        break;
      case 'NEW_LINK_IDEA':
        comment = ' liked the Card '
        source = data.metadata.IDEA_PREVIEW
        break;
      case 'NEW_COMMENT_ON_IDEA':
        comment = ' commented on the Card '
        source = data.metadata.IDEA_PREVIEW
        break;
      case 'USER_EDITED_IDEA':
        comment = ' updated the Card '
        source = data.metadata.IDEA_PREVIEW
        break;
      case 'IDEA_MOVED':
        comment = ' mmoved the Card '
        source = data.metadata.IDEA_PREVIEW
        link = ' to '
        target = data.metadata.HUNT_HEADLINE
        break;
      case 'IDEA_DELETED':
        comment = ' deleted the Card'
        source = data.metadata.IDEA_PREVIEW
        break;
      case 'HUNT_DELETED':
        comment = ' updated the Flow '
        source = data.metadata.HUNT_HEADLINE
        break;
      case 'USER_EDITED_HUNT':
        comment = ' has been invited to Flow '
        source = data.metadata.HUNT_HEADLINE
        break;
      case 'USER_INVITED_TO_HUNT':
        comment = ' joined the Flow '
        source = data.metadata.HUNT_HEADLINE
        link = ' by '
        target = data.metadata.INVIEE_NAME
        break;
      case 'USER_JOINED_HUNT':
        comment = ' updated '
        source = data.metadata.HUNT_HEADLINE
        break;
      case 'USER_ACCESS_CHANGED_1':
        comment = ' updated '
        source = data.metadata.NEW_PERMISSIONS
        link = ' permissions to '
        target = data.metadata.NEW_PERMISSIONS
        link_last = ' on Flow '
        target_last = data.metadata.HUNT_HEADLINE
        break;
      case 'USER_ACCESS_CHANGED':
        comment = ' updated your permissions to '
        source = data.metadata.NEW_PERMISSIONS
        link = ' on Flow '
        target = data.metadata.HUNT_HEADLINE
        break;
      default:
        break;
    }

    return (
      <View>
        <View style={styles.titleView}>
          <Text>
            <Text style={styles.title}>{data.instigatorName}</Text>
            {comment}
            <Text style={styles.title}>{source}</Text>
            {link && link}
            <Text style={styles.title}>{target && target}</Text>
            {link_last && link_last}
            <Text style={styles.title}>{target_last && target_last}</Text>
          </Text>
        </View>
        <View style={styles.durationView}>
          <Text style={[styles.text, data.read === 'true' && styles.readText]}>
            {getFullDurationFromNow(data.activityTime)}
          </Text>
          <Entypo name="dot-single" size={15} color={data.read === 'true' ? COLORS.PURPLE : COLORS.DARK_GREY} style={styles.dotIcon} />
        </View>
      </View>
    )
  }

  render() {
    const { data } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <View style={styles.avatarView}>
            {/* <UserAvatarComponent user={item.owner} size={38} /> */}
          </View>
        </View>

        <View style={styles.rightContainer}>
          <TouchableOpacity onPress={() => this.props.onReadActivity }>
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