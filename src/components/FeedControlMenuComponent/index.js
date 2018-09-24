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
import * as COMMON_FUNC from '../../service/commonFunc'

class FeedControlMenuComponent extends React.Component {
  render() {
    const { data, pinText } = this.props

    let MENU_ITEMS = []
    if (COMMON_FUNC.isFeedOwner(data)) {
      MENU_ITEMS = ['Duplicate', 'Edit', 'Archive', 'Delete']
    }

    if (COMMON_FUNC.isFeedEditor(data)) {
      MENU_ITEMS = ['Duplicate', 'Edit']
    }

    if (COMMON_FUNC.isFeedContributor(data) || COMMON_FUNC.isFeedGuest(data)) {
      MENU_ITEMS = []
    }

    return (
      <View style={styles.menuContainer}>
        <TouchableOpacity onPress={() => this.props.handleSettingItem(pinText)}>
          <View style={styles.buttonView}>
            <Octicons name="pin" style={styles.pinIcon} />
            <Text style={styles.buttonText}>{pinText}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.props.handleSettingItem('Share')}>
          <View style={[styles.buttonView, styles.buttonShareView]}>
            <Entypo name="share-alternative" style={styles.shareIcon} />
            <Text style={styles.buttonText}>Share</Text>
          </View>
        </TouchableOpacity>

        <FlatList
          data={MENU_ITEMS}
          keyExtractor={item => item}
          scrollEnabled={false}
          enableEmptySections
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
