import React from 'react'
import {
  View,
  Text,
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Entypo from 'react-native-vector-icons/Entypo'
import _ from 'lodash'
import HTML from 'react-native-render-html'
var striptags = require('striptags')

import { getDurationFromNow } from '../../../service/dateUtils'
import styles from './styles'
import LikeComponent from '../../LikeComponent';
import CommentComponent from '../../CommentComponent';
import UserAvatarComponent from '../../UserAvatarComponent';

import Autolink from 'react-native-autolink';
import { COMMENT_FEATURE } from '../../../service/api'
import ExFastImage from '../../ExFastImage';
import * as COMMON_FUNC from '../../../service/commonFunc'
import CONSTANTS from '../../../service/constants'

class FeedCardListComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  render() {
    const { invitees, idea, feedo, longSelected, longHold } = this.props;
    const invitee = _.find(invitees, item => item.id === idea.inviteeId)
    let isOnlyInvitee = false
    
    if (invitee && invitees.length === 1) {
      isOnlyInvitee = true
    }

    const viewMode = COMMON_FUNC.getCardViewMode(feedo.currentFeed, idea)

    return (
      // <View style={[styles.container, longSelected && styles.selected, longHold && viewMode === CONSTANTS.CARD_VIEW && { opacity: 0.4 }]}>
      <View style={[styles.container, longSelected && styles.selected]}>
        <View style={styles.leftContainer}>
          <View>
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
                    <Text key="1" style={styles.text}>{invitee.userProfile.firstName} {invitee.userProfile.lastName}</Text>,
                    <Entypo key="2" name="dot-single" style={styles.dotIcon} />
                  ]
                }
                <Text style={styles.text}>
                  {getDurationFromNow(idea.publishedDate)}
                </Text>
              </View>
            )}

            {_.has(idea, 'idea') && idea.idea.length !== null && idea.idea.length > 0 && (
              <View style={styles.subView}>
                <Autolink
                  style={styles.title}
                  linkStyle={styles.linkStyle}
                  text={COMMON_FUNC.htmlToPlainText(striptags(idea.idea))}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  onPress={() => longHold ? {} : this.props.onLinkPress()}
                  onLongPress={() => longHold ? {} : this.props.onLinkLongPress()}
                  suppressHighlighting={true}
                />
              </View>
            )}
          </View>

          {idea !== null && idea.metadata && (
            <View style={styles.commentView}>
              <LikeComponent
                idea={idea}
                longHold={longHold}
                isOnlyInvitee={isOnlyInvitee}
                prevPage={this.props.prevPage}
                smallIcon={false}
                type="all"
              />
              {COMMENT_FEATURE && (
                <CommentComponent 
                  idea={idea}
                  longHold={longHold}
                  isOnlyInvitee={isOnlyInvitee}
                  currentFeed={feedo.currentFeed}
                  onComment={this.props.onComment}
                  prevPage={this.props.prevPage}
                  smallIcon={false}
                />
              )}
            </View>
          )}
        </View>

        {idea.coverImage && idea.coverImage.length &&
          <View style={styles.thumbnailsView}>
            <ExFastImage
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
  longHold: false,
  onLinkPress: () => {},
  onLinkLongPress: () => {}
}

FeedCardListComponent.propTypes = {
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


export default connect(mapStateToProps, mapDispatchToProps)(FeedCardListComponent)
