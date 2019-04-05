import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native'
import PropTypes from 'prop-types'

import { getFullDurationFromNow } from '../../../service/dateUtils'
import styles from './styles'
import ExFastImage from '../../ExFastImage'

class ActivityFeedGroupComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  returnPlural(count, baseString) {
    return count === 1 ? baseString : baseString + 's'
  }

  getUpdatesData() {
    const { updates, read } = this.props.data
    let { likes, comments, ideas, userPermissionsChanged, usersInvitedToHunt, usersJoinedHunt, updatesToHunt, ideasMoved, updatesToIdeas, huntDeleted, ideasDeleted, mentions} = updates
    let updatesData = ''
    let otherUpdates = 0

    if (comments || mentions) {
      updatesData = `${comments + mentions} ${this.returnPlural(comments + mentions, 'comment')}`
    }
    if (likes) {
      updatesData = updatesData ? `${updatesData}, ` : updatesData
      updatesData = `${updatesData}${likes} ${this.returnPlural(likes, 'like')}`
    }
    if (ideas) {
      updatesData = `${ideas} ${this.returnPlural(ideas, 'card')}`
    }
    if (userPermissionsChanged) {
      otherUpdates += userPermissionsChanged
    }
    if (usersInvitedToHunt) {
      otherUpdates += usersInvitedToHunt
    }
    if (usersJoinedHunt) {
      otherUpdates += usersJoinedHunt
    }
    if (updatesToHunt) {
      otherUpdates += updatesToHunt
    }
    if (ideasMoved) {
      otherUpdates += ideasMoved
    }
    if (updatesToIdeas) {
      otherUpdates += updatesToIdeas
    }
    if (huntDeleted) {
      otherUpdates += huntDeleted
    }
    if (ideasDeleted) {
      otherUpdates += ideasDeleted
    }
    if (otherUpdates) {
      updatesData = updatesData ? `${updatesData}, ` : updatesData
      let upStr = updatesData ? this.returnPlural(otherUpdates, 'other update') : this.returnPlural(otherUpdates, 'update')
      updatesData = `${updatesData}${otherUpdates} ${upStr}`
    }

    if (!updatesData) {
      updatesData = 'No updates'
    }

    if (read) {
      updatesData = "No updates"
    }

    return updatesData
  }

  render() {
    const { coverImg, headline, latestActivityTime, read } = this.props.data
    return (
      <View style={[styles.container, read === true && { backgroundColor: '#fff' }]}>
        <View style={styles.leftContainer}>
          {coverImg
            ? <ExFastImage source={{ uri: coverImg }} resizeMode="cover" style={styles.coverImage} />
            : <View style={styles.coverImage} />
          }
        </View>

        <TouchableOpacity style={styles.rightContainer} onPress={() => this.props.onGroupItemSelect() }>
          <View style={styles.contentView}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{headline}</Text>
            <Text style={styles.updatesData}>{this.getUpdatesData()}</Text>
          </View>
          <View style={styles.timeView}>
            <Text style={styles.text}>
              {getFullDurationFromNow(latestActivityTime)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

ActivityFeedGroupComponent.defaultProps = {
  data: {}
}

ActivityFeedGroupComponent.propTypes = {
  data: PropTypes.object
}

export default ActivityFeedGroupComponent