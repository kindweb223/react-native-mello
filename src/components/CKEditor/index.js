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

const patchPostMessageJsCode = `(${String(function() {
  window.postMessage = function(data) {
    window.ReactNativeWebView.postMessage(data)
  }
})})();`;

class CKEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      placeholder: '',
      init: false
    }
  }

  componentWillMount() {
    const { placeholder, initHeight } = this.props;
    this.setState({ placeholder })
  }

  postMessage = payload => {
    // only send message when webview is loaded
    if (this.webview) {
      this.webview.postMessage(payload);
    }
  };

  handleMessage = event => {
    try {
      const msgData = event.nativeEvent.data;
      const keyCode = msgData.split('>>>!hunt!<<<')[0];

      if (keyCode === 'NO_KEYCODE') {
        const content = msgData.split('>>>!hunt!<<<')[2];
        this.props.onChange(content);
      } if (keyCode === 'FOCUS_COMMAND') {
        const command = msgData.split('>>>!hunt!<<<')[1];
        this.props.handleCommands(command.split(':'))
      } else {
        this.props.handleKeydown();
      }
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

  hideKeyboard = () => {
    data = 'hidekeyboard: ';
    this.postMessage(data);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <WebView
          {...this.props}
          ref={c => this.webview = c}
          injectedJavaScript={patchPostMessageJsCode}
          onLoadEnd={this.onWebViewLoaded}
          onMessage={this.handleMessage}
          source={{ uri: sourceUri}}
          originWhitelist={['*']}
          allowFileAcces={true}
          style={styles.webviewStyle}
        />
      </View>
    );
  }
}

CKEditor.defaultProps = {
  scrollEnabled: false,
  startInLoadingState: false,
  useWebKit: true,
  hideKeyboardAccessoryView: false,
  automaticallyAdjustContentInsets: true,
  domStorageEnabled: false,
  cacheEnabled: false,
  thirdPartyCookiesEnabled: false,
  incognito: true,
  saveFormDataDisabled: true,
  mixedContentMode: "always",
  javascriptEnable: true,
  placeholder: 'Add a note',
  initHeight: 101,
  height: 101
}

const styles = StyleSheet.create({
  webviewStyle: {
    width: '100%',
    flex: 1
  }
});

export default CKEditor;
