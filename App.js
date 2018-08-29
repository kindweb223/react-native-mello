import React from 'react'
import { 
  StyleSheet,
  AsyncStorage,
  ActivityIndicator,
  View,
  YellowBox,
  Linking,
  Alert,
  Platform
} from 'react-native'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import promiseMiddleware from './src/service/promiseMiddleware'
import { Actions, Scene, Router, Modal, Lightbox, Stack } from 'react-native-router-flux'
import DeepLinking from 'react-native-deep-linking'
import axios from 'axios'
import CONSTANTS from './src/service/constants'
import COLORS from './src/service/colors'
import { BASE_URL, SCHEME } from './src/service/api'

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
    throw error
  }
)

import reducers from './src/redux/reducers'
import LoginStartScreen from './src/containers/LoginStartScreen'
import LoginScreen from './src/containers/LoginScreen'
import SignUpScreen from './src/containers/SignUpScreen'
import SignUpConfirmScreen from './src/containers/SignUpConfirmScreen'
import TermsAndConditionsScreen from './src/containers/TermsAndConditionsScreen'
import HomeScreen from './src/containers/HomeScreen'
import LoadingScreen from './src/containers/LoadingScreen';
import ImageSliderScreen from './src/containers/ImageSliderScreen';
import FeedDetailScreen from './src/containers/FeedDetailScreen';
import DocumentSliderScreen from './src/containers/DocumentSliderScreen';
import LikesListScreen from './src/containers/LikesListScreen';
import CommentScreen from './src/containers/CommentScreen';
import ProfileScreen from './src/containers/ProfileScreen'
import ProfileUpdateScreen from './src/containers/ProfileUpdateScreen'
import AccountConfirmScreen from './src/containers/AccountConfirmScreen'
import ResetPasswordScreen from './src/containers/ResetPasswordScreen'

const store = createStore(reducers, applyMiddleware(thunk, promiseMiddleware))
// crossroads.addRoute('confirm/{token}', token => Actions.confirm({ token, deepLinking: true }))

export default class Root extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false
    }

    this.handleOpenURL = this.handleOpenURL.bind(this)
  }

  componentDidMount() {
    YellowBox.ignoreWarnings(['Module RNDocumentPicker'])

    Linking.getInitialURL()
    .then((url) => {
      if (url) {
        Alert.alert('GET INIT URL', 'initial url ' + url)
        // this.resetStackToProperRoute(url)
      }
    })

    DeepLinking.addScheme(SCHEME)
    Linking.addEventListener('url', this.handleOpenURL)

    DeepLinking.addRoute('/confirm/:token', res => {
      Actions.confirm({ token: res['token'] })
    })
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL)
  }

  resetStackToProperRoute = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        DeepLinking.evaluateUrl(url)
      } else {
        if (Platform.OS === 'ios') {
          // Linking.openURL(`https://itunes.apple.com/${appStoreLocale}/app/${appName}/id${appStoreId}`);
        } else {
          // Linking.openURL(
          //   `https://play.google.com/store/apps/details?id=${playStoreId}`
          // );
        }
      }
    })
  }

  handleOpenURL({ url }) {
    this.resetStackToProperRoute(url)
  }
  
  async UNSAFE_componentWillMount() {
    this.setState({ loading: true })
    try {
      const xAuthToken = await AsyncStorage.getItem('xAuthToken')
      const userInfo = await AsyncStorage.getItem('userInfo')
      console.log('xAuthToken: ', xAuthToken)
      if (xAuthToken && userInfo) {
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
        <Modal hideNavBar>
          <Scene key="root">
            <Scene key="LoginStartScreen" component={ LoginStartScreen } initial hideNavBar panHandlers={null} />
            <Scene key="LoginScreen" component={ LoginScreen } hideNavBar panHandlers={null} />
            <Scene key="SignUpScreen" component={ SignUpScreen } hideNavBar panHandlers={null} />
            <Scene key="SignUpConfirmScreen" component={ SignUpConfirmScreen } hideNavBar panHandlers={null} />
            <Scene key="TermsAndConditionsScreen" component={ TermsAndConditionsScreen } hideNavBar panHandlers={null} />
            <Scene key="HomeScreen" component={ HomeScreen } hideNavBar panHandlers={null} />
            <Scene key="FeedDetailScreen" component={ FeedDetailScreen } hideNavBar panHandlers={null} />
            <Scene key="DocumentSliderScreen" component={ DocumentSliderScreen } hideNavBar />
            <Scene key="LikesListScreen" component={ LikesListScreen } navigationBarStyle={styles.defaultNavigationBar} />
            <Scene key="CommentScreen" component={ CommentScreen } navigationBarStyle={styles.defaultNavigationBar} />
            <Scene key="confirm" component={ AccountConfirmScreen } hideNavBar panHandlers={null} />
            <Scene key="ResetPasswordScreen" component={ ResetPasswordScreen } hideNavBar panHandlers={null} />
          </Scene>
          <Stack key="ProfileScreen" hideNavBar>
            <Stack key="ProfileScreen" hideNavBar>
              <Scene key="ProfileScreen" component={ ProfileScreen } hideNavBar panHandlers={null} />
              <Scene key="ProfileUpdateScreen" component={ ProfileUpdateScreen } hideNavBar panHandlers={null} />
            </Stack>
          </Stack>
        </Modal>
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
          <Router scenes={scenes} />
        </Provider>
      )
    }
  }
}

const styles = StyleSheet.create({
  defaultNavigationBar: {
    height: 54,
    backgroundColor: '#FEFEFE',
    // borderBottomWidth: 0,
  },
  loadingContainer: {
    width: CONSTANTS.SCREEN_WIDTH,
    height: CONSTANTS.SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
});