import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import promiseMiddleware from './src/service/promiseMiddleware'
import { Actions, Scene, Router, Lightbox, } from 'react-native-router-flux'
import axios from 'axios'

import { BASE_URL } from './src/service/api'

axios.defaults.baseURL = BASE_URL
axios.defaults.headers.get['Content-Type'] = 'application/json'
axios.defaults.headers.get.Accept = 'application/json'
axios.defaults.withCredentials = true
axios.defaults.headers['x-auth-token'] = 'affe06f0-f36c-47aa-8448-5a56c067ec37'
axios.defaults.headers['x-mobile-api'] = true

import reducers from './src/redux/reducers'
import HomeScreen from './src/containers/HomeScreen'
import LoadingScreen from './src/containers/LoadingScreen';
import ImageSliderScreen from './src/containers/ImageSliderScreen';


const store = createStore(reducers, applyMiddleware(thunk, promiseMiddleware))

export default class Root extends React.Component {
  render() {
    const scenes = Actions.create(
      <Lightbox>
        <Scene key="root">
          <Scene key="Home" component={ HomeScreen } initial hideNavBar panHandlers={null} />
        </Scene>
        <Scene key="LoadingScreen" component={ LoadingScreen } hideNavBar />
        <Scene key="ImageSliderScreen" component={ ImageSliderScreen } hideNavBar />
      </Lightbox>
    );

    return (
      <Provider store={store}>
        <Router scenes={scenes}/>
      </Provider>
    );
  }
}

