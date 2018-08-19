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
import Octicons from 'react-native-vector-icons/Octicons'
import AwesomeAlert from 'react-native-awesome-alerts'
import ActionSheet from 'react-native-actionsheet'
import Permissions from 'react-native-permissions'
import ImagePicker from 'react-native-image-picker'
import * as mime from 'react-native-mime-types'
import * as Progress from 'react-native-progress'
import zxcvbn from 'zxcvbn'
import _ from 'lodash'
import KeyboardScrollView from '../../components/KeyboardScrollView'
import LoadingScreen from '../LoadingScreen'
import TextInputComponent from '../../components/TextInputComponent'
import { userSignUp } from '../../redux/user/actions'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
import resolveError from '../../service/resolveError'
import * as COMMON_FUNC from '../../service/commonFunc'
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
      fullName: 'First Last',
      userEmail: props.userEmail,
      loading: false,
      isError: false,
      isSecure: true,
      errorMsg: '',
      passwordScore: 0,
      isPasswordFocus: false,
      avatarFile: {},
      ERRORS: {
        fullName: false,
        email: false,
        password: false
      },
      fieldErrors: [
        {
          code: '',
          field: '',
          message: ''
        }
      ]
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user.loading === 'USER_SIGNUP_PENDING' && this.props.user.loading === 'USER_SIGNUP_FULFILLED') {
      this.setState({ loading: false })
      Actions.SignUpConfirmScreen({ userEmail: this.state.userEmail })
    }

    if (prevProps.user.loading === 'USER_SIGNUP_PENDING' && this.props.user.loading === 'USER_SIGNUP_REJECTED') {
      const { error } = this.props.user
      this.setState({ loading: false, fieldErrors: error })
    }
  }

  changeFullName = text => {
    const { ERRORS } = this.state
    
    if (text.length > 0) {
      ERRORS.fullName = false
    }
    this.setState({ fullName: text, ERRORS })
  }
  
  changePassword = text => {
    this.setState({ password: text })
    const passwordScore = zxcvbn(text).score
    this.setState({ passwordScore })
  }

  changePassword = text => {
    this.setState({ password: text })
    
    let passwordScore = zxcvbn(text).score
    if (passwordScore > 3) {
      passwordScore = 3
    }
    this.setState({ passwordScore })
  }

  onPasswordFocus = status => {
    this.setState({ isPasswordFocus: status })
  }

  onSignUp = () => {
    const { ERRORS, avatarFile, userEmail, fullName, password, passwordScore } = this.state
    console.log('avatarFile: ', avatarFile)
    // if (!COMMON_FUNC.validateEmail(userEmail)) {
    //   ERRORS.email = true
    // } else {
    //   ERRORS.email = false
    // }

    // if (fullName.length === 0) {
    //   ERRORS.fullName = true
    // } else {
    //   ERRORS.fullName = false
    // }

    // if (password.length === 0 || passwordScore < 2) {
    //   ERRORS.password = true
    // } else {
    //   ERRORS.password = false
    // }

    // this.setState({ ERRORS })

    // if (!ERRORS.email && !ERRORS.fullName && !ERRORS.password) {
      const arr = _.split(fullName, ' ')
      const param = {
        // email: userEmail,
        // email: 'sergeypahm+1@gmail.com',
        email: 'test@test.com',
        password,
        firstName: arr[0],
        lastName: arr[1]
      }
      console.log('PARAM: ', param)
      this.setState({ loading: true })
      this.props.userSignUp(param)
    // }
  }

  pickMediaFromCamera(options) {
    ImagePicker.launchCamera(options, (response)  => {
      if (!response.didCancel) {
        this.setState({ avatarFile: response })
      }
    });
  }

  pickMediaFromLibrary(options) {
    ImagePicker.launchImageLibrary(options, (response)  => {
      if (!response.didCancel) {
        this.setState({ avatarFile: response })
      }
    });
  }

  onTapMediaPickerActionSheet(index) {
    const options = {
      storageOptions: {
        skipBackup: true,
        path: 'feedo'
      }
    };
        
    if (index === 0) {
      // from camera
      Permissions.check('camera').then(response => {
        if (response === 'authorized') {
          this.pickMediaFromCamera(options);
        } else if (response === 'undetermined') {
          Permissions.request('camera').then(response => {
            if (response === 'authorized') {
              this.pickMediaFromCamera(options);
            }
          });
        } else {
          Permissions.openSettings();
        }
      });
    } else if (index === 1) {
      // from library
      Permissions.check('photo').then(response => {
        if (response === 'authorized') {
          this.pickMediaFromLibrary(options);
        } else if (response === 'undetermined') {
          Permissions.request('photo').then(response => {
            if (response === 'authorized') {
              this.pickMediaFromLibrary(options);
            }
          });
        } else {
          Permissions.openSettings();
        }
      });
    }
  }

  uploadPhoto = () => {
    this.imagePickerActionSheetRef.show();
  }
  

  render () {
    const {
      passwordScore,
      password,
      isPasswordFocus,
      isSecure,
      avatarFile,
      ERRORS,
      fieldErrors
    } = this.state

    return (
      <View style={styles.container}>
        <Gradient />

        <KeyboardScrollView extraScrollHeight={100}>
          <View style={styles.innerContainer}>

            <View style={styles.modalContainer}>
              <TouchableOpacity onPress={() => this.uploadPhoto()} activeOpacity={0.8}>
                <View style={styles.avatarView}>
                  <View style={styles.avatar}>
                    {_.isEmpty(avatarFile)
                      ? <Image source={CAMERA_ICON} />
                      : <Image style={styles.avatarImg} source={{ uri: avatarFile.uri }} />
                    }
                  </View>
                  <Text style={styles.uploadText}>Upload avatar</Text>
                </View>
              </TouchableOpacity>

              <TextInputComponent
                placeholder="Full name"
                value={this.state.fullName}
                isError={fieldErrors[0].field === 'fullname' ? true : false}
                errorText={resolveError(fieldErrors[0].code, fieldErrors[0].message)}
                handleChange={text => this.changeFullName(text)}
                returnKeyType="return"
              />

              <TextInputComponent
                placeholder="Enter Email"
                value={this.state.userEmail}
                isError={fieldErrors[0].field === 'email' ? true : false}
                errorText={resolveError(fieldErrors[0].code, fieldErrors[0].message)}
                handleChange={text => this.setState({ userEmail: text })}
                returnKeyType="return"
                keyboardType="email-address"
              />

              <TextInputComponent
                placeholder="Enter Password"
                isError={fieldErrors[0].field === 'password' ? true : false}
                errorText={resolveError(fieldErrors[0].code, fieldErrors[0].message)}
                isSecure={this.state.isSecure}
                ContainerStyle={{ marginBottom: 10 }}
                handleChange={text => this.changePassword(text)}
                onFocus={() => this.onPasswordFocus(true)}
                onBlur={() => this.onPasswordFocus(false)}
              >
                <TouchableOpacity onPress={() => this.setState({ isSecure: !isSecure}) } activeOpacity={0.8}>
                  <View style={styles.passwordPreview}>
                    {isSecure
                      ? <Octicons name="eye" size={20} color={isPasswordFocus ? COLORS.PURPLE : COLORS.MEDIUM_GREY} />
                      : <MaterialCommunityIcons name="onepassword" size={20} color={isPasswordFocus ? COLORS.PURPLE : COLORS.MEDIUM_GREY} />
                    }
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
                  <Text style={styles.passwordScoreText}>{PASSWORD_PROGRESS[passwordScore].text}</Text>
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
            <MaterialCommunityIcons name="onepassword" size={25} color={'#fff'} />
          </TouchableOpacity>
        </View>

        <ActionSheet
          ref={ref => this.imagePickerActionSheetRef = ref}
          title='Select a Photo / Video'
          options={['Take A Photo', 'Select From Photos', 'Cancel']}
          cancelButtonIndex={2}
          tintColor={COLORS.PURPLE}
          onPress={(index) => this.onTapMediaPickerActionSheet(index)}
        />
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
  userSignUp: (data) => dispatch(userSignUp(data)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpScreen)
