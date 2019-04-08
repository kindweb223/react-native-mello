import React, { document } from 'react';
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
      webVewHeight: 101,
      placeholder: ''
    }
  }

  componentWillMount() {
    const { placeholder, initHeight } = this.props;
    this.setState({ placeholder, webVewHeight: initHeight })
  }

  postMessage = payload => {
    // only send message when webview is loaded
    if (this.webview) {
      this.webview.postMessage(payload);
    }
  };

  handleMessage = event => {
    try {
      console.log('DATA: ',  event.nativeEvent.data)
      const msgData = event.nativeEvent.data;
      const webVewHeight = parseInt(msgData.split('>>>!hunt!<<<')[0]) + 20;
      const content = msgData.split('>>>!hunt!<<<')[1];

      this.setState({ webVewHeight });
      this.props.onChange(content);
    } catch (err) {
      console.warn(err);
      return;
    }
  };

  onWebViewLoaded = async () => {
    data = 'placeholder: ' + this.props.content;
    this.postMessage(data);
  };

  executeCommand = (command) => {
    data = 'execute: ' + command;
    this.postMessage(data);
  }

  render() {
    return (
      <View style={{ height: this.state.webVewHeight }}>
        <WebView
          {...this.props}
          ref={c => this.webview = c}
          injectedJavaScript={patchPostMessageJsCode}
          onLoadEnd={this.onWebViewLoaded}
          onMessage={this.handleMessage}
          source={Platform.OS === 'ios' ? editor : { uri: 'file:///android_asset/ckeditor/index.html' }}
          // source={{ uri: Platform.OS === 'ios' ? 'https://demos.solvers.io/solvers/melloapp-landing/ckeditor_ios.html' : 'https://demos.solvers.io/solvers/melloapp-landing/ckeditor_android.html' }}
          style={styles.webviewStyle}
        />
      </View>
    );
  }
}

CKEditor.defaultProps = {
  startInLoadingState: true,
  useWebKit: true,
  hideKeyboardAccessoryView: false,
  automaticallyAdjustContentInsets: true,
  domStorageEnabled: false,
  cacheEnabled: false,
  thirdPartyCookiesEnabled: false,
  incognito: true,
  saveFormDataDisabled: true,
  mixedContentMode: "always",
  scrollEnabled: true,
  javascriptEnable: true,
  placeholder: 'Add a note',
  initHeight: 101
}

const styles = StyleSheet.create({
  webviewStyle: {
    width: '100%',
    marginTop: Platform.OS === 'ios' ? 8 : 0
  }
});

export default CKEditor;
