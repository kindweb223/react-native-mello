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
import { resendConfirmationEmail } from '../../redux/user/actions'
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

class SignUpConfirmScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user.loading === 'RESEND_CONFIRMATION_EMAIL_PENDING' && this.props.user.loading === 'RESEND_CONFIRMATION_EMAIL_FULFILLED') {
      this.setState({ loading: false }, () => {
        Alert.alert(
          "We've resent a confirmation email"
        )
      })
    }
  }

  onResend = () => {
    this.setState({ loading: true })
    this.props.resendConfirmationEmail()
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

        <View style={styles.headerView}>
          <TouchableOpacity onPress={() => Actions.pop()} style={styles.btnBack}>
            <Feather name="arrow-left" size={25} color={'#fff'} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

SignUpConfirmScreen.defaultProps = {
  userEmail: 'data-seed@gmail.com'
}

SignUpConfirmScreen.propTypes = {
  userEmail: PropTypes.string
}

const mapStateToProps = ({ user }) => ({
  user
})

const mapDispatchToProps = dispatch => ({
  resendConfirmationEmail: () => dispatch(resendConfirmationEmail()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpConfirmScreen)
