import React from 'react'
import {
  View,
  Text,
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Entypo from 'react-native-vector-icons/Entypo'
import { filter } from 'lodash'

import { getDurationFromNow } from '../../../service/dateUtils'
import styles from './styles'
import LikeComponent from '../../LikeComponent';
import CommentComponent from '../../CommentComponent';
import UserAvatarComponent from '../../UserAvatarComponent';

import FastImage from "react-native-fast-image";
import Autolink from 'react-native-autolink';

class FeedCardExtendComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  render() {
    const { invitees, idea, feedo, height, cardType } = this.props;
    const invitee = filter(invitees, item => item.id === idea.inviteeId)[0]
    let isOnlyInvitee = false
    
    if (invitees.length === 1 && invitees[0].userProfile.id === invitee.userProfile.id) {
      isOnlyInvitee = true
    }

    let hasCoverImage = idea.coverImage && idea.coverImage.length > 0

    console.log('HEIGHT: ', height)

    let containerHeight = height
    let thumbnailHeight = height / 2
    let contentHeight = height / 2

    if (cardType === 'long') {
      if (!hasCoverImage) {
        containerHeight = height * 2 / 3
        contentHeight = containerHeight
      } else {
        thumbnailHeight = containerHeight * 2 / 3
        contentHeight = containerHeight / 3
      }
    } else {
      if (!hasCoverImage) {
        contentHeight = containerHeight
      }
    }

    return (
      <View style={[styles.container, { height: containerHeight }]}>
        <View style={styles.subContainer}>
          {hasCoverImage &&
            <View style={[styles.thumbnailsView, { height: thumbnailHeight }]}>
              <FastImage
                style={styles.thumbnails}
                source={{ uri: idea.coverImage }}
              />
            </View>
          }

          <View style={[styles.contentContainer, { height: contentHeight }]}>
            <View style={styles.contentView}>
              {!isOnlyInvitee && (
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
                    numberOfLines={hasCoverImage ? 2 : 4}
                    ellipsizeMode="tail"
                    onPress={() => this.props.onLinkPress()}
                    onLongPress={() => this.props.onLinkLongPress()}
                    suppressHighlighting={true}
                  />
                </View>
              )}
            </View>

            <View style={styles.commentView}>
              <LikeComponent idea={idea} isOnlyInvitee={isOnlyInvitee} />
              <CommentComponent 
                idea={idea}
                isOnlyInvitee={isOnlyInvitee}
                currentFeed={feedo.currentFeed}
                onComment={this.props.onComment}
              />
            </View>
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
