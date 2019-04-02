import React from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  View,
  Platform
} from 'react-native';

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
  console.log('patchedPostMessage: ', patchedPostMessage)
  window.postMessage = patchedPostMessage;
})})();`;

class CKEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };
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
    this.setState({ loading: false });
    this.postMessage(this.props.content);
  };

  showLoadingIndicator = () => {
    return (
      <View style={styles.activityIndicatorContainer}>
        <ActivityIndicator size="large" animating={this.state.loading} color="#4A00CD" />
      </View>
    );
  };

  setTextType = (type) => {
    console.log('TYPE: ', { type: 'style', content: type })
    this.postMessage({ type: 'style', content: type });
  }

  render() {
    return (
      <WebView
        ref={ c => this.webview = c}
        injectedJavaScript={patchPostMessageJsCode}
        style={styles.webviewStyle}
        // scrollEnabled={false}
        hideKeyboardAccessoryView={true}
        source={webapp}
        onError={this.onError}
        renderError={this.renderError}
        javaScriptEnabled
        onLoadEnd={this.onWebViewLoaded}
        onMessage={this.handleMessage}
        renderLoading={this.showLoadingIndicator}
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
