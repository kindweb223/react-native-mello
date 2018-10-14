import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground
} from 'react-native'
import PropTypes from 'prop-types'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Video from 'react-native-video'

import styles from './styles'
import COLORS from '../../service/colors'

const SPEECH_BUBBLE_TOP = require('../../../assets/images/onboard/bubbleSmallTop.png')
const SPEECH_BUBBLE_BOTTOM = require('../../../assets/images/onboard/bubbleSmallBottom.png')
const SPEECH_BUBBLE_MIDDLE = require('../../../assets/images/onboard/bubbleSmallMiddle.png')
const DOLL_FEED= require('../../../assets/images/onboard/adamStatic1.png')
const DOLL_CARD= require('../../../assets/images/onboard/adamStatic2.png')

class EmptyStateComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  onStart = () => {
    const { page } = this.props
    if (page === 'card') {
      this.props.onCreateNewCard()
    } else {
      this.props.onCreateNewFeed()
    }
  }

  showVideo = () => {
    this.player.presentFullscreenPlayer();
    this.player.seek(0);
  }

  render() {
    const { page, title, subTitle, ctaTitle } = this.props

    let height = 190
    if (page === 'feed_exist') {
      height = 80
    }

    let marginTop = -125
    if (page === 'feed_exist') {
      marginTop = -40
    }

    return (
      <View style={styles.container}>
        {page === 'card' && (
          <Image source={DOLL_CARD} style={styles.doll_card} />
        )}
        {page === 'feed' && (
          <Image source={DOLL_FEED} style={styles.doll_feed} />
        )}
        {page === 'feed_exist' && (
          <Image source={DOLL_FEED} style={styles.doll_feed_exist} />
        )}

        <View style={[styles.bubbleImageView, { marginTop }]}>
          <Image source={SPEECH_BUBBLE_TOP} style={styles.bubbleView} resizeMode="stretch" />
          <ImageBackground
            source={SPEECH_BUBBLE_MIDDLE}
            resizeMode="stretch"
            style={[styles.bubbleView, { height }]}
          >
            <View style={styles.bubbleContent}>
              <Text style={styles.title}>
                {title}
              </Text>
              {subTitle.length > 0 && (
                <TouchableOpacity style={styles.videoBtn} activeOpacity={0.8} onPress={this.showVideo}>
                  <Text style={styles.videoBtnText}>
                    {subTitle}
                    <MaterialCommunityIcons name='play' size={23} color={COLORS.PURPLE} />
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.newFeedBtn} activeOpacity={0.8} onPress={this.onStart}>
                <Text style={styles.newFeedBtnText}>{ctaTitle}</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
          <Image source={SPEECH_BUBBLE_BOTTOM} style={styles.bubbleView} resizeMode="stretch" />
        </View>

        <Video
          ref={(ref) => { this.player = ref }}
          source={{ uri: 'https://player.vimeo.com/video/289041385' }}
          style={styles.video}
          resizeMode='cover'
          autoplay={false}
          paused
        />
      </View>
    )
  }
}

EmptyStateComponent.defaultProps = {
  page: 'feed',
  title: '',
  subTitle: '',
  ctaTitle: ''
}

EmptyStateComponent.propTypes = {
  page: PropTypes.string,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  ctaTitle: PropTypes.string
}

export default EmptyStateComponent