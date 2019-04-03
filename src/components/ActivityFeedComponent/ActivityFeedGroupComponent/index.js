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

  getUpdatesData() {
    const { updates } = this.props.data
    let { likes, comments, userPermissionsChanged, usersInvitedToHunt, usersJoinedHunt, updatesToHunt, ideasMoved, updatesToIdeas, huntDeleted, ideasDeleted, mentions} = updates
    let updatesData = ''
    let otherUpdates = 0

    if (comments) {
      updatesData = `${comments} comments`
    }
    if (mentions) {
      updatesData = updatesData ? `${updatesData}, ` : updatesData
      updatesData = `${updatesData}${mentions} mentions`
    }
    if (likes) {
      updatesData = updatesData ? `${updatesData}, ` : updatesData
      updatesData = `${updatesData}${likes} likes`
    }

    if (userPermissionsChanged) {
      otherUpdates++
    }
    if (usersInvitedToHunt) {
      otherUpdates++
    }
    if (usersJoinedHunt) {
      otherUpdates++
    }
    if (updatesToHunt) {
      otherUpdates++
    }
    if (ideasMoved) {
      otherUpdates++
    }
    if (updatesToIdeas) {
      otherUpdates++
    }
    if (huntDeleted) {
      otherUpdates++
    }
    if (ideasDeleted) {
      otherUpdates++
    }
    if (otherUpdates) {
      updatesData = updatesData ? `${updatesData}, ` : updatesData
      let upStr = updatesData ? 'other updates' : 'updates'
      updatesData = `${updatesData}${otherUpdates} ${upStr}`
    }

    if (!updatesData) {
      updatesData = 'No updates'
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