/** @format */

import {AppRegistry} from 'react-native';
import App from './App';
import Share from './share';
import {name as appName, nameEx} from './app.json';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent(nameEx, () => Share);
