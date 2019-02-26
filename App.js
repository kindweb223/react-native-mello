import React from 'react'
import {
  StyleSheet,
  AsyncStorage,
  View,
  Image,
  YellowBox,
  Linking,
  Platform
} from 'react-native'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import _ from 'lodash'
import promiseMiddleware from './src/service/promiseMiddleware'
import { Actions, Scene, Router, Modal, Lightbox, Stack, Tabs } from 'react-native-router-flux'
import SharedGroupPreferences from 'react-native-shared-group-preferences'
import { Client, Configuration  } from 'bugsnag-react-native'
import SplashScreen from 'react-native-splash-screen'
import axios from 'axios'
import CONSTANTS from './src/service/constants'
import { BASE_URL, BUGSNAG_KEY, APP_LOCALE, APP_NAME, APP_STORE_ID, PLAY_STORE_ID } from './src/service/api'
import pubnub from './src/lib/pubnub'

const config = new Configuration(BUGSNAG_KEY);
config.appVersion = require('./package.json').version;
const bugsnag = new Client(config);

axios.defaults.baseURL = BASE_URL
axios.defaults.headers.get['Content-Type'] = 'application/json'
axios.defaults.headers.get.Accept = 'application/json'
axios.defaults.withCredentials = true
axios.defaults.headers['x-mobile-api'] = true
axios.defaults.timeout = 30000

axios.interceptors.response.use(
  response => (
    response
  ),
  (error) => {
    if (error.response && (
      (error.response.status === 401 && error.response.data.code === 'session.expired') ||
      (error.response.status === 403 && error.response.data.code === 'error.user.not.authenticated')
    )) {
      AsyncStorage.removeItem('xAuthToken')
      SharedGroupPreferences.setItem('xAuthToken', null, CONSTANTS.APP_GROUP_TOKEN_IDENTIFIER)

      if (Actions.currentScene !== 'TutorialScreen') {
        Actions.LoginScreen({ type: 'replace' })
      }
      return
    }
    throw error
  }
)

import reducers from './src/redux/reducers'
import TutorialScreen from './src/containers/TutorialScreen'
import LoginScreen from './src/containers/LoginScreen'
import SignUpScreen from './src/containers/SignUpScreen'
import SignUpConfirmScreen from './src/containers/SignUpConfirmScreen'
import TermsAndConditionsScreen from './src/containers/TermsAndConditionsScreen'
import HomeScreen from './src/containers/HomeScreen'
import LoadingScreen from './src/containers/LoadingScreen'
import ImageSliderScreen from './src/containers/ImageSliderScreen'
import FeedDetailScreen from './src/containers/FeedDetailScreen'
import DocumentSliderScreen from './src/containers/DocumentSliderScreen'
import LikesListScreen from './src/containers/LikesListScreen'
import CommentScreen from './src/containers/CommentScreen'
import ProfileScreen from './src/containers/ProfileScreen'
import ProfileSupportScreen from './src/containers/ProfileSupportScreen'
import ProfileUpdateScreen from './src/containers/ProfileUpdateScreen'
import SignUpSuccessScreen from './src/containers/SignUpSuccessScreen'
import ResetPasswordConfirmScreen from './src/containers/ResetPasswordConfirmScreen'
import ResetPasswordScreen from './src/containers/ResetPasswordScreen'
import ResetPasswordSuccessScreen from './src/containers/ResetPasswordSuccessScreen'
import CropImageScreen from './src/containers/CropImageScreen'
import FeedFilterScreen from './src/containers/FeedFilterScreen'
import ArchivedFeedScreen from './src/containers/ArchivedFeedScreen'
import PrivacyPolicyScreen from './src/containers/PrivacyPolicyScreen'
import NotificationScreen from './src/containers/NotificationScreen'
import TabbarContainer from './src/navigations/TabbarContainer'
import TermsAndConditionsConfirmScreen from './src/containers/TermsAndConditionsConfirmScreen'
import ProfilePremiumScreen from './src/containers/ProfilePremiumScreen'

