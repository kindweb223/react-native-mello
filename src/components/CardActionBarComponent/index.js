import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Platform
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'
import Modal from 'react-native-modal'
import styles from './styles'
import CONSTANTS from '../../service/constants'
import COLORS from '../../service/colors'
const TRASH_ICON = require('../../../assets/images/Trash/White.png')

const SELECT_NONE = 0
const SELECT_MOVE = 1
const SELECT_DELETE = 2
const SELECT_MENU = 3

class CardActionBarComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isVisibleMenu: false,
      selectedButton: SELECT_NONE,
      isSettingMenu: false,
    }
    this.animatedSelect = new Animated.Value(1);
  }

  onMove() {
    this.setState({
      selectedButton: SELECT_MOVE,
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
        if (this.props.onMove) {
          this.props.onMove()
        }
      });
    });
  }

  onDelete() {
    this.setState({
      selectedButton: SELECT_DELETE,
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
        if (this.props.onHandleSettings) {
          this.props.onHandleSettings('Delete')
        }
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

  onSelectSettingItem = (item) => {
    this.setState({ isSettingMenu: false, selectedItem: item })
  }

  onSettingMenuHide = () => {
    this.props.onHandleSettings(this.state.selectedItem)
  }

  render() {
    const { hasViewModeCard } = this.props
    width = hasViewModeCard ? 130 : 240
    settingMenuMargin = (CONSTANTS.SCREEN_WIDTH - width) / 2 - 15

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
            <TouchableOpacity
              onPress={() => this.onSelectSettingItem('Report')}
              activeOpacity={0.5}
            >
              <View style={styles.settingItem}>
                <Feather name="flag" size={22} color={COLORS.PURPLE} />
                <Text style={styles.settingButtonText}>
                  Report
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>

        {hasViewModeCard
        ? <View style={[styles.rowContainer, { width }]}>
            <Animated.View
              style={
                this.state.selectedButton === SELECT_DELETE &&
                {
                  transform: [
                    { scale: this.animatedSelect },
                  ]
                }
              }
            >
              <TouchableOpacity
                style={styles.buttonView}
                activeOpacity={0.7}
                onPress={() => this.props.onHandleSettings('Report')}
              >
                <Feather name="flag" size={22} color={'#fff'} />
                <Text style={styles.buttonReportText}>Report</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        : <View style={[styles.rowContainer, { width }]}>
            <Animated.View
              style={
                this.state.selectedButton === SELECT_MOVE &&
                {
                  transform: [
                    { scale: this.animatedSelect },
                  ]
                }
              }
            >
              <TouchableOpacity
                style={styles.buttonView}
                activeOpacity={0.7}
                onPress={this.onMove.bind(this)}
              >
                <Ionicons name='md-arrow-forward' size={22} color='#fff' style={styles.arrowIcon} />
                <Text style={styles.buttonText}>Move</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View
              style={
                this.state.selectedButton === SELECT_DELETE &&
                {
                  transform: [
                    { scale: this.animatedSelect },
                  ]
                }
              }
            >
              <TouchableOpacity
                style={styles.buttonView}
                activeOpacity={0.7}
                onPress={this.onDelete.bind(this)}
              >
                <Image source={TRASH_ICON} />
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </Animated.View>

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
                style={[styles.buttonView, { marginLeft: 10 }]}
                activeOpacity={0.7}
                onPress={() => this.onPressMenu()}
              >
                <Entypo name="dots-three-horizontal" size={22} color="#fff" />
              </TouchableOpacity>
            </Animated.View>
          </View>
        }
      </View>
    )
  }
}

CardActionBarComponent.propTypes = {
  onMove: PropTypes.func.isRequired,
  onHandleSettings: PropTypes.func.isRequired,
}

export default CardActionBarComponent
