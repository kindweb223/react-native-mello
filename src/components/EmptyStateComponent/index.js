import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native'
import PropTypes from 'prop-types'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import styles from './styles'
import COLORS from '../../service/colors'

const SPEECH_BUBBLE_LARGE = require('../../../assets/images/onboard/textBubble1.png')
const SPEECH_BUBBLE_MEDIUM = require('../../../assets/images/onboard/textBubble3.png')
const SPEECH_BUBBLE_SMALL = require('../../../assets/images/onboard/textBubble2.png')
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

    return (
      <View style={styles.container}>
        {page === 'feed'
          ? <Image source={DOLL_FEED} style={styles.doll_feed} />
          : <Image source={DOLL_CARD} style={styles.doll_card} />
        }
        <View style={styles.bubbleView}>
          <Image source={SPEECH_BUBBLE_LARGE} style={styles.bubble} />
          <View style={styles.bubbleContent}>
            <Text style={styles.title}>
              {page === 'feed'
                ? "First time here? No worries, you are in good hands..."
                : "It's pretty boring here... Let's create some cards!"
              }
            </Text>
            <TouchableOpacity style={styles.videoBtn} activeOpacity={0.8}>
              <Text style={styles.videoBtnText}>
                Watch a 15sec video about creating {page === 'feed' ? 'feeds' : 'cards'}
              </Text>
              <MaterialCommunityIcons name='play' size={23} color={COLORS.PURPLE} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.newFeedBtn} activeOpacity={0.8} onPress={this.onStart}>
              <Text style={styles.newFeedBtnText}>Start your first {page}</Text>
            </TouchableOpacity>
          </View>
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
