import React from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Keyboard,
  AsyncStorage,
  Platform,
} from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { GoogleSignin, statusCodes } from 'react-native-google-signin'
import _ from 'lodash'

import LoadingScreen from '../LoadingScreen'
import TextInputComponent from '../../components/TextInputComponent'
import Analytics from '../../lib/firebase'
import { userSignIn, getUserSession, sendResetPasswordEmail, userGoogleSigin } from '../../redux/user/actions'
import COLORS from '../../service/colors'
import resolveError from '../../service/resolveError'
import * as COMMON_FUNC from '../../service/commonFunc'
import styles from './styles'

const LOGO = require('../../../assets/images/Login/icon_40pt.png')
const GOOGLE_ICON = require('../../../assets/images/Login/iconMediumGoogle.png')

class LoginScreen extends React.Component {
  static renderLeftButton(props) {
    return (
      <TouchableOpacity 
        style={styles.btnBack}
        activeOpacity={0.6}
        onPress={() => {
          if (props.prevPage === 'signup') {
            Actions.pop()
          } else if (props.prevPage === 'loggedOut') {
            Actions.TutorialScreen({ type: 'replace', prevPage: 'login' })
          } else {
            Actions.TutorialScreen({ prevPage: 'login' })
          }
        }}
      >
        <Ionicons name="ios-arrow-back" size={32} color={COLORS.PURPLE} />
      </TouchableOpacity>
    );
  }

  static renderTitle(props) {
    return (
      <Image source={LOGO} />
    );
  }

  constructor(props) {
    super(props)
    this.state = {
      password: '',
      userEmail: '',
      loading: false,
      isError: false,
      fieldErrors: [
        {
          code: '',
          field: '',
          message: ''
        }
      ]
    }
  }

