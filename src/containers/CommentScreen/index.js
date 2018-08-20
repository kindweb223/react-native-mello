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
import UserAvatar from 'react-native-user-avatar'
import Swipeout from 'react-native-swipeout';

import styles from './styles'
import CONSTANTS from '../../service/constants'
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


class CommentScreen extends React.Component {
  static renderLeftButton(props) {
    return (
      <TouchableOpacity 
        style={styles.buttonWrapper}
        onPress={() => Actions.pop()}
      >
        <Ionicons name="ios-arrow-back" size={30} color={COLORS.PURPLE} />
        <Text style={styles.textBack}>Back</Text>
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
    this.keyboardWillShowSubscription = Keyboard.addListener('keyboardWillShow', (e) => this.keyboardWillShow(e));
    this.keyboardWillHideSubscription = Keyboard.addListener('keyboardWillHide', (e) => this.keyboardWillHide(e));
    this.props.getCardComments(this.props.idea.id);
  }

  componentWillUnmount() {
    this.keyboardWillShowSubscription.remove();
    this.keyboardWillHideSubscription.remove();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let loading = false;
    if (this.props.card.loading !== types.GET_CARD_COMMENTS_PENDING && nextProps.card.loading === types.GET_CARD_COMMENTS_PENDING) {
      // getting comments of a card
      loading = true;
    } else if (this.props.card.loading !== types.GET_CARD_COMMENTS_FULFILLED && nextProps.card.loading === types.GET_CARD_COMMENTS_FULFILLED) {
      // success in getting comments of a card
    } else if (this.props.card.loading !== types.ADD_CARD_COMMENT_PENDING && nextProps.card.loading === types.ADD_CARD_COMMENT_PENDING) {
      // adding a comment of a card
      loading = true;
    } else if (this.props.card.loading !== types.ADD_CARD_COMMENT_FULFILLED && nextProps.card.loading === types.ADD_CARD_COMMENT_FULFILLED) {
      // success in adding a comment of a card
    } else if (this.props.card.loading !== types.EDIT_CARD_COMMENT_PENDING && nextProps.card.loading === types.EDIT_CARD_COMMENT_PENDING) {
      // adding a comment of a card
      loading = true;
    } else if (this.props.card.loading !== types.EDIT_CARD_COMMENT_FULFILLED && nextProps.card.loading === types.EDIT_CARD_COMMENT_FULFILLED) {
      // success in adding a comment of a card
    } else if (this.props.card.loading !== types.DELETE_CARD_COMMENT_PENDING && nextProps.card.loading === types.DELETE_CARD_COMMENT_PENDING) {
      // adding a comment of a card
      loading = true;
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
    const swipeoutBtns = [
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
    const user = this.getCommentUser(item);
    const enabled = user && user.id === this.props.user.userInfo.userProfileId;
    const name = `${user.firstName} ${user.lastName}`;

    return (
      <Swipeout
        style={[styles.itemContainer, this.state.selectedItemIndex === index && {backgroundColor: '#4A00CD0A'}]}
        disabled={!enabled}
        autoClose={true}
        right={swipeoutBtns}
      > 
        <View style={styles.itemContentContainer}>
          <UserAvatar
            size="32"
            name={name}
            color="#000"
            textColor="#fff"
            src={user.imageUrl}
          />
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
          contentContainerStyle={{paddingVertical: 16}}
          data={this.props.card.currentComments}
          renderItem={this.renderItem.bind(this)}
          keyExtractor={(item, index) => index.toString()}
          extraData={this.state}
        />
        <Animated.View style={{marginBottom: this.keyboardHeight}}>
          <InputToolbarComponent
            ref={ref => this.inputToolbarRef = ref}
            showKeyboard={this.state.isShowKeyboard}
            comment={this.state.comment}
            onChangeText={(comment) => this.onChangeText(comment)}
            onSend={() => this.onSend()}
          />
        </Animated.View>
        {this.state.loading && <LoadingScreen />}
      </View>
    );
  }
}


CommentScreen.defaultProps = {
}


CommentScreen.propTypes = {
  idea: PropTypes.object,
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