import ShareCardScreen from './src/share/ShareCardScreen'
import ShareModalScreen from './src/share/ShareModalScreen'
import ChooseLinkImageFromExtension from './src/share/ChooseLinkImageFromExtension'
import ShareSuccessScreen from './src/share/ShareSuccessScreen'

import { 
  getCardComments,
  getCard
} from './src/redux/card/actions'
import {
  pubnubDeleteFeed,
  pubnubGetFeedDetail,
  pubnubLikeCard,
  pubnubUnLikeCard,
  getInvitedFeedList,
  pubnubDeleteInvitee,
  pubnubDeleteOtherInvitee,
  pubnubMoveIdea,
  getFeedoList
} from './src/redux/feedo/actions'

const SPLASH_LOGO = require('./assets/images/Splash/splashLogo.png')

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
    SplashScreen.hide()

    pubnub.addListener({
      status: function(statusEvent) {
          if (statusEvent.category === "PNConnectedCategory") {
          }
      },
      message: function(response) {
        console.log('PUBNUB_RESPONSE: ', response.message)
        if (response.message.action === 'COMMENT_ADDED' || response.message.action === 'COMMENT_EDITED' || response.message.action === 'COMMENT_DELETED') {
          console.log("refreshing comments")
          store.dispatch(getCardComments(response.message.data.ideaId))
        }
        if (response.message.action === 'HUNT_UPDATED' ||
            response.message.action === 'IDEA_ADDED' ||
            response.message.action === 'IDEA_DELETED' ||
            response.message.action === 'USER_ACCESS_CHANGED'
        ) {
          store.dispatch(pubnubGetFeedDetail(response.message.data.huntId))
        }
        if (response.message.action === 'IDEA_MOVED') {
          store.dispatch(pubnubMoveIdea(response.message.data.huntId, response.message.data.ideaId))
        }
        if (response.message.action === 'HUNT_DELETED') {
          store.dispatch(pubnubDeleteFeed(response.message.data.huntId))
        }
        if (response.message.action === 'IDEA_UPDATED') {
          store.dispatch(getCard(response.message.data.ideaId))
        }
        if (response.message.action === 'IDEA_LIKED') {
          store.dispatch(pubnubLikeCard(response.message.data.ideaId))
        }
        if (response.message.action === 'IDEA_UNLIKED') {
          store.dispatch(pubnubUnLikeCard(response.message.data.ideaId))
        }
        if (response.message.action === 'USER_INVITED_TO_HUNT') {
          store.dispatch(getInvitedFeedList())
          store.dispatch(pubnubGetFeedDetail(response.message.data.huntId))
        }
        if (response.message.action === 'USER_JOINED_HUNT') {
          store.dispatch(pubnubGetFeedDetail(response.message.data.huntId))
        }
        if (response.message.action === 'HUNT_INVITEE_REMOVED') {
          const state = store.getState()

          if (state.user.userInfo.id === response.message.data.userProfileId) {
            store.dispatch(pubnubDeleteFeed(response.message.data.huntId))
          } else {
            store.dispatch(pubnubDeleteOtherInvitee(response.message.data.huntId, response.message.data.huntInviteeId))
          }
        }
        if (response.message.action === 'HUNT_INVITEE_REMOVED_SELF') {
          store.dispatch(pubnubDeleteInvitee(response.message.data.huntId, response.message.data.huntInviteeId))
        }
      },
      presence: function(presenceEvent) {

      }
    })

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
      this.setState({ userInfo: JSON.parse(userInfo) })
      console.log('Has xAuthToken: ', xAuthToken !== null)

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
    YellowBox.ignoreWarnings(['Setting a timer']);
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL)
  }

  resetStackToProperRoute = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        const url_ = url.replace('//', '/')
        let params = _.split(decodeURIComponent(url_), '/')
        const path = params[params.length - 2]
        console.log('UNIVERSAL_LINK: ', decodeURIComponent(url_), ' Path: ', path)

        if (path) {  
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
              Actions.replace('SignUpConfirmScreen', { token, deepLinking: true })
            }
          }
        }

        if (path === 'reset') { // Reset password
          const token = params[params.length - 1]
          Actions.ResetPasswordScreen({ token })
        }

        if (path === 'flow') { // Share an Idea
            const feedId = params[params.length - 1]
            const data = {
              id: feedId
            }

            try {
              const userInfo = AsyncStorage.getItem('userInfo')
              store.dispatch(getFeedoList())

              if (userInfo) {
                if (Actions.currentScene === 'FeedDetailScreen') {                  
                  Actions.FeedDetailScreen({ type: 'replace', data, isDeepLink: true });
                } 
                else {
                  Actions.FeedDetailScreen({ data, isDeepLink: true })
                }
              } 
              else {
                Actions.LoginScreen()
              }
            } 
            catch (e) {
            }
        }
        
        var searchIndex = -1;
        for (i = 3; i < params.length; i ++)
        {
          if (params[i] === 'share') {
            searchIndex = i
            break;
          }
        }
        if (Platform.OS === 'android' && i !== -1) { //share extension for Android
          var type = '';
          if (params[searchIndex + 1] === 'image' && params[searchIndex + 2] === 'jpeg') {
            type = 'images'
            searchIndex ++;
          } else if (params[searchIndex + 1] === 'url') {
            type = 'url'
          } else {
            console.log('error: wrong share link')
          }

          var value = ''
          for (i = searchIndex+2; i < params.length; i ++)
          {
            if (params[i] !== '')
              value += `${params[i]}/`
          }
          console.log('path: ', type, value)
          Actions.ChooseLinkImageFromExtension({mode: type, value: value});
        }

      } else {
        if (Platform.OS === 'ios') {
          Linking.openURL(`https://itunes.apple.com/${APP_LOCALE}/app/${APP_NAME}/id${APP_STORE_ID}`)
        } else {
          // Linking.openURL(`https://play.google.com/store/apps/details?id=${PLAY_STORE_ID}`)
        }
      }
    })
  }

  handleOpenURL({ url }) {
    this.resetStackToProperRoute(url)
  }

  render() {
    const isAndroid = Platform.OS === 'android'
    const scenes = Actions.create(
      <Lightbox>
        <Modal hideNavBar>
          <Tabs key="tabs" tabBarComponent={TabbarContainer}>
            <Scene key="root">
              <Scene key="TutorialScreen" component={ TutorialScreen } hideNavBar panHandlers={null} />
              <Scene key="TermsAndConditionsConfirmScreen" component={ TermsAndConditionsConfirmScreen } hideNavBar panHandlers={null} />
              <Scene key="LoginScreen" component={ LoginScreen } navigationBarStyle={styles.emptyBorderNavigationBar} />
              <Scene key="SignUpScreen" component={ SignUpScreen } navigationBarStyle={styles.emptyBorderNavigationBar} />
              <Scene key="SignUpConfirmScreen" component={ SignUpConfirmScreen } panHandlers={null} navigationBarStyle={styles.emptyBorderNavigationBar} />
              <Scene key="TermsAndConditionsScreen" component={ TermsAndConditionsScreen } navigationBarStyle={styles.emptyBorderNavigationBar} />
              <Scene key="HomeScreen" component={ HomeScreen } hideNavBar panHandlers={null} />
              <Scene key="FeedDetailScreen" component={ FeedDetailScreen } clone hideNavBar panHandlers={null} />
              <Scene key="DocumentSliderScreen" component={ DocumentSliderScreen } hideNavBar />
              <Scene key="LikesListScreen" component={ LikesListScreen } navigationBarStyle={styles.defaultNavigationBar} />
              <Scene key="CommentScreen" component={ CommentScreen } navigationBarStyle={styles.defaultNavigationBar} />
              <Scene key="SignUpSuccessScreen" component={ SignUpSuccessScreen } hideNavBar panHandlers={null} />
              <Scene key="ResetPasswordConfirmScreen" component={ ResetPasswordConfirmScreen } navigationBarStyle={styles.emptyBorderNavigationBar} />
              <Scene key="ResetPasswordScreen" component={ ResetPasswordScreen } panHandlers={null} navigationBarStyle={styles.emptyBorderNavigationBar} />
              <Scene key="ResetPasswordSuccessScreen" component={ ResetPasswordSuccessScreen } hideNavBar panHandlers={null} />
              <Scene key="FeedFilterScreen" component={ FeedFilterScreen } hideNavBar />
              <Scene key="PremiumScreen" component={ ProfilePremiumScreen } navigationBarStyle={styles.defaultNavigationBar} />
              <Scene key={isAndroid ? "ChooseLinkImageFromExtension" : "none1"} component={ChooseLinkImageFromExtension} hideNavBar panHandlers={null}/>
              <Scene key={isAndroid ? "ShareCardScreen" : "none2"} component={ShareCardScreen} hideNavBar panHandlers={null} />
              <Scene key={isAndroid ? "ShareSuccessScreen" : "none3"} component={ShareSuccessScreen}  hideNavBar panHandlers={null} />
              <Scene key={isAndroid ? "ShareModalScreen" : "none4"} component={ShareModalScreen} okLabel='Sign In' hideNavBar panHandlers={null} />
              
            </Scene>
          </Tabs>
          <Stack key="ProfileScreen" hideNavBar>
            <Stack key="ProfileScreen">
              <Scene key="ProfileScreen" component={ ProfileScreen } hideNavBar />
              <Scene key="ProfileSupportScreen" component={ ProfileSupportScreen } navigationBarStyle={styles.defaultNavigationBar} />
              <Scene key="ProfileUpdateScreen" component={ ProfileUpdateScreen } navigationBarStyle={styles.defaultNavigationBar} />
              <Scene key="ProfileResetPasswordConfirmScreen" component={ ResetPasswordConfirmScreen } navigationBarStyle={styles.defaultNavigationBar} />
              <Scene key="ProfileTermsAndConditionsScreen" component={ TermsAndConditionsScreen } navigationBarStyle={styles.emptyBorderNavigationBar} />
              <Scene key="ProfilePrivacyPolicyScreen" component={ PrivacyPolicyScreen } navigationBarStyle={styles.emptyBorderNavigationBar} />
              <Scene key="ArchivedFeedScreen" component={ ArchivedFeedScreen } navigationBarStyle={styles.defaultNavigationBar} />
              <Scene key="ProfilePremiumScreen" component={ ProfilePremiumScreen } navigationBarStyle={styles.defaultNavigationBar} />
            </Stack>
          </Stack>
          <Stack key="NotificationScreen" hideNavBar>
            <Stack key="NotificationScreen">
              <Scene key="NotificationScreen" component={ NotificationScreen } hideNavBar />
              <Scene key="ActivityCommentScreen" component={ CommentScreen } navigationBarStyle={styles.defaultNavigationBar} />
              <Scene key="ActivityLikesListScreen" component={ LikesListScreen } navigationBarStyle={styles.defaultNavigationBar} />
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
          {/* <ActivityIndicator 
            animating
            size="large"
            color={COLORS.PURPLE}
          /> */}
          <Image
            source={SPLASH_LOGO}
            style={styles.splashLogo}
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
    backgroundColor: '#FEFEFE'
  },
  emptyBorderNavigationBar: {
    height: 54,
    paddingHorizontal: 6,
    backgroundColor: '#fff',
    borderBottomWidth: 0
  },
  loadingContainer: {
    width: CONSTANTS.SCREEN_WIDTH,
    height: CONSTANTS.SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F6FF'
  },
  splashLogo: {
    width: 150,
    height: 150
  }
});