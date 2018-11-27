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

const NotificationItemComponent = ({ data, hideTumbnail, updateInvitation }) => {
  const filteredIdeas = _.orderBy(
    _.filter(data.ideas, idea => idea.coverImage !== null && idea.coverImage !== ''),
    ['publishedDate'],
    ['asc']
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

  const name = `${data.owner.firstName} ${data.owner.lastName}`

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <View style={styles.avatarView}>
          <UserAvatarComponent user={data.owner} size={38} />
        </View>
      </View>

      <View style={styles.rightContainer}>
        <TouchableOpacity onPress={() => hideTumbnail ? {} : Actions.FeedDetailScreen({ data })}>
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
  hideTumbnail: false
}

NotificationItemComponent.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  hideTumbnail: PropTypes.bool
}

const mapDispatchToProps = dispatch => ({
  updateInvitation: (feedId, type) => dispatch(updateInvitation(feedId, type))
})

export default connect(
  null,
  mapDispatchToProps
)(NotificationItemComponent)
