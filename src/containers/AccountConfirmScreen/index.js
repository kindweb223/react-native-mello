import React from 'react'
import {
  View,
  Text
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import Feather from 'react-native-vector-icons/Feather'
import LinearGradient from 'react-native-linear-gradient'
import LoadingScreen from '../LoadingScreen'
import { ConfirmAccount } from '../../redux/user/actions'
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
    const { token } = this.props
    // this.setState({ loading: true })
    // this.props.ConfirmAccount(token)
  }

  componentDidUpdate(prevProps) {
    const { user } = this.props
    if (prevProps.user.loading === 'USER_CONFIRM_ACCOUNT_PENDING' && user.loading === 'USER_CONFIRM_ACCOUNT_FULFILLED') {
      this.setState({ loading: false })
      setTimeout(() => {
        Actions.LoginStartScreen()
      }, 2000)
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
  token: 'test'
}

AccountConfirmScreen.propTypes = {
  token: PropTypes.string,
  ConfirmAccount: PropTypes.func.isRequired
}

const mapStateToProps = ({ user }) => ({
  user
})

const mapDispatchToProps = dispatch => ({
  ConfirmAccount: (token) => dispatch(ConfirmAccount(token)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountConfirmScreen)
