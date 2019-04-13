import React, { Component } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import _ from 'lodash'

class TouchableDebounce extends Component {
  constructor(props) {
    super(props);

    this.onPressDelayed = _.debounce(() => { this.setState({ isAvailable: true }) }, 500);

    this.state = {
        isAvailable: true
    }   
  }

  render() {
    return (
      <TouchableOpacity
        style={this.props.style}
        activeOpacity={this.props.activeOpacity}
        onPress={ () => { 
            if (this.state.isAvailable) { 
                this.props.onPress() 
            };
            this.setState({ isAvailable: false })
            this.onPressDelayed();
        }}
        onLongPress={ () => {
            this.props.onLongPress()
        }}
      >
        {this.props.children}
      </TouchableOpacity>
    );
  }
}

export default TouchableDebounce;

export function debounce(callback, wait, context = this) {
    let timeout = null;
    let callbackArgs = null;
  
    const later = () => callback.apply(context, callbackArgs);
  
    return function() {
      callbackArgs = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
}