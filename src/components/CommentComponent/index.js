import React from 'react'
import {
  Text,
  Image,
  TouchableOpacity,
} from 'react-native'
import PropTypes from 'prop-types'

import { Actions } from 'react-native-router-flux'

import styles from './styles'
import * as COMMON_FUNC from '../../service/commonFunc'
import Analytics from '../../lib/firebase'

const COMMENT_ICON_B = require('../../../assets/images/Comment/Blue.png')
const COMMENT_ICON_G = require('../../../assets/images/Comment/Grey.png')

export default class CommentComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  onComment() {
    Analytics.logEvent('edit_card_commnet_icon', {})

    // Ignore Guest
    if (this.props.onComment) {
      this.props.onComment();
    }
    Actions.CommentScreen({
      idea: this.props.idea,
      guest: COMMON_FUNC.isFeedGuest(this.props.currentFeed)
    });
  }

  render() {
    const {
      comments,
    } = this.props.idea.metadata;
    return (
      <TouchableOpacity 
        style={styles.buttonWrapper}
        activeOpacity={0.7}
        onPress={() => this.onComment()}
      >
        {comments > 0
          ? <Image source={COMMENT_ICON_B} style={styles.commentIcon} />
          : <Image source={COMMENT_ICON_G} style={styles.commentIcon} />
        }
        {!this.props.isOnlyInvitee && (
          <Text style={styles.iconText}>{comments}</Text>
        )}
      </TouchableOpacity>
    );
  }
}

CommentComponent.defaultProps = {
  currentFeed: {}
}

CommentComponent.propTypes = {
  idea: PropTypes.objectOf(PropTypes.any).isRequired,
  currentFeed: PropTypes.objectOf(PropTypes.any),
  onComment: PropTypes.func,
}
