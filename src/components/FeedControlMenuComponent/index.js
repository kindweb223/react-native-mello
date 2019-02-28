import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Switch,
  Image
} from 'react-native'
import PropTypes from 'prop-types'
import styles from './styles'
import * as COMMON_FUNC from '../../service/commonFunc'
import { images } from '../../themes'
import colors from '../../service/colors'

import { PIN_FEATURE } from '../../service/api'

class FeedControlMenuComponent extends React.Component {

  handleSwitchValue = (value) => {
    const { handleLinkSharing } = this.props
    handleLinkSharing(value)
  }

  render() {
    const { feedo, pinText, isEnableShare } = this.props

    let isEnableShareAllowed = COMMON_FUNC.isFeedOwner(feedo) || COMMON_FUNC.isFeedEditor(feedo)
    let pinImg = pinText === 'Pin' ? images.pinGrey : images.pinActive
    let sharingImg = isEnableShare ? images.shareLinkActive : images.shareLinkGrey

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

    if (COMMON_FUNC.isMelloTipFeed(feedo)) {
      MENU_ITEMS = ['Leave Flow']
    }

    return (
      <View style={styles.menuContainer}>
        {!COMMON_FUNC.isMelloTipFeed(feedo) && (
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => this.props.handleSettingItem('AddPeople')}
          >
            <Image source={images.addProfile} style={styles.menuIcon} />
            <Text style={styles.settingButtonText}>{isEnableShareAllowed ? 'Add people' : 'Flow members'}</Text>
          </TouchableOpacity>
        )}

        {
          isEnableShareAllowed && !COMMON_FUNC.isMelloTipFeed(feedo) &&
          <View style={styles.switchView}>
            <TouchableOpacity style={styles.switchTextView} onPress={() => isEnableShare ? this.props.handleSettingItem('ShareLink') : {}} >
              <Image source={sharingImg} style={styles.menuIcon} />
              <Text style={styles.settingButtonText}>Link sharing {isEnableShare ? 'on' : 'off'}</Text>
            </TouchableOpacity>
            <Switch
              style={styles.switch}
              trackColor={{true: colors.PURPLE, false: null}}
              value={isEnableShare}
              onValueChange={value => this.handleSwitchValue(value)}
            />
          </View>
        }

        {PIN_FEATURE && (
          <View style={styles.separator} />
        )}

        {PIN_FEATURE && (
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => this.props.handleSettingItem(pinText)}
          >
            <Image source={pinImg} style={styles.menuIcon} />
            <Text style={styles.settingButtonText}>{pinText}</Text>
          </TouchableOpacity>
        )}

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
            } else if (item === 'Leave Flow') {
              iconSource = images.leave
            }

            return (
              <TouchableOpacity
                onPress={() => this.props.handleSettingItem(item)}
                activeOpacity={0.5}
              >
                <View style={[styles.settingItem, COMMON_FUNC.isMelloTipFeed(feedo) && { justifyContent: 'center' }]}>
                  {!COMMON_FUNC.isMelloTipFeed(feedo) &&
                    <Image source={iconSource} style={styles.menuIcon} />
                  }
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
  feedo: PropTypes.objectOf(PropTypes.any).isRequired,
  isEnableShare: PropTypes.bool,
}

export default FeedControlMenuComponent
