import React from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  BackHandler,
  Alert,
} from 'react-native'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import PropTypes from 'prop-types'
import Swiper from 'react-native-swiper'
import LottieView from 'lottie-react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { GoogleSignin, statusCodes } from 'react-native-google-signin'

import LoadingScreen from '../LoadingScreen'
import COLORS from '../../service/colors'
import { GOOGLE_WEB_CLIENT_ID } from '../../service/api'
import styles from './styles'
import Analytics from '../../lib/firebase'
import resolveError from '../../service/resolveError'

import { userGoogleSigin, getUserSession } from '../../redux/user/actions'

const LOGO = require('../../../assets/images/Login/logoMelloIcon-Tutorial.png')
const LOGO_TEXT = require('../../../assets/images/Login/logoMello-Tutorial.png')
const TEMP_IMG = require('../../../assets/images/Login/tutorialTempImg.png')
const GOOGLE_ICON = require('../../../assets/images/Login/iconMediumGoogle.png')
const MAIL_ICON = require('../../../assets/images/Login/iconMediumEmailGrey.png')

import LOTTIE_COLLECT from '../../../assets/lottie/showcase-collect.json'
import LOTTIE_REVIEW from '../../../assets/lottie/showcase-review.json'
import LOTTIE_SHARE from '../../../assets/lottie/showcase-share.json'

class TutorialScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      position: 0,
      loading: false
    }
  }

  componentDidMount() {
    Analytics.setCurrentScreen('TutorialScreen')

    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      offlineAccess: false
    })

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    
    const {position} = this.state;
    if (position > 0)
    {
      this.swiperRef.scrollBy(-1, true)
    }
    return true;
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
      this.setState({ loading: false }, () => {
        if (user.userInfo.tandcAccepted) {
          Actions.HomeScreen()
        } else {
          Actions.TermsAndConditionsConfirmScreen()
        }
      })
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
        <View style={styles.titleView}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
        <View style={styles.subContainer}>
          <View style={styles.lottieView}>
            {index === 1 && (
              <LottieView
                ref={animation => this.lottieFirst = animation}
                source={lottieUrl}
                loop
                style={{ }}
              />
            )}
            {index === 2 && (
              <LottieView
                ref={animation => this.lottieSecond = animation}
                source={lottieUrl}
                loop
                style={{ }}
              />
            )}
            {index === 3 && (
              <LottieView
                ref={animation => this.lottieThird = animation}
                source={lottieUrl}
                loop
                style={{ }}
              />
            )}          
          </View>
        </View>
      </View>
    )
  }

  renderImageView(title, imageUrl) {
    return (
      <View style={styles.swipeContainer}>
        <View style={styles.titleView}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
        <View style={styles.subContainer}>
          <View style={styles.imageView}>
            <Image style={styles.navLogo} source={imageUrl} />
          </View>
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
    this.lottieFirst.reset()
    this.lottieSecond.reset()
    this.lottieThird.reset()

    if (context.state.index === 1) {
      this.lottieFirst.play()
    } else if (context.state.index === 2) {
      this.lottieSecond.play()
    } else if (context.state.index === 3) {
      this.lottieThird.play()
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
            {this.renderLottieView('... or just straight out of you brain.', LOTTIE_SHARE, 3)}
            {this.renderImageView('... from instagram, Photos, Dropbox, YouTube, Pinterest, Slack... You get the idea.', TEMP_IMG)}
            {this.renderImageView('Collaborate with your teammates and close friends.', TEMP_IMG)}
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
