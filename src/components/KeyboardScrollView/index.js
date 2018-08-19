import React, { Component } from 'react'
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import PropTypes from 'prop-types'

const KeyboardScrollView = ({ children, isKeyboardVerticalOffset, extraScrollHeight }) => {
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
      extraScrollHeight={extraScrollHeight}
      automaticallyAdjustContentInsets={true}
    >
      {children}
    </KeyboardAwareScrollView>
  )
}

KeyboardScrollView.propTypes = {
  isKeyboardVerticalOffset: PropTypes.bool,
  extraScrollHeight: PropTypes.number,
  children: PropTypes.node.isRequired
}

KeyboardScrollView.defaultProps = {
  isKeyboardVerticalOffset: true,
  extraScrollHeight: 10
}

export default KeyboardScrollView
