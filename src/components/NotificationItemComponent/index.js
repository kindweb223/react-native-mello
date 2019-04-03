import React from 'react'
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native'

import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import PropTypes from 'prop-types'
import _ from 'lodash'
import R from 'ramda'

import FeedCoverImageComponent from '../FeedItemComponent/FeedCoverImageComponent'
import UserAvatarComponent from '../../components/UserAvatarComponent'
import {
  updateInvitation
} from '../../redux/feedo/actions'
import styles from './styles'

const NotificationItemComponent = ({ data, hideTumbnail, updateInvitation, prevPage, avatarSize }) => {
  const filteredIdeas = _.orderBy(
    _.filter(data.ideas, idea => idea.coverImage !== null && idea.coverImage !== ''),
    ['publishedDate'],
    ['desc']
  )

  let coverImages = []
  if (filteredIdeas.length > 4) {
    coverImages = R.slice(0, 4, filteredIdeas)
  } else {
    coverImages = R.slice(0, 4, filteredIdeas)
    for (let i = 0; i < 4 - filteredIdeas.length; i ++) {
      coverImages.push(null)
    }
  }

  if (!data.owner) {
    return null
  }
  const name = `${data.owner.firstName} ${data.owner.lastName}`

  return (
    <View style={styles.container}>
      <View style={{ width: avatarSize + 12 }}>
        <View style={styles.avatarView}>
          <UserAvatarComponent user={data.owner} size={avatarSize} />
        </View>
      </View>

      <View style={styles.rightContainer}>
        <TouchableOpacity onPress={() => Actions.FeedDetailScreen({ data, prevPage })}>
          <View>
            <View style={styles.titleView}>
              <Text><Text style={styles.title}>{name}</Text> has invited you to this flow</Text>
            </View>
            {!hideTumbnail && (
              <View style={styles.thumbnailsView}>
                <FeedCoverImageComponent data={coverImages} />
              </View>
            )}
            <Text style={styles.title}>
              {data.headline}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => updateInvitation(data.id, true)} activeOpacity={0.8}>
            <View style={[styles.buttonView, styles.acceptButtonView]}>
              <Text style={[styles.buttonText, styles.acceptButtonText]}>Accept</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => updateInvitation(data.id, false)} activeOpacity={0.8}>
            <View style={[styles.buttonView, styles.ignoreButtonView]}>
              <Text style={[styles.buttonText, styles.ignoreButtonText]}>Ignore</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

NotificationItemComponent.defaultProps = {
  hideTumbnail: false,
  prevPage: 'activity',
  avatarSize: 38
}

NotificationItemComponent.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  hideTumbnail: PropTypes.bool,
  prevPage: PropTypes.string,
  avatarSize: PropTypes.number
}

const mapDispatchToProps = dispatch => ({
  updateInvitation: (feedId, type) => dispatch(updateInvitation(feedId, type))
})

export default connect(
  null,
  mapDispatchToProps
)(NotificationItemComponent)
