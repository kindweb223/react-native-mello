import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import LoadingScreen from '../LoadingScreen'
import { confirmAccount, resendConfirmationEmail, getUserSession } from '../../redux/user/actions'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
import styles from './styles'

const LOGO = require('../../../assets/images/Login/icon_40pt.png')
const MAIL_ICON = require('../../../assets/images/Success/iconMailBig.png')

class SignUpConfirmScreen extends React.Component {
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
      loading: false
    }
  }

  componentDidMount() {
    const { token, deepLinking } = this.props

    if (deepLinking) { // from deep_linking (signup confirm)
      this.setState({ loading: true })
      this.props.confirmAccount(token)
    } else {
      this.intervalId = setInterval(this.pollSession, 5000)
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { user, deepLinking } = nextProps

    if (Actions.currentScene === 'SignUpConfirmScreen') {
      if (this.props.user.loading === 'RESEND_CONFIRMATION_EMAIL_PENDING' && user.loading === 'RESEND_CONFIRMATION_EMAIL_FULFILLED') {
        this.setState({ loading: false }, () => {
          Alert.alert(
            "We've resent a confirmation email"
          )
        })
      }

      if (this.props.loading === 'RESEND_CONFIRMATION_EMAIL_PENDING' && user.loading === 'RESEND_CONFIRMATION_EMAIL_FAILED') {
        this.setState({ loading: false })
      }

      if (user.loading === 'USER_CONFIRM_ACCOUNT_PENDING') {
        clearInterval(this.intervalId)
        this.intervalId = null
      }

      if (this.props.user.loading === 'USER_CONFIRM_ACCOUNT_PENDING' && user.loading === 'USER_CONFIRM_ACCOUNT_FULFILLED') {
        this.props.getUserSession()
      }

      if (this.props.user.loading === 'USER_CONFIRM_ACCOUNT_PENDING' && user.loading === 'USER_CONFIRM_ACCOUNT_REJECTED') {
        this.setState({ loading: false })

        if (user.userInfo) {
          Actions.HomeScreen()
        } else {
          Alert.alert(
            "Error", "Your confirmation token is no longer valid.\nJust tap resend and we will send you another one"
          )
        }
      }

      if (this.props.loading === 'GET_USER_SESSION_PENDING' && user.loading === 'GET_USER_SESSION_FULFILLED') {
        if (!deepLinking) {     // Verified from web app
          clearInterval(this.intervalId)
          this.intervalId = null
        }

        if (!user.userConfirmed && user.userInfo.emailConfirmed) {
          Actions.SignUpSuccessScreen()
        }
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
    this.intervalId = null
  }

  pollSession = () => {
    this.props.getUserSession()
  }

  onResend = () => {
    this.setState({ loading: true })
    this.props.resendConfirmationEmail()
  }

  render () {
    const { userEmail } = this.props

    return (
      <View style={styles.container}>
        {this.state.loading && (
          <LoadingScreen />
        )}

        <View style={styles.innerContainer}>
          <Image source={MAIL_ICON} style={styles.mailIcon} />

          <Text style={styles.title}>Confirm email</Text>
          <Text style={styles.title}>address</Text>

          <View style={styles.subTitleView}>
            <Text style={styles.subTitle}>We have sent a confirmation</Text>
            <Text style={styles.subTitle}>email to {userEmail}</Text>
          </View>

          <TouchableOpacity onPress={() => this.onResend()} style={styles.buttonView}>
            <Text style={styles.btnSend}>Resend</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

SignUpConfirmScreen.defaultProps = {
  userEmail: '',
  token: 'null',
  deepLinking: false
}

SignUpConfirmScreen.propTypes = {
  userEmail: PropTypes.string,
  token: PropTypes.string,
  deepLinking: PropTypes.bool
}

const mapStateToProps = ({ user }) => ({
  user
})

const mapDispatchToProps = dispatch => ({
  confirmAccount: (token) => dispatch(confirmAccount(token)),
  resendConfirmationEmail: () => dispatch(resendConfirmationEmail()),
  getUserSession: () => dispatch(getUserSession())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpConfirmScreen)
