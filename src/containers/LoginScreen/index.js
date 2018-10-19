import React from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Keyboard,
  AsyncStorage
} from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import _ from 'lodash'
import LoadingScreen from '../LoadingScreen'
import TextInputComponent from '../../components/TextInputComponent'
import { userSignIn, getUserSession, sendResetPasswordEmail } from '../../redux/user/actions'
import COLORS from '../../service/colors'
import resolveError from '../../service/resolveError'
import * as COMMON_FUNC from '../../service/commonFunc'
import styles from './styles'

const LOGO = require('../../../assets/images/Login/icon_40pt.png')

class LoginScreen extends React.Component {
  static renderLeftButton(props) {
    return (
      <TouchableOpacity 
        style={styles.btnBack}
        activeOpacity={0.6}
        onPress={() => Actions.pop()}
      >
        <Ionicons name="ios-arrow-back" size={30} color={COLORS.PURPLE} />
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
          Alert.alert(
            'Warning',
            user.error
          )
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
        this.setState({ loading: false }, () => {
          if (!user.userInfo) {
            Actions.ResetPasswordConfirmScreen({ userEmail })
          }
        })
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

    if (userEmail.length === 0) {
      Alert.alert('Error', 'Email is required')
    } else if (!COMMON_FUNC.validateEmail(userEmail)) {
      Alert.alert('Error', 'Email is invalid')
    } else {
      this.setState({ loading: true })
      const param = {
        email: userEmail
      }
      this.props.sendResetPasswordEmail(param)
      Keyboard.dismiss()
    }
  }

  onSignIn = () => {
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
            message: 'Email is invalid'
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

  render () {
    const {
      fieldErrors
    } = this.state

    const emailError = (_.filter(fieldErrors, item => item.field === 'email'))
    const passwordError = (_.filter(fieldErrors, item => item.field === 'password'))

    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.innerContainer}>
            <TextInputComponent
              ref={ref => this.emailRef = ref}
              placeholder="E-mail"
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
              selectionColor={COLORS.PURPLE}
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

            <View style={styles.signupButtonView}>
              <Text style={[styles.btnSend, { color: COLORS.MEDIUM_GREY }]}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => this.onSignUp()}>
                <Text style={[styles.btnSend, { color: COLORS.PURPLE }]}>Sign up.</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>

        {this.state.loading && (
          <LoadingScreen />
        )}
      </View>
    )
  }
}

const mapStateToProps = ({ user }) => ({
  user
})

const mapDispatchToProps = dispatch => ({
  userSignIn: (data) => dispatch(userSignIn(data)),
  getUserSession: () => dispatch(getUserSession()),
  sendResetPasswordEmail: (data) => dispatch(sendResetPasswordEmail(data)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen)
