import React from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  AsyncStorage
} from 'react-native'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import PropTypes from 'prop-types'
import Modal from 'react-native-modal'
import axios from 'axios'
import LinearGradient from 'react-native-linear-gradient'
import FastImage from "react-native-fast-image"
import LoadingScreen from '../LoadingScreen'
import KeyboardScrollView from '../../components/KeyboardScrollView'
import TextInputComponent from '../../components/TextInputComponent'
import { userLookup } from '../../redux/user/actions'
import * as COMMON_FUNC from '../../service/commonFunc'
import { xSecretToken } from '../../service/api'
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
      email: '',
      loading: false,
      isInvalidError: false,
      errorText: ''
    }
  }

  async UNSAFE_componentWillMount() {
    const userBackInfo = await AsyncStorage.getItem('userBackInfo')
    if (userBackInfo) {
      const parseInfo = JSON.parse(userBackInfo)
      this.setState({ email: parseInfo.email })
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { user } = nextProps
    const { email, loading } = this.state

    if (this.props.user.loading === 'USER_LOOKUP_PENDING' && user.loading === 'USER_LOOKUP_FULFILLED') {
      if (user.userLookup.imageUrl) {
        FastImage.preload([
          {
            uri: user.userLookup.imageUrl
          }
        ])
      }

      this.setState({ loading: false }, () => {
        Actions.LoginScreen({ userData: user.userLookup })
      })
    }

    if (this.props.user.loading === 'USER_LOOKUP_PENDING' && user.loading === 'USER_LOOKUP_REJECTED') {
      if (loading && user.error.code === 'error.user.email.not.found') {
        this.setState({ loading: false })
        Actions.SignUpScreen({ userEmail: email })
      }
    }
  }

  onContinue = () => {
    const { email } = this.state

    if (email.length === 0) {
      this.setState({ isInvalidError: true, errorText: 'Email is required' })
      return
    }

    if (!COMMON_FUNC.validateEmail(email)) {
      this.setState({ isInvalidError: true, errorText: 'Email is invalid' })
      return
    }

    this.setState({ loading: true })
    const param = {
      key: xSecretToken,
      email
    }

    if (!this.state.loading) {
      this.props.userLookup(param)
    }
  }

  handleChange = text => {
    if (text.length > 0) {
      this.setState({ isInvalidError: false })
    }
    this.setState({ email: text })
  }

  render () {
    const { isInvalidError, errorText, email } = this.state
    console.log('START !!!!', email)
    return (
      <View style={styles.container}>
        <Gradient />
        
        <KeyboardScrollView>
          <View style={styles.innerContainer}>
            <View style={styles.contentView}>
              <View style={styles.logoView}>
                <Image style={styles.logo} source={LOGO} />
              </View>
              <View style={styles.content}>
                <Text style={styles.title}>Get started</Text>
                <Text style={styles.title}>with Feedo</Text>
                <Text style={styles.subTitle}>Enter your email and continue</Text>
              </View>
            </View>

            <View style={styles.modalContainer}>
              <TextInputComponent
                value={email}
                placeholder="Enter email"
                isError={isInvalidError}
                errorText={errorText}
                keyboardType="email-address"
                textContentType='emailAddress'
                handleChange={(text) => this.handleChange(text)}
                onSubmitEditing={() => this.onContinue()}
              />
              <TouchableOpacity onPress={() => this.onContinue()} activeOpacity={0.8}>
                <View style={styles.buttonView}>
                  <Text style={styles.buttonText}>Continue</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardScrollView>

        {this.state.loading && (
          <LoadingScreen />
        )}
      </View>
    )
  }
}

LoginStartScreen.propTypes = {
  userLookup: PropTypes.func.isRequired
}

const mapStateToProps = ({ user }) => ({
  user
})

const mapDispatchToProps = dispatch => ({
  userLookup: (data) => dispatch(userLookup(data)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginStartScreen)
