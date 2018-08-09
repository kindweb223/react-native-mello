'use strict'
/** @flow */

import React from 'react'
import { ScrollView, View, Image, Text, TouchableOpacity } from 'react-native'
import GestureRecognizer, { SwipeDirections } from 'react-native-swipe-gestures'
import styles from './styles'

export default class SlideShow extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      offset: 0
    }
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

  render () {
    const {
      imageFiles,
      height,
      width,
      position
    } = this.props

    return (
      <View style={{ width, height: height + 40 }}>
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
              <TouchableOpacity activeOpacity={1} onPress={() => this.props.handleImage()}>
                <Image source={{ uri: item.accessUrl }} resizeMode="contain" style={{ width, height: '100%' }} />
              </TouchableOpacity>
            </GestureRecognizer>
          ))}
        </ScrollView>
        
        {this.renderBubbles(width)}
      </View>
    )
  }
}
