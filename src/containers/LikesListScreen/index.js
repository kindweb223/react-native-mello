import React from 'react'
import {
  View,
  SafeAreaView,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  BackHandler,
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Actions } from 'react-native-router-flux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import _ from 'lodash';

import styles from './styles'
import COLORS from '../../service/colors'
import LoadingScreen from '../LoadingScreen';
import * as types from '../../redux/card/types'
import { 
  getCardLikes,
} from '../../redux/card/actions'
import { getDurationFromNow } from '../../service/dateUtils'
import UserAvatarComponent from '../../components/UserAvatarComponent';
import AlertController from '../../components/AlertController'

import Analytics from '../../lib/firebase'

class LikesListScreen extends React.Component {

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
      <Text style={styles.textTitle}>Liked by</Text>
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      likesList: [],
      loading: false,
    };
  }

  componentDidMount() {
    Analytics.setCurrentScreen('LikesListScreen')
    
    this.setState({
      loading: true,
    });
    this.props.getCardLikes(this.props.idea.id);
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    Actions.pop()
    return true;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.card.loading !== types.GET_CARD_LIKES_FULFILLED && nextProps.card.loading === types.GET_CARD_LIKES_FULFILLED) {
      // success in liking a card
      this.setState({ loading: false }, () => {
        this.getLikeUsers(nextProps);
      })
    } else if ((this.props.feedo.loading !== 'PUBNUB_LIKE_CARD_FULFILLED' && nextProps.feedo.loading === 'PUBNUB_LIKE_CARD_FULFILLED') ||
              (this.props.feedo.loading !== 'PUBNUB_UNLIKE_CARD_FULFILLED' && nextProps.feedo.loading === 'PUBNUB_UNLIKE_CARD_FULFILLED')) {
      this.props.getCardLikes(this.props.idea.id);
    }

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
          {text: 'Close'},
        ]);
      }
      return;
    }
  }

  getLikeUsers(props) {
    let likes = [];
    const { currentLikes } = props.card;
    const { invitees } = props.feedo.currentFeed;
    if (currentLikes) {
      currentLikes.forEach(like => {
        const invitee = _.find(invitees, invitee => invitee.id === like.huntInviteeId);
        if (invitee) {
          likes.push({
            ...like,
            firstName: invitee.userProfile.firstName,
            lastName: invitee.userProfile.lastName,
            imageUrl: invitee.userProfile.imageUrl,
          })
        }
      });
      this.setState({
        likesList: likes,
      });
    } else {
      this.setState({
        likesList: [],
      })
    }
  }

  renderItem({item, index}) {
    const name = `${item.firstName} ${item.lastName}`;
    return (
      <View style={styles.itemContainer}>
        <View style={styles.avatarContainer}>
          <UserAvatarComponent
            user={item}
            size={32}
          />
          <View style={styles.likeContainer}>
            <FontAwesome name='heart' size={10} color={COLORS.RED} />
          </View>
        </View>
        <Text style={styles.textItemName}>{name}</Text>
        <Text style={styles.textItemTime}>{getDurationFromNow(item.likedDate)}</Text>
      </View>
    );
  }

  render () {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <FlatList
            data={this.state.likesList}
            renderItem={this.renderItem.bind(this)}
            keyExtractor={(item, index) => index.toString()}
            extraData={this.state}
          />
          {this.state.loading && <LoadingScreen />}
        </View>
      </SafeAreaView>
    );
  }
}


LikesListScreen.defaultProps = {
}


LikesListScreen.propTypes = {
  idea: PropTypes.object.isRequired,
}


const mapStateToProps = ({ feedo, card }) => ({
  feedo,
  card,
})


const mapDispatchToProps = dispatch => ({
  getCardLikes: (ideaId) => dispatch(getCardLikes(ideaId)),
})


export default connect(mapStateToProps, mapDispatchToProps)(LikesListScreen)