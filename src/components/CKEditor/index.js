import React, { document } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  Platform
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
      init: false,
      height: 70,
      initHeight: 70
    }
  }

  componentWillMount() {
    const { placeholder } = this.props;
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

      console.log("[CKEditor] Event = " + keyCode)
      console.log("[CKEditor] Data = " + msgData)

      if (keyCode === 'NO_KEYCODE' || keyCode === 'PASTE_COMMAND') {
        const content = msgData.split('>>>!hunt!<<<')[2];
        const height = parseInt(msgData.split('>>>!hunt!<<<')[1]) + 8;
        if (height > this.state.initHeight) {
          this.setState({ height })
        }
        this.props.onChange(content);
      } if (keyCode === 'FOCUS_COMMAND') {
        const command = (msgData.split('>>>!hunt!<<<')[1]).split(':');
        this.props.handleCommands(command)
        const height = parseInt(msgData.split('>>>!hunt!<<<')[2]) + 8;
        if (height > this.state.initHeight) {
          this.setState({ height })
        }
      } else {
        // Space(32) or Enter(13)
        if (keyCode === '13' || keyCode == '32') {
          if (keyCode === '13') {
            this.props.handleCKEditorHeight(parseInt(this.state.height) + 8)
          }
          this.props.handleKeydown();
        }
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
    const sourceUri = (
      Platform.OS === 'android' 
        ? 'file:///android_asset/' 
        : ''
    ) + 'Web.bundle/ckeditor.html';

    return (
      <View
        style={{ height: this.state.height + 8 }}
        onLayout={(event) => {
          const height = event.nativeEvent.layout.height;
          this.props.handleCKEditorHeight(parseInt(height + 8))
        }}
      >
        <WebView
          {...this.props}
          ref={c => this.webview = c}
          injectedJavaScript={patchPostMessageJsCode}
          onLoadEnd={this.onWebViewLoaded}
          onMessage={this.handleMessage}
          source={{ uri: sourceUri }}
          originWhitelist={['*']}
          allowFileAcces={true}
          // source={{ uri: Platform.OS === 'ios' ? 'https://demos.solvers.io/solvers/melloapp-landing/ckeditor_ios.html' : 'https://demos.solvers.io/solvers/melloapp-landing/ckeditor_android.html' }}
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
  placeholder: 'Add a note'
}

const styles = StyleSheet.create({
  webviewStyle: {
    width: '100%',
    flex: 1
  }
});

export default CKEditor;