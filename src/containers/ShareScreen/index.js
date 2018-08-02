import React from 'react'
import {
  View,
  Text, 
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
  Image
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Feather from 'react-native-vector-icons/Feather'
import Entypo from 'react-native-vector-icons/Entypo'
import styles from './styles'
const LINK_ICON = require('../../../assets/images/Link/White.png')
const PLUS_ICON = require('../../../assets/images/Add/White.png')
const CLOSE_ICON = require('../../../assets/images/Close/Blue.png')

class ShareScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    this.animatedPlusButton = new Animated.Value(1);
    this.animatedLinkButton = new Animated.Value(1);
  }

  onPlusPressInAddFeed() {
    Animated.timing(this.animatedPlusButton, {
      toValue: 0.8,
      duration: 100,
    }).start();
  }

  onPlusPressOutAddFeed() {
    Animated.timing(this.animatedPlusButton, {
      toValue: 1,
      duration: 100,
    }).start();
  }

  onLinkPressInAddFeed() {
    Animated.timing(this.animatedLinkButton, {
      toValue: 0.8,
      duration: 100,
    }).start();
  }

  onLinkPressOutAddFeed() {
    Animated.timing(this.animatedLinkButton, {
      toValue: 1,
      duration: 100,
    }).start();
  }

  render () {
    return (
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.onClose()} style={styles.closeButton}>
            <Image source={CLOSE_ICON} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.props.handleSettingItem('Share')}>
            <View style={styles.shareButtonView}>
              <Entypo name="share-alternative" style={styles.shareIcon} />
              <Text style={styles.shareButtonText}>Share link</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <View style={styles.listItem}>
            <View style={styles.innerView}>
              <Animated.View 
                style={[styles.plusButtonView, 
                  {
                    transform: [
                      { scale: this.animatedPlusButton },
                    ],
                  },
                ]}
              >
                <TouchableWithoutFeedback
                  onPressIn={this.onPlusPressInAddFeed.bind(this)}
                  onPressOut={this.onPlusPressOutAddFeed.bind(this)}
                >
                  <View style={styles.plusButton}>
                    <Image source={PLUS_ICON} />
                  </View>
                </TouchableWithoutFeedback>
              </Animated.View>
              <Text style={styles.title}>Invite people</Text>
            </View>
          </View>

          <View style={styles.listItem}>
            <View style={styles.innerView}>
              <Animated.View 
                style={[styles.plusButtonView, 
                  {
                    transform: [
                      { scale: this.animatedLinkButton },
                    ],
                  },
                ]}
              >
                <TouchableWithoutFeedback
                  onPressIn={this.onLinkPressInAddFeed.bind(this)}
                  onPressOut={this.onLinkPressOutAddFeed.bind(this)}
                >
                  <View style={styles.linkButton}>
                    <Image source={LINK_ICON} />
                  </View>
                </TouchableWithoutFeedback>
              </Animated.View>

              <View style={styles.tileView}>
                <Text style={styles.title}>Invite people</Text>
                <Text style={styles.description}>Anyone with the link can view</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.rightView}>
              <Text style={styles.viewText}>View</Text>
              <Entypo name="cog" style={styles.cogIcon} />
            </TouchableOpacity>

          </View>
        </View>
      </View>
    )
  }
}

ShareScreen.defaultProps = {
  onClose: () => {}
}

ShareScreen.propTypes = {
  onClose: PropTypes.func
}

const mapStateToProps = ({ feedo }) => ({
  feedo
})

export default connect(
  mapStateToProps,
  null
)(ShareScreen)
