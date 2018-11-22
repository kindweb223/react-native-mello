import React from 'react'
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import PropTypes from 'prop-types'
import UserAvatarComponent from '../UserAvatarComponent'
import { getDurationFromNow } from '../../service/dateUtils'
import styles from './styles'

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

    return (
      <View>
        <View style={styles.titleView}>
          <Text><Text style={styles.title}>{data.instigatorName}</Text> {TITLE_TEXT[data.activityTypeEnum]}</Text>
          <Text style={styles.title}>
            {data.metadata.HUNT_HEADLINE}
          </Text>
        </View>
        <View style={styles.durationView}>
          <Text style={[styles.text, data.read === 'true' && styles.readText]}>
            {getDurationFromNow(data.activityTime)}
          </Text>
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