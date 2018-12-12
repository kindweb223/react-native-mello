import React from 'react'
import {
  View,
  Text,
  Image
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import _ from 'lodash'

import FastImage from "react-native-fast-image";
import Autolink from 'react-native-autolink';

import styles from './styles'
import LikeComponent from '../../LikeComponent';
import CommentComponent from '../../CommentComponent';
import UserAvatarComponent from '../../UserAvatarComponent';

import CONSTANTS from '../../../service/constants'

class FeedCardExtendComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      imageHeight: 120
    };
  }

  render() {
    const { invitees, idea, feedo, cardType, longSelected } = this.props;
    const { imageHeight } = this.state

    const invitee = _.find(invitees, item => item.id === idea.inviteeId)
    let isOnlyInvitee = false
    
    if (invitees.length === 1 && invitee) {
      isOnlyInvitee = true
    }

    let hasCoverImage = idea.coverImage && idea.coverImage.length > 0

    return (
      <View style={[styles.container, longSelected && styles.selected]}>
        <View style={styles.subContainer}>
          {hasCoverImage &&
            <View style={[styles.thumbnailsView, { height: imageHeight > CONSTANTS.SCREEN_HEIGHT / 2 ? CONSTANTS.SCREEN_HEIGHT / 2 : imageHeight }]}>
              <FastImage
                style={styles.thumbnails}
                source={{ uri: idea.coverImage }}
                onLoad={ 
                  e => {
                    let { height, width } = e.nativeEvent
                    let maxImgWidth = cardType === 'long' ? CONSTANTS.SCREEN_WIDTH : (CONSTANTS.SCREEN_SUB_WIDTH - 16) / 2
                    let ratio = width / maxImgWidth
                    height = height / ratio 

                    this.setState({ imageHeight: height })
                  }
                }
              />
            </View>
          }

          <View style={styles.contentContainer}>
            <View style={styles.contentView}>
              {!isOnlyInvitee && invitee && (
                <View style={styles.subView}>
                  {
                    [
                      <View key="0" style={styles.avatar}>
                        <UserAvatarComponent
                          user={invitee.userProfile}
                          size={24}
                        />
                      </View>,
                      <Text key="1" style={styles.text}>{invitee.userProfile.firstName} {invitee.userProfile.lastName}</Text>
                    ]
                  }
                </View>
              )}

              {idea.idea.length > 0 && (
                <View style={styles.subView}>
                  <Autolink
                    style={styles.title}
                    linkStyle={styles.linkStyle}
                    text={idea.idea}
                    numberOfLines={hasCoverImage ? 4 : 10}
                    ellipsizeMode="tail"
                    onPress={() => this.props.onLinkPress()}
                    onLongPress={() => this.props.onLinkLongPress()}
                    suppressHighlighting={true}
                  />
                </View>
              )}
            </View>

            {idea && (
              <View style={styles.commentView}>
                <LikeComponent idea={idea} isOnlyInvitee={isOnlyInvitee} />
                <CommentComponent 
                  idea={idea}
                  isOnlyInvitee={isOnlyInvitee}
                  currentFeed={feedo.currentFeed}
                  onComment={this.props.onComment}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    )
  }
}

FeedCardExtendComponent.defaultProps = {
  onLinkPress: () => {},
  onLinkLongPress: () => {}
}

FeedCardExtendComponent.propTypes = {
  idea: PropTypes.objectOf(PropTypes.any).isRequired,
  invitees: PropTypes.arrayOf(PropTypes.any).isRequired,
  onComment: PropTypes.func,
  onLinkPress: PropTypes.func,
  onLinkLongPress: PropTypes.func
}

const mapStateToProps = ({ card, feedo }) => ({
  card,
  feedo,
})


const mapDispatchToProps = dispatch => ({
})


export default connect(mapStateToProps, mapDispatchToProps)(FeedCardExtendComponent)
