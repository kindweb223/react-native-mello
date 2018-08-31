import React from 'react'
import {
  View,
  Text,
  Alert
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import Feather from 'react-native-vector-icons/Feather'
import LinearGradient from 'react-native-linear-gradient'
import LoadingScreen from '../LoadingScreen'
import { confirmAccount, getUserSession } from '../../redux/user/actions'
import COLORS from '../../service/colors'
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

class AccountConfirmScreen extends React.Component {
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
      }, 3000)
    }
  }

  componentDidUpdate(prevProps) {
    const { user, deepLinking } = this.props

    if (user.loading === 'USER_CONFIRM_ACCOUNT_FULFILLED') {
      this.props.getUserSession()
    }

    if (user.loading === 'USER_CONFIRM_ACCOUNT_REJECTED') {
      Alert.alert(
        'Error',
        user.error.message
      )
      Actions.LoginStartScreen()
    }

    if (prevProps.user.loading === 'GET_USER_SESSION_PENDING' && user.loading === 'GET_USER_SESSION_FULFILLED') {
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
                <Gradient />
                <Feather name="check" size={60} color={'#fff'} />
              </View>

              <View style={styles.titleView}>
                <Text style={styles.title}>Congratulations</Text>
                <Text style={styles.subTitle}>You're all signed up for Feedo</Text>
              </View>
            </View>
        }
      </View>
    )
  }
}

AccountConfirmScreen.defaultProps = {
  token: 'null',
  deepLinking: false
}

AccountConfirmScreen.propTypes = {
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
)(AccountConfirmScreen)
