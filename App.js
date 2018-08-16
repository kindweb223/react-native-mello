import React from 'react'
import { 
  StyleSheet,
  AsyncStorage,
  ActivityIndicator,
  View
} from 'react-native'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import promiseMiddleware from './src/service/promiseMiddleware'
import { Actions, Scene, Router, Lightbox } from 'react-native-router-flux'
import axios from 'axios'
import CONSTANTS from './src/service/constants'
import COLORS from './src/service/colors'
import { BASE_URL } from './src/service/api'

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
    if (error.response === undefined || (error.response.status === 401 && error.response.data.code === 'session.expired')) {
      AsyncStorage.removeItem('xAuthToken')
      Actions.LoginStartScreen()
    }
    console.log('ERROR: ', error)
    return error
  }
)

import reducers from './src/redux/reducers'
import LoginStartScreen from './src/containers/LoginStartScreen'
import LoginScreen from './src/containers/LoginScreen'
import HomeScreen from './src/containers/HomeScreen'
import LoadingScreen from './src/containers/LoadingScreen';
import ImageSliderScreen from './src/containers/ImageSliderScreen';
import FeedDetailScreen from './src/containers/FeedDetailScreen';
import DocumentSliderScreen from './src/containers/DocumentSliderScreen';
import LikesListScreen from './src/containers/LikesListScreen';


const store = createStore(reducers, applyMiddleware(thunk, promiseMiddleware))

export default class Root extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  async UNSAFE_componentWillMount() {
    this.setState({ loading: true })
    try {
      const xAuthToken = await AsyncStorage.getItem('xAuthToken')
      console.log('xAuthToken: ', xAuthToken)
      if (xAuthToken) {
        axios.defaults.headers['x-auth-token'] = xAuthToken
        Actions.HomeScreen()
      }
      this.setState({ loading: false })
    } catch(error) {
      console.log('error', error)
      this.setState({ loading: false })
    }
  }

  render() {
    const scenes = Actions.create(
      <Lightbox>
        <Scene key="root">
          <Scene key="LoginStartScreen" component={ LoginStartScreen } initial hideNavBar panHandlers={null} />
          <Scene key="LoginScreen" component={ LoginScreen } hideNavBar panHandlers={null} />
          <Scene key="HomeScreen" component={ HomeScreen } hideNavBar panHandlers={null} />
          <Scene key="FeedDetailScreen" component={ FeedDetailScreen } hideNavBar panHandlers={null} />
          <Scene key="DocumentSliderScreen" component={ DocumentSliderScreen } hideNavBar />
          <Scene key="LikesListScreen" component={ LikesListScreen } navigationBarStyle={styles.defaultNavigationBar}/>
        </Scene>
        <Scene key="LoadingScreen" component={ LoadingScreen } hideNavBar />
        <Scene key="ImageSliderScreen" component={ ImageSliderScreen } hideNavBar />
      </Lightbox>
    );

    if (this.state.loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            animating
            size="large"
            color={COLORS.PURPLE}
          />
        </View>
      )
    } else {
      return (
        <Provider store={store}>
          <Router scenes={scenes}/>
        </Provider>
      )
    }
  }
}

const styles = StyleSheet.create({
  defaultNavigationBar: {
    height: 70,
    // backgroundColor: whiteColor,
    // borderBottomWidth: 0,
    // shadowColor: lightGreyColor,
		// shadowOffset: { width: 0, height: 2 },
		// shadowOpacity: 0.19,
		// shadowRadius: 12,
  },
  loadingContainer: {
    width: CONSTANTS.SCREEN_WIDTH,
    height: CONSTANTS.SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
});