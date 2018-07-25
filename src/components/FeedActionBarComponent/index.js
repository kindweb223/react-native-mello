import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList
} from 'react-native'
import PropTypes from 'prop-types'
import { Octicons, Entypo } from '@expo/vector-icons'
import styles from './styles'

import Modal from "react-native-modal"
const MENU_ITMS = ['Duplicate', 'Edit', 'Archive', 'Delete']

class FeedActionBarComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isSettingMenu: false,
    }
  }

  onPressPin = () => {
    this.props.handlePin()
    this.setState({ isSettingMenu: false })
  }

  onPressShare = () => {
    this.props.handleShare()
    this.setState({ isSettingMenu: false })
  }

  onSettingMenuHide = () => {
    this.props.handleSetting(this.state.selectedItem)
  }

  onPressSetting = (item) => {
    this.setState({ isSettingMenu: false, selectedItem: item })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Modal 
            isVisible={this.state.isSettingMenu}
            backdropOpacity={0}
            animationIn="fadeIn"
            animationOut="fadeOut"
            animationInTiming={600}
            onModalHide={this.onSettingMenuHide}
            onBackdropPress={() => this.setState({ isSettingMenu: false })}
          >
            <View style={styles.settingMenuView}>
              <FlatList
                data={MENU_ITMS}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => this.onPressSetting(item)}
                    activeOpacity={0.5}
                  >
                    <View style={styles.settingItem}>
                      <Text style={item === 'Delete' ? styles.deleteButtonText : styles.settingButtonText}>
                        {item}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          </Modal>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={this.onPressPin}>
              <View style={styles.buttonView}>
                <Octicons name="pin" style={styles.pinIcon} />
                <Text style={styles.buttonText}>{this.props.pinFlag ? 'Unpin' : 'Pin'}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onPressShare}>
              <View style={styles.buttonView}>
                <Entypo name="share-alternative" style={styles.shareIcon} />
                <Text style={styles.buttonText}>Share</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState(prevState => ({ isSettingMenu: !prevState.isSettingMenu }))}>
              <View style={[styles.iconStyle, styles.plusButton]}>
                <Entypo name="dots-three-horizontal" style={styles.plusButtonIcon} />
              </View>
            </TouchableOpacity>
          </View>
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
  pinFlag: PropTypes.bool.isRequired
}

export default FeedActionBarComponent
