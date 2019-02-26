console.log('iOS ShareExtension - index_share_extension');
import {AppRegistry} from 'react-native';
import Share from './src/share';
import {nameEx} from './app.json';
AppRegistry.registerComponent(nameEx, () => Share);
