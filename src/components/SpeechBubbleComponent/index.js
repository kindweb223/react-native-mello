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
import styles from './styles'
import COLORS from '../../service/colors'

const SPEECH_BUBBLE_TOP = require('../../../assets/images/onboard/bubbleLargeTop.png')
const SPEECH_BUBBLE_BOTTOM = require('../../../assets/images/onboard/bubbleLargeBottom.png')
const SPEECH_BUBBLE_MIDDLE = require('../../../assets/images/onboard/bubbleLargeMiddle.png')

class SpeechBubbleComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCloseBtn: false
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ showCloseBtn: nextProps.isShowCloseBubble })
  }

  render() {
    const { page } = this.props
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
            style={[styles.bubbleView]}
          >
            <View style={styles.bubbleContent}>
              <Text style={styles.title}>
                {page === 'feed' && (
                  "So you've been invited to feedo? Exciting, isn't it?!"
                )}
                {page === 'card' && (
                  "Feeds contain cards. Cards can have, images, text, attachments and likes. My granny enjoys liking."
                )}
                {page === 'pinned' && (
                  "Your pinned items will appear here. To pin a feed tap and hold it to bring up a quick actions and select PIN."
                )}
                {page === 'shared' && (
                  "Feeds can be shared with friends and colleagues for collaboration. Feeds you've been invited to will appear here."
                )}
              </Text>

              {page !== 'pinned' && (
                <TouchableOpacity style={styles.videoBtn} activeOpacity={0.8}>
                  <Text style={styles.videoBtnText}>
                    {page === 'feed' && (
                      "Watch a 15 sec Quick Start video "
                    )}
                    {page === 'card' && (
                      "Watch a 15 sec video about the cards "
                    )}
                    {page === 'shared' && (
                      "All you need to know about sharing in 15 sec "
                    )}
                    <MaterialCommunityIcons name='play' size={23} color={COLORS.PURPLE} />
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ImageBackground>
          <Image source={SPEECH_BUBBLE_BOTTOM} style={styles.bubbleView} resizeMode="stretch" />
        </View>

        {(page === 'feed' || page === 'card') && showCloseBtn && (
          <View style={[styles.closeBtnView, { top: marginTop - 10 }]}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => this.props.onCloseBubble()}>
              <MaterialIcons name='close' size={15} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    )
  }
}

SpeechBubbleComponent.defaultProps = {
  page: 'feed',
  isShowCloseBubble: false
}

SpeechBubbleComponent.propTypes = {
  page: PropTypes.string,
  isShowCloseBubble: PropTypes.bool
}

export default SpeechBubbleComponent
