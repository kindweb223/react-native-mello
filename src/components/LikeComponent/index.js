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
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
import styles from './styles'
import * as types from '../../redux/card/types'
import { 
  likeCard,
  unlikeCard,
  setCurrentCard,
} from '../../redux/card/actions'

const FAV_ICON_R = require('../../../assets/images/Fav/Red.png')
const FAV_ICON_G = require('../../../assets/images/Fav/Grey.png')

class LikeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      liked: this.props.idea.metadata.liked,
      likes: this.props.idea.metadata.likes,
      prevLikes: this.props.idea.metadata.likes,
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
          liked: nextProps.idea.metadata.liked,
          likes: nextProps.idea.metadata.likes,
        }, () => {
          this.animatedShow.setValue(0);
          Animated.timing(this.animatedShow, {
            toValue: 1,
            duration: CONSTANTS.ANIMATEION_MILLI_SECONDS * 1.5,
          }).start(() => {
            this.setState({
              prevLikes: nextProps.idea.metadata.likes,
            });
          });
        });
      }
    } else if (this.props.card.loading !== types.UNLIKE_CARD_FULFILLED && nextProps.card.loading === types.UNLIKE_CARD_FULFILLED) {
      // success in unliking a card
      if (this.props.card.currentCard.id === this.props.idea.id) {
        this.setState({
          prevLikes: nextProps.idea.metadata.likes,
        }, () => {
          this.animatedShow.setValue(1);
          Animated.timing(this.animatedShow, {
            toValue: 0,
            duration: CONSTANTS.ANIMATEION_MILLI_SECONDS * 1.5,
          }).start(() => {
            this.setState({
              liked: nextProps.idea.metadata.liked,
              likes: nextProps.idea.metadata.likes,
            });
          });
        });
      }
    }
  }

  onShowLikes() {
    const {
      likes,
    } = this.state;
    if (likes > 0) {
      Actions.LikesListScreen({idea: this.props.idea});
    }
  }

  onLike(liked) {
    this.props.setCurrentCard(this.props.idea);
    if (liked) {
      this.props.unlikeCard(this.props.idea.id);
    } else {
      this.props.likeCard(this.props.idea.id);
    }
  }

  render() {
    const {
      liked,
      likes,
      prevLikes,
    } = this.state;

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
        style={styles.container}
        activeOpacity={0.7}
        onPress={() => this.onLike(liked)}
        onLongPress={() => this.onShowLikes()}
      >
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
        <Animated.Text style={[styles.iconText, {top: animatedMove1, opacity: animatedOpacity1, }]}>{prevLikes}</Animated.Text>
        <Animated.Text style={[styles.iconText, {top: animatedMove2, opacity: animatedOpacity2, }]}>{likes}</Animated.Text>
      </TouchableOpacity>
    );
  }
}

LikeComponent.propTypes = {
  idea: PropTypes.objectOf(PropTypes.any).isRequired,
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
