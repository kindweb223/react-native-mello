'use strict'
/** @flow */

import React from 'react'
import { ScrollView, View, Image, Text, TouchableOpacity, Animated } from 'react-native'
import GestureRecognizer, { SwipeDirections } from 'react-native-swipe-gestures'
import styles from './styles'
import FastImage from "react-native-fast-image";

export default class SlideShow extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      offset: 0,
      isTouch: false
    }
    this.buttonOpacity = new Animated.Value(1)
  }

  renderBubbles = (width) => {
    const { imageFiles } = this.props

    const { offset } =  this.state
    let bubbles = []

    for (let i = 0; i < imageFiles.length; i++) {
      bubbles.push(<View style={[ styles.bubbles, styles.emptyBubble ]} key={width * i} />)
    }

    if (offset % width === 0) {
      bubbles.map(v => {
        if (v.key == offset) {
          bubbles[v.key / width] = <View style={[ styles.bubbles, styles.filledBubble ]} key={v.key} />
        }
      })
    }

    return (
      <View style={styles.bubbleView}>
        {bubbles}
      </View>
    )
  }

  handleImage = () => {
    if (this.state.isTouch) {
      this.buttonOpacity.setValue(0);
      Animated.timing(this.buttonOpacity, {
        toValue: 1,
        duration: 200,
      }).start();
    } else {
      this.buttonOpacity.setValue(1);
      Animated.timing(this.buttonOpacity, {
        toValue: 0,
        duration: 200
      }).start();
    }
    this.setState({ isTouch: !this.state.isTouch })
    this.props.handleImage()
  }
  render () {
    const {
      imageFiles,
      height,
      width,
      position
    } = this.props

    return (
      <View style={[styles.container, { width, height }]}>
        <ScrollView
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          contentOffset={{ x: width * position, y: 0 }}
          scrollEventThrottle={10}
          onScroll={e => {
            this.setState({ offset: e.nativeEvent.contentOffset.x })
          }}
          contentContainerStyle={{ height }}
        >
          {imageFiles.map((item, key) => (
            <GestureRecognizer
              key={key}
              style={{ width, height }}
              onSwipeUp={() => this.props.onSwipeUp()}
              config={{
                velocityThreshold: 0.3,
                directionalOffsetThreshold: 80
              }}
            >
              <TouchableOpacity activeOpacity={1} onPress={() => this.handleImage()}>
                <FastImage source={{uri: item.accessUrl}} resizeMode="contain" style={{ width, height: '100%' }} />
              </TouchableOpacity>
            </GestureRecognizer>
          ))}
        </ScrollView>
        
        <Animated.View 
          style={[styles.renderButtonWrapper, { opacity: this.buttonOpacity }]}
        >
          {this.renderBubbles(width)}
        </Animated.View>
      </View>
    )
  }
}
