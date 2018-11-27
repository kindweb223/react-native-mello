import React from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  Keyboard,
  Alert,
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Actions } from 'react-native-router-flux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import _ from 'lodash';
import Swipeout from 'react-native-swipeout';

import styles from './styles'
import COLORS from '../../service/colors'
import LoadingScreen from '../LoadingScreen';
import * as types from '../../redux/card/types'
import { 
  getCardComments,
  addCardComment,
  updateCardComment,
  deleteCardComment,
} from '../../redux/card/actions'
import { getDurationFromNow } from '../../service/dateUtils'
import InputToolbarComponent from '../../components/InputToolbarComponent';
import UserAvatarComponent from '../../components/UserAvatarComponent';
import * as COMMON_FUNC from '../../service/commonFunc'

import Analytics from '../../lib/firebase'
import pubnub from '../../lib/pubnub'

class CommentScreen extends React.Component {
  static renderLeftButton(props) {
    return (
      <TouchableOpacity 
        style={styles.buttonWrapper}
        activeOpacity={0.6}
        onPress={() => Actions.pop()}
      >
        <Ionicons name="ios-arrow-back" size={32} color={COLORS.PURPLE} />
      </TouchableOpacity>
    );
  }

  static renderTitle(props) {
    return (
      <Text style={styles.textTitle}>Comments</Text>
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedItemIndex: -1,
      comment: '',
      loading: false,
      isShowKeyboard: false,
    };
    this.keyboardHeight = new Animated.Value(0);
    this.userInfo = {};
  }

  componentDidMount() {
    Analytics.setCurrentScreen('CommentScreen')

    this.keyboardWillShowSubscription = Keyboard.addListener('keyboardWillShow', (e) => this.keyboardWillShow(e));
    this.keyboardWillHideSubscription = Keyboard.addListener('keyboardWillHide', (e) => this.keyboardWillHide(e));
    this.props.getCardComments(this.props.idea.id);
    if (this.props.isShowKeyboard) {
      this.setState({
        isShowKeyboard: this.props.isShowKeyboard,
      });
      this.inputToolbarRef.focus();
    }

    // Subscribe to comments channel for new comments and updates
    console.log("Subscribe to: ", this.props.idea.id + '_comments')
    pubnub.subscribe({
      channels: [this.props.idea.id + '_comments'],
    });
  }

