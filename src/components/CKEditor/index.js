import React from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  Platform,
  // WebView
} from 'react-native';
import _ from 'lodash';

import { WebView } from 'react-native-webview'
var editor = require('./ckeditor.html')

const patchPostMessageJsCode = `(${String(function() {
  window.postMessage = function(data) {
    window.ReactNativeWebView.postMessage(data)
  }
})})();`;

class CKEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      height: 100
    }
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
    data = 'placeholder: ' + 'TEST';
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
        source={Platform.OS === 'ios' ? editor : { uri: 'file:///android_asset/ckeditor/index.html' }}
        // source={{ uri: Platform.OS === 'ios' ? 'https://demos.solvers.io/solvers/melloapp-landing/ckeditor_ios.html' : 'https://demos.solvers.io/solvers/melloapp-landing/ckeditor_android.html' }}
        // onError={this.onError}
        // renderError={this.renderError}
        javaScriptEnabled
        startInLoadingState={true}  
        onLoadEnd={this.onWebViewLoaded}
        onMessage={this.handleMessage}
        domStorageEnabled={false}
        cacheEnabled={false}
        thirdPartyCookiesEnabled={false}
        incognito={true}
        saveFormDataDisabled={true}
        mixedContentMode="always"
        scrollEnabled
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
