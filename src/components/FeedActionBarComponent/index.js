import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native'
import PropTypes from 'prop-types'
import Octicons from 'react-native-vector-icons/Octicons'
import Entypo from 'react-native-vector-icons/Entypo'
import styles from './styles'
import Analytics from '../../lib/firebase'

import CONSTANTS from '../../service/constants'
import * as COMMON_FUNC from '../../service/commonFunc'
import Modal from "react-native-modal"

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
    this.setState({
      selectedButton: SELECT_SHARE,
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
        Analytics.logEvent('dashboard_share', {})

        this.props.handleShare()
        this.setState({ isSettingMenu: false })
      });
    });
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
    const { data, pinFlag } = this.props

    let MENU_ITEMS = []
    if (COMMON_FUNC.isFeedOwner(data)) {
      MENU_ITEMS = ['Duplicate', 'Edit', 'Archive', 'Delete']
    }

    if (COMMON_FUNC.isFeedEditor(data)) {
      MENU_ITEMS = ['Duplicate', 'Edit', 'Leave Flow']
    }

    if (COMMON_FUNC.isFeedContributorGuest(data)) {
      MENU_ITEMS = ['Leave Flow']
    }

    let settingMenuMargin = (CONSTANTS.SCREEN_WIDTH - BAR_WIDTH_UNPIN) / 2
    let actionBarWidth = BAR_WIDTH_UNPIN
    if (pinFlag) {
      settingMenuMargin = (CONSTANTS.SCREEN_WIDTH - BAR_WIDTH_PIN) / 2
      actionBarWidth = BAR_WIDTH_PIN
    }

    return (
      <View style={styles.container}>
        <Modal
          style={styles.settingMenu}
          isVisible={this.state.isSettingMenu}
          backdropOpacity={0}
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInTiming={600}
          onModalHide={this.onSettingMenuHide}
          onBackdropPress={() => this.setState({ isSettingMenu: false })}
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
            <TouchableOpacity 
              style={styles.buttonView}
              activeOpacity={0.7}
              onPress={this.onPressShare}
            >
              <Entypo name="share-alternative" style={styles.shareIcon} size={22} color="#fff" />
              <Text style={styles.buttonText}>Share</Text>
            </TouchableOpacity>
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

FeedActionBarComponent.propTypes = {
  handlePin: PropTypes.func.isRequired,
  handleShare: PropTypes.func.isRequired,
  handleSetting: PropTypes.func.isRequired,
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  pinFlag: PropTypes.bool.isRequired,
  userInfo: PropTypes.object
}

export default FeedActionBarComponent
