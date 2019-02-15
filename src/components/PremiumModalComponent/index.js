import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import PropTypes from 'prop-types'
import styles from './styles'

const CLOSE_ICON = require('../../../assets/images/Close/Grey.png')
const STAR_ICON = require('../../../assets/images/Premium/StarIconPremium.png')
const FACEBOOK_ICON = require('../../../assets/images/Premium/facebookPremium.png')
const TWITTER_ICON = require('../../../assets/images/Premium/twitterPremium.png')
const LINKEDIN_ICON = require('../../../assets/images/Premium/linkedinPremium.png')
const DRIBBLE_ICON = require('../../../assets/images/Premium/dribbblePremium.png')

class PremiumModal extends React.Component {
  get renderHeader() {
    return (
      <TouchableOpacity 
        style={styles.closeButtonView}
        activeOpacity={0.7}
        onPress={() => this.props.onClose()}
      >
        <Image source={CLOSE_ICON} />
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerView}>
          {this.renderHeader}
        </View>

        <View style={styles.mainView}>
          <Image source={STAR_ICON} style={styles.iconView} />
          <Text style={styles.title}>Premium will be available in the coming weeks to a select number of users.</Text>
          <Text style={styles.subTitle}>If you want to be one of those select share Mello with your friends.</Text>
        </View>

        <View style={styles.buttonView}>
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Image source={FACEBOOK_ICON} style={styles.shareIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Image source={TWITTER_ICON} style={styles.shareIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Image source={LINKEDIN_ICON} style={styles.shareIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Image source={DRIBBLE_ICON} style={styles.shareIcon} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

PremiumModal.defaultProps = {
  onClose: () => {}
}

PremiumModal.propTypes = {
  onClose: PropTypes.func
}

export default PremiumModal