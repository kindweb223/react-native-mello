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
    const { data, pinText } = this.props

    return (
      <View style={styles.menuContainer}>
        <TouchableOpacity onPress={() => this.props.handleSettingItem(pinText)}>
          <View style={styles.buttonView}>
            <Octicons name="pin" style={styles.pinIcon} />
            <Text style={styles.buttonText}>{pinText}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.props.handleSettingItem('Share')}>
          <View style={styles.buttonView}>
            <Entypo name="share-alternative" style={styles.shareIcon} />
            <Text style={styles.buttonText}>Share</Text>
          </View>
        </TouchableOpacity>

        <FlatList
          data={MENU_ITMS}
          keyExtractor={item => item}
          scrollEnabled={false}
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

FeedControlMenuComponent.propTypes = {
  handleSettingItem: PropTypes.func.isRequired,
  pinText: PropTypes.string.isRequired,
  data: PropTypes.objectOf(PropTypes.any).isRequired
}

export default FeedControlMenuComponent
