import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import Modal from 'react-native-modal'
import PropTypes from 'prop-types'
import Entypo from 'react-native-vector-icons/Entypo'
import styles from './styles'
const LINK_ICON = require('../../../../assets/images/Link/White.png')

const LinkShareItem = ({ isViewOnly, feed }) => (
  <View style={styles.container}>
    <View style={styles.innerView}>
      <View style={[styles.linkButton, feed.sharingPreferences.level === 'INVITEES_ONLY' ? styles.linkDisableButton : styles.linkEnableButton]}>
        <Image source={LINK_ICON} />
      </View>

      <View style={styles.tileView}>
        <Text style={styles.title}>
          {feed.sharingPreferences.level === 'INVITEES_ONLY' ? 'Link sharing disabled' : 'Link sharing enabled'}
        </Text>
        <Text style={styles.description}>
          {feed.sharingPreferences.level === 'INVITEES_ONLY' ? 'Anyone with the link can view' : 'Invitation only access'}
        </Text>
      </View>
    </View>

    {!isViewOnly && (
      <View style={styles.rightView}>
        <Text style={[styles.viewText, feed.sharingPreferences.level === 'INVITEES_ONLY' ? styles.viewDisableText : styles.viewEnableText]}>
          {feed.sharingPreferences.level === 'INVITEES_ONLY' ? 'Off' : feed.sharingPreferences.permissions}
        </Text>
        <Entypo name="cog" style={[styles.cogIcon, feed.sharingPreferences.level === 'INVITEES_ONLY' ? styles.cogDisableIcon : styles.cogEnableIcon]} />
      </View>
    )}
  </View>
)

LinkShareItem.defaultProps = {
  isViewOnly: true,
  feed: {}
}

LinkShareItem.propTypes = {
  isViewOnly: PropTypes.bool,
  feed: PropTypes.objectOf(PropTypes.any)
}

export default LinkShareItem