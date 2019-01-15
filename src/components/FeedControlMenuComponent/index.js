import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Switch
} from 'react-native'
import PropTypes from 'prop-types'
import Octicons from 'react-native-vector-icons/Octicons'
import Entypo from 'react-native-vector-icons/Entypo'
import SVGImage from 'react-native-remote-svg'
import styles from './styles'
import * as COMMON_FUNC from '../../service/commonFunc'
import { images } from '../../themes'
import colors from '../../service/colors'

class FeedControlMenuComponent extends React.Component {

  handleSwitchValue = (value) => {
    const { handleLinkSharing } = this.props
    handleLinkSharing(value)
  }

  render() {
    const { feedo, pinText } = this.props
    let isEnableShare = feedo.sharingPreferences.level === 'INVITEES_ONLY' ? false : true
    let pinImg = pinText === 'Pin' ? images.pinGrey : images.pinActive

    let MENU_ITEMS = []
    if (COMMON_FUNC.isFeedOwner(feedo)) {
      MENU_ITEMS = ['Duplicate', 'Edit', 'Archive', 'Delete']
    }

    if (COMMON_FUNC.isFeedEditor(feedo)) {
      MENU_ITEMS = ['Duplicate', 'Edit', 'Leave Flow']
    }

    if (COMMON_FUNC.isFeedContributor(feedo) || COMMON_FUNC.isFeedGuest(feedo)) {
      MENU_ITEMS = ['Leave Flow']
    }

    return (
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => this.props.handleSettingItem('AddPeople')}
        >
          <SVGImage source={images.addProfile} style={styles.menuIcon} />
          <Text style={styles.settingButtonText}>Add people</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
        >
          <SVGImage source={images.shareLink} style={styles.menuIcon} />
          <Text style={styles.settingButtonText}>Link sharing</Text>
          <Switch
            style={{ marginLeft: 20 }}
            trackColor={{true: colors.PURPLE, false: null}}
            value={isEnableShare}
            onValueChange={value => this.handleSwitchValue(value)}
          />
        </TouchableOpacity>

        {
          isEnableShare &&
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => this.props.handleSettingItem('ShareLink')}
          >
            <SVGImage source={images.shareLink} style={[styles.menuIcon, { opacity: 0 }]} />
            <Text style={styles.settingButtonText}>Share link</Text>
          </TouchableOpacity>
        }

        <View style={styles.separator} />

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => this.props.handleSettingItem(pinText)}
        >
          <SVGImage source={pinImg} style={styles.menuIcon} />
          <Text style={styles.settingButtonText}>{pinText}</Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        <FlatList
          data={MENU_ITEMS}
          keyExtractor={item => item}
          scrollEnabled={false}
          enableEmptySections
          renderItem={({ item }) => {
            let iconSource
            if (item === 'Duplicate') {
              iconSource = images.duplicate
            } else if (item === 'Edit') {
              iconSource = images.edit
            } else if (item === 'Archive') {
              iconSource = images.archive
            } else if (item === 'Delete') {
              iconSource = images.delete
            }

            return (
              <TouchableOpacity
                onPress={() => this.props.handleSettingItem(item)}
                activeOpacity={0.5}
              >
                <View style={styles.settingItem}>
                  <SVGImage source={iconSource} style={styles.menuIcon} />
                  <Text style={(item === 'Delete' || item === 'Leave Flow') ? styles.deleteButtonText : styles.settingButtonText}>
                    {item}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          }}
        />
      </View>
    )
  }
}

FeedControlMenuComponent.propTypes = {
  handleSettingItem: PropTypes.func.isRequired,
  pinText: PropTypes.string.isRequired,
  feedo: PropTypes.objectOf(PropTypes.any).isRequired
}

export default FeedControlMenuComponent
