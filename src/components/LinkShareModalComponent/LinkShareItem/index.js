import React from 'react'
import { View, Text, TouchableOpacity, Image, Switch } from 'react-native'
import Modal from 'react-native-modal'
import PropTypes from 'prop-types'
import Entypo from 'react-native-vector-icons/Entypo'
import styles from './styles'
import COLORS from '../../../service/colors'
import * as COMMON_FUNC from '../../../service/commonFunc'
const LINK_ICON = require('../../../../assets/images/Link/White.png')

const changeToCapital = str => {
  return str[0].toUpperCase() + str.substr(1).toLowerCase()
}

const LinkShareItem = ({ isViewOnly, feed, handleLinkSharing, isEnableShare, onPress }) => {
  let isEnableShareAllowed = COMMON_FUNC.isFeedOwner(feed) || COMMON_FUNC.isFeedEditor(feed)

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.innerView}
        activeOpacity={0.8}
        onPress={onPress}
      >
        <View style={[styles.linkButton, feed.sharingPreferences.level === 'INVITEES_ONLY' ? styles.linkDisableButton : styles.linkEnableButton]}>
          <Image source={LINK_ICON} />
        </View>

        <View style={styles.tileView}>
          <Text style={styles.title}>
            {feed.sharingPreferences.level === 'INVITEES_ONLY' ? 'Link sharing disabled' : 'Link sharing enabled'}
          </Text>
          <Text style={styles.description}>
            {feed.sharingPreferences.level === 'INVITEES_ONLY' 
              ? 'Invitation only access'
              : `Anyone with the link can ${changeToCapital(feed.sharingPreferences.permissions)}`
            }
          </Text>
          {/* <View style={styles.separator} /> */}
        </View>
      </TouchableOpacity>

      {!isViewOnly && isEnableShareAllowed && (
        <View style={styles.rightView}>
          <Switch
            trackColor={{true: COLORS.PURPLE, false: null}}
            value={isEnableShare}
            onValueChange={value => handleLinkSharing(value)}
          />
        </View>
      )}
    </View>
  )
}

LinkShareItem.defaultProps = {
  isViewOnly: true,
  feed: {}
}

LinkShareItem.propTypes = {
  isViewOnly: PropTypes.bool,
  feed: PropTypes.objectOf(PropTypes.any)
}

export default LinkShareItem