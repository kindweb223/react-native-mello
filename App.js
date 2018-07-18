import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import promiseMiddleware from './src/service/promiseMiddleware'
import { Actions, Scene, Router } from 'react-native-router-flux'
import axios from 'axios'
axios.defaults.headers.get['Content-Type'] = 'application/json'
axios.defaults.headers.get.Accept = 'application/json'
axios.defaults.withCredentials = true
axios.defaults.headers['x-auth-token'] = '6d78204d-6239-4b40-8441-377790c6f968'
axios.defaults.headers['x-mobile-api'] = true

import reducers from './src/redux/reducers'
import HomeScreen from './src/containers/HomeScreen'

const store = createStore(reducers, applyMiddleware(thunk, promiseMiddleware))

export default class Root extends React.Component {
  render() {
    const scenes = Actions.create(
      <Scene key="root">
        <Scene key="Home" component={ HomeScreen } initial hideNavBar panHandlers={null} />
      </Scene>
    );

    return (
      <Provider store={store}>
        <Router scenes={scenes}/>
      </Provider>
    );
  }
}

