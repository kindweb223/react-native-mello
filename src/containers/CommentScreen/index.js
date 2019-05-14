import React from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  Keyboard,
  Alert,
  BackHandler,
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Actions } from 'react-native-router-flux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import _ from 'lodash';
import Swipeout from 'react-native-swipeout';
import Highlighter from 'react-native-highlight-words';

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
import {
  getActivityFeed,
  getFeedoList
} from '../../redux/feedo/actions'

import { getDurationFromNow } from '../../service/dateUtils'
import InputToolbarComponent from '../../components/InputToolbarComponent';
import UserAvatarComponent from '../../components/UserAvatarComponent';
import * as COMMON_FUNC from '../../service/commonFunc'

import Analytics from '../../lib/firebase'
import pubnub from '../../lib/pubnub'
import AlertController from '../../components/AlertController'

const PAGE_COUNT = 50

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
      commentList: [],
      userNameArray: []
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
      Animated.delay(400).start(() => {
        this.setState({
          isShowKeyboard: this.props.isShowKeyboard,
        });
        this.inputToolbarRef.focus();  
      });
    }

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    this.getUserNames()
  }

  componentWillUnmount() {
    this.keyboardWillShowSubscription.remove();
    this.keyboardWillHideSubscription.remove();

    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    Actions.pop();
    return true;
  }
  
  UNSAFE_componentWillReceiveProps(nextProps) {
    // if (nextProps.feedo.loading === 'PUBNUB_DELETE_FEED') {
    //   this.props.getFeedoList()
    //   Actions.popTo('HomeScreen')
    // }

    let loading = false;
    if (this.props.card.loading !== types.GET_CARD_COMMENTS_PENDING && nextProps.card.loading === types.GET_CARD_COMMENTS_PENDING) {
      // getting comments of a card
      loading = false;
    } else if (this.props.card.loading !== types.GET_CARD_COMMENTS_FULFILLED && nextProps.card.loading === types.GET_CARD_COMMENTS_FULFILLED) {
      // success in getting comments of a card
      if (nextProps.card.currentCardId === nextProps.card.currentCard.id ||
          nextProps.card.currentCardId === this.props.idea.id) {
        this.setState({ commentList: nextProps.card.currentComments })
      }
      this.props.getActivityFeed(this.props.user.userInfo.id, { page: 0, size: PAGE_COUNT })
    } else if (this.props.card.loading !== types.ADD_CARD_COMMENT_PENDING && nextProps.card.loading === types.ADD_CARD_COMMENT_PENDING) {
      // adding a comment of a card
      loading = false;
    } else if (this.props.card.loading !== types.ADD_CARD_COMMENT_FULFILLED && nextProps.card.loading === types.ADD_CARD_COMMENT_FULFILLED) {
      // success in adding a comment of a card
      if (nextProps.card.currentCardId === nextProps.card.currentCard.id ||
        nextProps.card.currentCardId === this.props.idea.id) {
        this.setState({ commentList: nextProps.card.currentComments })
      }
    } else if (this.props.card.loading !== types.EDIT_CARD_COMMENT_PENDING && nextProps.card.loading === types.EDIT_CARD_COMMENT_PENDING) {
      // editing a comment of a card
      loading = false;
    } else if (this.props.card.loading !== types.EDIT_CARD_COMMENT_FULFILLED && nextProps.card.loading === types.EDIT_CARD_COMMENT_FULFILLED) {
      // success in adding a comment of a card
      if (nextProps.card.currentCardId === nextProps.card.currentCard.id ||
        nextProps.card.currentCardId === this.props.idea.id) {
        this.setState({ commentList: nextProps.card.currentComments })
      }
    } else if (this.props.card.loading !== types.DELETE_CARD_COMMENT_PENDING && nextProps.card.loading === types.DELETE_CARD_COMMENT_PENDING) {
      // delete a comment of a card
      loading = false;
    } else if (this.props.card.loading !== types.DELETE_CARD_COMMENT_FULFILLED && nextProps.card.loading === types.DELETE_CARD_COMMENT_FULFILLED) {
      // success in adding a comment of a card
      if (nextProps.card.currentCardId === nextProps.card.currentCard.id ||
        nextProps.card.currentCardId === this.props.idea.id) {
        this.setState({ commentList: nextProps.card.currentComments })
      }
    } 

    this.setState({
      loading
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
        AlertController.shared.showAlert('Error', errorMessage, [
          {
            text: 'Close',
          },
        ]);
      }
      return;
    }
  }

  keyboardWillShow(e) {
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
  
  getUserNames() {
    const { invitees } = this.props.feedo.currentFeed
    let userNameArray = []

    invitees.map(item => {
      const displayName = `${item.userProfile.firstName} ${item.userProfile.lastName}`
      userNameArray.push(`@${displayName}`)
    })
    this.setState({ userNameArray })
  }

  extendCommentList() {
    const extendedCommentList = this.state.commentList.map(item => {
      const user = this.getCommentUser(item);
      const extend = {
        ...item,
        ...user
      }
      return extend
    })
    this.setState({ extendedCommentList })
  }

  convertComment() {
    let { comment } = this.state
    const { invitees } = this.props.feedo.currentFeed

    invitees.map(item => {
      const displayName = `${item.userProfile.firstName} ${item.userProfile.lastName}`
      if (comment.indexOf(`@${displayName}`) !== -1) {
        comment = comment.replace(`@${displayName}`, `<@{${item.id}}>`)
      }
    })

    return comment
  }

  revertComment(comment) {
    const { invitees } = this.props.feedo.currentFeed

    invitees.map(item => {
      const displayName = `${item.userProfile.firstName} ${item.userProfile.lastName}`
      if (comment.content.indexOf(item.id) !== -1) {
        comment.content = comment.content.replace(`<@{${item.id}}>`, `@${displayName}`)
      }
    })

    return comment
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
    const { commentList } = this.state
    this.setState({
      selectedItemIndex: index,
      comment: commentList[index].content,
    });
    this.inputToolbarRef.focus();
  }

  onConfirmDelete(index) {
    AlertController.shared.showAlert(
      '',
      'Are you sure you want to delete this comment?',
      [
        { text: 'No', 
          style: 'cancel' },
        { text: 'Yes', 
          onPress: () => {
            this.onDelete(index);
          }
        },
      ],
      { cancelable: false }
    )
  }

  onDelete(index) {
    const { commentList } = this.state

    this.setState({ 
      comment: '',
      selectedItemIndex: -1,
    });
    this.props.deleteCardComment(
      this.props.idea.id, 
      commentList[index].id,
    );
  }

  onSend() {
    const { commentList, selectedItemIndex, comment } = this.state

    const updatedComment = this.convertComment()
    if (selectedItemIndex === -1) {
      this.props.addCardComment(this.props.idea.id, updatedComment);
    } else {
      this.props.updateCardComment(
        this.props.idea.id, 
        commentList[selectedItemIndex].id,
        updatedComment
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
    user = this.getCommentUser(item);
    item = this.revertComment(item)

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
            <Text>
              <Text style={styles.textItemName}>{name}{" "}</Text>
              <Highlighter
                style={styles.textItemComment}
                highlightStyle={styles.mention}
                searchWords={this.state.userNameArray}
                textToHighlight={item.content}
              />
            </Text>
            <View style={styles.rowContainer}>
              <Text style={styles.textItemTime}>{`${getDurationFromNow(item.created)} ago`}</Text>
              <TouchableOpacity>
                <Text style={styles.replyButton}>
                  Reply
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Swipeout>
    );
  }

  render () {
    const { commentList } = this.state
    const { invitees } = this.props.feedo.currentFeed

    return (
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={{ paddingVertical: 16 }}
          data={commentList}
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
              dataList={invitees}
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
  prevPage: 'idea'
}


CommentScreen.propTypes = {
  idea: PropTypes.object,
  guest: PropTypes.bool,
  isShowKeyboard: PropTypes.bool,
  prevPage: PropTypes.string
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
  getActivityFeed: (userId, param) => dispatch(getActivityFeed(userId, param)),
  getFeedoList: () => dispatch(getFeedoList())
})


export default connect(mapStateToProps, mapDispatchToProps)(CommentScreen)