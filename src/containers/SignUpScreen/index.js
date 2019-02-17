import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Keyboard
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import * as Progress from 'react-native-progress'
import CheckBox from '../../components/CheckBoxComponent'
import zxcvbn from 'zxcvbn'
import _ from 'lodash'
import Analytics from '../../lib/firebase'
import LoadingScreen from '../LoadingScreen'
import TextInputComponent from '../../components/TextInputComponent'
import { userSignUp, validateInvite, completeInvite, getUserSession } from '../../redux/user/actions'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
import resolveError from '../../service/resolveError'
import * as COMMON_FUNC from '../../service/commonFunc'
import styles from './styles'

const LOGO = require('../../../assets/images/Login/icon_40pt.png')

const PASSWORD_PROGRESS = [
  { color: COLORS.RED, text: 'Weak' },
  { color: COLORS.MEDIUM_RED, text: 'Medium' },
  { color: COLORS.YELLOW, text: 'Strong' },
  { color: COLORS.PURPLE, text: 'Very Strong' }
]

class SignUpScreen extends React.Component {
  static renderLeftButton(props) {
    return (
      <TouchableOpacity 
        style={styles.btnBack}
        activeOpacity={0.6}
        onPress={() => Actions.pop()}
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
      fullName: '',
      userEmail: props.userEmail,
      loading: false,
      isError: false,
      isSecure: true,
      errorMsg: '',
      passwordScore: 0,
      isPasswordFocus: false,
      isTNC: false,
      showTncError: false,
      avatarFile: {},
      fieldErrors: [
        {
          code: '',
          field: '',
          message: ''
        }
      ],
      isInvite: props.isInvite,
      isSignup: false
    }
  }

