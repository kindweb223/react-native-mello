import React from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import PropTypes from 'prop-types'
import Modal from 'react-native-modal'
import axios from 'axios'
import LinearGradient from 'react-native-linear-gradient'
import KeyboardScrollView from '../../components/KeyboardScrollView'
import TextInputComponent from '../../components/TextInputComponent'
import { checkAccount } from '../../redux/user/actions'
import COLORS from '../../service/colors'
import styles from './styles'
const LOGO = require('../../../assets/images/Login/Group.png')

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

class LoginStartScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // email: 'seed-data@solvers.io'
      email: ''
    }
  }

  onContinue = () => {
    const { email } = this.state
    Actions.LoginScreen({ userEmail: email })
    // Actions.SignUpScreen({ userEmail: email })
  }

  render () {
    return (
      <View style={styles.container}>
        <Gradient />
        
        <KeyboardScrollView>
          <View style={styles.container}>
            <View style={styles.contentView}>
              <View style={styles.logoView}>
                <Image source={LOGO} />
              </View>
              <View style={styles.content}>
                <Text style={styles.title}>Get started</Text>
                <Text style={styles.title}>with Feedo</Text>
                <Text style={styles.subTitle}>Enter your email and continue</Text>
              </View>
            </View>

            <View style={styles.modalContainer}>
              <TextInputComponent
                value={this.state.email}
                placeholder="Enter email"
                handleChange={text => this.setState({ email: text })}
              />
              <TouchableOpacity onPress={() => this.onContinue()} activeOpacity={0.8}>
                <View style={styles.buttonView}>
                  <Text style={styles.buttonText}>Continue</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardScrollView>
      </View>
    )
  }
}

LoginStartScreen.propTypes = {
  checkAccount: PropTypes.func.isRequired
}

const mapStateToProps = ({ user }) => ({
  user
})

const mapDispatchToProps = dispatch => ({
  checkAccount: (feedId, data) => dispatch(checkAccount(feedId, data)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginStartScreen)
