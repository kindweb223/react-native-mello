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
import styles from './styles'
import Analytics from '../../lib/firebase'
import AlertController from '../../components/AlertController'

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
    this.calledApi = false
  }

  componentDidMount() {
    Analytics.setCurrentScreen('SignUpConfirmScreen')

    const { token, deepLinking } = this.props

    if (deepLinking) { // from deep_linking (signup confirm)
      this.setState({ loading: true })
      this.calledApi = true
      this.props.confirmAccount(token)
    } else {
      this.intervalId = setInterval(this.pollSession, 5000)
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { user, deepLinking } = nextProps
    const { userEmail, token } = this.props

    if (Actions.currentScene === 'SignUpConfirmScreen') {
      // componentDidMount does not get called when linking here from App.js and deep link for confirmation email
      // add code here to call the API and track a local variable to track API call has been made
      if (this.props.deepLinking && this.calledApi === false) {
        this.setState({ loading: true })  
        this.calledApi = true
        this.props.confirmAccount(token)
      }
  
      if (this.props.user.loading !== 'RESEND_CONFIRMATION_EMAIL_FULFILLED' && user.loading === 'RESEND_CONFIRMATION_EMAIL_FULFILLED') {
        this.setState({ loading: false }, () => {
          AlertController.shared.showAlert(
            "Confirmation resent to " + userEmail
          )
        })
      }

      if (this.props.user.loading !== 'RESEND_CONFIRMATION_EMAIL_FAILED' && user.loading === 'RESEND_CONFIRMATION_EMAIL_FAILED') {
        this.setState({ loading: false })
      }

      if (this.props.user.loading !== 'USER_CONFIRM_ACCOUNT_PENDING' && user.loading === 'USER_CONFIRM_ACCOUNT_PENDING') {
        clearInterval(this.intervalId)
        this.intervalId = null
      }

      if (this.props.user.loading !== 'USER_CONFIRM_ACCOUNT_FULFILLED' && user.loading === 'USER_CONFIRM_ACCOUNT_FULFILLED') {
        this.props.getUserSession()
      }

      if (this.props.user.loading !== 'USER_CONFIRM_ACCOUNT_REJECTED' && user.loading === 'USER_CONFIRM_ACCOUNT_REJECTED') {
        this.setState({ loading: false })

        if (user.userInfo) {
          Actions.HomeScreen()
        } else {
          AlertController.shared.showAlert(
            "Error", "Your confirmation token is no longer valid.\nJust tap resend and we will send you another one"
          )
        }
      }

      if (this.props.user.loading !== 'GET_USER_SESSION_FULFILLED' && user.loading === 'GET_USER_SESSION_FULFILLED') {
        if (!deepLinking) {     // Verified from web app
          clearInterval(this.intervalId)
          this.intervalId = null
        }

        Actions.SignUpSuccessScreen()
      }

      if (this.props.user.loading !== 'GET_USER_SESSION_REJECTED' && user.loading === 'GET_USER_SESSION_REJECTED') {
        if (this.state.loading) {
          this.setState({ loading: false })
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
    const { userEmail, deepLinking } = this.props

    return (
      <View style={styles.container}>
        {this.state.loading && (
          <LoadingScreen />
        )}

        <View style={styles.innerContainer}>
          <Image source={MAIL_ICON} style={styles.mailIcon} />

          <Text style={styles.title}>Confirm email</Text>
          <Text style={styles.title}>address</Text>

          {deepLinking
            ? <View style={styles.subTitleView}>
                <Text style={styles.subTitle}>Almost done!</Text>
              </View>
            : <View style={styles.subTitleView}>
                <Text style={styles.subTitle}>Please validate your email in the </Text>
                <Text style={styles.subTitle}>confirmation email sent to {userEmail}</Text>
              </View>
          }

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