  componentWillMount() {
    const { token } = this.props
    const { isInvite } = this.state

    Analytics.setCurrentScreen('SignUpScreen')

    // For invited user
    if (isInvite) {
      const param = {
        validationToken: token,
        email: this.state.userEmail
      }
      this.setState({ loading: true })
      this.props.validateInvite(param)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (Actions.currentScene === 'SignUpScreen') {
      if (prevProps.user.loading === 'USER_SIGNUP_PENDING' && this.props.user.loading === 'USER_SIGNUP_FULFILLED') {
        this.setState({ loading: false }, () => {
          Actions.SignUpConfirmScreen({ userEmail: this.state.userEmail })
        })
      }

      if (prevProps.user.loading === 'USER_SIGNUP_PENDING' && this.props.user.loading === 'USER_SIGNUP_REJECTED') {
        const { error } = this.props.user
        this.setState({ loading: false }, () => {
          Alert.alert(
            'Oops',
            resolveError(error.code, error.message),
            [
              {
                text: 'OK',
                style: 'cancel'
              },
              {
                text: 'Login',
                onPress: () => Actions.LoginScreen()
              }
            ]
          )
        })
      }

      if (prevProps.user.loading === 'VALIDATE_INVITE_PENDING' && this.props.user.loading === 'VALIDATE_INVITE_FULFILLED') {
        this.setState({ loading: false })
      }

      if (prevProps.user.loading === 'VALIDATE_INVITE_PENDING' && this.props.user.loading === 'VALIDATE_INVITE_REJECTED') {
        // Invitation has expired
        const { error } = this.props.user
        this.setState({ loading: false, isInvite: false })
        Alert.alert(
          'Error',
          error.message
        )
      }

      if (prevProps.user.loading === 'COMPLETE_INVITE_PENDING' && this.props.user.loading === 'COMPLETE_INVITE_FULFILLED') {
        this.props.getUserSession()
        this.setState({ isSignup: true })
      }

      if (prevProps.user.loading === 'COMPLETE_INVITE_PENDING' && this.props.user.loading === 'COMPLETE_INVITE_REJECTED') {
        const { error } = this.props.user
        this.setState({ loading: false, isInvite: false })
        Alert.alert(
          'Error',
          error.message
        )
      }

      if (prevProps.user.loading === 'GET_USER_SESSION_PENDING' && this.props.user.loading === 'GET_USER_SESSION_FULFILLED') {
        if (this.state.isSignup && this.props.isInvite) {
          this.setState({ loading: false }, () => {
            this.setState({ isSignup: false })
            if (this.props.user.userInfo.emailConfirmed) {
              Actions.SignUpSuccessScreen()
            }
          })
        }
      }

      if (prevProps.user.loading === 'GET_USER_SESSION_PENDING' && this.props.user.loading === 'GET_USER_SESSION_REJECTED') {
        this.setState({ loading: false, isSignup: false })
      }
    }
  }

  changeFullName = text => {
    if (text.length > 0) {
      const { fieldErrors } = this.state
      const restErrors = _.filter(fieldErrors, item => item.field !== 'fullname')
      this.setState({ fieldErrors: restErrors })
    }
    this.setState({ fullName: text })
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

    let passwordScore = zxcvbn(text).score
    if (passwordScore > 3) {
      passwordScore = 3
    }
    this.setState({ password: text, passwordScore })
  }

  onPasswordFocus = status => {
    this.setState({ isPasswordFocus: status })
  }

  onSignUp = () => {
    Analytics.logEvent('signup_signup', {})

    const {
      fieldErrors,
      userEmail,
      fullName,
      password,
      passwordScore,
      isInvite,
      isTNC
    } = this.state

    let errors = []

    if (fullName.length === 0) {
      errors = [
        ...errors,
        {
          code: 'com.signup.fullname.empty',
          field: 'fullname',
          message: 'Full name is required'
        }
      ]
    } else if (!(/(\w.+\s).+/).test(fullName)) {
      errors = [
        ...errors,
        {
          code: 'com.signup.fullname.invalid',
          field: 'fullname',
          message: 'Please enter your full name'
        }
      ]
    }

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
    } else if (password.length < 6) {
      errors = [
        ...errors,
        {
          code: 'com.signup.password.invalid',
          field: 'password',
          message: 'Password must be at least 6 characters'
        }
      ]
    }

    this.setState({ fieldErrors: errors })

    if (!isTNC) {
      this.setState({ showTncError: true })
    }

    if (errors.length === 0 && isTNC) {
      const arr = _.split(fullName, ' ')

      this.setState({ showTncError: false })

      this.setState({ loading: true })

      if (isInvite) {
        const param = {
          email: userEmail,
          password: password,
          firstName: arr[0],
          lastName: arr[1],
          tandcAccepted: true,
          validationToken: this.props.token,
          jobTitle: ''
        }
        this.props.completeInvite(param)
        Keyboard.dismiss()
      } else {
        const param = {
          email: userEmail,
          password: password,
          firstName: arr[0],
          lastName: arr[1],
          tandcAccepted: true
        }
        this.props.userSignUp(param)
        Keyboard.dismiss()
      }
    }
  }

  onNextEmail = () => {
    this.passwordRef.textRef.focus()
  }

  onNextFullName = () => {
    this.emailRef.textRef.focus()
  }

  onSignIn = () => {
    Actions.LoginScreen({ prevPage: 'signup' })
  }

  render () {
    const {
      passwordScore,
      password,
      isPasswordFocus,
      isSecure,
      avatarFile,
      fieldErrors
    } = this.state

    const nameError = (_.filter(fieldErrors, item => item.field === 'fullname'))
    const emailError = (_.filter(fieldErrors, item => item.field === 'email'))
    const passwordError = (_.filter(fieldErrors, item => item.field === 'password'))

    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.innerContainer}>
            <TextInputComponent
              ref={ref => this.fullnameRef = ref}
              placeholder="Full name"
              value={this.state.fullName}
              isError={nameError.length > 0 ? true : false}
              errorText={nameError.length > 0 ? resolveError(nameError[0].code, nameError[0].message) : ''}
              handleChange={text => this.changeFullName(text)}
              returnKeyType="next"
              autoCapitalize="words"
              textContentType="name"
              onSubmitEditing={() => this.onNextFullName()}
            />

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

