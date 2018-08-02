'use strict';
/** @flow */

import React, { Component } from 'react';
import {
  ScrollView,
  View
} from 'react-native';
import PropTypes from 'prop-types'

class Carousel extends Component {
  state: {
    offset: ?Number
  }

  constructor(props) {
    super(props);

    this.state = {
      offset: 0,
    }
  }

  renderBubbles = (width: Number) => {
    const {
      children,
      color,
      dimmedColor,
      bubbleWidth,
      bubbleHeight
    } = this.props;

    let bubbles = [];

    const emptyBubble = {
      width: bubbleWidth,
      height: bubbleHeight,
      backgroundColor: dimmedColor,
      borderRadius: 15,
      marginHorizontal: 3,
      alignSelf: 'center',
    }

    const filledBubble = {
      width: bubbleWidth,
      height: bubbleHeight,
      backgroundColor: color,
      marginHorizontal: 3,
      borderRadius: 15,
      alignSelf: 'center',
    }

    for (let i = 0; i < children.length; i ++) {
      bubbles.push (
        <View style={ emptyBubble } key={ width * i }/>
      )
    }

    if (this.state.offset % width === 0) {
      bubbles.map((v) => {
        v.key == this.state.offset
          ? bubbles[v.key / width]
              = <View style={ filledBubble } key={ v.key }/>
          : null;
      })
    }

    return (
      <View style={{ flexDirection: 'row', alignSelf: 'center', position: 'absolute', bottom: -40 }}>
        { bubbles }
      </View>
    )
  }

  render() {
    const {
      backgroundColor,
      children,
      height,
      showBubbles,
      showScroll,
      width,
    } = this.props;

    let pages = [];

    for (let i = 0; i < children.length; i ++) {
      pages.push (
        <View style={{ width: width }} key={i}>
          { children[i] }
        </View>
      )
    }

    return (
      <View style={{ width: width, backgroundColor: backgroundColor }}>
        <ScrollView
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={showScroll}
          onScroll={(e)=>{
            this.setState({ offset: e.nativeEvent.contentOffset.x })
          }}
          style={{ width: width, height: height }}
        >
          { pages }
        </ScrollView>
        { showBubbles ? this.renderBubbles(width) : null }
      </View>
    )
  }
}

Carousel.defaultProps = {
  color: '#fff',
  dimmedColor: '#666',
  bubbleWidth: 6,
  bubbleHeight: 6,
  showBubbles: true,
  showScroll: true,
  width: 350,
  height: 500,
  backgroundColor: '#fff'
}

Carousel.propTypes = {
  children: PropTypes.node.isRequired,
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
  dimmedColor: PropTypes.string,
  bubbleWidth: PropTypes.number,
  bubbleHeight: PropTypes.number,
  showBubbles: PropTypes.bool,
  showScroll: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
}

export default Carousel