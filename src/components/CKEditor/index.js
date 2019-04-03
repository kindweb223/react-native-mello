import React from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  View,
  Platform,
  // WebView
} from 'react-native';
import _ from 'lodash';

import { WebView } from 'react-native-webview'

const webapp = require('./index.html');

// fix https://github.com/facebook/react-native/issues/10865
const patchPostMessageJsCode = `(${String(function() {
  var originalPostMessage = window.postMessage;
  var patchedPostMessage = function(message, targetOrigin, transfer) {
    originalPostMessage(message, targetOrigin, transfer);
  };
  patchedPostMessage.toString = function() {
    return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
  };
  window.postMessage = patchedPostMessage;
})})();`;

class CKEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  onError = error => {
    Alert.alert('WebView onError', error, [
      { text: 'OK', onPress: () => console.log('OK Pressed') }
    ]);
  };

  renderError = error => {
    Alert.alert('WebView renderError', error, [
      { text: 'OK', onPress: () => console.log('OK Pressed') }
    ]);
  };

  postMessage = payload => {
    // only send message when webview is loaded
    if (this.webview) {
      this.webview.postMessage(payload);
    }
  };

  handleMessage = event => {
    try {
      const msgData = event.nativeEvent.data;
      this.props.onChange(msgData);
    } catch (err) {
      console.warn(err);
      return;
    }
  };

  onWebViewLoaded = () => {
    // data = 'placeholder: ' + this.props.content;
    data = 'placeholder: ' + 'My TEST';
    this.postMessage(data);
  };

  executeCommand = (command) => {
    data = 'execute: ' + command;
    this.postMessage(data);
  }

  render() {
    return (
      <WebView
        ref={c => this.webview = c}
        injectedJavaScript={patchPostMessageJsCode}
        style={styles.webviewStyle}
        useWebKit={true}
        scrollEnabled={false}
        hideKeyboardAccessoryView={true}
        source={webapp}
        onError={this.onError}
        renderError={this.renderError}
        javaScriptEnabled
        onLoadEnd={this.onWebViewLoaded}
        onMessage={this.handleMessage}
        mixedContentMode="always"
      />
    );
  }
}

const styles = StyleSheet.create({
  activityIndicatorContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  webviewStyle: {
    width: '100%',
    marginTop: Platform.OS === 'ios' ? 8 : 0
  }
});

export default CKEditor;
