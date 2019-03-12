import React, { Component } from 'react'
import {
  YellowBox,
  Linking
} from 'react-native'
import _ from 'lodash'

import SharedGroupPreferences from 'react-native-shared-group-preferences'
import { SCHEME } from '../service/api'


import ShareExtension from './shareExtension'
import LoadingScreen from '../containers/LoadingScreen';
import CONSTANTS from '../service/constants'

export default class Share extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initialized: false,
    }
    YellowBox.ignoreWarnings(['RCTBridge'])
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
        return;
      }
      
      if (type === 'text/plain')
        type = 'url'

      SharedGroupPreferences.setItem(CONSTANTS.ANDROID_SHARE_EXTENTION_FLAG, true, CONSTANTS.APP_GROUP_SHARE_EXTENSION)
      
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
