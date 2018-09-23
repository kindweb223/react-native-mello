import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Modal from 'react-native-modal'
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'

import * as COMMON_FUNC from '../../service/commonFunc'
import styles from './styles'

const SELECT_NONE = 0;
const SELECT_MOVE = 1;
const SELECT_MENU = 2;


class CardActionBarComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isVisibleMenu: false,
      selectedButton: SELECT_NONE,
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
        this.setState({ isVisibleMenu: false })
      });
    });
  }

  onShowMenu() {
    this.setState({
      selectedButton: SELECT_MENU,
    }, () => {
      Animated.sequence([
        Animated.timing(this.animatedSelect, {
          toValue: 0.9,
          duration: 100,
        }),
        Animated.timing(this.animatedSelect, {
          toValue: 1,
          duration: 100,
        }),
      ]).start(() => {
        this.setState({ isVisibleMenu: !this.state.isVisibleMenu });
      });
    });
  }

  onSettingMenuHide() {
    if (this.props.onHandleSettings) {
      this.props.onHandleSettings(this.state.selectedItem)
    }
  }

  onPressSetting(item) {
    this.setState({ isVisibleMenu: false, selectedItem: item })
  }

  renderItem({ item }) {
    return (
      <TouchableOpacity
        style={styles.settingItem}
        activeOpacity={0.7}
        onPress={() => this.onPressSetting(item)}
      >
        <Text style={item === 'Delete' ? styles.deleteButtonText : styles.settingButtonText}>{item}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const { feedo, idea } = this.props

    let MENU_ITEMS = []
    if (COMMON_FUNC.isFeedGuest(feedo.currentFeed)) {
      MENU_ITEMS = []
    }

    if (COMMON_FUNC.isFeedOwner(feedo.currentFeed) || COMMON_FUNC.isFeedEditor(feedo.currentFeed)) {
      MENU_ITEMS = ['Edit', 'Delete']
    }

    if (COMMON_FUNC.isFeedContributor(feedo.currentFeed)) {
      if (COMMON_FUNC.isCardOwner(idea)) {
        MENU_ITEMS = ['Edit', 'Delete']
      } else {
        MENU_ITEMS = []
      }
    }

    let canMoveCard = false
    if (COMMON_FUNC.isFeedOwnerEditor(feedo.currentFeed) || (COMMON_FUNC.isFeedContributor(feedo.currentFeed) && COMMON_FUNC.isCardOwner(idea))) {
      canMoveCard = true
    }

    return (
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          {canMoveCard && (
            <Animated.View
              style={
                this.state.selectedButton === SELECT_MOVE &&
                {
                  transform: [
                    { scale: this.animatedSelect },
                  ],
                }
              }
            >
              <TouchableOpacity
                style={styles.moveButtonContainer}
                activeOpacity={0.7}
                onPress={this.onMove.bind(this)}
              >
                <Ionicons name='md-arrow-forward' size={18} color='#fff' />
                <Text style={styles.buttonText}>Move</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

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
                style={styles.moreButtonContainer}
                activeOpacity={0.7}
                onPress={() => this.onShowMenu()}
              >
                <Entypo name='dots-three-horizontal' style={styles.plusButtonIcon} />
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
        <Modal
          style={styles.settingMenu}
          isVisible={this.state.isVisibleMenu}
          backdropOpacity={0}
          animationIn='fadeIn'
          animationOut='fadeOut'
          animationInTiming={600}
          onModalHide={this.onSettingMenuHide.bind(this)}
          onBackdropPress={() => this.setState({ isVisibleMenu: false })}
        >
          <FlatList
            style={styles.settingMenuContainer}
            data={MENU_ITEMS}
            keyExtractor={item => item}
            renderItem={this.renderItem.bind(this)}
          />
        </Modal>
      </View>
    )
  }
}

const mapStateToProps = ({ feedo }) => ({
  feedo
})

CardActionBarComponent.propTypes = {
  onMove: PropTypes.func.isRequired,
  onHandleSettings: PropTypes.func.isRequired,
  idea: PropTypes.object,
}

export default connect(
  mapStateToProps,
  null
)(CardActionBarComponent)
