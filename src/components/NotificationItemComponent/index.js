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
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import FastImage from "react-native-fast-image"

import FeedCoverImageComponent from '../FeedItemComponent/FeedCoverImageComponent'
import UserAvatarComponent from '../../components/UserAvatarComponent'
import {
  updateInvitation
} from '../../redux/feedo/actions'
import COLORS from '../../service/colors'
import styles from './styles'

const NotificationItemComponent = ({ item, hideTumbnail, updateInvitation }) => {
  const filteredIdeas = _.orderBy(
    _.filter(item.ideas, idea => idea.coverImage !== null && idea.coverImage !== ''),
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

  const name = `${item.owner.firstName} ${item.owner.lastName}`

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <View style={styles.avatarView}>
          <UserAvatarComponent user={item.owner} size={35} />
        </View>
      </View>

      <View style={styles.rightContainer}>
        <TouchableOpacity onPress={() => hideTumbnail ? {} : Actions.FeedDetailScreen({ data: item })}>
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
              {item.headline}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => updateInvitation(item.id, true)} activeOpacity={0.8}>
            <View style={[styles.buttonView, styles.acceptButtonView]}>
              <Text style={[styles.buttonText, styles.acceptButtonText]}>Accept</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => updateInvitation(item.id, false)} activeOpacity={0.8}>
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
  item: PropTypes.objectOf(PropTypes.any),
  hideTumbnail: PropTypes.bool
}

const mapDispatchToProps = dispatch => ({
  updateInvitation: (feedId, type) => dispatch(updateInvitation(feedId, type))
})

export default connect(
  null,
  mapDispatchToProps
)(NotificationItemComponent)
