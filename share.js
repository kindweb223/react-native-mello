import React, { Component } from 'react'
import {
  YellowBox,
  StyleSheet,
  View,
} from 'react-native'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import _ from 'lodash'
import promiseMiddleware from './src/service/promiseMiddleware'
import reducers from './src/redux/reducers'

const store = createStore(reducers, applyMiddleware(thunk, promiseMiddleware))

import { Scene, Router, Modal } from 'react-native-router-flux'
import ShareExtension from 'react-native-share-extension'

import ShareCardScreen from './src/share/ShareCardScreen';
import NewCardScreen from './src/containers/NewCardScreen' 


export default class Share extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: '',
      value: ''
    }
  }

  async componentDidMount() {
    YellowBox.ignoreWarnings(['Module ReactNativeShareExtension'])
    try {
      const { type, value } = await ShareExtension.data()
      this.setState({
        type,
        value
      })
    } catch(e) {
      console.log('errrr', e)
    }
  }

  render() {
    return (
      <View style={styles.rootContainer}>
        <Provider store={store}>
          <Router>
            <Scene key="root" hideNavBar>
              <Scene key="ShareCardScreen" component={ShareCardScreen} />
            </Scene>
          </Router>
        </Provider>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});
