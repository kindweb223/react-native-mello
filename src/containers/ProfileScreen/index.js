import React from 'react'
import {
  View,
  Text, 
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
  Image,
  Share,
  ScrollView,
  FlatList
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import UserAvatar from 'react-native-user-avatar'
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import _ from 'lodash'
import { userSignOut } from '../../redux/user/actions'
import COLORS from '../../service/colors'
import * as COMMON_FUNC from '../../service/commonFunc'
import actionSheetStyles from './actionSheetStyles'
import styles from './styles'
const CLOSE_ICON = require('../../../assets/images/Close/Blue.png')
const TRASH_ICON = require('../../../assets/images/Trash/Blue.png')
const BELL_ICON = require('../../../assets/images/Bell/Blue.png')
const QUOTE_ICON = require('../../../assets/images/Quote/Blue.png')
const LOCK_ICON = require('../../../assets/images/Lock/Blue.png')


const ABOUT_ITEMS = [
  'Knowledge Base',
  'Contact Us',
  'Privacy Policy',
  'Terms & Conditions'
]

const ACTIONSHEET_OPTIONS = [
  <Text key="0" style={actionSheetStyles.actionButtonText}>Sign Out</Text>,
  'Cancel'
]

const SETTING_ITEMS = [
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
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user.loading === 'USER_SIGNOUT_PENDING' && this.props.user.loading === 'USER_SIGNOUT_FULFILLED') {
      Actions.LoginStartScreen()
    }
  }

  onTapActionSheet = (index) => {
    if (index === 0) {
      this.props.userSignOut()
    }
  }

  render () {
    const { userInfo } = this.props.user

    return (
      <View style={styles.overlay}>
        {userInfo && (
          <ScrollView style={styles.scrollView}>
            <View style={styles.body}>
              <TouchableOpacity onPress={() => Actions.pop()} style={styles.closeButton}>
                <Image source={CLOSE_ICON} />
              </TouchableOpacity>

              <View style={styles.headerView}>
                {userInfo.imageUrl
                ? <View style={styles.avatarView}>
                    <Image
                      style={styles.image}
                      source={{ uri: item.coverImage }}
                    />
                  </View>
                : <UserAvatar
                    size="100"
                    name={`${userInfo.firstName} ${userInfo.lastName}`}
                    color="#fff"
                    textColor={COLORS.PURPLE}
                  />
                }
                <Text style={styles.name}>
                  {userInfo.firstName} {userInfo.lastName}
                </Text>
                <Text style={styles.email}>
                  {userInfo.email}
                </Text>
              </View>

              <View style={styles.settingView}>
                <View style={styles.settingItem}>
                  <TouchableOpacity
                    onPress={() => this.props.handleSettingItem(0)}
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
                </View>
                {
                  SETTING_ITEMS.map((item, key) => (
                    <View key={key} style={styles.settingItem}>
                      <TouchableOpacity
                        onPress={() => this.props.handleSettingItem(key + 1)}
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
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => this.props.handleAboutItem(item)}
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
                <Text style={styles.version}>Version 1.0.0 (1000)</Text>
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
          title={<Text style={actionSheetStyles.titleText}>Are you sure that you would like to sign out?</Text>}
          options={ACTIONSHEET_OPTIONS}
          cancelButtonIndex={1}
          destructiveButtonIndex={2}
          tintColor={COLORS.PURPLE}
          styles={actionSheetStyles}
          onPress={(index) => this.onTapActionSheet(index)}
        />
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
