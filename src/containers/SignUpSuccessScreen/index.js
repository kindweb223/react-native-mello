import React from 'react'
import {
  View,
  Text,
  Alert,
  Image
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import LoadingScreen from '../LoadingScreen'
import { confirmAccount, getUserSession } from '../../redux/user/actions'
import COLORS from '../../service/colors'
import styles from './styles'
const SUCCESS_ICON = require('../../../assets/images/Success/adamStatic3.png')

class SignUpSuccessScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  componentWillMount() {
    const { token, deepLinking } = this.props
    if (deepLinking) { // from deep_linking
      this.setState({ loading: true })
      this.props.confirmAccount(token)
    } else {
      setTimeout(() => {
        Actions.HomeScreen()
      }, 2000)
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { user, deepLinking } = nextProps

    if (user.loading === 'USER_CONFIRM_ACCOUNT_FULFILLED') {
      this.props.getUserSession()
    }

    if (user.loading === 'USER_CONFIRM_ACCOUNT_REJECTED') {
      this.setState({ loading: false })

      if (user.userInfo) {
        Actions.HomeScreen()
      } else {
        Actions.LoginScreen()
      }
    }

    if (this.props.user.loading === 'GET_USER_SESSION_PENDING' && user.loading === 'GET_USER_SESSION_FULFILLED') {
      if (deepLinking) {
        this.setState({ loading: false }, () => {
          if (user.userInfo.emailConfirmed) {
            setTimeout(() => {
              Actions.HomeScreen()
            }, 2000)
          }
        })
      }
    }
  }

  render () {
    return (
      <View style={styles.container}>
        {this.state.loading
          ? <LoadingScreen />
          : <View style={styles.body}>
              <View style={styles.successView}>
                <Image source={SUCCESS_ICON} />
              </View>

              <View style={styles.titleView}>
                <Text style={styles.title}>Success!</Text>
                <Text style={styles.subTitle}>Welcome to Feedo!</Text>
              </View>
            </View>
        }
      </View>
    )
  }
}

SignUpSuccessScreen.defaultProps = {
  token: 'null',
  deepLinking: false
}

SignUpSuccessScreen.propTypes = {
  token: PropTypes.string,
  deepLinking: PropTypes.bool,
  confirmAccount: PropTypes.func.isRequired
}

const mapStateToProps = ({ user }) => ({
  user
})

const mapDispatchToProps = dispatch => ({
  confirmAccount: (token) => dispatch(confirmAccount(token)),
  getUserSession: () => dispatch(getUserSession())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpSuccessScreen)
