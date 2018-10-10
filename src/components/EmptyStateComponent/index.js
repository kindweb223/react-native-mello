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
    if (page === 'feed') {
      this.props.onCreateNewFeed()
    } else {
      this.props.onCreateNewCard()
    }
  }

  render() {
    const { page } = this.props
    const height = page === 'feed' ? 190 : 190

    return (
      <View style={styles.container}>
        {page === 'feed'
          ? <Image source={DOLL_FEED} style={styles.doll_feed} />
          : <Image source={DOLL_CARD} style={styles.doll_card} />
        }
        <View style={styles.bubbleImageView}>
          <Image source={SPEECH_BUBBLE_TOP} style={styles.bubbleView} resizeMode="stretch" />
          <ImageBackground
            source={SPEECH_BUBBLE_MIDDLE}
            resizeMode="stretch"
            style={[styles.bubbleView, { height }]}
            capInsets={{
              left: 10, right: 30, top: 10, bottom: 10
            }}
          >
            <View style={styles.bubbleContent}>
              <Text style={styles.title}>
                {page === 'feed'
                  ? "First time here? No worries, you are in good hands..."
                  : "It's pretty boring here... Let's create some cards!"
                }
              </Text>
              <TouchableOpacity style={styles.videoBtn} activeOpacity={0.8}>
                <Text style={styles.videoBtnText}>
                  Watch a 15 sec video about cre {page === 'feed' ? 'feeds' : 'cards'}
                  <MaterialCommunityIcons name='play' size={23} color={COLORS.PURPLE} />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.newFeedBtn} activeOpacity={0.8} onPress={this.onStart}>
                <Text style={styles.newFeedBtnText}>Start your first {page}</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
          <Image source={SPEECH_BUBBLE_BOTTOM} style={styles.bubbleView} resizeMode="stretch" />
        </View>
      </View>
    )
  }
}

EmptyStateComponent.defaultProps = {
  page: 'feed'
}

EmptyStateComponent.propTypes = {
  page: PropTypes.string
}

export default EmptyStateComponent
