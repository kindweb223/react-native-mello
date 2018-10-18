import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Alert
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

class ResetPasswordConfirmScreen extends React.Component {
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
        <Gradient />

        {this.state.loading && (
          <LoadingScreen />
        )}

        <View style={styles.innerContainer}>
          <Ionicons name="ios-mail" size={90} color={'#fff'} />
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

        <View style={styles.headerView}>
          <TouchableOpacity onPress={() => Actions.pop()}>
            <View style={styles.btnBack}>
              <Feather name="arrow-left" size={25} color={'#fff'} />
            </View>
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
