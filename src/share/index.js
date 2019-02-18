import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  YellowBox,
} from 'react-native'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import _ from 'lodash'
import promiseMiddleware from '../service/promiseMiddleware'
import reducers from '../redux/reducers'

const store = createStore(reducers, applyMiddleware(thunk, promiseMiddleware))

import { Scene, Router } from 'react-native-router-flux'
import SharedGroupPreferences from 'react-native-shared-group-preferences'
import axios from 'axios'

import { BASE_URL, SCHEME } from '../service/api'
axios.defaults.baseURL = BASE_URL
axios.defaults.headers.get['Content-Type'] = 'application/json'
axios.defaults.headers.get.Accept = 'application/json'
axios.defaults.withCredentials = true
axios.defaults.headers['x-mobile-api'] = true

axios.interceptors.response.use(
  response => (
    response
  ),
  (error) => {
    if (error.response && (
      (error.response.status === 401 && error.response.data.code === 'session.expired') ||
      (error.response.status === 403 && error.response.data.code === 'error.user.not.authenticated')
    )) {
      ShareExtension.goToMainApp(SCHEME);
    }
    throw error
  }
)


import CONSTANTS from '../service/constants';
import ShareExtension from './shareExtension'
import ShareCardScreen from './ShareCardScreen';
import ShareModalScreen from './ShareModalScreen';
import ChooseLinkImageFromExtension from './ChooseLinkImageFromExtension';
import ShareSuccessScreen from './ShareSuccessScreen';
import LoadingScreen from '../containers/LoadingScreen';


export default class Share extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initialized: false,
      isVisibleModal: false,
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
  }

  render() {
    if (!this.state.initialized) {
      return (
        <LoadingScreen />
      );
    }
    return (
      <View style={styles.rootContainer}>
        <Provider store={store}>
          <Router>
            <Scene key="root" hideNavBar duration={0}>
              <Scene key="ChooseLinkImageFromExtension" component={ChooseLinkImageFromExtension} duration={0} /> 
              <Scene key="ShareCardScreen" component={ShareCardScreen} duration={0} />
              <Scene key="ShareSuccessScreen" component={ShareSuccessScreen} duration={0} />
              <Scene key="ShareModalScreen" component={ShareModalScreen} okLabel='Sign In' initial={this.state.isVisibleModal} duration={0} />
            </Scene>
          </Router>
        </Provider>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  rootContainer: {
    backgroundColor: 'transparent',
  },
});
