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
      init: false,
      didLoadWebview: false
    }
  }

  componentWillMount() {
    const { placeholder, initHeight } = this.props;
    this.setState({ placeholder })
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.didLoadWebview == nextState.didLoadWebview) {
      return false
    }
    return true 
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

        // Because the inhability to change the placeholder in CKEditor, we set the opacity to 0 for it until it loads.
        // Because there was no working event that was only fired on CKEditor finished loading, I had to add it here.
        // shouldComponentUpdate method prevents multiple rerenders caused by this:
        this.setState({ didLoadWebview: true })
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
    const sourceUri = (
      Platform.OS === 'android' 
        ? 'file:///android_asset/' 
        : ''
    ) + 'Web.bundle/ckeditor.html';

    return (
      <View style={{ flex: 1 }} opacity={ this.state.didLoadWebview ? 1 : 0 }>
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
