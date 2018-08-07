import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import Modal from 'react-native-modal'
import PropTypes from 'prop-types'
import Entypo from 'react-native-vector-icons/Entypo'
import styles from './styles'
const LINK_ICON = require('../../../../assets/images/Link/White.png')

const LinkShareItem = ({ isInviteeOnly, isViewOnly }) => (
  <View style={styles.container}>
    <View style={styles.innerView}>
      <View style={[styles.linkButton, isInviteeOnly ? styles.linkDisableButton : styles.linkEnableButton]}>
        <Image source={LINK_ICON} />
      </View>

      <View style={styles.tileView}>
        <Text style={styles.title}>
          {isInviteeOnly ? 'Link sharing disabled' : 'Link sharing enabled'}
        </Text>
        <Text style={styles.description}>
          {isInviteeOnly ? 'Anyone with the link can view' : 'Invitation only access'}
        </Text>
      </View>
    </View>

    {!isViewOnly && (
      <View style={styles.rightView}>
        <Text style={[styles.viewText, isInviteeOnly ? styles.viewDisableText : styles.viewEnableText]}>
          {isInviteeOnly ? 'Off' : 'View'}
        </Text>
        <Entypo name="cog" style={[styles.cogIcon, isInviteeOnly ? styles.cogDisableIcon : styles.cogEnableIcon]} />
      </View>
    )}
  </View>
)

LinkShareItem.defaultProps = {
  isInviteeOnly: true,
  isViewOnly: true
}

LinkShareItem.propTypes = {
  isInviteeOnly: PropTypes.bool,
  isViewOnly: PropTypes.bool
}

export default LinkShareItem