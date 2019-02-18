import React from 'react'
import { View, Text, Animated, PanResponder, Image } from 'react-native'
import { connect } from 'react-redux'
import * as mime from 'react-native-mime-types';
import SVGImage from 'react-native-remote-svg';
import SvgUri from 'react-native-svg-uri';

import { SCHEME } from '../../service/api'
import ShareExtension from '../shareExtension'
import styles from './styles'
import * as Animatable from 'react-native-animatable'

const CloseVelocity = 1.25;
const SelectDelta = 2;


class ShareSuccessScreen extends React.Component {
  constructor(props) {
    super(props);
    
    this.animatedFade = new Animated.Value(0),
    this.animatedMoveX = new Animated.Value(0),
    this.showClipboardTimeout = null;
    this.isClosed = false;

    this.state = {
      animationType: 'slideInUp',
      duration: 750
    }

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        this.isClosed = false;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (Math.abs(gestureState.vx) > CloseVelocity) {
          this.setState({
            animationType: gestureState.vx < 0 ? 'slideOutLeft' : 'slideOutRight',
            animationDuration: 1000
          });
          this.isClosed = true;
          this.closeView(false);
        } else {
          this.animatedMoveX.setValue(gestureState.moveX - gestureState.x0);
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        if (Math.abs(gestureState.dx) < SelectDelta) {
          this.onSelect();
        } else if (this.isClosed == false) {
          Animated.timing(
            this.animatedMoveX, {
              toValue: 0,
              duration: Math.abs(gestureState.moveX - gestureState.x0),
            }
          ).start();
        }
      },
      onPanResponderTerminate: (evt, gestureState) => {
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        return true;
      },
    });
  }

  componentDidMount() {
    Animated.timing(
      this.animatedFade, {
        toValue: 1,
        duration: 750
      }
    ).start(() => {
      this.showClipboardTimeout = setTimeout(() => {
        this.showClipboardTimeout = null;
        this.setState({ animationType: 'fadeOutDownBig', animationDuration: 1500 });
        this.closeView(false);
      }, 2500);
    })
  }

  componentWillMount() {
    if (this.showClipboardTimeout) {
      clearTimeout(this.showClipboardTimeout);
      this.showClipboardTimeout = null;
    }
  }

  onSelect() {
    this.setState({ animationType: 'fadeOutDownBig', animationDuration: 1500 });
    this.closeView(true);
  }

  closeView(isSelect = true) {
    this.animatedFade.setValue(1);
    Animated.timing(
      this.animatedFade, {
        toValue: 0,
        duration: this.state.animationDuration
      }
    ).start(() => {
      if (this.showClipboardTimeout) {
        clearTimeout(this.showClipboardTimeout);
        this.showClipboardTimeout = null;
      }
      if (isSelect) {
        console.log('FEED_ID: ', this.props.feedo.currentFeed.id)
        ShareExtension.goToMainApp(SCHEME + `flow/${this.props.feedo.currentFeed.id}`);
        ShareExtension.close();
      } else {
        ShareExtension.close();
      }
    })
  }

  renderImage(item) {
    if (item.coverImage) {
      if (item.coverImage.indexOf('data:image/svg+xml;base64') !== -1) {
        return (
          <SvgUri
            width="55"
            height="55"
            source={{ uri: item.coverImage }}
            style={styles.imageCover}
          />
        );
      }
      const mimeType = mime.lookup(item.coverImage);
      if (mimeType !== false && mimeType.indexOf('svg') !== -1) {
        return (
          <SVGImage
            style={styles.imageCover}
            source={{ uri: item.coverImage }}
          />
        );
      }
      return (
        <Image style={styles.imageCover} source={{ uri: item.coverImage }} resizeMode='cover' />
      );
    }
  }

  render() {
    const { feedo, card } = this.props

    return (
      <View style={styles.container}>
        <Animatable.View animation={this.state.animationType} duration={this.state.duration} style={[styles.toasterContainer, { opacity: this.animatedFade }]}>
          <Animated.View
            style={[
              styles.mainContainer,
              { transform: [{ translateX: this.animatedMoveX }]}
            ]}
            {...this._panResponder.panHandlers}
          >
            <View style={styles.buttonContainer}>
              {card.currentCard && card.currentCard.coverImage && (
                this.renderImage(card.currentCard)
              )}
              <View style={(card.currentCard && card.currentCard.coverImage) ? styles.textsContainer : styles.textsContainerNoImage}>
                <Text style={styles.textTitle}>Saved to</Text>
                <Text style={styles.feedTitle} numberOfLines={1} ellipsizeMode="tail">{feedo.currentFeed.headline}</Text>
              </View>
            </View>
          </Animated.View>
        </Animatable.View>
      </View>
    )
  }
}


const mapStateToProps = ({ feedo, card }) => ({
  feedo,
  card
})

export default connect(mapStateToProps, null)(ShareSuccessScreen)