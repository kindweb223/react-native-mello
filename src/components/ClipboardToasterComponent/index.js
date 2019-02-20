import React from 'react'
import { View, Text, Animated, PanResponder } from 'react-native'
import PropTypes from 'prop-types'
import Ionicons from 'react-native-vector-icons/Ionicons'
import * as Animatable from 'react-native-animatable'

import styles from './styles'
import CONSTANTS from '../../service/constants';
const CloseVelocity = 1.25;
const SelectDelta = 2;
const FADE_IN_TIME = 750;
const FADE_OUT_TIME = 500;
const FADE_OUT_DOWN_TIME = 1000;
const SLIDE_OUT_TIME = 1250;
const SLIDE_OUT_TIME_MIN = 600;

class ClipboardToasterComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      animationType: 'slideInUp',
      animationDuration: FADE_IN_TIME,
    }

    this.animatedFade = new Animated.Value(0),
    this.animatedMoveX = new Animated.Value(0),
    this.showClipboardTimeout = null;
    this.isClosed = false;

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        this.isClosed = false;
      },
      onPanResponderMove: (evt, gestureState) => {
        clearTimeout(this.showClipboardTimeout);
        this.showClipboardTimeout = null;
        if (Math.abs(gestureState.vx) > CloseVelocity) {
          // Need to check close hasnt already been initiated
          if (!this.isClosed) {
            this.setState({
              animationType: gestureState.vx < 0 ? 'slideOutLeft' : 'slideOutRight',
              animationDuration: SLIDE_OUT_TIME / Math.abs(gestureState.vx) < SLIDE_OUT_TIME_MIN ? SLIDE_OUT_TIME_MIN : SLIDE_OUT_TIME / Math.abs(gestureState.vx) 
            }, () => {
              this.isClosed = true;
              this.closeView(false);
            });  
          }
        } else {
          this.animatedMoveX.setValue(gestureState.moveX - gestureState.x0);
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        if (Math.abs(gestureState.dx) < SelectDelta) {
          this.onSelect();
        } else if (this.isClosed === false) {
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
        duration: FADE_IN_TIME
      }
    ).start(() => {
      this.showClipboardTimeout = setTimeout(() => {
        this.showClipboardTimeout = null;
        this.setState({
          animationType: 'fadeOutDownBig',
          animationDuration: FADE_OUT_DOWN_TIME
        }, () => {
          this.closeView(false);
        });
      }, CONSTANTS.CLIPBOARD_DATA_CONFIRM_DURATION);
    })
  }

  componentWillMount() {
    if (this.showClipboardTimeout) {
      clearTimeout(this.showClipboardTimeout);
      this.showClipboardTimeout = null;
    }
  }

  onSelect() {
    this.setState({
      animationType: 'fadeOut',
      animationDuration: FADE_OUT_TIME
    }, () => {
      this.closeView(true);
    });
  }

  closeView(isSelect=true) {
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
        this.props.onPress()
      } else {
        this.props.onClose();
      }
    })
  }

  render() {
    const { title, description } = this.props
    return (
      <Animatable.View animation={this.state.animationType} duration={this.state.animationDuration} style={[styles.container, { opacity: this.animatedFade }]}>
        <Animated.View
          style={[
            styles.mainContainer,
            { transform: [{ translateX: this.animatedMoveX }]}
          ]}
          {...this._panResponder.panHandlers}
        >
          <View style={styles.buttonContainer}>
            <Ionicons name="md-add" size={32} color={'#FFFFFF'} />
            <View style={styles.textsContainer}>
              <Text style={styles.textTitle} numberOfLines={1}>{title}</Text>
              <Text style={styles.textDescription} numberOfLines={1}>{description}</Text>
            </View>
          </View>
        </Animated.View>
      </Animatable.View>
    )
  }
}


ClipboardToasterComponent.defaultProps = {
  title: 'Create new card from',
  description: '',
  onPress: () => {},
  onClose: () => {},
}


ClipboardToasterComponent.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  onPress: PropTypes.func,
  onClose: PropTypes.func,
}


export default ClipboardToasterComponent