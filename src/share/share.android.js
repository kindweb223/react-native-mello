import React, { Component } from 'react'
import {
  StyleSheet,
  YellowBox,
  Linking
} from 'react-native'
import _ from 'lodash'
import { Actions } from 'react-native-router-flux'
import SharedGroupPreferences from 'react-native-shared-group-preferences'
import axios from 'axios'

import { SCHEME } from '../service/api'


import CONSTANTS from '../service/constants';
import ShareExtension from './shareExtension'
import LoadingScreen from '../containers/LoadingScreen';


export default class Share extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initialized: false,
      isVisibleModal: false,
      type: '',
      value: '',
    }
    YellowBox.ignoreWarnings(['RCTBridge'])
  }

  async componentDidMount() {
    try {
      const xAuthToken = await SharedGroupPreferences.getItem("xAuthToken", CONSTANTS.APP_GROUP_TOKEN_IDENTIFIER);
      if (xAuthToken) {
        axios.defaults.headers['x-auth-token'] = xAuthToken;
        this.setState({
          initialized: true,
        })
        return;
      }
    } catch (error) {
      console.log('error code : ', error);
    }    
    this.setState({
      initialized: true,
      isVisibleModal: true,
    })

    const { type, value } = await ShareExtension.data();

    this.setState({value})
    if (type === 'text/plain')
      this.setState({type: 'url'})
    else
      this.setState({type})

    setTimeout(() => {
        Linking.openURL('https://' + SCHEME + `share/${this.state.type}/${this.state.value}`)
    }, 10)
  
    
  }

  onClose = () => {
    this.setState({ isVisibleModal: false });

    setTimeout(() => {
      Linking.openURL('https://' + SCHEME + `share/${this.state.type}/${this.state.value}`)
    }, 10)

  };


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
