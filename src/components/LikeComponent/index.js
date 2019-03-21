import React from 'react'
import {
  View,
  TouchableOpacity,
  Animated,
  Image
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Actions } from 'react-native-router-flux'
import CONSTANTS from '../../service/constants'
import styles from './styles'
import * as types from '../../redux/card/types'
import { 
  likeCard,
  unlikeCard,
  setCurrentCard,
} from '../../redux/card/actions'
import * as COMMON_FUNC from '../../service/commonFunc'

import Analytics from '../../lib/firebase'

const FAV_ICON_R = require('../../../assets/images/Fav/Red.png')
const FAV_ICON_G = require('../../../assets/images/Fav/Grey.png')

class LikeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      liked: this.props.idea.metadata.liked,
      likes: this.props.idea.metadata.likes,
      prevLikes: this.props.idea.metadata.likes,
      disabled: false
    }
    let animationValue = 0;
    if (this.props.idea.metadata.liked) {
      animationValue = 1;
    }
    this.animatedShow = new Animated.Value(animationValue);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.card.loading !== types.LIKE_CARD_FULFILLED && nextProps.card.loading === types.LIKE_CARD_FULFILLED) {
      // success in liking a card
      if (this.props.card.currentCard.id === this.props.idea.id) {
        this.setState({
          prevLikes: nextProps.idea.metadata.likes,
          liked: nextProps.idea.metadata.liked,
          likes: nextProps.idea.metadata.likes,
          disabled: false
        });
      }
    } else if (this.props.card.loading !== types.UNLIKE_CARD_FULFILLED && nextProps.card.loading === types.UNLIKE_CARD_FULFILLED) {
      // success in unliking a card
      if (this.props.card.currentCard.id === this.props.idea.id) {
        this.setState({
          prevLikes: nextProps.idea.metadata.likes,
          liked: nextProps.idea.metadata.liked,
          likes: nextProps.idea.metadata.likes,
          disabled: false
        });
      }
    } else if (nextProps.card.loading === 'PUBNUB_LIKE_CARD_FULFILLED' || nextProps.card.loading === 'PUBNUB_UNLIKE_CARD_FULFILLED') {
      this.setState({
        liked: nextProps.idea.metadata.liked,
        likes: nextProps.idea.metadata.likes,
        prevLikes: nextProps.idea.metadata.likes,
        disabled: false
      });
    } else if (this.props.idea !== nextProps.idea) {
      if (nextProps.idea.metadata.liked) {
        this.animatedShow.setValue(1);
      } else {
        this.animatedShow.setValue(0);
      }

      this.setState({
        liked: nextProps.idea.metadata.liked,
        likes: nextProps.idea.metadata.likes,
        prevLikes: nextProps.idea.metadata.likes,
        disabled: false
      });
    } else {

      // this.setState({
      //   liked: nextProps.idea.metadata.liked,
      //   likes: nextProps.idea.metadata.likes,
      //   prevLikes: nextProps.idea.metadata.likes,
      // }, () => {
      //   let animationValue = 0;
      //   if (nextProps.idea.metadata.liked) {
      //     animationValue = 1;
      //   }
      //   this.animatedShow.setValue(animationValue);
      // });
    }
  }

  onShowLikes() {
    const {
      likes,
    } = this.state;
    if (likes > 0) {
      Analytics.logEvent('feed_detail_show_like_list', {})

      if (this.props.prevPage === 'activity') {
        Actions.ActivityLikesListScreen({ idea: this.props.idea });
      } else {
        Actions.LikesListScreen({ idea: this.props.idea });
      }
    }
  }

  animateLike() {
    this.animatedShow.setValue(0);
    Animated.timing(this.animatedShow, {
      toValue: 1,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS * 1.5,
    }).start();

    this.setState({
      liked: true,
      likes: this.state.likes + 1,
      prevLikes: this.state.likes + 1,
    });
  }

  animateUnlink() {
    this.animatedShow.setValue(1);
    Animated.timing(this.animatedShow, {
      toValue: 0,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS * 1.5,
    }).start();

    this.setState({
      liked: false,
      likes: this.state.likes - 1,
      prevLikes: this.state.likes - 1
    });
  }

  onLike(liked) {
    if (liked) {
      this.animateUnlink();
    } else {
      this.animateLike();
    }

    this.setState({ disabled: true });
    // Move to like list for Guest
    if (COMMON_FUNC.isFeedGuest(this.props.feedo.currentFeed)) {
      Analytics.logEvent('feed_detail_show_like_list', {})
      Actions.LikesListScreen({idea: this.props.idea});
    } else {
      this.props.setCurrentCard(this.props.idea);
      if (liked) {
        Analytics.logEvent('feed_detail_unlike_card', {})

        this.props.unlikeCard(this.props.idea.id);
      } else {
        Analytics.logEvent('feed_detail_like_card', {})

        this.props.likeCard(this.props.idea.id);
      }
    }
  }

  render() {
    const {
      liked,
      likes,
      prevLikes,
      disabled
    } = this.state;
    const {
      longHold,
      type
    } = this.props

    const animatedMove1 = this.animatedShow.interpolate({
      inputRange: [0, 1],
      outputRange: [6, 0],
    });
    const animatedMove2 = this.animatedShow.interpolate({
      inputRange: [0, 1],
      outputRange: [14, 6],
    });
    const animatedOpacity1 = this.animatedShow.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });
    const animatedOpacity2 = this.animatedShow.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    const animatedScale1 = this.animatedShow.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    const animatedScale2 = this.animatedShow.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 2],
    });

    return (
      <TouchableOpacity
        style={[styles.container, this.props.isOnlyInvitee ? { width: 45 } : { width: 55 }, type === 'text' && { justifyContent: 'flex-end' }]}
        activeOpacity={0.7}
        disabled={disabled}
        onPress={() => longHold ? {} : ( type === 'text' ? this.onShowLikes() : this.onLike(liked))}
        onLongPress={() => longHold ? {} : this.onShowLikes()}
      >
        {(type === 'icon' || type === 'all') && (
          <View style={styles.likeContainer}>
            <Animated.View 
              style={[
                styles.heartContainer, {
                  transform: [
                    { scale: animatedScale1 },
                  ],
                  opacity: animatedOpacity2,
                }
              ]}
            >
              <Image source={FAV_ICON_R} />
            </Animated.View>
            <Animated.View 
              style={[
                styles.heartContainer, {
                  transform: [
                    { scale: animatedScale2 },
                  ],
                  opacity: animatedOpacity1,
                }
              ]}
            >
              <Image source={FAV_ICON_G} />
            </Animated.View>
          </View>
        )}

        {(type === 'text' || type === 'all') && (
          !this.props.isOnlyInvitee && (
            <Animated.Text style={[styles.iconText, { top: animatedMove1, opacity: animatedOpacity1 }, type === 'all' && { left: 40 }]}>
              {prevLikes} {type !== 'all' && ((prevLikes === 1) ? 'like' : 'likes')}
            </Animated.Text>
          )
        )}

        {(type === 'text' || type === 'all') && (
          !this.props.isOnlyInvitee && (
            <Animated.Text style={[styles.iconText, { top: animatedMove2, opacity: animatedOpacity2 }, type === 'all' && { left: 40 }]}>
              {likes} {type !== 'all' && ((likes === 1) ? 'like' : 'likes')}
            </Animated.Text>
          )
        )}
      </TouchableOpacity>
    );
  }
}

LikeComponent.defaultProps = {
  longHold: false,
  type: 'icon'
}

LikeComponent.propTypes = {
  longHold: PropTypes.bool,
  idea: PropTypes.objectOf(PropTypes.any).isRequired,
  type: PropTypes.string
}

const mapStateToProps = ({ card, feedo }) => ({
  card,
  feedo,
})


const mapDispatchToProps = dispatch => ({
  likeCard: (ideaId) => dispatch(likeCard(ideaId)),
  unlikeCard: (ideaId) => dispatch(unlikeCard(ideaId)),
  setCurrentCard: (idea) => dispatch(setCurrentCard(idea)),
})


export default connect(mapStateToProps, mapDispatchToProps)(LikeComponent)
