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
import LinearGradient from 'react-native-linear-gradient'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import LoadingScreen from '../LoadingScreen'
import { sendResetPasswordEmail } from '../../redux/user/actions'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
import styles from './styles'

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

  componentDidUpdate(prevProps) {
    const { user } = this.props

    if (prevProps.user.loading === 'RESEND_CONFIRMATION_EMAIL_PENDING' && user.loading === 'RESEND_CONFIRMATION_EMAIL_FULFILLED') {
      this.setState({ loading: false }, () => {
        Alert.alert(
          "We've resent a confirmation email"
        )
      })
    }

    if ((prevProps.user.loading === 'SEND_RESET_PASSWORD_EMAIL_PENDING' && user.loading === 'SEND_RESET_PASSWORD_EMAIL_FULFILLED') ||
      (prevProps.user.loading === 'SEND_RESET_PASSWORD_EMAIL_PENDING' && user.loading === 'SEND_RESET_PASSWORD_EMAIL_REJECTED')) {
      this.setState({ loading: false })
    }
  }

  onResend = () => {
    this.setState({ loading: true })
    const param = {
      email: this.props.userEmail
    }
    this.props.sendResetPasswordEmail(param)
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

          <Text style={styles.title}>Reset</Text>
          <Text style={styles.title}>password</Text>
          <View style={styles.subTitleView}>
            <Text style={styles.subTitle}>We have sent instructions to</Text>
            <Text style={styles.subTitle}>{userEmail}</Text>
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
