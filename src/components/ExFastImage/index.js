import React from 'react'
import {
  View,
  Animated,
} from 'react-native';
import PropTypes from 'prop-types';

import FastImage from "react-native-fast-image";

import { images } from '../../themes'

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

class ExFastImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      placeholderOpacity: new Animated.Value(1.0),
      placeholderScale: new Animated.Value(1.0),
      placeholderSource: images.placeholder,
      placeholderColor: '#b3e5fc',
      loadFromCache: true
    }
    this.imageOpacity = new Animated.Value(0.0)
  }

  onLoadStart = () => {
  }

  onProgress = (e) => {
    this.setState({ loadFromCache: false })
  }

  onLoad = () => {
    const {
      placeholderScale,
      placeholderOpacity,
      loadFromCache
    } = this.state

    Animated.timing(this.imageOpacity, {
      toValue: 1.0,
      duration: loadFromCache ? 0 : 500,
      // useNativeDriver: false
    }).start();

    // Animated.sequence([
    //   Animated.parallel([
    //     Animated.timing(placeholderScale, {
    //       toValue: 0.7,
    //       duration: 100,
    //       useNativeDriver: true
    //     }),
    //     Animated.timing(placeholderOpacity, {
    //       toValue: 0.66,
    //       duration: 100,
    //       useNativeDriver: true
    //     }),
    //   ]),
    //   Animated.parallel([
    //     Animated.parallel([
    //       Animated.timing(placeholderOpacity, {
    //         toValue: 0,
    //         duration: 200,
    //         useNativeDriver: true
    //       }),
    //       Animated.timing(placeholderScale, {
    //         toValue: 1.2,
    //         duration: 200,
    //         useNativeDriver: true
    //       }),
    //     ]),
    //     Animated.timing(imageOpacity, {
    //       toValue: 1.0,
    //       delay: 200,
    //       duration: 300,
    //       useNativeDriver: true
    //     })
    //   ])
    // ]).start(() => {
    //   this.setState(() => ({ loaded: true }))
    // })
  }

  render() {
    const {
      style,
      resizeMode,
      source,
      onLoadEnd
    } = this.props;

    const {
      loaded,
      placeholderOpacity,
      placeholderScale,
      placeholderSource,
      placeholderColor,
    } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <AnimatedFastImage
          style={[style, {
            opacity: this.imageOpacity,
            transform: [
              {
                scale: this.imageOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.85, 1],
                })
              }
            ]
          }]}
          source={source}
          resizeMode={resizeMode}
          onLoad={this.onLoad}
          onLoadEnd={onLoadEnd}
          onProgress={this.onProgress}
        />
        {/* <FastImage
          style={style}
          source={source}
          resizeMode={resizeMode}
          onLoadStart={this.onLoadStart}
          onLoad={this.onLoad}
        />

        {(placeholderSource && !loaded) &&
          <Animated.Image
            source={placeholderSource}
            style={[
              style,
              {
                opacity: placeholderOpacity,
                position: 'absolute'
              }
            ]} />
        }

        {(!placeholderSource && !loaded) &&
          <Animated.View
            style={[
              style,
              {
                backgroundColor: placeholderColor || '#90a4ae',
                opacity: placeholderOpacity,
                position: 'absolute',
                transform: [{ scale: placeholderScale }]
              }
            ]} />
        } */}
      </View>
    )
  }
}

ExFastImage.propTypes = {
  style: PropTypes.object,
  resizeMode: PropTypes.string,
  source: PropTypes.object,
}

export default ExFastImage