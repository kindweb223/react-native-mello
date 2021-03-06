import React from 'react'
import {
  View
} from 'react-native'

import PropTypes from 'prop-types'
import _ from 'lodash'
import styles from './styles'
import FeedCoverImageComponent from './FeedCoverImageComponent'
import FeedItemContentComponent from './FeedItemContentComponent'
import FeedMiniItemContentComponent from './FeedMiniItemContentComponent'
import * as COMMON_FUNC from '../../service/commonFunc'

const FeedItemComponent = ({ item, pinFlag, page, clickEvent, listType }) => {
  let avatars = []
  invitees = item.invitees
  
  invitees = COMMON_FUNC.filterRemovedInvitees(invitees)

  // If you own the flow and are the only invitee
  if (COMMON_FUNC.isFeedOwnerOnlyInvitee(item)) {
    invitees = _.filter(invitees, invitee => invitee.userProfile.id !== item.owner.id)
  }
  
  invitees.forEach(data => {
    avatars = [
      ...avatars,
      data.userProfile
    ]
  })

  if (listType === 'LIST') {
    return (
      <View style={styles.container}>
        {item.coverImages && item.coverImages.length > 0 && (
          <View style={styles.thumbnailsView}>
            <FeedCoverImageComponent data={item.coverImages} />
          </View>
        )}
        <FeedItemContentComponent
          data={item}
          avatars={avatars}
          pinFlag={pinFlag}
          page={page}
          clickEvent={clickEvent}
        />
      </View>
    )
  }  else {
    return (
      <View style={styles.container}>
        <FeedMiniItemContentComponent
          data={item}
          avatars={avatars}
          pinFlag={pinFlag}
          page={page}
          clickEvent={clickEvent}
          thumbnailImage={item.coverImages && item.coverImages.length > 0 ? (item.coverImages)[0] : null}
        />
      </View>
    )
  }
}

FeedItemComponent.defaultProps = {
  clickEvent: 'normal'
}

FeedItemComponent.propTypes = {
  clickEvent: PropTypes.string,
  item: PropTypes.objectOf(PropTypes.any),
  pinFlag: PropTypes.bool.isRequired
}

export default FeedItemComponent
