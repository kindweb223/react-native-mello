import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import axios from 'axios'
import axiosMiddleware from 'redux-axios-middleware'

import App from './src'
import { BASE_URL } from './src/service'
import reducers from './src/redux/reducers'

const client = axios.create({
  baseURL: BASE_URL,
  responseType: 'json'
})

const store = createStore(reducers, applyMiddleware(axiosMiddleware(client)))

export default class Root extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

