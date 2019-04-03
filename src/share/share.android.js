import React, { Component } from 'react'
import {
  YellowBox,
  Linking,
  AsyncStorage
} from 'react-native'
import _ from 'lodash'

import SharedGroupPreferences from 'react-native-shared-group-preferences'
import { SCHEME } from '../service/api'
import { Actions } from 'react-native-router-flux'

import ShareExtension from './shareExtension'
import LoadingScreen from '../containers/LoadingScreen';
import CONSTANTS from '../service/constants'
import AlertController from '../components/AlertController';

export default class Share extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initialized: false,
    }
    YellowBox.ignoreWarnings(['RCTBridge'])
  }

  handleError() {
    Actions.pop()
    setTimeout(() => {
      ShareExtension.close();
    }, 10)
  }

  async componentDidMount() {
    this.setState({
      initialized: true,
    })

    try {
      let { type, value } = await ShareExtension.data();

      if (type === '' || value === '')
      {
        console.log('empty share data:')
        AlertController.shared.showAlert('Error', 'Oops, we hit an issue \nPlease try sharing again', [
          {
            text: 'Ok',
            onPress: () => this.handleError()
          },
        ])
        return;
      }
      
      if (type === 'text/plain')
        type = 'url'

      AsyncStorage.setItem(CONSTANTS.ANDROID_SHARE_EXTENTION_FLAG, 'true')
      
      console.log('share data:', type, value)
      setTimeout(() => {
        Linking.openURL('https://' + SCHEME + `share/${type}/${value}`)
      }, 100); 

    } catch(error) {
      console.log('error : ', error)
    }
  
  }

  
  render() {
    console.log('this.state.initialized', this.state.initialized)
    if (!this.state.initialized) {
      return (
        <LoadingScreen />
      );
    }
    return (
      null
    )
  }
}
