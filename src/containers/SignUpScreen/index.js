import React from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import LinearGradient from 'react-native-linear-gradient'
import Feather from 'react-native-vector-icons/Feather'
import Octicons from 'react-native-vector-icons/Octicons'
import AwesomeAlert from 'react-native-awesome-alerts'
import * as Progress from 'react-native-progress'
import zxcvbn from 'zxcvbn'
import KeyboardScrollView from '../../components/KeyboardScrollView'
import LoadingScreen from '../LoadingScreen'
import TextInputComponent from '../../components/TextInputComponent'
import { userSignUp } from '../../redux/user/actions'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
import styles from './styles'
const CAMERA_ICON = require('../../../assets/images/Camera/Blue.png')
const PASSWORD_PROGRESS = [
  { color: COLORS.RED, text: 'Weak' },
  { color: COLORS.MEDIUM_RED, text: 'Medium' },
  { color: COLORS.YELLOW, text: 'Strong' },
  { color: COLORS.PURPLE, text: 'Very Strong' }
]

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

class SignUpScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      password: '',
      fullName: '',
      userEmail: props.userEmail,
      confirmPassword: '',
      loading: false,
      isError: false,
      errorMsg: '',
      passwordScore: 0
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user.loading === 'USER_SIGNUP_PENDING' && this.props.user.loading === 'USER_SIGNUP_FULFILLED') {
      this.setState({ loading: false })
      Actions.HomeScreen()
    }

    if (prevProps.user.loading === 'USER_SIGNUP_PENDING' && this.props.user.loading === 'USER_SIGNUP_REJECTED') {
      this.setState({ loading: false })
      this.setState({ isError: true, errorMsg: this.props.user.error })
    }
  }

  changePassword = text => {
    this.setState({ password: text })
    const passwordScore = zxcvbn(text).score
    this.setState({ passwordScore })
  }

  onSignUp = () => {
    // const { password } = this.state
    // const param = {
    //   username: this.props.userEmail,
    //   password
    // }
    // this.setState({ loading: true })
    // this.props.userSignUp(param)
  }

  uploadPhoto = () => {

  }
  

  render () {
    const { passwordScore, password } = this.state

    return (
      <View style={styles.container}>
        <Gradient />

        <KeyboardScrollView>
          <View style={styles.innerContainer}>

            <View style={styles.modalContainer}>
              <TouchableOpacity onPress={() => this.uploadPhoto()} activeOpacity={0.8}>
                <View style={styles.avatarView}>
                  <View style={styles.avatar}>
                    <Image source={CAMERA_ICON} />
                  </View>
                  <Text style={styles.uploadText}>Upload avatar</Text>
                </View>
              </TouchableOpacity>

              <TextInputComponent
                placeholder="Full name"
                value={this.state.fullName}
                handleChange={text => this.setState({ fullName: text })}
              />

              <TextInputComponent
                placeholder="Enter Email"
                value={this.state.userEmail}
                handleChange={text => this.setState({ userEmail: text })}
              />

              <TextInputComponent
                placeholder="Enter Password"
                isSecure={true}
                ContainerStyle={{ marginBottom: 10 }}
                handleChange={text => this.changePassword(text)}
              >
                <TouchableOpacity onPress={() => this.onForgot()} activeOpacity={0.8}>
                  <View style={styles.passwordPreview}>
                    <Octicons name="eye" size={20} color={COLORS.MEDIUM_GREY} />
                  </View>
                </TouchableOpacity>
              </TextInputComponent>

              {password.length > 0 && (
                <View style={styles.passwordScoreView}>
                  <Progress.Bar
                    progress={(passwordScore + 1) * 0.25}
                    width={CONSTANTS.SCREEN_SUB_WIDTH - 90}
                    color={PASSWORD_PROGRESS[passwordScore].color}
                    unfilledColor={COLORS.LIGHT_GREY}
                    borderColor={COLORS.LIGHT_GREY}
                    borderWidth={0}
                    height={3}
                  />
                  <Text>{PASSWORD_PROGRESS[passwordScore].text}</Text>
                </View>
              )}

              <TouchableOpacity onPress={() => this.onSignUp()}>
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

        <AwesomeAlert
          show={this.state.isError}
          showProgress={false}
          title="Warning"
          message={this.state.errorMsg}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          cancelButtonColor='rgba(255, 0, 0, 0.6)'
          onCancelPressed={() => this.setState({ isError: false })}
        />

        <View style={styles.headerView}>
          <TouchableOpacity onPress={() => Actions.pop()} style={styles.btnBack}>
            <Feather name="arrow-left" size={25} color={'#fff'} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Create new account</Text>
          <TouchableOpacity onPress={() => {}}>
            <Feather name="info" size={25} color={'#fff'} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

SignUpScreen.defaultProps = {
  userEmail: ''
}

SignUpScreen.propTypes = {
  userEmail: PropTypes.string
}

const mapStateToProps = ({ user }) => ({
  user
})

const mapDispatchToProps = dispatch => ({
  userSignp: (data) => dispatch(userSignp(data)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpScreen)
