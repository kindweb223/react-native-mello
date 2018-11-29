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

class FeedCardListComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  render() {
    const { invitees, idea, feedo } = this.props;
    const invitee = filter(invitees, item => item.id === idea.inviteeId)[0]
    let isOnlyInvitee = false
    
    if (invitees.length === 1 && invitees[0].userProfile.id === invitee.userProfile.id) {
      isOnlyInvitee = true
    }

    return (
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <View>
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
                    <Text key="1" style={styles.text}>{invitee.userProfile.firstName} {invitee.userProfile.lastName}</Text>,
                    <Entypo key="2" name="dot-single" style={styles.dotIcon} />
                  ]
                }
                <Text style={styles.text}>
                  {getDurationFromNow(idea.publishedDate)}
                </Text>
              </View>
            )}

            {idea.idea.length > 0 && (
              <View style={styles.subView}>
                <Autolink
                  style={styles.title}
                  linkStyle={styles.linkStyle}
                  text={idea.idea}
                  numberOfLines={2}
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

        {idea.coverImage && idea.coverImage.length && 
          <View style={styles.thumbnailsView}>
            <FastImage
              style={styles.thumbnails}
              source={{ uri: idea.coverImage }}
            />
          </View>
        }
      </View>
    )
  }
}

FeedCardListComponent.defaultProps = {
  onLinkPress: () => {},
  onLinkLongPress: () => {}
}

FeedCardListComponent.propTypes = {
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


export default connect(mapStateToProps, mapDispatchToProps)(FeedCardListComponent)
