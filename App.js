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
import _ from 'lodash'
import promiseMiddleware from './src/service/promiseMiddleware'
import { Actions, Scene, Router, Modal, Lightbox, Stack } from 'react-native-router-flux'
import SharedGroupPreferences from 'react-native-shared-group-preferences'
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
    console.log('ERROR: ', error)
    if (error.response === undefined || (error.response.status === 401 && error.response.data.code === 'session.expired')) {
      AsyncStorage.removeItem('xAuthToken')
      SharedGroupPreferences.setItem('xAuthToken', null, CONSTANTS.APP_GROUP_TOKEN_IDENTIFIER)

      Actions.LoginScreen({type: 'replace'})
    }
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
import SignUpSuccessScreen from './src/containers/SignUpSuccessScreen'
import ResetPasswordConfirmScreen from './src/containers/ResetPasswordConfirmScreen'
import ResetPasswordScreen from './src/containers/ResetPasswordScreen'
import ResetPasswordSuccessScreen from './src/containers/ResetPasswordSuccessScreen'
import CropImageScreen from './src/containers/CropImageScreen'
import FeedFilterScreen from './src/containers/FeedFilterScreen'
import ArchivedFeedScreen from './src/containers/ArchivedFeedScreen'

const store = createStore(reducers, applyMiddleware(thunk, promiseMiddleware))

