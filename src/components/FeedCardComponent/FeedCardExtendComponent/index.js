import React from 'react'
import {
  View,
  Text,
  Image,
  ScrollView
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import _ from 'lodash'
import HTML from 'react-native-render-html'
import Autolink from 'react-native-autolink';
import styles from './styles'
import LikeComponent from '../../LikeComponent';
import CommentComponent from '../../CommentComponent';
import UserAvatarComponent from '../../UserAvatarComponent';
import ExFastImage from '../../ExFastImage';

import CONSTANTS from '../../../service/constants'
import { COMMENT_FEATURE } from '../../../service/api'
import * as COMMON_FUNC from '../../../service/commonFunc'

class FeedCardExtendComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  render() {
    const { invitees, idea, feedo, cardType, longSelected, longHold, imageHeight, masonryData } = this.props;

    const invitee = _.find(invitees, item => item.id === idea.inviteeId)
    let isOnlyInvitee = false

    if (invitee && invitees.length === 1) {
      isOnlyInvitee = true
    }

    const hasCoverImage = idea.coverImage && idea.coverImage.length > 0
    const viewMode = COMMON_FUNC.getCardViewMode(feedo.currentFeed, idea)

    return (
      // <View style={[styles.container, longSelected && styles.selected, longHold && viewMode === CONSTANTS.CARD_VIEW && { opacity: 0.4 }]}>
      <View style={[styles.container, longSelected && styles.selected]}>
        <View style={styles.subContainer}>
          {hasCoverImage &&
            <View style={[styles.thumbnailsView, { height: imageHeight }]}>
              <ExFastImage
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

              {_.has(idea, 'idea') && idea.idea.length !== null && idea.idea.length > 0 && (
                <View style={[styles.htmlView, { height: masonryData.contentHeight - 80 }]}>
                  <HTML
                    html={this.addExternalParagraphIfNeeded(masonryData.clipText)}
                    containerStyle={styles.textHtmlIdea}
                    onLinkPress={(evt, href) => this.onPressLink(href)}
                    classesStyles={CONSTANTS.HTML_CLASS_STYLES}
                    tagsStyles={CONSTANTS.HTML_TAGS_STYLE_MASONRY}
                  />
                  {/* <Autolink
                    style={styles.title}
                    linkStyle={styles.linkStyle}
                    text={striptags(idea.idea)}
                    numberOfLines={hasCoverImage ? 4 : 10}
                    ellipsizeMode="tail"
                    onPress={() => longHold ? {} : this.props.onLinkPress()}
                    onLongPress={() => longHold ? {} : this.props.onLinkLongPress()}
                    suppressHighlighting={true}
                  /> */}
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
                    smallIcon={false}
                    prevPage={this.props.prevPage}
                  />
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    )
  }

  // Used for cards with no format
  addExternalParagraphIfNeeded(text) {
    if (text.includes('<p>')) {
      return text
    } else {
      return '<p>' + text + '</p>'
    }
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
