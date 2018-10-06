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


class LastCommentComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    this.props.getCardComments(this.props.card.currentCard.id);
  }


  UNSAFE_componentWillReceiveProps(nextProps) {
    let loading = false;
    if (this.props.card.loading !== types.GET_CARD_COMMENTS_PENDING && nextProps.card.loading === types.GET_CARD_COMMENTS_PENDING) {
      // getting comments of a card
      loading = true;
    } else if (this.props.card.loading !== types.GET_CARD_COMMENTS_FULFILLED && nextProps.card.loading === types.GET_CARD_COMMENTS_FULFILLED) {
      // success in getting comments of a card
    } this.setState({
      loading,
    });
  }

  getCommentUser(comment) {
    const { invitees } = this.props.feedo.currentFeed;
    const invitee = _.find(invitees, invitee => invitee.id === comment.huntInviteeId);
    if (invitee) {
      return invitee.userProfile;  
    }
    return null;
  }

  onAddComment() {
    Actions.CommentScreen({
      idea: this.props.card.currentCard,
      guest: COMMON_FUNC.isFeedGuest(this.props.feedo.currentFeed)
    });
  }

  onViewOldComments() {
    Actions.CommentScreen({
      idea: this.props.card.currentCard,
      guest: COMMON_FUNC.isFeedGuest(this.props.feedo.currentFeed)
    });
  }

  get renderAddComment() {
    const { userInfo } = this.props.user;
    return (
      <TouchableOpacity 
        style={styles.rowContainer}
        activeOpacity={0.6}
        onPress={this.onAddComment.bind(this)}
      >
        <UserAvatarComponent
          user={userInfo}
        />
        <Text style={styles.textAddComment}>Add comment...</Text>
      </TouchableOpacity>
    )
  }

  renderItem({item, index}) {
    const user = this.getCommentUser(item);
    const name = user ? user.firstName || user.lastName : '';
    return (
      <View style={styles.itemContainer}>
        <Text>
          <Text style={styles.textItemName}>{name}</Text>
          <Text style={styles.textItemComment}>  {item.content}</Text>
        </Text>
      </View>
    );
  }

  render () {
    const { currentComments } = this.props.card;
    const { feedo } = this.props;
    let lastComments = [];
    let oldCommentsLength = 0;
    if (currentComments) {
      lastComments = currentComments.slice(0, 2);
      oldCommentsLength = currentComments.length > 2 ? currentComments.length - 2 : 0;
    }
    return (
      <View style={styles.container}>
        <FlatList
          data={lastComments}
          renderItem={this.renderItem.bind(this)}
          keyExtractor={(item, index) => index.toString()}
          extraData={this.props}
        />
        { 
          oldCommentsLength > 0 && 
          <TouchableOpacity 
            style={styles.itemContainer}
            activeOpacity={0.6}
            onPress={this.onViewOldComments.bind(this)}
          >
            <Text style={[styles.textItemComment, {color: COLORS.DARK_GREY}]}>View {oldCommentsLength} older comments</Text>
          </TouchableOpacity>
        }
        {!COMMON_FUNC.isFeedGuest(feedo.currentFeed) && this.renderAddComment}
      </View>
    );
  }
}


LastCommentComponent.defaultProps = {
}


LastCommentComponent.propTypes = {
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