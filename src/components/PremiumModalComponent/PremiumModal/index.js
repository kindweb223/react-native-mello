import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import PropTypes from 'prop-types'
import SVGImage from 'react-native-remote-svg'
import styles from './styles'

const CLOSE_ICON = require('../../../../assets/images/Close/Grey.png')
const STAR_ICON = require('../../../../assets/svgs/StarIconPremium.svg')
const FACEBOOK_ICON = require('../../../../assets/svgs/facebookPremium.svg')
const TWITTER_ICON = require('../../../../assets/svgs/twitterPremium.svg')
const LINKEDIN_ICON = require('../../../../assets/svgs/linkedinPremium.svg')
const DRIBBLE_ICON = require('../../../../assets/svgs/dribbblePremium.svg')

class PremiumAlert extends React.Component {
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
          <SVGImage source={STAR_ICON} style={styles.iconView} />
          <Text style={styles.title}>Premium will be available in the coming weeks to a select number of users.</Text>
          <Text style={styles.subTitle}>If you want to be one of those select share Mello with your friends.</Text>
        </View>

        <View style={styles.buttonView}>
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <SVGImage source={FACEBOOK_ICON} style={styles.shareIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <SVGImage source={TWITTER_ICON} style={styles.shareIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <SVGImage source={LINKEDIN_ICON} style={styles.shareIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <SVGImage source={DRIBBLE_ICON} style={styles.shareIcon} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

PremiumAlert.defaultProps = {
  onClose: () => {}
}

PremiumAlert.propTypes = {
  onClose: PropTypes.func
}

export default PremiumAlert