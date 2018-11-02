import React from 'react'
import {
  View,
  Text,
  Image
} from 'react-native'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import Foundation from 'react-native-vector-icons/Foundation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Octicons from 'react-native-vector-icons/Octicons'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import UserAvatar from 'react-native-user-avatar'
import Tags from "../../../components/FeedTags"
import styles from './styles'
import COLORS from '../../../service/colors'

const CARD_ICON_GREY = require('../../../../assets/images/Card/Grey.png')
const CARD_ICON_PURPLE = require('../../../../assets/images/Card/Purple.png')
const PROFILE_ICON_GREY = require('../../../../assets/images/Users/Grey.png')
const PROFILE_ICON_PURPLE = require('../../../../assets/images/Users/Blue.png')
const PIN_ICON_GREY = require('../../../../assets/images/Pin/Grey.png')
const PIN_ICON_PURPLE = require('../../../../assets/images/Pin/Blue.png')


import { 
  addFilterTag
} from '../../../redux/feedo/actions'

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

class FeedItemContentComponent extends React.Component {
  onTagPress = (initialTag, page, clickEvent) => {
    if (page === 'search') {
      this.props.addFilterTag(initialTag)
    }

    if (page === 'home' && clickEvent === 'normal') {
      Actions.FeedFilterScreen({
        initialTag: [{ text: initialTag.text }]
      })
    }
  }

  render() {
    const { data, pinFlag, page, clickEvent } = this.props

    return (
      <View style={styles.container}>
        <View style={styles.titleView}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{data.headline}</Text>
          <View style={styles.rightView}>
            {pinFlag && (
              <Image source={PIN_ICON_PURPLE} />
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
            {
              data.metadata.newInvitees > 0 ?
              <Image source={PROFILE_ICON_PURPLE} style={styles.profileIcon} /> :
              <Image source={PROFILE_ICON_GREY} style={styles.profileIcon} />
            }
            <Text style={[styles.feedText, data && data.metadata.newInvitees ? styles.active : styles.inActive]}>
              {data.invitees.length}
            </Text>
          </View>
          <View style={styles.statsItemView}>
            {
              data.metadata.newIdeas > 0 ? 
              <Image source={CARD_ICON_PURPLE} style={styles.cardIcon} /> :
              <Image source={CARD_ICON_GREY} style={styles.cardIcon} />
            }
            <Text style={[styles.feedText, data.metadata.newIdeas ? styles.active : styles.inActive]}>
              {data.ideas.length}
            </Text>
          </View>
        </View>

        {data.tags.length > 0 && page !== 'archived' && (
          <View style={styles.tagsView}>
            <Tags
              initialTags={data.tags}
              onChangeTags={() => {}}
              onTagPress={(tag) => this.onTagPress(tag, page, clickEvent)}
              inputStyle={{
                backgroundColor: 'white',
              }}
              tagContainerStyle={{
                backgroundColor: COLORS.TAG_LIGHT_ORANGE_BACKGROUND
              }}
              tagTextStyle={{
                color: COLORS.DARK_ORANGE,
                fontSize: 14,
              }}
            />
          </View>
        )}
      </View>
    )
  }
}

FeedItemContentComponent.defaultProps = {
  addFilterTag: () => {}
}

FeedItemContentComponent.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  pinFlag: PropTypes.bool.isRequired,
  addFilterTag: PropTypes.func
}

const mapDispatchToProps = dispatch => ({
  addFilterTag: (data) => dispatch(addFilterTag(data))
})

export default connect(
  null,
  mapDispatchToProps
)(FeedItemContentComponent)