  componentWillUnmount() {
    this.keyboardWillShowSubscription.remove();
    this.keyboardWillHideSubscription.remove();

    // Unsubscribe to comments channel for new comments and updates
    console.log("Unsubscribe from: ", this.props.idea.id + '_comments')
    pubnub.unsubscribe({
      channels: [this.props.idea.id + '_comments'],
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let loading = false;
    if (this.props.card.loading !== types.GET_CARD_COMMENTS_PENDING && nextProps.card.loading === types.GET_CARD_COMMENTS_PENDING) {
      // getting comments of a card
      loading = false;
    } else if (this.props.card.loading !== types.GET_CARD_COMMENTS_FULFILLED && nextProps.card.loading === types.GET_CARD_COMMENTS_FULFILLED) {
      // success in getting comments of a card
    } else if (this.props.card.loading !== types.ADD_CARD_COMMENT_PENDING && nextProps.card.loading === types.ADD_CARD_COMMENT_PENDING) {
      // adding a comment of a card
      loading = false;
    } else if (this.props.card.loading !== types.ADD_CARD_COMMENT_FULFILLED && nextProps.card.loading === types.ADD_CARD_COMMENT_FULFILLED) {
      // success in adding a comment of a card
    } else if (this.props.card.loading !== types.EDIT_CARD_COMMENT_PENDING && nextProps.card.loading === types.EDIT_CARD_COMMENT_PENDING) {
      // editing a comment of a card
      loading = false;
    } else if (this.props.card.loading !== types.EDIT_CARD_COMMENT_FULFILLED && nextProps.card.loading === types.EDIT_CARD_COMMENT_FULFILLED) {
      // success in adding a comment of a card
    } else if (this.props.card.loading !== types.DELETE_CARD_COMMENT_PENDING && nextProps.card.loading === types.DELETE_CARD_COMMENT_PENDING) {
      // delete a comment of a card
      loading = false;
    } else if (this.props.card.loading !== types.DELETE_CARD_COMMENT_FULFILLED && nextProps.card.loading === types.DELETE_CARD_COMMENT_FULFILLED) {
      // success in adding a comment of a card
    } 

    this.setState({
      loading,
    });

    // showing error alert
    let error = nextProps.feedo.error;
    if (!error) {
      error = nextProps.card.error;
    }
    if (error) {
      let errorMessage = null;
      if (error.error) {
        errorMessage = error.error;
      } else {
        errorMessage = error.message;
      }
      if (errorMessage) {
        Alert.alert('Error', errorMessage, [
          {text: 'Close'},
        ]);
      }
      return;
    }
  }

  keyboardWillShow(e) {
    if (Actions.currentScene !== 'CommentScreen') {
      return;
    }
    Animated.timing(
      this.keyboardHeight, {
        toValue:  e.endCoordinates.height,
        duration: e.duration,
      }
    ).start();
    this.setState({
      isShowKeyboard: true,
    });
  }

  keyboardWillHide(e) {
    if (Actions.currentScene !== 'CommentScreen') {
      return;
    }
    Animated.timing(
      this.keyboardHeight, {
        toValue:  0,
        duration: e.duration,
      }
    ).start(() => {
      this.setState({
        isShowKeyboard: false,
      });
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

  get renderEdit() {
    return (
      <View style={styles.swipeItemContainer}>
        <FontAwesome name='pencil' size={25} color={COLORS.MEDIUM_GREY} />
      </View>
    );
  }
  
  get renderDelete() {
    return (
      <View style={styles.swipeItemContainer}>
        <FontAwesome name='trash' size={25} color='#fff' />
      </View>
    );
  }

  onEdit(index) {
    this.setState({
      selectedItemIndex: index,
      comment: this.props.card.currentComments[index].content,
    });
    this.inputToolbarRef.focus();
  }

  onConfirmDelete(index) {
    Alert.alert(
      '',
      'Are you sure you want to delete this comment?',
      [
        {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: () => this.onDelete(index)},
      ],
      { cancelable: false }
    )
  }

  onDelete(index) {
    this.setState({ 
      comment: '',
      selectedItemIndex: -1,
    });
    this.props.deleteCardComment(
      this.props.idea.id, 
      this.props.card.currentComments[index].id,
    );
  }

  onSend() {
    if (this.state.selectedItemIndex === -1) {
      this.props.addCardComment(this.props.idea.id, this.state.comment);
    } else {
      this.props.updateCardComment(
        this.props.idea.id, 
        this.props.card.currentComments[this.state.selectedItemIndex].id,
        this.state.comment
      );
    }
    this.setState({ 
      comment: '',
      selectedItemIndex: -1,
    });
  }

  onChangeText(comment) {
    this.setState({ comment });
  }

  renderItem({item, index}) {
    const { currentFeed } = this.props.feedo
    let user = {}
    if (this.props.prevPage === 'idea') {
      user = this.getCommentUser(item);
    } else {
      user = this.props.instigatorData
    }

    let editable = false
    if (COMMON_FUNC.isFeedOwnerEditor(currentFeed) && user && user.id === this.props.user.userInfo.id) {
      editable = true
    }

    let swipeoutBtns = []
    if (editable) {
      swipeoutBtns = [
        {
          component: this.renderEdit,
          backgroundColor: COLORS.SOFT_GREY,
          onPress: () => this.onEdit(index),
        },
        {
          component: this.renderDelete,
          backgroundColor: COLORS.DARK_RED,
          onPress: () => this.onConfirmDelete(index),
        }
      ];
    } else {
      swipeoutBtns = [
        {
          component: this.renderDelete,
          backgroundColor: COLORS.DARK_RED,
          onPress: () => this.onConfirmDelete(index),
        }
      ];
    }

    // const enabled = user && user.id === this.props.user.userInfo.id;
    let enabled = true
    if (COMMON_FUNC.isFeedContributorGuest(currentFeed)) {
      enabled = false
      if (user && user.id === this.props.user.userInfo.id) {
        enabled = true
      }
    }

    const name = user ? `${user.firstName} ${user.lastName}` : '';

    return (
      <Swipeout
        style={[styles.itemContainer, this.state.selectedItemIndex === index && {backgroundColor: '#4A00CD0A'}]}
        disabled={!enabled}
        autoClose={true}
        right={swipeoutBtns}
      > 
        <View style={styles.itemContentContainer}>
          {user && (
            <UserAvatarComponent
              user={user}
              size={32}
            />
          )}
          <View style={styles.textsContainer}>
            <View style={styles.rowContainer}>
              <Text style={styles.textItemName}>{name}</Text>
              <Entypo name='dot-single' size={12} color={COLORS.DARK_GREY} />
              <Text style={styles.textItemTime}>{getDurationFromNow(item.created)}</Text>
            </View>
            <Text style={styles.textItemComment}>{item.content}</Text>
          </View>
        </View>
      </Swipeout>
    );
  }

  render () {
    return (
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={{ paddingVertical: 16 }}
          data={this.props.card.currentComments}
          renderItem={this.renderItem.bind(this)}
          keyExtractor={(item, index) => index.toString()}
          extraData={this.state}
        />
        {!this.props.guest && (
          <Animated.View style={{ marginBottom: this.keyboardHeight }}>
            <InputToolbarComponent
              ref={ref => this.inputToolbarRef = ref}
              showKeyboard={this.state.isShowKeyboard}
              comment={this.state.comment}
              onChangeText={(comment) => this.onChangeText(comment)}
              onSend={() => this.onSend()}
            />
          </Animated.View>
        )}
        {this.state.loading && <LoadingScreen />}
      </View>
    );
  }
}


CommentScreen.defaultProps = {
  guest: false,
  isShowKeyboard: false,
  prevPage: 'idea',
  instigatorData: {}
}


CommentScreen.propTypes = {
  idea: PropTypes.object,
  guest: PropTypes.bool,
  isShowKeyboard: PropTypes.bool,
  prevPage: PropTypes.string,
  instigatorData: PropTypes.object
}


const mapStateToProps = ({ feedo, card, user }) => ({
  feedo,
  card,
  user,
})


const mapDispatchToProps = dispatch => ({
  getCardComments: (ideaId) => dispatch(getCardComments(ideaId)),
  addCardComment: (ideaId, content) => dispatch(addCardComment(ideaId, content)),
  updateCardComment: (ideaId, commentId, content) => dispatch(updateCardComment(ideaId, commentId, content)),
  deleteCardComment: (ideaId, commentId) => dispatch(deleteCardComment(ideaId, commentId)),
})


export default connect(mapStateToProps, mapDispatchToProps)(CommentScreen)