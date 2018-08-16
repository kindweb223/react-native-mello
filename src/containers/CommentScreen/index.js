import React from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  Keyboard,
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
} from '../../redux/card/actions'
import { getDurationFromNow } from '../../service/dateUtils'
import InputToolbarComponent from '../../components/InputToolbarComponent';


const Comments = [
  {
    firstName: 'James',
    lastName: '',
    time: '2min ago',
    comment: 'It looks great!',
  },
  {
    firstName: 'Lisa',
    lastName: '',
    time: '4h ago',
    comment: 'Hella narwhal Cosby sweater McSweeney\'s, salvia 👍 kitsch before they sold out High Life. Umami tatto.',
  },
  {
    firstName: 'Thomas',
    lastName: '',
    time: '4h ago',
    comment: 'James narwhal Cosby sweater McSweeney\'s 😃',
  },
  
]


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
      comments: Comments,
      selectedItemIndex: -1,
      loading: false,
    };
    this.keyboardHeight = new Animated.Value(0);
  }

  componentDidMount() {
    this.keyboardWillShowSubscription = Keyboard.addListener('keyboardWillShow', (e) => this.keyboardWillShow(e));
    this.keyboardWillHideSubscription = Keyboard.addListener('keyboardWillHide', (e) => this.keyboardWillHide(e));
    // this.props.getCardComments(this.props.idea.id);
  }

  componentWillUnmount() {
    this.keyboardWillShowSubscription.remove();
    this.keyboardWillHideSubscription.remove();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let loading = false;
    if (this.props.card.loading !== types.GET_CARD_COMMENTS_PENDING && nextProps.card.loading === types.GET_CARD_COMMENTS_PENDING) {
      // liking a card
      loading = true;
    } else if (this.props.card.loading !== types.GET_CARD_COMMENTS_FULFILLED && nextProps.card.loading === types.GET_CARD_COMMENTS_FULFILLED) {
      // success in liking a card
      this.getCommentUsers(nextProps);
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
  }

  keyboardWillHide(e) {
    Animated.timing(
      this.keyboardHeight, {
        toValue:  0,
        duration: e.duration,
      }
    ).start();
  }

  getCommentUsers(props) {
    // let likes = [];
    // const { currentLikes } = props.card;
    // const { invitees } = props.feedo.currentFeed;
    // if (currentLikes) {
    //   currentLikes.forEach(like => {
    //     const invitee = _.find(invitees, invitee => invitee.id === like.huntInviteeId);
    //     if (invitee) {
    //       likes.push({
    //         ...like,
    //         firstName: invitee.userProfile.firstName,
    //         lastName: invitee.userProfile.lastName,
    //         imageUrl: invitee.userProfile.imageUrl,
    //       })
    //     }
    //   });
    //   this.setState({
    //     likesList: likes,
    //   });
    // }
  }

  onSelectItem(index) {
    this.setState({
      selectedItemIndex: index,
    });
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
  }

  onDelete(index) {
  }

  onSend(comment) {
  }

  renderItem({item, index}) {
    const name = `${item.firstName} ${item.lastName}`;

    const swipeoutBtns = [
      {
        component: this.renderEdit,
        backgroundColor: COLORS.SOFT_GREY,
        onPress: () => this.onEdit(index),
      },
      {
        component: this.renderDelete,
        backgroundColor: COLORS.DARK_RED,
        onPress: () => this.onDelete(index),
      }
    ]
    
    return (
      <Swipeout
        style={[styles.itemContainer, this.state.selectedItemIndex === index && {backgroundColor: '#4A00CD0A'}]}
        autoClose={true}
        right={swipeoutBtns}
      > 
        <TouchableOpacity 
          style={styles.itemButtonContainer}
          activeOpacity={0.6}
          onPress={() => this.onSelectItem(index)}
        >
          <UserAvatar
            size="32"
            name={name}
            color="#000"
            textColor="#fff"
            src={item.imageUrl}
          />
          <View style={styles.textsContainer}>
            <View style={styles.rowContainer}>
              <Text style={styles.textItemName}>{name}</Text>
              <Entypo name='dot-single' size={12} color={COLORS.DARK_GREY} />
              <Text style={styles.textItemTime}>{/*getDurationFromNow(item.likedDate)*/item.time}</Text>
            </View>
            <Text style={styles.textItemComment}>{item.comment}</Text>
          </View>
        </TouchableOpacity>
      </Swipeout>
    );
  }

  render () {
    return (
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={{paddingVertical: 16}}
          data={this.state.comments}
          renderItem={this.renderItem.bind(this)}
          keyExtractor={(item, index) => index.toString()}
          extraData={this.state}
        />
        <Animated.View style={{marginBottom: this.keyboardHeight}}>
          <InputToolbarComponent 
            onSend={(comment) => this.onSend(comment)}
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


const mapStateToProps = ({ feedo, card }) => ({
  feedo,
  card,
})


const mapDispatchToProps = dispatch => ({
  getCardComments: (ideaId) => dispatch(getCardComments(ideaId)),
})


export default connect(mapStateToProps, mapDispatchToProps)(CommentScreen)