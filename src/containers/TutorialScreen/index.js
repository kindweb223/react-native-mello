import React from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import PropTypes from 'prop-types'
import Swiper from 'react-native-swiper'
import LottieView from 'lottie-react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { GoogleSignin, statusCodes } from 'react-native-google-signin'
import Video from 'react-native-video'

import LoadingScreen from '../LoadingScreen'
import COLORS from '../../service/colors'
import { GOOGLE_WEB_CLIENT_ID } from '../../service/api'
import styles from './styles'
import Analytics from '../../lib/firebase'
import resolveError from '../../service/resolveError'

import { userGoogleSigin, getUserSession } from '../../redux/user/actions'

const LOGO = require('../../../assets/images/Login/logoMelloIcon-Tutorial.png')
const LOGO_TEXT = require('../../../assets/images/Login/logoMello-Tutorial.png')
const GOOGLE_ICON = require('../../../assets/images/Login/iconMediumGoogle.png')
const MAIL_ICON = require('../../../assets/images/Login/iconMediumEmailGrey.png')

import LOTTIE_COLLECT from '../../../assets/lottie/1-Orbit.json'
import LOTTIE_REVIEW from '../../../assets/lottie/2-Phone.json'
import LOTTIE_SHARE from '../../../assets/lottie/3-Head.json'
import LOTTIE_SERVICE from '../../../assets/lottie/4-Srevices.json'
import LOTTIE_PEOPLE from '../../../assets/lottie/5-People.json'

import VIDEO_COLLECT from '../../../assets/videos/Orbit.m4v'
import VIDEO_REVIEW from '../../../assets/videos/Phone.m4v'
import VIDEO_SHARE from '../../../assets/videos/Head.m4v'
import VIDEO_SERVICE from '../../../assets/videos/Services.m4v'
import VIDEO_PEOPLE from '../../../assets/videos/People.m4v'


class TutorialScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      position: 0,
      loading: false,
      video1Paused: true,
      video2Paused: true,
      video3Paused: true,
      video4Paused: true,
      video5Paused: true,
    }
  }

  componentDidMount() {
    Analytics.setCurrentScreen('TutorialScreen')

    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      offlineAccess: false
    })
  }

  componentWillReceiveProps(nextProps) {
    const { user } = nextProps

    if (nextProps.prevPage === 'login') {
      this.onSkip(false)
    }

    if (this.props.user.loading === 'USER_GOOGLE_SIGNIN_PENDING' && user.loading === 'USER_GOOGLE_SIGNIN_FULFILLED') {
      this.props.getUserSession()
    }

    if (this.props.user.loading === 'USER_GOOGLE_SIGNIN_PENDING' && user.loading === 'USER_GOOGLE_SIGNIN_REJECTED') {
      this.setState({ loading: false }, () => {
        if (user.error) {
          Alert.alert(
            'Warning',
            resolveError(user.error.code, user.error.message)
          )
        }
      })
    }

    if (this.props.user.loading === 'GET_USER_SESSION_PENDING' && user.loading === 'GET_USER_SESSION_FULFILLED') {
      if (Actions.currentScene === 'TutorialScreen') {
        this.setState({ loading: false }, () => {
          if (user.userInfo.tandcAccepted) {
            Actions.HomeScreen()
          } else {
            Actions.TermsAndConditionsConfirmScreen()
          }
        })
      }
    }

    if (this.props.user.loading === 'GET_USER_SESSION_PENDING' && user.loading === 'GET_USER_SESSION_REJECTED') {
      this.setState({ loading: false })
    }
  }

  onLogin = () => {
    Actions.LoginScreen()
  }

  onSignUp = () => {
    Actions.SignUpScreen()
  }

  onGoogleSignUp = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      // google services are available

      try {
        this.setState({ loading: true })
        const userInfo = await GoogleSignin.signIn()
        this.props.userGoogleSigin(userInfo.idToken)
      } catch(error) {
        this.setState({ loading: false })
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          // user cancelled the login flow
        } 
        else if (error.code === statusCodes.IN_PROGRESS) {
          // operation (f.e. sign in) is in progress already
          Alert.alert('Error', 'Sign in is in progress already')
        } 
        else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          // play services not available or outdated
          Alert.alert('Error', 'You must enable Play Services to Sign in with Google')
        } 
        else {
          // some other error happened
          Alert.alert('Error', 'Sign in with Google failed')
        }
      }
    } catch (err) {
      Alert.alert('Error', 'You must enable Play Services to Sign in with Google')
    }
  }

  renderLogoView() {
    return (
      <View style={styles.logoViewContainer}>
        <View style={styles.logoView}>
          <Image style={styles.logo} source={LOGO_TEXT} />
        </View>
        <Text style={styles.subText}>A place to put things that matter to you.</Text>
      </View>
    )
  }

  renderLottieView(title, lottieUrl, index) {
    return (
      <View style={styles.swipeContainer}>
        <View style={styles.lottieContainer}>
          <View style={styles.lottieView}>
            {index === 1 && (
              <Video 
                ref={(ref) => { this.player1 = ref }}
                source={VIDEO_COLLECT}
                allowsExternalPlayback={false}
                paused={this.state.video1Paused}
                style={styles.backgroundVideo}
                resizeMode="contain" 
                repeat={true} />            
            )}
            {index === 2 && (
              <Video  
                ref={(ref) => { this.player2 = ref }}
                source={VIDEO_REVIEW}
                allowsExternalPlayback={false}
                paused={this.state.video2Paused}
                style={styles.backgroundVideo}
                resizeMode="contain" 
                repeat={true} />
            )}
            {index === 3 && (
              <Video 
                ref={(ref) => { this.player3 = ref }}
                source={VIDEO_SHARE}
                allowsExternalPlayback={false}
                paused={this.state.video3Paused}
                style={styles.backgroundVideo}
                resizeMode="contain" 
                repeat={true} />
            )}
            {index === 4 && (
              <Video 
                ref={(ref) => { this.player4 = ref }}
                source={VIDEO_SERVICE}
                allowsExternalPlayback={false}
                paused={this.state.video4Paused}
                style={styles.backgroundVideo}
                resizeMode="contain" 
                repeat={true} />
            )}
            {index === 5 && (
              <Video 
                ref={(ref) => { this.player5 = ref }}
                source={VIDEO_PEOPLE}
                allowsExternalPlayback={false}
                paused={this.state.video5Paused}
                style={styles.backgroundVideo}
                resizeMode="contain" 
                repeat={true} />
            )}     
          </View>
        </View>
        <View style={styles.titleView}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
      </View>
    )
  }

  renderSignupView() {
    return (
      <View style={styles.signupViewContainer}>
        <View style={styles.signupFormView}>
          <View style={styles.signupTextView}>
            <Text style={styles.subText}>Sign up</Text>
          </View>
          <TouchableOpacity onPress={() => this.onGoogleSignUp()} activeOpacity={0.8}>
            <View style={styles.buttonView}>
              <Image source={GOOGLE_ICON} />
              <Text style={styles.buttonText}>Sign up with Google</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.onSignUp()} activeOpacity={0.8}>
            <View style={styles.buttonView}>
              <Image source={MAIL_ICON} />
              <Text style={styles.buttonText}>Sign up with e-mail</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.signinView}>
            <Text
              onPress={() => this.onLogin()}
              suppressHighlighting={true}
              style={styles.signinText}
            >
              Already have an account? <Text style={{ color: COLORS.PURPLE }}> Sign in.</Text>
            </Text>
          </View>
        </View>
      </View>
    )
  }

  onMomentumScrollEnd = (e, state, context) => {
    // this.lottieFirst.reset()
    // this.lottieSecond.reset()
    // this.lottieThird.reset()
    // this.lottieFourth.reset()
    // this.lottieFifth.reset()

    // Pause all videos
    this.setState({
      video1Paused: true, 
      video2Paused: true, 
      video3Paused: true, 
      video4Paused: true, 
      video5Paused: true
    })

    if (context.state.index === 1) {
      this.setState({video1Paused: false})
      this.player1.seek(0)
      // this.lottieFirst.play()
    } else if (context.state.index === 2) {
      this.setState({video2Paused: false})
      this.player2.seek(0)
      // this.lottieSecond.play()
    } else if (context.state.index === 3) {
      this.setState({video3Paused: false})
      this.player3.seek(0)
      // this.lottieThird.play()
    } else if (context.state.index === 4) {
      this.setState({video4Paused: false})
      this.player4.seek(0)
      // this.lottieFourth.play()
    } else if (context.state.index === 5) {
      this.setState({video5Paused: false})
      this.player5.seek(0)
      // this.lottieFifth.play()
    }

    this.setState({ position: context.state.index })
  }

  onSkip(animated) {
    this.swiperRef.scrollBy(6 - this.state.position, animated)
  }

  render () {
    const { position } = this.state

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeView}>
          <View style={styles.navbarView}>
            {position > 0 && (
              <Image source={LOGO} />
            )}
          </View>

          <Swiper
            ref={c => this.swiperRef = c}
            loop={false}
            index={position}
            paginationStyle={{ bottom: ifIphoneX(5, 30) }}
            dotStyle={styles.dotStyle}
            activeDotStyle={styles.dotStyle}
            activeDotColor={COLORS.DARK_GREY}
            dotColor="#fff"
            onMomentumScrollEnd={this.onMomentumScrollEnd}
          >
            {this.renderLogoView()}
            {this.renderLottieView('Save important content from the web.', LOTTIE_COLLECT, 1)}
            {this.renderLottieView('... or from your camera.', LOTTIE_REVIEW, 2)}
            {this.renderLottieView('... or just straight out of your brain.', LOTTIE_SHARE, 3)}
            {this.renderLottieView('... from instagram, Photos, Dropbox, YouTube, Pinterest, Slack... You get the idea.', LOTTIE_SERVICE, 4)}
            {this.renderLottieView('Collaborate with your teammates and close friends.', LOTTIE_PEOPLE, 5)}
            {this.renderSignupView()}
          </Swiper>

          {(position !== 0 && position !== 6) && (
            <View style={styles.skipButtonView}>
              <TouchableOpacity onPress={() => this.onSkip(true)} activeOpacity={0.8}>
                <View style={styles.skipButton}>
                  <Text style={styles.skipButtonText}>Skip</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>

        {this.state.loading && (
          <LoadingScreen />
        )}
      </View>
    )
  }
}

TutorialScreen.defaultProps = {
  prevPage: 'start',
  googleLogin: () => {}
}

TutorialScreen.propTypes = {
  userGoogleSigin: PropTypes.func,
  prevPage: PropTypes.string
}

const mapStateToProps = ({ user }) => ({
  user
})

const mapDispatchToProps = dispatch => ({
  userGoogleSigin: (token) => dispatch(userGoogleSigin(token)),
  getUserSession: () => dispatch(getUserSession()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TutorialScreen)
