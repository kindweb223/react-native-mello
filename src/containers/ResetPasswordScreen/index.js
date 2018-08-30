import React from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Keyboard
} from 'react-native'
import axios from 'axios';
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import LinearGradient from 'react-native-linear-gradient'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import * as Progress from 'react-native-progress'
import zxcvbn from 'zxcvbn'
import _ from 'lodash'
import KeyboardScrollView from '../../components/KeyboardScrollView'
import LoadingScreen from '../LoadingScreen'
import TextInputComponent from '../../components/TextInputComponent'
import { resetPassword } from '../../redux/user/actions'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
import resolveError from '../../service/resolveError'
import * as COMMON_FUNC from '../../service/commonFunc'
import styles from './styles'

const PASSWORD_PROGRESS = [
  { color: COLORS.RED, text: 'Weak' },
  { color: COLORS.MEDIUM_RED, text: 'Medium' },
  { color: COLORS.YELLOW, text: 'Strong' },
  { color: COLORS.PURPLE, text: 'Very Strong' }
]

const Gradient = () => {
  return(
    <LinearGradient
      colors={[COLORS.PURPLE, COLORS.RED]}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 0.0 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      }}
    />
  )
}

class ResetPasswordScreen extends React.Component {
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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user.loading === 'RESET_PASSWORD_PENDING' && this.props.user.loading === 'RESET_PASSWORD_FULFILLED') {
      this.setState({ loading: false }, () => {
        Actions.HomeScreen()
      })
    }

    if (prevProps.user.loading === 'RESET_PASSWORD_PENDING' && this.props.user.loading === 'RESET_PASSWORD_REJECTED') {
      const { error } = this.props.user
      this.setState({ loading: false }, () => {
        Alert.alert(
          'Error',
          error.message
        )
      })
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
          message: 'Password must have at least 6 characters'
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
        <Gradient />

        <KeyboardScrollView>
          <View style={styles.innerContainer}>

            <View style={styles.contentView}>
              <View style={styles.content}>
                <Text style={styles.title}>Create new</Text>
                <Text style={styles.title}>password</Text>
              </View>
            </View>

            <View style={styles.modalContainer}>
              <View>
                <TextInputComponent
                  ref={ref => this.passwordRef = ref}
                  placeholder="Enter Password"
                  isSecure={this.state.isSecure}
                  ContainerStyle={{ marginBottom: 0 }}
                  isErrorView={false}
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

                <View style={styles.errorView}>
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
          </View>
        </KeyboardScrollView>

        {this.state.loading && (
          <LoadingScreen />
        )}

        {/* <View style={styles.headerView}>
          <TouchableOpacity onPress={() => Actions.pop()} style={styles.btnBack}>
            <Feather name="arrow-left" size={25} color={'#fff'} />
          </TouchableOpacity>
        </View> */}

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
