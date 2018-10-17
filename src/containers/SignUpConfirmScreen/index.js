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
import { resendConfirmationEmail, getUserSession } from '../../redux/user/actions'
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
        onPress={() => Actions.LoginStartScreen({ type: 'replace' })}
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
      loading: false
    }
  }

  componentDidMount() {
    this.intervalId = setInterval(this.pollSession, 5000)
  }

  componentDidUpdate(prevProps) {
    const { user } = this.props

    if (prevProps.user.loading === 'RESEND_CONFIRMATION_EMAIL_PENDING' && user.loading === 'RESEND_CONFIRMATION_EMAIL_FULFILLED') {
      this.setState({ loading: false }, () => {
        Alert.alert(
          "We've resent a confirmation email"
        )
      })
    }

    if (prevProps.user.loading === 'RESEND_CONFIRMATION_EMAIL_PENDING' && user.loading === 'RESEND_CONFIRMATION_EMAIL_FAILED') {
      this.setState({ loading: false })
    }

    if (prevProps.user.loading === 'GET_USER_SESSION_PENDING' && user.loading === 'GET_USER_SESSION_FULFILLED') {
      // Verified from web app
      clearInterval(this.intervalId)
      this.intervalId = null

      if (!user.userConfirmed && user.userInfo.emailConfirmed) {
        Actions.SignUpSuccessScreen()
      }
    }

    if (user.loading === 'USER_CONFIRM_ACCOUNT_PENDING') {
      clearInterval(this.intervalId)
      this.intervalId = null
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
  userEmail: ''
}

SignUpConfirmScreen.propTypes = {
  userEmail: PropTypes.string
}

const mapStateToProps = ({ user }) => ({
  user
})

const mapDispatchToProps = dispatch => ({
  resendConfirmationEmail: () => dispatch(resendConfirmationEmail()),
  getUserSession: () => dispatch(getUserSession())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpConfirmScreen)
