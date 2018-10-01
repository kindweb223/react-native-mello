import React from 'react'
import {
  View,
  Text,
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Entypo from 'react-native-vector-icons/Entypo'
import { filter } from 'lodash'
import Image from 'react-native-image-progress'

import COLORS from '../../service/colors'
import { getDurationFromNow } from '../../service/dateUtils'
import styles from './styles'
import LikeComponent from '../LikeComponent';
import CommentComponent from '../CommentComponent';
import UserAvatarComponent from '../UserAvatarComponent';

import * as COMMON_FUNC from '../../service/commonFunc'
import FastImage from "react-native-fast-image";

class FeedCardComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  get renderBottom() {
    const { invitees, idea, feedo } = this.props;
    const invitee = filter(invitees, item => item.id === idea.inviteeId)[0]
    let isOnlyInvitee = false
    
    if (invitees.length === 1 && invitees[0].userProfile.id === invitee.userProfile.id) {
      isOnlyInvitee = true
    }
  
    return (
      <View style={styles.bottomContainer}>
        <View style={styles.subView}>
          {
            !isOnlyInvitee &&
              [
                <View key="0" style={styles.avatar}>
                  <UserAvatarComponent
                    user={invitee.userProfile}
                    size={30}
                  />
                </View>,
                <Text key="1" style={styles.text}>{invitee.userProfile.firstName}</Text>,
                <Entypo key="2" name="dot-single" style={styles.dotIcon} />
              ]
          }
          <Text style={styles.text}>
            {getDurationFromNow(idea.publishedDate)}
          </Text>
        </View>
        {!isOnlyInvitee && (
          <View style={styles.subView}>
            <LikeComponent idea={idea} />
            <CommentComponent 
              idea={idea}
              currentFeed={feedo.currentFeed}
              onComment={this.props.onComment}
            />
          </View>
        )}
      </View>
    )
  }

  render() {
    const {
      idea,
    } = this.props;

    return (
      <View style={styles.container}>
        {idea.coverImage && idea.coverImage.length && 
          <View style={styles.thumbnailsView}>
            <FastImage
              style={styles.thumbnails}
              source={{uri: idea.coverImage}}
            />
          </View>
        }
        {idea.idea
          ? <Text style={styles.title} numberOfLines={3} ellipsizeMode="tail">{idea.idea}</Text>
          : <Text style={styles.greyTitle}>New Card</Text>
        }
        {this.renderBottom}
      </View>
    )
  }
}

FeedCardComponent.propTypes = {
  idea: PropTypes.objectOf(PropTypes.any).isRequired,
  invitees: PropTypes.arrayOf(PropTypes.any).isRequired,
  onComment: PropTypes.func,
}

const mapStateToProps = ({ card, feedo }) => ({
  card,
  feedo,
})


const mapDispatchToProps = dispatch => ({
})


export default connect(mapStateToProps, mapDispatchToProps)(FeedCardComponent)