  async UNSAFE_componentWillMount() {
    Analytics.setCurrentScreen('LoginScreen')

    const userBackInfo = await AsyncStorage.getItem('userBackInfo')
    if (userBackInfo) {
      const parseInfo = JSON.parse(userBackInfo)
      this.setState({ userEmail: parseInfo.email })
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { user } = nextProps
    const { userEmail } = this.state

    if (Actions.currentScene === 'LoginScreen') {
      if (this.props.user.loading === 'USER_SIGNIN_PENDING' && user.loading === 'USER_SIGNIN_FULFILLED') {
        this.props.getUserSession()
      }

      if (this.props.user.loading === 'USER_SIGNIN_PENDING' && user.loading === 'USER_SIGNIN_REJECTED') {
        this.setState({ loading: false }, () => {
          if (user.error) {
            if (user.error.code === 'error.login.disabled') {
              Alert.alert(
                'Oops',
                resolveError(user.error.code, user.error.message),
                [
                  {
                    text: 'Try Again Later',
                    style: 'cancel'
                  },
                  {
                    text: 'Reset Password',
                    onPress: () => this.onForgotPassword()
                  }
                ]
              )
            }
            else {
              Alert.alert(
                'Oops',
                resolveError(user.error.code, user.error.message),
                [
                  {
                    text: 'Try Again',
                    style: 'cancel'
                  },
                  {
                    text: 'Forgot Password',
                    onPress: () => this.onForgotPassword()
                  }
                ]
              )
            }
          }
        })
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
        this.setState({ loading: false  }, () => {
          if (user.userInfo.emailConfirmed) {
            Actions.HomeScreen()
          } else {
              Actions.SignUpConfirmScreen({ userEmail })
          }
        })
      }

      if (this.props.user.loading === 'GET_USER_SESSION_PENDING' && user.loading === 'GET_USER_SESSION_REJECTED') {
        this.setState({ loading: false }, () => {
            Actions.SignUpConfirmScreen({ userEmail })
        })
      }

      if (this.props.user.loading === 'SEND_RESET_PASSWORD_EMAIL_PENDING' && user.loading === 'SEND_RESET_PASSWORD_EMAIL_FULFILLED') {
        Actions.ResetPasswordConfirmScreen({ userEmail })
      }
    }
  }

  changeEmail = text => {
    if (text.length > 0) {
      const { fieldErrors } = this.state
      const restErrors = _.filter(fieldErrors, item => item.field !== 'email')
      this.setState({ fieldErrors: restErrors })
    }
    this.setState({ userEmail: text })
  }
  
  changePassword = text => {
    if (text.length > 0) {
      const { fieldErrors } = this.state
      const restErrors = _.filter(fieldErrors, item => item.field !== 'password')
      this.setState({ fieldErrors: restErrors })
    }
    this.setState({ password: text })
  }

  onForgotPassword = () => {
    const { userEmail } = this.state

    Analytics.logEvent('login_reset_password', {})

    if (userEmail.length === 0) {
      Alert.alert('Error', 'Email is required')
    } else if (!COMMON_FUNC.validateEmail(userEmail)) {
      Alert.alert('Error', 'Please enter a valid email address')
    } else {
      const param = {
        email: userEmail
      }
      this.props.sendResetPasswordEmail(param)
      Keyboard.dismiss()
    }
  }

  onSignIn = () => {
    Analytics.logEvent('login_login', {})

    const {
      fieldErrors,
      userEmail,
      password
    } = this.state

    let errors = []

    if (userEmail.length === 0) {
      errors = [
        ...errors,
        {
          code: 'com.signup.email.empty',
          field: 'email',
          message: 'Email is required'
        }
      ]
    } else {
      if (!COMMON_FUNC.validateEmail(userEmail)) {
        errors = [
          ...errors,
          {
            code: 'com.signup.email.invalid',
            field: 'email',
            message: 'Please enter a valid email address'
          }
        ]
      }
    }

    if (password.length === 0) {
      errors = [
        ...errors,
        {
          code: 'com.signup.password.empty',
          field: 'password',
          message: 'Password is required'
        }
      ]
    }

    this.setState({ fieldErrors: errors })

    if (errors.length === 0) {
      const param = {
        username: userEmail,
        password
      }
      this.setState({ loading: true })
      this.props.userSignIn(param)
      Keyboard.dismiss()
    }
  }

  onNextEmail = () => {
    this.passwordRef.textRef.focus()
  }

  onSignUp = () => {
    Actions.SignUpScreen()
  }

  onGoogleSignIn = async () => {
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

  render () {
    const {
      fieldErrors,
      loading
    } = this.state

    const emailError = (_.filter(fieldErrors, item => item.field === 'email'))
    const passwordError = (_.filter(fieldErrors, item => item.field === 'password'))

    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.innerContainer}>
            <TextInputComponent
              ref={ref => this.emailRef = ref}
              placeholder="Email"
              value={this.state.userEmail}
              isError={emailError.length > 0 ? true : false}
              errorText={emailError.length > 0 ? resolveError(emailError[0].code, emailError[0].message) : ''}
              handleChange={text => this.changeEmail(text)}
              returnKeyType="next"
              keyboardType="email-address"
              textContentType='emailAddress'
              onSubmitEditing={() => this.onNextEmail()}
            />

            <TextInputComponent
              ref={ref => this.passwordRef = ref}
              placeholder="Password"
              value={this.state.password}
              isSecure={true}
              isError={passwordError.length > 0 ? true : false}
              errorText={passwordError.length > 0 ? resolveError(passwordError[0].code, passwordError[0].message) : ''}
              handleChange={text => this.changePassword(text)}
              onSubmitEditing={() => this.onSignIn()}
              selectionColor={Platform.OS === 'ios' ? COLORS.PURPLE : COLORS.LIGHT_PURPLE}
            >
              <TouchableOpacity onPress={() => this.onForgotPassword()} activeOpacity={0.8}>
                <View style={styles.forgotView}>
                  <Text style={styles.forgotText}>Forgot?</Text>
                </View>
              </TouchableOpacity>
            </TextInputComponent>

            <TouchableOpacity onPress={() => this.onSignIn()}>
              <View style={styles.buttonView}>
                <Text style={styles.buttonText}>Sign in</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.onGoogleSignIn()} activeOpacity={0.8}>
              <View style={styles.googleButtonView}>
                <Image source={GOOGLE_ICON} />
                <Text style={styles.googelButtonText}>Sign in with Google</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.signupButtonView}>
              <Text style={[styles.btnSend, { color: COLORS.MEDIUM_GREY }]}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => this.onSignUp()}>
                <Text onPress={() => this.onSignUp()} suppressHighlightin={true} style={[styles.btnSend, { color: COLORS.PURPLE }]}>Sign up.</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>

        {(this.props.user.loading === 'SEND_RESET_PASSWORD_EMAIL_PENDING' || loading) && (
          <LoadingScreen />
        )}
      </View>
    )
  }
}

LoginScreen.defaultProps = {
  prevPage: 'login'
}

LoginScreen.propTypes = {
  prevPage: PropTypes.string
}

const mapStateToProps = ({ user }) => ({
  user
})

const mapDispatchToProps = dispatch => ({
  userSignIn: (data) => dispatch(userSignIn(data)),
  getUserSession: () => dispatch(getUserSession()),
  sendResetPasswordEmail: (data) => dispatch(sendResetPasswordEmail(data)),
  userGoogleSigin: (token) => dispatch(userGoogleSigin(token)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen)
