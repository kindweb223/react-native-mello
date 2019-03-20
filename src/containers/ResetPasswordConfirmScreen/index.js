import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import LoadingScreen from '../LoadingScreen'
import { sendResetPasswordEmail } from '../../redux/user/actions'
import COLORS from '../../service/colors'
import styles from './styles'
import Analytics from '../../lib/firebase'
import AlertController from '../../components/AlertController'

const LOGO = require('../../../assets/images/Login/icon_40pt.png')
const MAIL_ICON = require('../../../assets/images/Success/iconMailBig.png')

class ResetPasswordConfirmScreen extends React.Component {
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
      loading: false
    }
  }

  componentDidMount() {
    Analytics.setCurrentScreen('ResetPasswordConfirmScreen')
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { user } = nextProps

    if (Actions.currentScene === 'ResetPasswordConfirmScreen' || Actions.currentScene === 'ProfileResetPasswordConfirmScreen') {
      if ((this.props.user.loading === 'SEND_RESET_PASSWORD_EMAIL_PENDING' && user.loading === 'SEND_RESET_PASSWORD_EMAIL_FULFILLED') ||
        (this.props.user.loading === 'SEND_RESET_PASSWORD_EMAIL_PENDING' && user.loading === 'SEND_RESET_PASSWORD_EMAIL_REJECTED')) {
        this.setState({ loading: false })
      }
    }
  }

  onResend = () => {
    this.setState({ loading: true })
    const param = {
      email: this.props.userEmail
    }
    this.props.sendResetPasswordEmail(param)

    AlertController.shared.showAlert(
      '',
      'Email resent to ' + param.email,
    )
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

          <Text style={styles.title}>Almost done!</Text>
          <View style={styles.subTitleView}>
            <Text style={styles.subTitle}>Please follow the instructions sent to </Text>
            <Text style={styles.subTitle}>{userEmail} to reset your password</Text>
          </View>

          <TouchableOpacity onPress={() => this.onResend()} style={styles.buttonView}>
            <Text style={styles.btnSend}>Resend</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

ResetPasswordConfirmScreen.defaultProps = {
  userEmail: ''
}

ResetPasswordConfirmScreen.propTypes = {
  userEmail: PropTypes.string
}

const mapStateToProps = ({ user }) => ({
  user
})

const mapDispatchToProps = dispatch => ({
  sendResetPasswordEmail: (data) => dispatch(sendResetPasswordEmail(data)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetPasswordConfirmScreen)
