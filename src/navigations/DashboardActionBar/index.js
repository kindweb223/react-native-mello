import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Image
} from 'react-native'

import { Actions } from 'react-native-router-flux'
import PropTypes from 'prop-types'
import _ from 'lodash'
import styles from './styles'
import * as COMMON_FUNC from '../../service/commonFunc'

const BELL_ICON_B = require('../../../assets/images/Bell/Blue.png')
const BELL_ICON_G = require('../../../assets/images/Bell/Grey.png')
const FILTER_ICON_B = require('../../../assets/images/Filter/Blue.png')
const FILTER_ICON_G = require('../../../assets/images/Filter/Grey.png')
const LIST_ICON = require('../../../assets/images/List/List.png')
const LIST_ICON_THUMBNAIL = require('../../../assets/images/List/Thumbnail.png')
const MASONRY_ICON = require('../../../assets/images/List/Masonry.png')
const PLUS_ICON = require('../../../assets/images/PlusButton/Blue.png')

class DashboardActionBar extends React.Component {

  constructor(props) {
    super(props);

    this.animatedPlusButton = new Animated.Value(1);
  }

  onPressInAddFeed() {
    Animated.timing(this.animatedPlusButton, {
      toValue: 0.8,
      duration: 100,
    }).start();
  }

  onPressOutAddFeed() {
    Animated.timing(this.animatedPlusButton, {
      toValue: 1,
      duration: 100,
    }).start();

    if (this.props.onAddFeed) {
      this.props.onAddFeed();
    }
  }

  render () {
    const { filtering, filterType, sortType, notifications, feed, badgeCount, showList, listType, page } = this.props

    return (
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          {showList && (
            <TouchableOpacity style={styles.iconView} onPress={() => this.props.handleList()}>
              {page === 'detail'
                ? <Image source={listType === 'list' ? MASONRY_ICON : LIST_ICON} />
                : <Image source={listType === 'list' ? LIST_ICON : LIST_ICON_THUMBNAIL} />
              }
            </TouchableOpacity>
          )}
          {filtering && (
            <TouchableOpacity style={styles.iconView} onPress={() => this.props.handleFilter()}>
              <Image source={filterType === 'all' && sortType ==='date' ? FILTER_ICON_G : FILTER_ICON_B} />
            </TouchableOpacity>
          )}
          {notifications &&
            <TouchableOpacity
              style={styles.notificationView}
              onPress={() => Actions.NotificationScreen()}
              // onPress={() => badgeCount > 0 ? Actions.NotificationScreen() : {}}
            >
              <Image source={badgeCount > 0 ? BELL_ICON_B : BELL_ICON_G} />
              {badgeCount > 0 && (
                <Text style={styles.notificationText}>{badgeCount}</Text>
              )}
            </TouchableOpacity>
          }
        </View>

        <View style={styles.rightContainer}>
          {!(!_.isEmpty(feed) && COMMON_FUNC.isFeedGuest(feed)) && (
            <TouchableWithoutFeedback
              onPressIn={this.onPressInAddFeed.bind(this)}
              onPressOut={this.onPressOutAddFeed.bind(this)}
            >
              <Animated.View
                style={[styles.plusButton, { transform: [{ scale: this.animatedPlusButton }] }]}
              >
                <Image source={PLUS_ICON} />
              </Animated.View>
            </TouchableWithoutFeedback>
          )}

        </View>
      </View>
    )
  }
}

DashboardActionBar.defaultProps = {
  page: 'home',
  showList: false,
  listType: 'list',
  filtering: true,  
  filterType: 'all',
  sortType: 'date',
  notifications: true,
  feed: {},
  badgeCount: 0,
  handleList: () => {},
  handleFilter: () => {}
}

DashboardActionBar.propTypes = {
  page: PropTypes.string,
  showList: PropTypes.bool,
  listType: PropTypes.string,
  filterType: PropTypes.string,
  sortType: PropTypes.string,
  filtering: PropTypes.bool,
  onAddFeed: PropTypes.func,
  handleList: PropTypes.func,
  handleFilter: PropTypes.func,
  notifications: PropTypes.bool,
  feed: PropTypes.object,
  badgeCount: PropTypes.number
}

export default DashboardActionBar
