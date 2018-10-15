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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Video from 'react-native-video'

import styles from './styles'
import COLORS from '../../service/colors'

const SPEECH_BUBBLE_TOP = require('../../../assets/images/onboard/bubbleLargeTop.png')
const SPEECH_BUBBLE_BOTTOM = require('../../../assets/images/onboard/bubbleLargeBottom.png')
const SPEECH_BUBBLE_MIDDLE = require('../../../assets/images/onboard/bubbleLargeMiddle.png')

class SpeechBubbleComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCloseBtn: false,
      videoPaused: true
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ showCloseBtn: nextProps.showBubbleCloseButton })
  }

  showVideo = () => {
    this.player.presentFullscreenPlayer();
    this.player.seek(0);
    this.setState({ videoPaused: false })
  }

  render() {
    const { page, title, subTitle } = this.props
    const { showCloseBtn } = this.state

    const marginTop = 20
    
    // let height = 90
    // if (page === 'feed') {
    //   height = 90
    // } else if (page === 'card') {
    //   height = 130
    // } else if (page === 'pinned') {
    //   height = 75
    // } else {
    //   height = 160
    // }

    return (
      <View style={styles.container}>
        <View style={styles.bubbleImageView}>
          <Image source={SPEECH_BUBBLE_TOP} style={[styles.bubbleView, { marginTop }]} resizeMode="stretch" />
          <ImageBackground
            source={SPEECH_BUBBLE_MIDDLE}
            resizeMode="stretch"
            style={[styles.bubbleView, page === 'feed' && { height: 90 }]}
          >
            <View style={styles.bubbleContent}>
              {page === 'pinned' 
                ? <Text style={styles.title}>
                    <Text>{title}</Text>
                    <Text style={{ fontWeight: 'bold'}}> PIN.</Text>
                  </Text>
                : <Text style={styles.title}>
                    {title}
                  </Text>
              }

              {page !== 'pinned' && (
                <TouchableOpacity style={styles.videoBtn} activeOpacity={0.8} onPress={this.showVideo}>
                  <Text style={styles.videoBtnText}>
                    {subTitle}
                    <MaterialCommunityIcons name='play' size={23} color={COLORS.PURPLE} />
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ImageBackground>
          <Image source={SPEECH_BUBBLE_BOTTOM} style={styles.bubbleView} resizeMode="stretch" />
        </View>

        {showCloseBtn && (
          <View style={[styles.closeBtnView, { top: marginTop - 10 }]}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => this.props.onCloseBubble()}>
              <MaterialIcons name='close' size={15} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        <Video
          ref={(ref) => { this.player = ref }}
          source={{ uri: 'https://d5qq4b94z26us.cloudfront.net/solvers/videos/SOLVERS_FINAL.mp4' }}
          style={styles.video}
          resizeMode='cover'
          autoplay={false}
          paused={this.state.videoPaused}
          onFullscreenPlayerWillDismiss={() => {
            this.setState({ videoPaused: true })
          }}
        />
      </View>
    )
  }
}

SpeechBubbleComponent.defaultProps = {
  page: 'feed',
  title: '',
  subTitle: '',
  showBubbleCloseButton: false
}

SpeechBubbleComponent.propTypes = {
  page: PropTypes.string,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  showBubbleCloseButton: PropTypes.bool
}

export default SpeechBubbleComponent
