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
      loading: false
    };
  }

  render() {
    const { invitees, idea, feedo, cardType, longSelected, longHold } = this.props;

    const invitee = _.find(invitees, item => item.id === idea.inviteeId)
    let isOnlyInvitee = false
    
    if (invitees.length === 1 && invitee) {
      isOnlyInvitee = true
    }

    let hasCoverImage = idea.coverImage && idea.coverImage.length > 0
    let cardHeight = 0
    if (hasCoverImage) {
      const coverImageData = _.find(idea.files, file => file.accessUrl === idea.coverImage)
      const cardWidth = (CONSTANTS.SCREEN_SUB_WIDTH - 16) / 2
      if (coverImageData.metadata) {
        const ratio = coverImageData.metadata.width / cardWidth
        cardHeight = coverImageData.metadata.height / ratio
      } else {
        cardHeight = 160
      }
    }

    return (
      <View style={[styles.container, longSelected && styles.selected]}>
        <View style={styles.subContainer}>
          {hasCoverImage &&
            <View style={[styles.thumbnailsView, { height: cardHeight }]}>
              <FastImage
                style={styles.thumbnails}
                source={{ uri: idea.coverImage }}
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
                    onPress={() => longHold ? {} : this.props.onLinkPress()}
                    onLongPress={() => longHold ? {} : this.props.onLinkLongPress()}
                    suppressHighlighting={true}
                  />
                </View>
              )}
            </View>

            {idea && (
              <View style={styles.commentView}>
                <LikeComponent
                  idea={idea}
                  longHold={longHold}
                  isOnlyInvitee={isOnlyInvitee}
                  prevPage={this.props.prevPage}
                  type="all"
                />
                <CommentComponent 
                  idea={idea}
                  longHold={longHold}
                  isOnlyInvitee={isOnlyInvitee}
                  currentFeed={feedo.currentFeed}
                  onComment={this.props.onComment}
                  prevPage={this.props.prevPage}
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
  longHold: false,
  onLinkPress: () => {},
  onLinkLongPress: () => {}
}

FeedCardExtendComponent.propTypes = {
  longHold: PropTypes.bool,
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