            <View>
              <TextInputComponent
                ref={ref => this.passwordRef = ref}
                placeholder="Password"
                isSecure={this.state.isSecure}
                ContainerStyle={{ marginBottom: 0 }}
                isErrorView={false}
                isError={passwordError.length > 0 ? true : false}
                value={this.state.password}
                handleChange={text => this.changePassword(text)}
                onFocus={() => this.onPasswordFocus(true)}
                onBlur={() => this.onPasswordFocus(false)}
                onSubmitEditing={() => this.onSignUp()}
              >
                <TouchableOpacity onPress={() => this.setState({ isSecure: !isSecure}) } activeOpacity={0.8}>
                  <View style={styles.passwordPreview}>
                    {isSecure
                      ? <Ionicons name="md-eye" size={20} color={isPasswordFocus ? COLORS.PURPLE : COLORS.MEDIUM_GREY} />
                      : <Ionicons name="md-eye-off" size={20} color={isPasswordFocus ? COLORS.PURPLE : COLORS.MEDIUM_GREY} />
                    }
                  </View>
                </TouchableOpacity>
              </TextInputComponent>
              
              {password.length > 0 &&
                <View style={styles.passwordScoreView}>
                  <Progress.Bar
                    progress={(passwordScore + 1) * 0.25}
                    width={CONSTANTS.SCREEN_SUB_WIDTH - 90}
                    color={PASSWORD_PROGRESS[passwordScore].color}
                    unfilledColor={COLORS.LIGHT_GREY}
                    borderColor={COLORS.LIGHT_GREY}
                    borderWidth={0}
                    height={3}
                  />
                  <Text style={styles.passwordScoreText}>{PASSWORD_PROGRESS[passwordScore].text}</Text>
                </View>
              }

              <View style={[styles.errorView, password.length === 0 ? { paddingTop: 8 } : { paddingTop: 3 }]}>
                {passwordError.length > 0 && (
                  <Text style={styles.errorText}>{resolveError(passwordError[0].code, passwordError[0].message)}</Text>
                )}
              </View>
            </View>
            
            <View style={styles.checkboxView}>
              <CheckBox
                style={{ flex: 1, paddingVertical: 10 }}
                onClick={() => {
                  this.setState({
                    isTNC: !this.state.isTNC,
                    showTncError: false
                  })
                }}
                isChecked={this.state.isTNC}
                rightText="I'll accept the "
              >
                <TouchableOpacity onPress={() => Actions.TermsAndConditionsScreen()}>
                  <Text style={styles.termsText}>terms of service</Text>
                </TouchableOpacity>
              </CheckBox>
              <View style={styles.errorTncView}>
                {this.state.showTncError && (
                  <Text style={styles.errorText}>You must accept the Terms of Service to proceed</Text>
                )}
              </View>
            </View>

            <TouchableOpacity onPress={() => this.onSignUp()}>
              <View style={styles.buttonView}>
                <Text style={styles.buttonText}>Sign up</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.loginButtonView}>
              <Text style={[styles.btnSend, { color: COLORS.MEDIUM_GREY }]}>Already have an account? </Text>
              <TouchableOpacity onPress={() => this.onSignIn()}>
                <Text onPress={() => this.onSignIn()} suppressHighlighting={true} style={[styles.btnSend, { color: COLORS.PURPLE }]}>Sign in.</Text>
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

SignUpScreen.defaultProps = {
  userEmail: '',
  isInvite: false,
  token: 'null'
}

SignUpScreen.propTypes = {
  userEmail: PropTypes.string,
  isInvite: PropTypes.bool,
  token: PropTypes.string
}

const mapStateToProps = ({ user }) => ({
  user
})

const mapDispatchToProps = dispatch => ({
  userSignUp: (data) => dispatch(userSignUp(data)),
  validateInvite: (data) => dispatch(validateInvite(data)),
  completeInvite: (data) => dispatch(completeInvite(data)),
  getUserSession: () => dispatch(getUserSession()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpScreen)
