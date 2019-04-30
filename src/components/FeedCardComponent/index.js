import React from 'react'
import { Animated, TouchableHighlight, Platform } from 'react-native'
import FeedCardListComponent from './FeedCardListComponent'
import FeedCardExtendComponent from './FeedCardExtendComponent'
import PropTypes from 'prop-types'

class FeedCardComponent extends React.Component {
  constructor(props) {
    super(props);

    this.animatedPlusButton = new Animated.Value(1);
  }

  onPressInAddFeed() {
    const { longHold } = this.props

    if (!longHold && Platform.OS === 'ios') {
      Animated.timing(this.animatedPlusButton, {
        toValue: 0.95,
        duration: 100,
      }).start();  
    }
  }

  onPressOutAddFeed() {
    if (Platform.OS === 'ios') {
      Animated.timing(this.animatedPlusButton, {
        toValue: 1,
        duration: 100,
      }).start();  
    }
  }

  render() {
    if (this.props.listType === 'LIST') {
      return (
        <TouchableHighlight
          activeOpacity={1}
          underlayColor="#fff"
          onPressIn={this.onPressInAddFeed.bind(this)}
          onPressOut={this.onPressOutAddFeed.bind(this)}
          onPress={() => this.props.onPress()}
          onLongPress={() => this.props.onLongPress()}
        >
          <Animated.View
            style={[{ transform: [{ scale: this.animatedPlusButton }] }]}
          >
            <FeedCardListComponent {...this.props} />
          </Animated.View>
        </TouchableHighlight>
      )
    } else {
      return (
        <TouchableHighlight
          activeOpacity={1}
          underlayColor="#fff"
          onPressIn={this.onPressInAddFeed.bind(this)}
          onPressOut={this.onPressOutAddFeed.bind(this)}
          onPress={() => this.props.onPress()}
          onLongPress={() => this.props.onLongPress()}
        >
          <Animated.View
            style={[{ transform: [{ scale: this.animatedPlusButton }] }]}
          >
            <FeedCardExtendComponent {...this.props} />
          </Animated.View>
        </TouchableHighlight>
      )
    }
  }
}

FeedCardComponent.defaultProps = {
  onLongPress: () => {},
  onPress: () => {}
}

FeedCardComponent.propTypes = {
  longHold: PropTypes.bool,
  onLongPress: PropTypes.func,
  onPress: PropTypes.func
}

export default FeedCardComponent