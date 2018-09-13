import React from 'react'
import {
  View,
  Text, 
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'

import Permissions from 'react-native-permissions'
import ImagePicker from 'react-native-image-picker'
import Modal from "react-native-modal"
import * as mime from 'react-native-mime-types'
import ActionSheet from 'react-native-actionsheet'
import _ from 'lodash'
import ToasterComponent from '../../components/ToasterComponent'
import CropImageScreen from '../CropImageScreen'
import { userSignOut, getImageUrl, updateProfile } from '../../redux/user/actions'
import { uploadFileToS3 } from '../../redux/card/actions'
import COLORS from '../../service/colors'
import * as COMMON_FUNC from '../../service/commonFunc'
import styles from './styles'
import UserAvatarComponent from '../../components/UserAvatarComponent';

const CLOSE_ICON = require('../../../assets/images/Close/Blue.png')
const TRASH_ICON = require('../../../assets/images/Trash/Blue.png')
const BELL_ICON = require('../../../assets/images/Bell/Blue.png')
const QUOTE_ICON = require('../../../assets/images/Quote/Blue.png')
const LOCK_ICON = require('../../../assets/images/Lock/Blue.png')
const EDIT_ICON = require('../../../assets/images/Edit/Blue.png')
const PROFILE_ICON = require('../../../assets/images/Profile/Blue.png')


const ABOUT_ITEMS = [
  'Knowledge Base',
  'Contact Us',
  'Privacy Policy',
  'Terms & Conditions'
]

const SETTING_ITEMS = [
  {
    icon: <Image source={PROFILE_ICON} style={styles.leftIcon} />,
    title: 'Profile'
  },
  {
    icon: <Image source={LOCK_ICON} style={styles.leftIcon} />,
    title: 'Security'
  },
  {
    icon: <Image source={BELL_ICON} style={styles.leftIcon} />,
    title: 'Notifications'
  },
  {
    icon: <Image source={TRASH_ICON} style={styles.leftIcon} />,
    title: 'Archived feeds'
  }
]

class ProfileScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      avatarFile: {},
      isCrop: false,
      isShowToaster: false,
      toasterText: ''
    }
  }

  componentDidMount() {
    this.setState({ userInfo: this.props.user.userInfo })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ userInfo: nextProps.user.userInfo })

    if (this.props.user.loading === 'USER_SIGNOUT_PENDING' && nextProps.user.loading === 'USER_SIGNOUT_FULFILLED') {
      Actions.LoginStartScreen()
    }

    if (this.props.user.loading === 'UPDATE_PROFILE_PENDING' && nextProps.user.loading === 'UPDATE_PROFILE_FULFILLED') {
      this.setState({ isShowToaster: true, toasterText: 'Profile changed' })
      setTimeout(() => {
        this.setState({ isShowToaster: false })
      }, 2000)
    }

    if (this.props.user.loading === 'UPDATE_PASSWORD_PENDING' && nextProps.user.loading === 'UPDATE_PASSWORD_FULFILLED') {
      this.setState({ isShowToaster: true, toasterText: 'Password changed' })
      setTimeout(() => {
        this.setState({ isShowToaster: false })
      }, 2000)
    }
  }

  onTapActionSheet = (index) => {
    if (index === 0) {
      this.props.userSignOut()
    }
  }

  pickMediaFromCamera(options) {
    ImagePicker.launchCamera(options, (response)  => {
      if (!response.didCancel) {
        if (!response.fileName) {
          response.fileName = response.uri.replace(/^.*[\\\/]/, '')
        }
        this.setState({ avatarFile: response, isCrop: true })
      }
    });
  }

  pickMediaFromLibrary(options) {
    ImagePicker.launchImageLibrary(options, (response)  => {
      if (!response.didCancel) {
        this.setState({ avatarFile: response, isCrop: true })
        Actions.CropImageScreen({ avatarFile: response })
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

  updatePhoto = () => {
    this.imagePickerActionSheetRef.show();
  }

  handleSettingItem = (index) => {
    const { userInfo } = this.props.user
    switch(index) {
      case 0:
        return
      case 1: // Profile
        Actions.ProfileUpdateScreen({ page: 'user', data: userInfo, title: 'Edit Profile' })
        return
      case 2:
        Actions.ProfileUpdateScreen({ page: 'password', data: userInfo, title: 'Edit Password' })
        return
      case 3:
        return
      default:
        return
    }
  }

  handleAboutItem = (item, index) => {
    switch(index) {
      case 0:
        return
      case 1:
        return
      case 2:
        return
      case 3:
        Actions.ProfileTermsAndConditionsScreen()
        return
      default:
        return
    }
  }

  render () {
    const { userInfo } = this.state

    return (
      <View style={styles.overlay}>
        {userInfo && (
          <ScrollView style={styles.scrollView}>
            <View style={styles.body}>
              <TouchableOpacity onPress={() => Actions.pop()} style={styles.closeButton}>
                <Image source={CLOSE_ICON} />
              </TouchableOpacity>

              <View style={styles.headerView}>
                <View>
                  <UserAvatarComponent
                    user={userInfo}
                    size={100}
                    color="#fff"
                    textColor={COLORS.PURPLE}
                  />
                  <View style={styles.editView}>
                    <TouchableOpacity onPress={() => this.updatePhoto()}>
                      <Image source={EDIT_ICON} style={styles.editIcon} />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.name}>
                  {userInfo.firstName} {userInfo.lastName}
                </Text>
                <Text style={styles.email}>
                  {userInfo.email}
                </Text>
              </View>

              <View style={styles.settingView}>
                {/* <View style={styles.settingItem}>
                  <TouchableOpacity
                    onPress={() => this.handleSettingItem(0)}
                    activeOpacity={0.8}
                    style={styles.itemView}
                  >
                    <View style={styles.aboutItem}>
                      <View style={styles.settingLeftView}>
                        <Image source={QUOTE_ICON} style={styles.leftIcon} />
                        <Text style={styles.title}>
                          Bio
                        </Text>
                      </View>
                      <Ionicons name="ios-arrow-forward" color={COLORS.DARK_GREY} size={20} />
                    </View>
                  </TouchableOpacity>
                </View> */}
                {
                  SETTING_ITEMS.map((item, key) => (
                    <View key={key} style={styles.settingItem}>
                      <TouchableOpacity
                        onPress={() => this.handleSettingItem(key + 1)}
                        activeOpacity={0.8}
                        style={styles.itemView}
                      >
                        <View style={styles.aboutItem}>
                          <View style={styles.settingLeftView}>
                            {item.icon}
                            <Text style={styles.title}>
                              {item.title}
                            </Text>
                          </View>
                          <Ionicons name="ios-arrow-forward" color={COLORS.DARK_GREY} size={20} />
                        </View>
                      </TouchableOpacity>
                    </View>
                  ))
                }
              </View>

              <View style={styles.settingView}>
                <View style={styles.aboutTitleView}>
                  <Text style={styles.aboutTitle}>
                    About
                  </Text>
                </View>
                <FlatList
                  data={ABOUT_ITEMS}
                  keyExtractor={item => item}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      onPress={() => this.handleAboutItem(item, index)}
                      activeOpacity={0.8}
                      style={styles.itemView}
                    >
                      <View style={styles.aboutItem}>
                        <Text style={styles.title}>
                          { item }
                        </Text>
                        <Ionicons name="ios-arrow-forward" color={COLORS.DARK_GREY} size={20} />
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>

              <View style={styles.signoOutView}>
                <TouchableOpacity
                  onPress={() => this.ActionSheet.show()}
                  activeOpacity={0.8}
                  style={styles.itemView}
                >
                  <View style={styles.signOutItem}>
                    <Text style={styles.title}>
                      Sign out
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.bottomView}>
                <Text style={styles.version}>Version 1.0.0 (10000)</Text>
                <View style={styles.bottomItemView}>
                  <Text style={styles.version}>Crafted with</Text>
                  <MaterialIcons name='favorite' size={12} color={COLORS.MEDIUM_GREY} style={styles.favicon}/>
                  <Text style={styles.version}>in Dublin</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        )}

        <ActionSheet
          ref={ref => this.ActionSheet = ref}
          title={'Are you sure that you would like to sign out?'}
          options={['Sign Out', 'Cancel']}
          cancelButtonIndex={1}
          destructiveButtonIndex={0}
          tintColor={COLORS.PURPLE}
          onPress={(index) => this.onTapActionSheet(index)}
        />

        <ActionSheet
          ref={ref => this.imagePickerActionSheetRef = ref}
          options={['Photo Library', 'Take A Photo', 'Cancel']}
          cancelButtonIndex={2}
          tintColor={COLORS.PURPLE}
          onPress={(index) => this.onTapMediaPickerActionSheet(index)}
        />

        {/* <Modal 
          isVisible={this.state.isCrop}
          style={{ margin: 0 }}
          backdropColor='#fff'
          backdropOpacity={1}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          animationInTiming={600}
          onBackdropPress={() => this.setState({ isCrop: false })}
        >
          <CropImageScreen
            avatarFile={this.state.avatarFile}
            onClose={() => this.setState({ isCrop: false })}
          />
        </Modal> */}

        {this.state.isShowToaster && (
          <ToasterComponent
            isVisible={this.state.isShowToaster}
            title={this.state.toasterText}
            buttonTitle="OK"
            onPressButton={() => this.setState({ isShowToaster: false })}
          />
        )}

      </View>
    )
  }
}

ProfileScreen.defaultProps = {
  onClose: () => {},
  userSignOut: () => {},
}

ProfileScreen.propTypes = {
  onClose: PropTypes.func,
  userSignOut: PropTypes.func
}

const mapDispatchToProps =  dispatch => ({
  userSignOut: () => dispatch(userSignOut())
})

const mapStateToProps = ({ user }) => ({
  user
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileScreen)
