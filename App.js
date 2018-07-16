import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import axios from 'axios'
import axiosMiddleware from 'redux-axios-middleware'
import { Actions, Scene, Router } from 'react-native-router-flux';

import HomeScreen from './src/containers/HomeScreen'
import { BASE_URL } from './src/service'
import reducers from './src/redux/reducers'

const client = axios.create({
  baseURL: BASE_URL,
  responseType: 'json'
})

const store = createStore(reducers, applyMiddleware(axiosMiddleware(client)))

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

