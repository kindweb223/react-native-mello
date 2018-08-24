import React, { Component } from 'react'
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import PropTypes from 'prop-types'

class KeyboardScrollView extends React.Component {
  constructor(props) {
    super(props)
    this.mounted = false
    this.keyboardWillShowEvent = undefined
    this.keyboardWillHideEvent = undefined
  }

  componentDidMount() {
    this.mounted = true
    this.keyboardWillShowEvent = Keyboard.addListener(
      'keyboardWillShow',
      this.showKeyboard
    )
    this.keyboardWillHideEvent = Keyboard.addListener(
      'keyboardWillHide',
      this.hideKeyboard
    )
  }

  componentWillUnmount() {
    this.mounted = false
    this.keyboardWillShowEvent && this.keyboardWillShowEvent.remove()
    this.keyboardWillHideEvent && this.keyboardWillHideEvent.remove()
  }

  showKeyboard = () => {
    this.scrollRef.scrollToEnd()
  }

  hideKeyboard = () => {
  }

  render() {
    const { children, isKeyboardVerticalOffset, extraScrollHeight } = this.props
    
    if (Platform.OS === 'android') {
      return (
        <KeyboardAvoidingView
          behavior='padding'
          keyboardVerticalOffset={isKeyboardVerticalOffset ? 0 : 0}
        >
          <ScrollView keyboardDismissMode='on-drag'>
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      )
    }

    return (
      <KeyboardAwareScrollView
        ref={c => this.scrollRef = c}
        automaticallyAdjustContentInsets={true}
      >
        {children}
      </KeyboardAwareScrollView>
    )
  }
}

KeyboardScrollView.propTypes = {
  isKeyboardVerticalOffset: PropTypes.bool,
  extraScrollHeight: PropTypes.number,
  children: PropTypes.node.isRequired
}

KeyboardScrollView.defaultProps = {
  isKeyboardVerticalOffset: true,
  extraScrollHeight: 0
}

export default KeyboardScrollView
