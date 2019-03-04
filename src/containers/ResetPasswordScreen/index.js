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
import zxcvbn from 'zxcvbn'
import _ from 'lodash'
import LoadingScreen from '../LoadingScreen'
import TextInputComponent from '../../components/TextInputComponent'
import { resetPassword } from '../../redux/user/actions'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
import resolveError from '../../service/resolveError'
import styles from './styles'
import Analytics from '../../lib/firebase'
const LOGO = require('../../../assets/images/Login/icon_40pt.png')

const PASSWORD_PROGRESS = [
  { color: COLORS.RED, text: 'Weak' },
  { color: COLORS.MEDIUM_RED, text: 'Medium' },
  { color: COLORS.YELLOW, text: 'Strong' },
  { color: COLORS.PURPLE, text: 'Very Strong' }
]

class ResetPasswordScreen extends React.Component {
  static renderLeftButton(props) {
    return (
      <TouchableOpacity 
        style={styles.btnBack}
        activeOpacity={0.6}
        onPress={() => Actions.LoginScreen({ type: 'replace' })}
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
      loading: false,
      isError: false,
      isSecure: true,
      errorMsg: '',
      passwordScore: 0,
      isPasswordFocus: false,
      fieldErrors: [
        {
          code: '',
          field: '',
          message: ''
        }
      ]
    }
  }

  componentDidMount() {
    Analytics.setCurrentScreen('ResetPasswordScreen')
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { user } = nextProps

    if (this.props.user.loading === 'RESET_PASSWORD_PENDING' && user.loading === 'RESET_PASSWORD_FULFILLED') {
      this.setState({ loading: false }, () => {
        Actions.ResetPasswordSuccessScreen()
      })
    }

    if (this.props.user.loading === 'RESET_PASSWORD_PENDING' && user.loading === 'RESET_PASSWORD_REJECTED') {
      this.setState({ loading: false })
      Alert.alert(
        'Error',
        user.error.message,
        [{
          text: 'OK',
          onPress: () => Actions.LoginScreen({ type: 'replace' })
        }]
      )
    }
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

  onContinue = () => {
    const { fieldErrors, password, passwordScore } = this.state
    let errors = []

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

    if (errors.length === 0) {
      const param = {
        password: password,
        token: this.props.token
      }

      this.setState({ loading: true })
      this.props.resetPassword(param)
      Keyboard.dismiss()
    }
  }

  render () {
    const {
      passwordScore,
      password,
      isPasswordFocus,
      isSecure,
      fieldErrors
    } = this.state

    const passwordError = (_.filter(fieldErrors, item => item.field === 'password'))

    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.innerContainer}>
            <View>
              <TextInputComponent
                ref={ref => this.passwordRef = ref}
                placeholder="Enter Password"
                isSecure={this.state.isSecure}
                ContainerStyle={{ marginBottom: 0 }}
                isErrorView={false}
                value={this.state.password}
                handleChange={text => this.changePassword(text)}
                onFocus={() => this.onPasswordFocus(true)}
                onBlur={() => this.onPasswordFocus(false)}
                onSubmitEditing={() => this.onContinue()}
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

            <TouchableOpacity onPress={() => this.onContinue()}>
              <View style={styles.buttonView}>
                <Text style={styles.buttonText}>Continue</Text>
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>

        {this.state.loading && (
          <LoadingScreen />
        )}
      </View>
    )
  }
}

ResetPasswordScreen.defaultProps = {
  token: '12345'
}

ResetPasswordScreen.propTypes = {
  token: PropTypes.string
}

const mapStateToProps = ({ user }) => ({
  user
})

const mapDispatchToProps = dispatch => ({
  resetPassword: (data) => dispatch(resetPassword(data))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetPasswordScreen)
