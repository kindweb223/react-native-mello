import React, { Component } from 'react'
import {
  YellowBox,
  Linking
} from 'react-native'
import _ from 'lodash'

import { SCHEME } from '../service/api'


import ShareExtension from './shareExtension'
import LoadingScreen from '../containers/LoadingScreen';


export default class Share extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initialized: false,
      type: '',
      value: '',
    }
    YellowBox.ignoreWarnings(['RCTBridge'])
  }

  async componentDidMount() {
    this.setState({
      initialized: true,
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
