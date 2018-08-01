import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList
} from 'react-native'
import PropTypes from 'prop-types'
import Octicons from 'react-native-vector-icons/Octicons'
import Entypo from 'react-native-vector-icons/Entypo'
import styles from './styles'

const MENU_ITMS = ['Duplicate', 'Edit', 'Archive', 'Delete']

class FeedControlMenuComponent extends React.Component {
  render() {
    return (
      <View style={styles.menuContainer}>
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

        <FlatList
          data={MENU_ITMS}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => this.props.handleSettingItem(item)}
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
    )
  }
}

FeedControlMenuComponent.defaultProps = {
  pinFlag: false
}

FeedControlMenuComponent.propTypes = {
  handleSettingItem: PropTypes.func.isRequired,
  pinFlag: PropTypes.bool.isRequired
}

export default FeedControlMenuComponent
