import React from 'react'
import {
  View,
  SafeAreaView,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Actions } from 'react-native-router-flux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import _ from 'lodash'
import * as Progress from 'react-native-progress'
import zxcvbn from 'zxcvbn'
import LoadingScreen from '../LoadingScreen'
import KeyboardScrollView from '../../components/KeyboardScrollView'
import TextInputComponent from '../../components/TextInputComponent'
import { updatePassword } from '../../redux/user/actions'
import CONSTANTS from '../../service/constants'
import COLORS from '../../service/colors'
import resolveError from '../../service/resolveError'
import styles from './styles'

const PASSWORD_PROGRESS = [
  { color: COLORS.RED, text: 'Weak' },
  { color: COLORS.MEDIUM_RED, text: 'Medium' },
  { color: COLORS.YELLOW, text: 'Strong' },
  { color: COLORS.PURPLE, text: 'Very Strong' }
]

class ResetPasswordScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      oldPassword: '',
      password: '',
      loading: false,
      isSecure: true,
      passwordScore: 0,
      isPasswordFocus: false
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { user } = this.props

    if (prevProps.user.loading === 'UPDATE_PASSWORD_PENDING' && user.loading === 'UPDATE_PASSWORD_FULFILLED') {
      this.setState({ loading: false })
    }

    if (prevProps.user.loading === 'UPDATE_PASSWORD_PENDING' && user.loading === 'UPDATE_PASSWORD_REJECTED') {
      this.setState({ loading: false }, () => {
        Alert.alert('Error', resolveError(user.error.code, user.error.message));
      })
    }
  }

  changeOldPassword = text => {
    if (text.length > 0) {
      const { fieldErrors } = this.state
      const restErrors = _.filter(fieldErrors, item => item.field !== 'oldPassword')
      this.setState({ fieldErrors: restErrors })
    }

    this.setState({ oldPassword: text })
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

  onNextOldPassword = () => {
    this.passwordRef.textRef.focus()
  }

  onSavePassword = () => {
    const { userInfo } = this.props.user
    const { fieldErrors, oldPassword, password, passwordScore } = this.state
    let errors = []

    if (oldPassword.length === 0) {
      errors = [
        ...errors,
        {
          code: 'com.signup.oldpassword.empty',
          field: 'oldPassword',
          message: 'Old Password is required'
        }
      ]
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
          message: 'Password must have at least 6 characters'
        }
      ]
    }

    this.setState({ fieldErrors: errors })

    if (errors.length === 0) {
      const param = {
        oldPassword,
        password
      }

      this.setState({ loading: true })
      this.props.updatePassword(userInfo.id, param)
    }
  }

  render () {
    const { page } = this.props

    return (
      <SafeAreaView style={styles.container}>
        {this.renderNavBar()}

        {this.renderPasswordContent()}
        
        {this.state.loading && (
          <LoadingScreen />
        )}
      </SafeAreaView>
    );
  }

  renderNavBar = () => {
    return (
      <View style={styles.navBar}>
        <TouchableOpacity 
          style={styles.navLeftWrapper}
          activeOpacity={0.6}
          onPress={() => Actions.pop()}
        >
          <Ionicons name="ios-arrow-back" size={30} color={COLORS.PURPLE} />
          <Text style={styles.headerTextBack}>Profile</Text>
        </TouchableOpacity>

        <Text style={styles.headerTextTitle}>{this.props.title}</Text>

        <TouchableOpacity
          style={styles.navRightWrapper}
          activeOpacity={0.6}
          onPress={() => {}}
        />
      </View>
    );
  }

  renderPasswordContent = () => {
    const {
      fieldErrors,
      passwordScore,
      password,
      isPasswordFocus,
      isSecure
    } = this.state

    const passwordError = (_.filter(fieldErrors, item => item.field === 'password'))
    const oldPasswordError = (_.filter(fieldErrors, item => item.field === 'oldPassword'))

    return (
      <View style={styles.subContainer}>
        <KeyboardScrollView style={{ flex: 1 }}>
          <View style={styles.inputView}>
            <TextInputComponent
              ref={ref => this.oldPasswordRef = ref}
              label='Old password'
              placeholder="Enter old password"
              isSecure={true}
              ContainerStyle={{ marginBottom: 10 }}
              isError={oldPasswordError.length > 0 ? true : false}
              errorText={oldPasswordError.length > 0 ? resolveError(oldPasswordError[0].code, oldPasswordError[0].message) : ''}
              returnKeyType="next"
              handleChange={text => this.changeOldPassword(text)}
              onSubmitEditing={() => this.onNextOldPassword()}
            >
              <TouchableOpacity onPress={() => {}} activeOpacity={0.8}>
                <View style={styles.forgotView}>
                  <Text style={styles.forgotText}>Forgot?</Text>
                </View>
              </TouchableOpacity>
            </TextInputComponent>
          </View>

          <View style={styles.inputView}>
            <TextInputComponent
              ref={ref => this.passwordRef = ref}
              label='New password'
              placeholder="Enter password"
              isSecure={this.state.isSecure}
              ContainerStyle={{ marginBottom: 0 }}
              isErrorView={false}
              handleChange={text => this.changePassword(text)}
              onFocus={() => this.onPasswordFocus(true)}
              onBlur={() => this.onPasswordFocus(false)}
              onSubmitEditing={() => this.onSavePassword()}
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
        </KeyboardScrollView>

        <TouchableOpacity onPress={() => this.onSavePassword()} style={styles.buttonView}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Save Password</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}


ResetPasswordScreen.defaultProps = {
  type: 'user'
}


ResetPasswordScreen.propTypes = {
  data: PropTypes.object,
  type: PropTypes.string
}


const mapStateToProps = ({ user }) => ({
  user
})

const mapDispatchToProps = dispatch => ({
  updateProfile: (userId, data) => dispatch(updateProfile(userId, data)),
  updatePassword: (userId, data) => dispatch(updatePassword(userId, data))
})


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetPasswordScreen)