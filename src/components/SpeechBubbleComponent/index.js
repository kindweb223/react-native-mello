import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native'
import PropTypes from 'prop-types'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import styles from './styles'
import COLORS from '../../service/colors'

const SPEECH_BUBBLE_MEDIUM = require('../../../assets/images/onboard/textBubble3.png')
const SPEECH_BUBBLE_SMALL = require('../../../assets/images/onboard/textBubble2.png')

class SpeechBubbleComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { page } = this.props
    const margin = page === 'feed' ? 0 : 20

    return (
      <View style={styles.container}>
        <View style={[styles.bubbleView, { marginTop: margin }]}>
          {page === 'feed'
            ? <Image source={SPEECH_BUBBLE_SMALL} style={styles.bubble} />
            : <Image source={SPEECH_BUBBLE_MEDIUM} style={styles.bubble} />
          }
          <View style={styles.bubbleContent}>
            <Text style={styles.title}>
              {page === 'feed'
                ? "So you've been invited to feedo? Exciting, isn't it?!"
                : "Feeds contain cards, Cards can have, images, text, attachments and likes. My granny enjoys liking."
              }
            </Text>
            <TouchableOpacity style={styles.videoBtn} activeOpacity={0.8}>
              <Text style={styles.videoBtnText}>
                {page === 'feed'
                  ? "Watch a 15sec Quick Start video"
                  : "Watch a 15sec video about the cards"
                }
              </Text>
              <MaterialCommunityIcons name='play' size={23} color={COLORS.PURPLE} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.closeBtnView, { top: margin - 10 }]}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => this.props.onCloseBubble()}>
            <MaterialIcons name='close' size={15} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

SpeechBubbleComponent.defaultProps = {
  page: 'feed'
}

SpeechBubbleComponent.propTypes = {
  page: PropTypes.string
}

export default SpeechBubbleComponent