export default class Root extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      userInfo: null
    }

    this.handleOpenURL = this.handleOpenURL.bind(this)
  }

  async UNSAFE_componentWillMount() {
    Linking.getInitialURL()
    .then((url) => {
      if (url) {
        this.resetStackToProperRoute(url)
      }
    })

    Linking.addEventListener('url', this.handleOpenURL)

    try {
      const xAuthToken = await AsyncStorage.getItem('xAuthToken')
      const userInfo = await AsyncStorage.getItem('userInfo')
      this.setState({ userInfo })
      console.log('xAuthToken: ', xAuthToken)

      if (xAuthToken && userInfo) {
        axios.defaults.headers['x-auth-token'] = xAuthToken
        Actions.HomeScreen()
      } else {
        const userBackInfo = await AsyncStorage.getItem('userBackInfo')
        if (userBackInfo) {
          Actions.LoginScreen()
        }
      }
      this.setState({ loading: false })
    } catch(error) {
      this.setState({ loading: false })
    }
  }

  componentDidMount() {
    YellowBox.ignoreWarnings(['Module RNDocumentPicker'])
    YellowBox.ignoreWarnings(['Module ReactNativeShareExtension'])
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL)
  }

  resetStackToProperRoute = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        let params = _.split(decodeURIComponent(url), '/')
        const path = params[params.length - 2]
        console.log('UNIVERSAL_LINK: ', decodeURIComponent(url))

        if (path === 'get-started') {  
          const lastParam = params[params.length - 1]
          const paramArray = lastParam.split(/[?\=&]/)
          const type = paramArray[0]

          if (type === 'signup') {  // Signup via invite
            const token = paramArray[2]
            const userEmail = paramArray[4]
            
            Actions.SignUpScreen({
              userEmail,
              token,
              isInvite: true
            })
          } else if (type === 'check-token') {  // Confirm user
            const token = paramArray[2]
            if (this.state.userInfo) {
              Actions.HomeScreen()
            } else {
              Actions.SignUpSuccessScreen({ token, deepLinking: true })
            }
          }
        }

        if (path === 'reset') { // Reset password
          const token = params[params.length - 1]
          Actions.ResetPasswordScreen({ token })
        }

        if (path === 'feed') { // Share an Idea
          const feedId = params[params.length - 1]
          const data = {
            id: feedId
          }
          if (this.state.userInfo) {
            setTimeout(() => {
              Actions.FeedDetailScreen({ data })
            }, 1000); // Time in milliseconds
          } else {
            Actions.LoginScreen()
          }
        }

      } else {
        if (Platform.OS === 'ios') {
          // Linking.openURL(`https://itunes.apple.com/${appStoreLocale}/app/${appName}/id${appStoreId}`);
        } else {
          // Linking.openURL(`https://play.google.com/store/apps/details?id=${playStoreId}`);
        }
      }
    })
  }

  handleOpenURL({ url }) {
    this.resetStackToProperRoute(url)
  }

  render() {
    const scenes = Actions.create(
      <Lightbox>
        <Modal hideNavBar>
          <Scene key="root">
            <Scene key="LoginStartScreen" component={ LoginStartScreen } hideNavBar panHandlers={null} />
            <Scene key="LoginScreen" component={ LoginScreen } navigationBarStyle={styles.emptyBorderNavigationBar} />
            <Scene key="SignUpScreen" component={ SignUpScreen } navigationBarStyle={styles.emptyBorderNavigationBar} />
            <Scene key="SignUpConfirmScreen" component={ SignUpConfirmScreen } panHandlers={null} navigationBarStyle={styles.emptyBorderNavigationBar} />
            <Scene key="TermsAndConditionsScreen" component={ TermsAndConditionsScreen } navigationBarStyle={styles.emptyBorderNavigationBar} />
            <Scene key="HomeScreen" component={ HomeScreen } hideNavBar panHandlers={null} />
            <Scene key="FeedDetailScreen" component={ FeedDetailScreen } hideNavBar panHandlers={null} />
            <Scene key="DocumentSliderScreen" component={ DocumentSliderScreen } hideNavBar />
            <Scene key="LikesListScreen" component={ LikesListScreen } navigationBarStyle={styles.defaultNavigationBar} />
            <Scene key="CommentScreen" component={ CommentScreen } navigationBarStyle={styles.defaultNavigationBar} />
            <Scene key="SignUpSuccessScreen" component={ SignUpSuccessScreen } hideNavBar panHandlers={null} />
            <Scene key="ResetPasswordConfirmScreen" component={ ResetPasswordConfirmScreen } navigationBarStyle={styles.emptyBorderNavigationBar} />
            <Scene key="ResetPasswordScreen" component={ ResetPasswordScreen } panHandlers={null} navigationBarStyle={styles.emptyBorderNavigationBar} />
            <Scene key="ResetPasswordSuccessScreen" component={ ResetPasswordSuccessScreen } hideNavBar panHandlers={null} />
            <Scene key="FeedFilterScreen" component={ FeedFilterScreen } hideNavBar />
          </Scene>
          <Stack key="ProfileScreen" hideNavBar>
            <Stack key="ProfileScreen">
              <Scene key="ProfileScreen" component={ ProfileScreen } hideNavBar navigationBarStyle={styles.defaultNavigationBar} />
              <Scene key="ProfileUpdateScreen" component={ ProfileUpdateScreen } navigationBarStyle={styles.defaultNavigationBar} />
              <Scene key="ProfileResetPasswordConfirmScreen" component={ ResetPasswordConfirmScreen } navigationBarStyle={styles.defaultNavigationBar} />
              <Scene key="ProfileTermsAndConditionsScreen" component={ TermsAndConditionsScreen } navigationBarStyle={styles.emptyBorderNavigationBar} />
              <Scene key="ArchivedFeedScreen" component={ ArchivedFeedScreen } navigationBarStyle={styles.defaultNavigationBar} />
            </Stack>
          </Stack>
        </Modal>
        <Scene key="LoadingScreen" component={ LoadingScreen } hideNavBar />
        <Scene key="ImageSliderScreen" component={ ImageSliderScreen } hideNavBar />
        <Scene key="CropImageScreen" component={ CropImageScreen } hideNavBar panHandlers={null} />
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
    paddingHorizontal: 6,
    backgroundColor: '#FEFEFE',
    // borderBottomWidth: 0,
  },
  emptyBorderNavigationBar: {
    height: 54,
    paddingHorizontal: 6,
    backgroundColor: '#fff',
    borderBottomWidth: 0,
  },
  loadingContainer: {
    width: CONSTANTS.SCREEN_WIDTH,
    height: CONSTANTS.SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
});