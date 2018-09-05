import React from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  Keyboard
} from 'react-native'
import axios from 'axios';
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import LinearGradient from 'react-native-linear-gradient'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ActionSheet from 'react-native-actionsheet'
import Permissions from 'react-native-permissions'
import ImagePicker from 'react-native-image-picker'
import * as mime from 'react-native-mime-types'
import * as Progress from 'react-native-progress'
import CheckBox from '../../components/CheckBoxComponent'
import zxcvbn from 'zxcvbn'
import _ from 'lodash'
import KeyboardScrollView from '../../components/KeyboardScrollView'
import LoadingScreen from '../LoadingScreen'
import TextInputComponent from '../../components/TextInputComponent'
import { userSignUp, getImageUrl, updateProfile, validateInvite, completeInvite, getUserSession } from '../../redux/user/actions'
import { uploadFileToS3 } from '../../redux/card/actions'
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
      fullName: '',
      userEmail: props.userEmail,
      loading: false,
      isError: false,
      isSecure: true,
      errorMsg: '',
      passwordScore: 0,
      isPasswordFocus: false,
      isTNC: false,
      avatarFile: {},
      fieldErrors: [
        {
          code: '',
          field: '',
          message: ''
        }
      ],
      isInvite: props.isInvite,
      isSignup: false
    }
  }

  componentWillMount() {
    const { token } = this.props
    const { isInvite } = this.state

    // For invited user
    if (isInvite) {
      const param = {
        validationToken: token,
        email: this.state.userEmail
      }
      this.setState({ loading: true })
      this.props.validateInvite(param)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user.loading === 'USER_SIGNUP_PENDING' && this.props.user.loading === 'USER_SIGNUP_FULFILLED') {
      const { userSignUpData } = this.props.user
      if (_.isEmpty(this.state.avatarFile)) {
        this.setState({ loading: false }, () => {
          Actions.SignUpConfirmScreen({ userEmail: this.state.userEmail })
        })        
      } else {
        this.props.getImageUrl(userSignUpData.id)
      }
    }

    if (prevProps.user.loading === 'USER_SIGNUP_PENDING' && this.props.user.loading === 'USER_SIGNUP_REJECTED') {
      const { error } = this.props.user
      this.setState({ loading: false }, () => {
        Alert.alert(
          'Error',
          error.message
        )
      })
    }

    if (prevProps.user.loading === 'GET_USER_IMAGE_URL_PENDING' && this.props.user.loading === 'GET_USER_IMAGE_URL_FULFILLED') {
      const { userImageUrlData } = this.props.user
      this.uploadImage(userImageUrlData)
    }

    if (prevProps.user.loading === 'UPLOAD_FILE_PENDING' && this.props.user.loading === 'UPLOAD_FILE_FULFILLED') {
      const { userSignUpData, userImageUrlData } = this.props.user
      const param = {
        imageUrl: userImageUrlData.objectKey
      }
      this.props.updateProfile(userSignUpData.id, param)
    }

    if (prevProps.user.loading === 'UPDATE_PROFILE_PENDING' && this.props.user.loading === 'UPDATE_PROFILE_FULFILLED') {
      this.setState({ loading: false }, () => {
        Actions.SignUpConfirmScreen({ userEmail: this.state.userEmail })
      })
    }

    if (this.props.user.loading === 'GET_USER_IMAGE_URL_REJECTED' ||
        this.props.user.loading === 'UPLOAD_FILE_REJECTED' ||
        this.props.user.loading === 'UPDATE_PROFILE_REJECTED') {
      this.setState({ loading: false })
    }

    if (prevProps.user.loading === 'VALIDATE_INVITE_PENDING' && this.props.user.loading === 'VALIDATE_INVITE_FULFILLED') {
      this.setState({ loading: false })
    }

    if (prevProps.user.loading === 'VALIDATE_INVITE_PENDING' && this.props.user.loading === 'VALIDATE_INVITE_REJECTED') {
      // Invitation has expired
      const { error } = this.props.user
      this.setState({ loading: false, isInvite: false }, () => {
        Alert.alert(
          'Error',
          error.message
        )
      })
    }

    if (prevProps.user.loading === 'COMPLETE_INVITE_PENDING' && this.props.user.loading === 'COMPLETE_INVITE_FULFILLED') {
      this.props.getUserSession()
      this.setState({ isSignup: true })
    }

    if (prevProps.user.loading === 'COMPLETE_INVITE_PENDING' && this.props.user.loading === 'COMPLETE_INVITE_REJECTED') {
      const { error } = this.props.user
      this.setState({ loading: false, isInvite: false }, () => {
        Alert.alert(
          'Error',
          error.message
        )
      })
    }

    if (prevProps.user.loading === 'GET_USER_SESSION_PENDING' && this.props.user.loading === 'GET_USER_SESSION_FULFILLED') {
      if (this.state.isSignedup && this.props.isInvite) {
        console.log('SIGNUP_SESSION !!!!!')
        this.setState({ loading: false }, () => {
          this.setState({ isSignup: false })
          if (this.props.user.userInfo.emailConfirmed) {
            Actions.SignUpSuccessScreen()
          }
        })
      }
    }

    if (prevProps.user.loading === 'GET_USER_SESSION_PENDING' && this.props.user.loading === 'GET_USER_SESSION_REJECTED') {
      this.setState({ loading: false, isSignup: false })
    }
  }

  uploadImage = (userImageUrlData) => {
    const { avatarFile } = this.state

    const baseUrl = userImageUrlData.uploadUrl
    const fileUrl = avatarFile.uri
    const urlArray = fileUrl.split('/')
    const fileName = urlArray[urlArray.length - 1]
    const fileType = mime.lookup(fileUrl);

    this.props.uploadFileToS3(baseUrl, fileUrl, fileName, fileType);
  }

  changeFullName = text => {
    if (text.length > 0) {
      const { fieldErrors } = this.state
      const restErrors = _.filter(fieldErrors, item => item.field !== 'fullname')
      this.setState({ fieldErrors: restErrors })
    }
    this.setState({ fullName: text })
  }

  changeEmail = text => {
    if (text.length > 0) {
      const { fieldErrors } = this.state
      const restErrors = _.filter(fieldErrors, item => item.field !== 'email')
      this.setState({ fieldErrors: restErrors })
    }
    this.setState({ userEmail: text })
  }
  
  changePassword = text => {
    if (text.length > 0) {
      const { fieldErrors } = this.state
      const restErrors = _.filter(fieldErrors, item => item.field !== 'password')
      this.setState({ fieldErrors: restErrors })
    }

    let passwordScore = zxcvbn(text).score
    if (passwordScore > 3) {
      passwordScore = 3
    }
    this.setState({ password: text, passwordScore })
  }

  onPasswordFocus = status => {
    this.setState({ isPasswordFocus: status })
  }

  onSignUp = () => {
    const {
      fieldErrors,
      userEmail,
      fullName,
      password,
      passwordScore,
      isInvite,
      isTNC
    } = this.state

    let errors = []

    if (fullName.length === 0) {
      errors = [
        ...errors,
        {
          code: 'com.signup.fullname.empty',
          field: 'fullname',
          message: 'Full name is required'
        }
      ]
    } else if (!(/(\w.+\s).+/).test(fullName)) {
      errors = [
        ...errors,
        {
          code: 'com.signup.fullname.invalid',
          field: 'fullname',
          message: 'Please enter your full name'
        }
      ]
    }

    if (userEmail.length === 0) {
      errors = [
        ...errors,
        {
          code: 'com.signup.email.empty',
          field: 'email',
          message: 'Email is required'
        }
      ]
    } else {
      if (!COMMON_FUNC.validateEmail(userEmail)) {
        errors = [
          ...errors,
          {
            code: 'com.signup.email.invalid',
            field: 'email',
            message: 'Email is invalid'
          }
        ]
      }
    }

    if (password.length === 0) {
      errors = [
        ...errors,
        {
          code: 'com.signup.password.empty',
          field: 'password',
          message: 'Password is required'
        }
      ]
    } else if (password.length < 6) {
      errors = [
        ...errors,
        {
          code: 'com.signup.password.invalid',
          field: 'password',
          message: 'Password must have at least 6 characters'
        }
      ]
    }

    this.setState({ fieldErrors: errors })

    if (errors.length === 0) {
      const arr = _.split(fullName, ' ')

      if (!isTNC) {
        Alert.alert(
          'Warning',
          'You must accept the Terms and Conditions'
        )
      } else {
        this.setState({ loading: true })

        if (isInvite) {
          const param = {
            email: userEmail,
            password: password,
            firstName: arr[0],
            lastName: arr[1],
            tandcAccepted: true,
            validationToken: this.props.token,
            jobTitle: ''
          }
          this.props.completeInvite(param)
        } else {
          const param = {
            email: userEmail,
            password: password,
            firstName: arr[0],
            lastName: arr[1],
            tandcAccepted: true
          }
          this.props.userSignUp(param)
        }
      }
    }
  }

  pickMediaFromCamera(options) {
    ImagePicker.launchCamera(options, (response)  => {
      if (!response.didCancel) {
        if (!response.fileName) {
          response.fileName = response.uri.replace(/^.*[\\\/]/, '')
        }
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
        
    if (index === 1) {
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
    } else if (index === 0) {
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

  onNextEmail = () => {
    this.fullnameRef.textRef.focus()
  }

  onNextFullName = () => {
    this.passwordRef.textRef.focus()
  }

  render () {
    const {
      passwordScore,
      password,
      isPasswordFocus,
      isSecure,
      avatarFile,
      fieldErrors
    } = this.state

    const nameError = (_.filter(fieldErrors, item => item.field === 'fullname'))
    const emailError = (_.filter(fieldErrors, item => item.field === 'email'))
    const passwordError = (_.filter(fieldErrors, item => item.field === 'password'))

    return (
      <View style={styles.container}>
        <Gradient />

        <KeyboardScrollView>
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
                ref={ref => this.emailRef = ref}
                placeholder="Enter Email"
                value={this.state.userEmail}
                isError={emailError.length > 0 ? true : false}
                errorText={emailError.length > 0 ? resolveError(emailError[0].code, emailError[0].message) : ''}
                handleChange={text => this.changeEmail(text)}
                returnKeyType="next"
                keyboardType="email-address"
                textContentType='emailAddress'
                onSubmitEditing={() => this.onNextEmail()}
              />

              <TextInputComponent
                ref={ref => this.fullnameRef = ref}
                placeholder="Full name"
                value={this.state.fullName}
                isError={nameError.length > 0 ? true : false}
                errorText={nameError.length > 0 ? resolveError(nameError[0].code, nameError[0].message) : ''}
                handleChange={text => this.changeFullName(text)}
                returnKeyType="next"
                autoCapitalize="words"
                textContentType="name"
                onSubmitEditing={() => this.onNextFullName()}
              />

              <View>
                <TextInputComponent
                  ref={ref => this.passwordRef = ref}
                  placeholder="Enter Password"
                  isSecure={this.state.isSecure}
                  ContainerStyle={{ marginBottom: 0 }}
                  isErrorView={false}
                  isError={passwordError.length > 0 ? true : false}
                  handleChange={text => this.changePassword(text)}
                  onFocus={() => this.onPasswordFocus(true)}
                  onBlur={() => this.onPasswordFocus(false)}
                  onSubmitEditing={() => this.onSignUp()}
                >
                  <TouchableOpacity onPress={() => this.setState({ isSecure: !isSecure}) } activeOpacity={0.8}>
                    <View style={styles.passwordPreview}>
                      {isSecure
                        ? <Ionicons name="md-eye" size={20} color={isPasswordFocus ? COLORS.PURPLE : COLORS.MEDIUM_GREY} />
                        : <Ionicons name="md-eye-off" size={20} color={isPasswordFocus ? COLORS.PURPLE : COLORS.MEDIUM_GREY} />
                      }
                    </View>
                  </TouchableOpacity>
                </TextInputComponent>
                
                {password.length > 0 &&
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
                }

                <View style={styles.errorView}>
                  {passwordError.length > 0 && (
                    <Text style={styles.errorText}>{resolveError(passwordError[0].code, passwordError[0].message)}</Text>
                  )}
                </View>
              </View>
              
              <View style={styles.checkboxView}>
                <CheckBox
                  style={{ flex: 1, paddingVertical: 10 }}
                  onClick={() => {
                    this.setState({ isTNC: !this.state.isTNC })
                  }}
                  isChecked={this.state.isTNC}
                  rightText="I'll accept the "
                >
                  <TouchableOpacity onPress={() => Actions.TermsAndConditionsScreen()}>
                    <Text style={styles.termsText}>terms & conditions</Text>
                  </TouchableOpacity>
                </CheckBox>
              </View>

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
          options={['Photo Library', 'Take Photo', 'Cancel']}
          cancelButtonIndex={2}
          tintColor={COLORS.PURPLE}
          onPress={(index) => this.onTapMediaPickerActionSheet(index)}
        />
      </View>
    )
  }
}

SignUpScreen.defaultProps = {
  userEmail: '',
  isInvite: false,
  token: 'null'
}

SignUpScreen.propTypes = {
  userEmail: PropTypes.string,
  isInvite: PropTypes.bool,
  token: PropTypes.string
}

const mapStateToProps = ({ user }) => ({
  user
})

const mapDispatchToProps = dispatch => ({
  userSignUp: (data) => dispatch(userSignUp(data)),
  getImageUrl: (data) => dispatch(getImageUrl(data)),
  updateProfile: (userId, data) => dispatch(updateProfile(userId, data)),
  uploadFileToS3: (signedUrl, file, fileName, mimeType) => dispatch(uploadFileToS3(signedUrl, file, fileName, mimeType)),
  validateInvite: (data) => dispatch(validateInvite(data)),
  completeInvite: (data) => dispatch(completeInvite(data)),
  getUserSession: () => dispatch(getUserSession()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpScreen)
