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

const MENU_ITMS = ['Duplicate', 'Edit', 'Archive', 'Delete']

class FeedActionBarComponent extends React.Component {
  state = {
    isSettingMenu: false
  }

  onPressPin = () => {
    this.props.handlePin()
    this.setState({ isSettingMenu: false })
  }

  onPressShare = () => {
    this.props.handleShare()
    this.setState({ isSettingMenu: false })
  }

  onPressSetting = (item) => {
    this.setState({ isSettingMenu: false })
    this.props.handleSetting(item)
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          {this.state.isSettingMenu && (
            <View key="3" style={styles.settingMenuView}>
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
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={this.onPressPin}>
              <View style={styles.buttonView}>
                <Octicons name="pin" style={styles.pinIcon} />
                <Text style={styles.buttonText}>Pin</Text>
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
}

export default FeedActionBarComponent
