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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AwesomeAlert from 'react-native-awesome-alerts'
import KeyboardScrollView from '../../components/KeyboardScrollView'
import LoadingScreen from '../LoadingScreen'
import TextInputComponent from '../../components/TextInputComponent'
import { userSignIn } from '../../redux/user/actions'
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

class LoginScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // password: 'Qwerty123',
      password: '',
      loading: false,
      isError: false,
      isInvalidError: false,
      errorText: '',
      errorMsg: ''
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user.loading === 'USER_SIGNIN_PENDING' && this.props.user.loading === 'USER_SIGNIN_FULFILLED') {
      this.setState({ loading: false })
      Actions.HomeScreen()
    }

    if (prevProps.user.loading === 'USER_SIGNIN_PENDING' && this.props.user.loading === 'USER_SIGNIN_REJECTED') {
      this.setState({ loading: false })
      this.setState({ isError: true, errorMsg: this.props.user.error })
    }
  }

  onSignIn = () => {
    const { password } = this.state
    if (password.length === 0) {
      this.setState({ isInvalidError: true, errorText: 'Password is required' })
      return
    }

    const param = {
      username: this.props.userData.email,
      password
    }
    this.setState({ loading: true })
    this.props.userSignIn(param)
  }

  handleChange = text => {
    if (text.length > 0) {
      this.setState({ isInvalidError: false })
    }
    this.setState({ password: text })
  }

  onForgot = () => {

  }

  render () {
    const { userData } = this.props
    const { isInvalidError, errorText } = this.state

    return (
      <View style={styles.container}>
        <Gradient />

        <SafeAreaView>
          <KeyboardScrollView extraScrollHeight={120}>
            <View style={styles.innerContainer}>
              <View style={styles.contentView}>
                <View style={styles.avatarView}>
                  {userData.imageUrl
                    ? <Image style={styles.avatar} source={{ uri: userData.imageUrl }} />
                    : <Image style={styles.defaultAvatar} source={LOGO} />
                  }
                </View>

                <Text style={styles.subTitle}>{userData.email}</Text>
                <View style={styles.content}>
                  <Text style={styles.title}>Welcome back</Text>
                  <Text style={styles.title}>{userData.firstName}</Text>
                </View>
              </View>

              <View style={styles.modalContainer}>
                <View style={styles.inputView}>
                  <TextInputComponent
                    placeholder="Enter Password"
                    isSecure={true}
                    isError={isInvalidError}
                    errorText={errorText}
                    handleChange={text => this.handleChange(text)}
                    onSubmitEditing={() => this.onSignIn()}
                  >
                    <TouchableOpacity onPress={() => this.onForgot()} activeOpacity={0.8}>
                      <View style={styles.forgotView}>
                        <Text style={styles.forgotText}>Forgot?</Text>
                      </View>
                    </TouchableOpacity>
                  </TextInputComponent>
                </View>
                <TouchableOpacity onPress={() => this.onSignIn()}>
                  <View style={styles.buttonView}>
                    <Text style={styles.buttonText}>SignIn</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardScrollView>
        </SafeAreaView>

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
          <TouchableOpacity onPress={() => {}}>
            <MaterialCommunityIcons name="onepassword" size={25} color={'#fff'} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

LoginScreen.defaultProps = {
  userData: {}
}

LoginScreen.propTypes = {
  userEmail: PropTypes.objectOf(PropTypes.any),
}

const mapStateToProps = ({ user }) => ({
  user
})

const mapDispatchToProps = dispatch => ({
  userSignIn: (data) => dispatch(userSignIn(data)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen)
