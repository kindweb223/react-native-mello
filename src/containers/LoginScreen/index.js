import React from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import LinearGradient from 'react-native-linear-gradient'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import KeyboardScrollView from '../../components/KeyboardScrollView'
import LoadingScreen from '../LoadingScreen'
import TextInputComponent from '../../components/TextInputComponent'
import { userSignIn, getUserSession, sendResetPasswordEmail } from '../../redux/user/actions'
import UserAvatarComponent from '../../components/UserAvatarComponent';
import ToasterComponent from '../../components/ToasterComponent'
import COLORS from '../../service/colors'
import styles from './styles'
const LOGO = require('../../../assets/images/Login/Group.png')

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

class LoginScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // password: 'Qwerty123',
      password: '',
      loading: false,
      isInvalidError: false,
      errorText: '',
      isLogIn: false,
      isResetSuccess: false
    }
  }

  UNSAFE_componentWillMount() {
    this.setState({ isResetSuccess: true })
    setTimeout(() => {
      this.setState({ isResetSuccess: false })
    }, 5000)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user.loading === 'USER_SIGNIN_PENDING' && this.props.user.loading === 'USER_SIGNIN_FULFILLED') {
      this.props.getUserSession()
      this.setState({ isLogIn: true })
    }

    if (prevProps.user.loading === 'USER_SIGNIN_PENDING' && this.props.user.loading === 'USER_SIGNIN_REJECTED') {
      this.setState({ loading: false }, () => {
        Alert.alert(
          'Warning',
          this.props.user.error
        )
      })
    }

    if (prevProps.user.loading === 'GET_USER_SESSION_PENDING' && this.props.user.loading === 'GET_USER_SESSION_FULFILLED') {
      if (this.state.isLogIn) {
        console.log('LOGIN_SESSION !!!!!')
        this.setState({ loading: false  }, () => {
          this.setState({ isLogIn: false })

          if (this.props.user.userInfo.emailConfirmed) {
            Actions.HomeScreen()
          } else {
            Actions.SignUpConfirmScreen({ userEmail:  this.props.userData.email })
          }
        })
      }
    }

    if (prevProps.user.loading === 'GET_USER_SESSION_PENDING' && this.props.user.loading === 'GET_USER_SESSION_REJECTED') {
      this.setState({ loading: false, isLogIn: false }, () => {
        Actions.SignUpConfirmScreen({ userEmail:  this.props.userData.email })
      })
    }

    if (prevProps.user.loading === 'SEND_RESET_PASSWORD_EMAIL_PENDING' && this.props.user.loading === 'SEND_RESET_PASSWORD_EMAIL_FULFILLED') {
      this.setState({ loading: false }, () => {
        if (!this.props.user.userInfo) {
          Actions.ResetPasswordConfirmScreen({ userEmail: this.props.userData.email })
        }
      })
    }
  }

  onSignIn = () => {
    const { password } = this.state
    if (password.length === 0) {
      this.setState({ isInvalidError: true, errorText: 'Password is required' })
      return
    }

    const param = {
      username: this.props.userData.email,
      password
    }
    this.setState({ loading: true })
    this.props.userSignIn(param)
  }

  handleChange = text => {
    if (text.length > 0) {
      this.setState({ isInvalidError: false })
    }
    this.setState({ password: text })
  }

  onForgotPassword = () => {
    this.setState({ loading: true })
    const param = {
      email: this.props.userData.email
    }
    this.props.sendResetPasswordEmail(param)
  }

  render () {
    const { userData } = this.props
    const { isInvalidError, errorText } = this.state

    return (
      <View style={styles.container}>
        <Gradient />

        <KeyboardScrollView extraScrollHeight={isInvalidError ? 120 : 100}>
          <View style={styles.innerContainer}>
            <View style={styles.contentView}>
              <UserAvatarComponent
                user={userData}
                size={72}
                color="#fff"
                textColor={COLORS.PURPLE}
              />
              <Text style={styles.subTitle}>{userData.email}</Text>
              <View style={styles.content}>
                <Text style={styles.title}>Welcome back</Text>
                <Text style={styles.title}>{userData.firstName}</Text>
              </View>
            </View>

            <View style={styles.modalContainer}>
              <View style={styles.inputView}>
                <TextInputComponent
                  value={this.state.password}
                  placeholder="Enter Password"
                  isSecure={true}
                  isError={isInvalidError}
                  errorText={errorText}
                  handleChange={text => this.handleChange(text)}
                  onSubmitEditing={() => this.onSignIn()}
                >
                  <TouchableOpacity onPress={() => this.onForgotPassword()} activeOpacity={0.8}>
                    <View style={styles.forgotView}>
                      <Text style={styles.forgotText}>Forgot?</Text>
                    </View>
                  </TouchableOpacity>
                </TextInputComponent>
              </View>
              <TouchableOpacity onPress={() => this.onSignIn()}>
                <View style={styles.buttonView}>
                  <Text style={styles.buttonText}>Sign In</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardScrollView>

        <View style={styles.headerView}>
          <TouchableOpacity onPress={() => Actions.pop()} style={styles.btnBack}>
            <Feather name="arrow-left" size={25} color={'#fff'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <MaterialCommunityIcons name="onepassword" size={25} color={'#fff'} />
          </TouchableOpacity>
        </View>

        {this.state.loading && (
          <LoadingScreen />
        )}

        {this.props.isReset && (
          <ToasterComponent
            isVisible={this.state.isResetSuccess}
            title="Password changed successfully"
            buttonTitle="OK"
            onPressButton={() => this.setState({ isResetSuccess: false })}
          />
        )}
      </View>
    )
  }
}

LoginScreen.defaultProps = {
  userData: {},
  isReset: false
}

LoginScreen.propTypes = {
  userData: PropTypes.objectOf(PropTypes.any),
  isReset: PropTypes.bool
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
