import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
AppRegistry.registerComponent(appName, () => App);

// Android share extension, (index.share.js -> for iOS Share Extension)
import Share from './src/share/share.android';
import {nameEx} from './app.json';
{Platform.OS === 'android' && AppRegistry.registerComponent(nameEx, () => Share)}

