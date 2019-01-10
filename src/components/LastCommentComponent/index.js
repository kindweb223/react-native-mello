import React from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'

import { Actions } from 'react-native-router-flux'
import _ from 'lodash';

import styles from './styles'
import COLORS from '../../service/colors'
import * as types from '../../redux/card/types'
import { 
  getCardComments,
} from '../../redux/card/actions'
import UserAvatarComponent from '../../components/UserAvatarComponent';
import * as COMMON_FUNC from '../../service/commonFunc'
import Analytics from '../../lib/firebase'

class LastCommentComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      currentComments: []
    };
  }

  componentDidMount() {
    this.props.getCardComments(this.props.card.currentCard.id);
  }


  UNSAFE_componentWillReceiveProps(nextProps) {
    let loading = false;
    if (this.props.card.loading !== types.GET_CARD_COMMENTS_PENDING && nextProps.card.loading === types.GET_CARD_COMMENTS_PENDING) {
      loading = true;
    } else if (this.props.card.loading !== types.GET_CARD_COMMENTS_FULFILLED && nextProps.card.loading === types.GET_CARD_COMMENTS_FULFILLED) {
      if (nextProps.card.currentCardId === nextProps.card.currentCard.id) {
        this.setState({ currentComments: nextProps.card.currentComments })
      }
    } if (this.props.card.loading !== types.ADD_CARD_COMMENT_FULFILLED && nextProps.card.loading === types.ADD_CARD_COMMENT_FULFILLED) {
      if (nextProps.card.currentCardId === nextProps.card.currentCard.id || nextProps.card.currentCardId === this.props.idea.id) {
        this.setState({ currentComments: nextProps.card.currentComments })
      }
    } else if (this.props.card.loading !== types.EDIT_CARD_COMMENT_FULFILLED && nextProps.card.loading === types.EDIT_CARD_COMMENT_FULFILLED) {
      // success in adding a comment of a card
      if (nextProps.card.currentCardId === nextProps.card.currentCard.id || nextProps.card.currentCardId === this.props.idea.id) {
        this.setState({ currentComments: nextProps.card.currentComments })
      }
    } else if (this.props.card.loading !== types.DELETE_CARD_COMMENT_FULFILLED && nextProps.card.loading === types.DELETE_CARD_COMMENT_FULFILLED) {
      // success in adding a comment of a card
      if (nextProps.card.currentCardId === nextProps.card.currentCard.id || nextProps.card.currentCardId === this.props.idea.id) {
        this.setState({ currentComments: nextProps.card.currentComments })
      }
    } else if (this.props.card.loading !== types.DELETE_CARD_COMMENT_FULFILLED && nextProps.card.loading === types.DELETE_CARD_COMMENT_FULFILLED) {
      // success in adding a comment of a card
      if (nextProps.card.currentCardId === nextProps.card.currentCard.id || nextProps.card.currentCardId === this.props.idea.id) {
        this.setState({ currentComments: nextProps.card.currentComments })
      }
    } 
    
    this.setState({ loading })
  }

  getCommentUser(comment) {
    const { invitees } = this.props.feedo.currentFeed;
    const invitee = _.find(invitees, invitee => invitee.id === comment.huntInviteeId);
    if (invitee) {
      return invitee.userProfile;  
    }
    return null;
  }

  onViewOldComments() {
    Analytics.logEvent('edit_card_view_old_comments', {})

    if (this.props.prevPage === 'activity') {
      Actions.ActivityCommentScreen({
        idea: this.props.card.currentCard,
        guest: COMMON_FUNC.isFeedGuest(this.props.feedo.currentFeed)
      });
    } else {
      Actions.CommentScreen({
        idea: this.props.card.currentCard,
        guest: COMMON_FUNC.isFeedGuest(this.props.feedo.currentFeed)
      });
    }
  }

  renderItem({item, index}) {
    const user = this.getCommentUser(item);
    const name = user ? user.firstName || user.lastName : '';
    return (
      <View style={styles.itemContainer}>
        <UserAvatarComponent
          user={user}
        />
        <Text style={styles.commentTextView}>
          <Text style={styles.commenterName}>{name}</Text>
          <Text> </Text>
          <Text style={styles.commentText}>{item.content}</Text>
        </Text>
      </View>
    );
  }

  render () {
    const { currentComments } = this.state;

    let lastComments = [];
    let oldCommentsLength = 0;
    if (currentComments) {
      lastComments = currentComments.slice(0, 2);
      oldCommentsLength = currentComments.length > 2 ? currentComments.length - 2 : 0;
    }

    return (
      <View style={[styles.container, currentComments.length > 0 && { paddingVertical: 16 }]}>
        <FlatList
          data={lastComments}
          renderItem={this.renderItem.bind(this)}
          keyExtractor={(item, index) => index.toString()}
          extraData={this.props}
        />
        { 
          oldCommentsLength > 0 && 
          <TouchableOpacity 
            style={styles.viewAllContainer}
            activeOpacity={0.6}
            onPress={this.onViewOldComments.bind(this)}
          >
            {/* <Text style={[styles.textItemComment, {color: COLORS.DARK_GREY}]}>View {oldCommentsLength} older comments</Text> */}
            <Text style={[styles.commentText]}>View all comments</Text>
          </TouchableOpacity>
        }
      </View>
    );
  }
}

const mapStateToProps = ({ feedo, card, user }) => ({
  feedo,
  card,
  user,
})


const mapDispatchToProps = dispatch => ({
  getCardComments: (ideaId) => dispatch(getCardComments(ideaId)),
})


export default connect(mapStateToProps, mapDispatchToProps)(LastCommentComponent)