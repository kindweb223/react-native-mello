import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Animated,
  Share,
  Platform,
  Alert,
} from 'react-native'
import PropTypes from 'prop-types'
import Octicons from 'react-native-vector-icons/Octicons'
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'
import styles from './styles'
import Analytics from '../../lib/firebase'

import CONSTANTS from '../../service/constants'
import COLORS from '../../service/colors'
import { SHARE_LINK_URL } from "../../service/api"
import * as COMMON_FUNC from '../../service/commonFunc'
import Modal from "react-native-modal"
import { PIN_FEATURE } from '../../service/api'
import AlertController from '../AlertController';

const SELECT_NONE = 0;
const SELECT_PIN_UNPIN = 1;
const SELECT_SHARE = 2;
const SELECT_MENU = 3;

const BAR_WIDTH_UNPIN = 250
const BAR_WIDTH_PIN = 270

class FeedActionBarComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isSettingMenu: false,
      selectedButton: SELECT_NONE,
    }

    this.animatedSelect = new Animated.Value(1);
  }

  onPressPin = () => {
    this.setState({
      selectedButton: SELECT_PIN_UNPIN,
    }, () => {
      Animated.sequence([
        Animated.timing(this.animatedSelect, {
          toValue: 0.8,
          duration: 100,
        }),
        Animated.timing(this.animatedSelect, {
          toValue: 1,
          duration: 100,
        }),
      ]).start(() => {
        this.props.handlePin()
        this.setState({ isSettingMenu: false })
      });
    });
  }

  onPressShare = () => {
    const {selectedFeedList} = this.props

    Analytics.logEvent('dashboard_share', {})

    if (COMMON_FUNC.isSharingEnabled(selectedFeedList[0].feed)) {
      COMMON_FUNC.handleShareFeed(selectedFeedList[0].feed)
    } 
    else {
      AlertController.shared.showAlert('Warning', 'Sharing is not enabled for this flow')
    }
  }

  onPressMenu() {
    this.setState({
      selectedButton: SELECT_MENU,
    }, () => {
      Animated.sequence([
        Animated.timing(this.animatedSelect, {
          toValue: 0.8,
          duration: 100,
        }),
        Animated.timing(this.animatedSelect, {
          toValue: 1,
          duration: 100,
        }),
      ]).start(() => {
        this.setState(prevState => ({ isSettingMenu: !prevState.isSettingMenu }))
      });
    });
  }

  onSettingMenuHide = () => {
    this.props.handleSetting(this.state.selectedItem)
  }

  onPressSetting = (item) => {
    this.setState({ isSettingMenu: false, selectedItem: item })
  }

  render() {
    const { selectedFeedList } = this.props

    const pinFlag = selectedFeedList.length === 1 && selectedFeedList[0].feed.pinned

    let MENU_ITEMS = []

    let settingMenuMargin = (CONSTANTS.SCREEN_WIDTH - BAR_WIDTH_UNPIN) / 2
    let actionBarWidth = BAR_WIDTH_UNPIN

    if (selectedFeedList.length === 1) {
      const data = selectedFeedList[0].feed
      // Single select
      if (COMMON_FUNC.isFeedOwner(data)) {
        MENU_ITEMS = ['Duplicate', 'Edit', 'Archive', 'Delete']
      }

      if (COMMON_FUNC.isFeedEditor(data)) {
        MENU_ITEMS = ['Duplicate', 'Edit', 'Leave Flow']
      }

      if (COMMON_FUNC.isFeedContributorGuest(data)) {
        MENU_ITEMS = ['Leave Flow']
      }

      if (COMMON_FUNC.isMelloTipFeed(data)) {
        MENU_ITEMS = ['Leave Flow']
      }

      if (pinFlag) {
        settingMenuMargin = (CONSTANTS.SCREEN_WIDTH - BAR_WIDTH_PIN) / 2
        actionBarWidth = BAR_WIDTH_PIN
      }

      if (!PIN_FEATURE) {
        actionBarWidth = 170
        settingMenuMargin = (CONSTANTS.SCREEN_WIDTH - 170) / 2
      }
    } else {
      // Multiple select
      MENU_ITEMS = ['Duplicate', 'Archive']
      if (!PIN_FEATURE) {
        actionBarWidth = 170
        settingMenuMargin = (CONSTANTS.SCREEN_WIDTH - 170) / 2
      }
    }

    return (
      <View style={styles.container}>
        <Modal
          style={styles.settingMenu}
          isVisible={this.state.isSettingMenu}
          backdropOpacity={0}
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInTiming={Platform.OS === 'ios' ? 500 : 50}
          animationOutTiming={Platform.OS === 'ios' ? 500 : 1}
          onModalHide={this.onSettingMenuHide}
          onBackdropPress={() => this.setState({ isSettingMenu: false })}
          onBackButtonPress={() => this.setState({ isSettingMenu: false })}
        >
          <View style={[styles.settingMenuView, { right: settingMenuMargin }]}>
            <FlatList
              data={MENU_ITEMS}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => this.onPressSetting(item)}
                  activeOpacity={0.5}
                >
                  <View style={styles.settingItem}>
                    <Text style={(item === 'Delete' || item === 'Leave Flow') ? styles.deleteButtonText : styles.settingButtonText}>
                      {item}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>

        <View style={[styles.rowContainer, { width: actionBarWidth }]}>
          {PIN_FEATURE && (
            <Animated.View
              style={
                this.state.selectedButton === SELECT_PIN_UNPIN &&
                {
                  transform: [
                    { scale: this.animatedSelect },
                  ],
                }
              }
            >
              <TouchableOpacity 
                style={styles.buttonView}
                activeOpacity={0.7}
                onPress={this.onPressPin}
              >
                <Octicons name="pin" style={styles.pinIcon} size={22} color="#fff" />
                <Text style={styles.buttonText}>{pinFlag ? 'Unpin' : 'Pin'}</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          <Animated.View
            style={
              this.state.selectedButton === SELECT_SHARE &&
              {
                transform: [
                  { scale: this.animatedSelect },
                ],
              }
            }
          >
            {selectedFeedList.length === 1
              ? <TouchableOpacity 
                  style={styles.buttonView}
                  activeOpacity={0.7}
                  onPress={this.onPressShare}
                >
                  <Entypo name={Platform.OS === 'ios' ? 'share-alternative' : 'share'} style={styles.shareIcon} size={22} color="#fff" />
                  <Text style={styles.buttonText}>Share</Text>
                </TouchableOpacity>
              : <TouchableOpacity 
                  style={styles.buttonView}
                  activeOpacity={0.7}
                  onPress={() => this.props.handleDelete()}
                >
                  <Feather name="trash-2" style={styles.shareIcon} size={22} color="#fff" />
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            }
          </Animated.View>

          {MENU_ITEMS.length > 0 && (
            <Animated.View
              style={
                this.state.selectedButton === SELECT_MENU &&
                {
                  transform: [
                    { scale: this.animatedSelect },
                  ],
                }
              }
            >
              <TouchableOpacity 
                style={styles.btnMenu}
                activeOpacity={0.7}
                onPress={() => this.onPressMenu()}
              >
                <Entypo name="dots-three-horizontal" size={22} color="#fff" />
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </View>
    )
  }
}

FeedActionBarComponent.defaultProps = {
  handleDelete: () => {}
}

FeedActionBarComponent.propTypes = {
  handlePin: PropTypes.func.isRequired,
  handleShare: PropTypes.func.isRequired,
  handleSetting: PropTypes.func.isRequired,
  selectedFeedList: PropTypes.arrayOf(PropTypes.any).isRequired,
  userInfo: PropTypes.object,
  handleDelete: PropTypes.func
}

export default FeedActionBarComponent
