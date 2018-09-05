import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Linking,
} from 'react-native'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import _ from 'lodash'
import promiseMiddleware from '../service/promiseMiddleware'
import reducers from '../redux/reducers'

const store = createStore(reducers, applyMiddleware(thunk, promiseMiddleware))

import { Scene, Router } from 'react-native-router-flux'
import ShareExtension from './shareExtension'

import ShareCardScreen from './ShareCardScreen';

const MainAppURL = 'https://www.apple.com/'


export default class Share extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: '',
      value: ''
    }
  }

  async componentDidMount() {
    try {
      const { type, value } = await ShareExtension.data()
      this.setState({
        type,
        value
      })
    } catch(e) {
      console.log('errrr', e)
    }

    ShareExtension.goToMainApp();
    // Linking.canOpenURL(MainAppURL).then((supported) => {
    //   console.log('Linking : ', supported);
    //   if (!supported) {
    //     console.log('Can\'t handle url: ' + MainAppURL);
    //   } else {
    //     return Linking.openURL(MainAppURL);
    //   }
    // }).catch((error) => console.error('An error occurred', error));
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
    backgroundColor: 'transparent',
  },
});
