import React from 'react'
import { View, Text, TouchableOpacity, Animated, ScrollView } from 'react-native'
import PropTypes from 'prop-types'
import Ionicons from 'react-native-vector-icons/Ionicons'
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures'

import CONSTANTS from '../../service/constants';
import styles from './styles'


class ClipboardToasterComponent extends React.Component {
  constructor(props) {
    super(props);
    
    this.fadeAnimate = new Animated.Value(0),
    this.showClipboardTimeout = null;
  }

  componentDidMount() {
    Animated.timing(
      this.fadeAnimate, {
        toValue: 1,
        duration: 750
      }
    ).start(() => {
      this.showClipboardTimeout = setTimeout(() => {
        this.showClipboardTimeout = null;
        this.closeView(false);
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
    this.closeView(true);
  }

  onSwipeToDismissClipboardToaster(direction, state) {
    const {SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    if (direction === SWIPE_LEFT || direction === SWIPE_RIGHT) {
      this.closeView(false);
    }
  }

  closeView(isSelect=true) {
    this.fadeAnimate.setValue(1);
    Animated.timing(
      this.fadeAnimate, {
        toValue: 0,
        duration: 750
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
      <Animated.ScrollView
        style={[styles.container, { opacity: this.fadeAnimate }]}
        contentContainerStyle={{padding: CONSTANTS.PADDING}}
        horizontal={true}
      >
        <Animated.View style={styles.mainContainer}>
          <GestureRecognizer
            style={{width: '100%', height: '100%'}}
            onSwipe={(direction, state) => this.onSwipeToDismissClipboardToaster(direction, state)}
          >
            <TouchableOpacity
              style={styles.buttonContainer}
              activeOpacity={0.6}
              onPress={() => this.onSelect()}
            >
              <Ionicons name="md-add" size={28} color={'#FFFFFF'} />
              <View style={styles.textsContainer}>
                <Text style={styles.textTitle} numberOfLines={1}>{title}</Text>
                <Text style={styles.textDescription} numberOfLines={1}>{description}</Text>
              </View>
            </TouchableOpacity>
          </GestureRecognizer>
        </Animated.View>
      </Animated.ScrollView>
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